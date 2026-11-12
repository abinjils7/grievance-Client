import React, { useEffect, useState } from 'react';
import api from '../api/client';
import { useAuthStore } from '../stores/authStore';
import { useActionStore } from '../stores/actionStore';
import { Alert, AlertDescription, Button, Card, Input, Label, Select, Textarea } from './ui';
import { toast } from 'sonner';

export default function StaffTools({ g, reload }) {
  const user = useAuthStore((s) => s.user),
    runOnce = useActionStore((s) => s.runOnce),
    actions = useActionStore((s) => s.actions);
  const [deps, setDeps] = useState([]),
    [dept, setDept] = useState(''),
    [officers, setOfficers] = useState([]),
    [officer, setOfficer] = useState(''),
    [remark, setRemark] = useState(''),
    [report, setReport] = useState(''),
    [error, setError] = useState('');
  useEffect(() => {
    if (user.role === 'cmo')
      api
        .get('/departments')
        .then((r) => setDeps(r.data.data))
        .catch(() => setError('Could not load departments'));
  }, [user.role]);
  useEffect(() => {
    if (dept)
      api
        .get(`/cmo/officers?departmentId=${dept}`)
        .then((r) => setOfficers(r.data.data))
        .catch(() => setError('Could not load officers'));
  }, [dept]);
  const assignKey = `assign:${g._id}:${g.status}`,
    escalateKey = `escalate:${g._id}`,
    reviewKey = `review:${g._id}:${g.actionTakenReport?.submittedAt || 'none'}`;
  const reportKey = `report:${g._id}:${g.actionTakenReport?.submittedAt ? new Date(g.actionTakenReport.submittedAt).getTime() : 'first'}`;
  async function act(key, request, after) {
    setError('');
    try {
      const result = await runOnce(key, request);
      if (result.skipped) return;
      after?.(result.result);
      toast.success('Grievance updated', { description: 'The action has been recorded in its history.' });
      await reload();
    } catch (e) {
      const message = e.response?.data?.message || 'The action could not be completed. Please retry.';
      setError(message);
      toast.error('Action could not be completed', { description: message });
    }
  }
  async function sendRemark() {
    const text = remark.trim();
    if (!text) return;
    const key = `remark:${g._id}:${user.role}:${text.toLowerCase()}`;
    await act(
      key,
      () =>
        api.post(`/${user.role}/grievances/${g._id}/remark`, {
          text,
          isInternal: user.role === 'cmo',
        }),
      () => setRemark(''),
    );
  }

  if (user.role === 'officer') {
    const reportPending = Boolean(
      g.actionTakenReport?.submittedAt && !g.actionTakenReport.reviewed,
    );
    return (
      <Card className="mb-4">
        <h2 className="text-lg font-semibold">Action taken</h2>
        <p className="mt-1 text-base text-muted-foreground">
          Record the work completed for this grievance.
        </p>
        {error && (
          <Alert variant="destructive" className="mt-3"><AlertDescription>{error}</AlertDescription></Alert>
        )}
        {reportPending ? (
          <div className="mt-4 rounded-md border border-emerald-200 bg-emerald-50 p-4">
            <p className="font-medium text-emerald-900">Report submitted</p>
            <p className="mt-1 text-base text-emerald-800">
              The CMO will review your action report before the grievance is resolved.
            </p>
          </div>
        ) : (
          <div className="mt-4 space-y-3">
            <div className="space-y-2">
              <Label htmlFor="action-report">Action report</Label>
              <Textarea
                id="action-report"
                value={report}
                onChange={(e) => setReport(e.target.value)}
                rows={4}
                placeholder="Describe the action taken"
              />
            </div>
            <Button
              disabled={
                !report.trim() ||
                actions[reportKey]?.status === 'pending' ||
                actions[reportKey]?.status === 'done'
              }
              onClick={() =>
                act(
                  reportKey,
                  () => api.post(`/officer/grievances/${g._id}/action-report`, { text: report }),
                  () => setReport(''),
                )
              }
            >
              {actions[reportKey]?.status === 'pending'
                ? 'Submitting…'
                : actions[reportKey]?.status === 'done'
                  ? 'Submitted'
                  : 'Submit action report'}
            </Button>
          </div>
        )}
        <div className="mt-5 flex flex-col gap-3 border-t pt-4 sm:flex-row">
          <Input
            value={remark}
            onChange={(e) => setRemark(e.target.value)}
            placeholder="Add a public remark"
          />
          <Button
            variant="outline"
            disabled={
              !remark.trim() ||
              actions[`remark:${g._id}:${user.role}:${remark.trim().toLowerCase()}`]?.status ===
                'pending'
            }
            onClick={sendRemark}
          >
            Add remark
          </Button>
        </div>
      </Card>
    );
  }

  const reportNeedsReview = Boolean(
    g.actionTakenReport?.submittedAt && !g.actionTakenReport.reviewed,
  );
  return (
    <Card className="mb-4">
      <h2 className="text-lg font-semibold">CMO actions</h2>
      <p className="mt-1 text-base text-muted-foreground">
        Assign, review reports, add remarks, or escalate.
      </p>
      {error && (
        <Alert variant="destructive" className="mt-3"><AlertDescription>{error}</AlertDescription></Alert>
      )}
      {g.actionTakenReport?.submittedAt && (
        <div className="my-4 rounded-md border bg-slate-50 p-4">
          <p className="font-semibold">Officer action report</p>
          <p className="mt-2 whitespace-pre-wrap text-base">{g.actionTakenReport.text}</p>
          {reportNeedsReview ? (
            <div className="mt-3 flex flex-wrap gap-2">
              <Button
                disabled={
                  actions[reviewKey]?.status === 'pending' || actions[reviewKey]?.status === 'done'
                }
                onClick={() =>
                  act(reviewKey, () =>
                    api.post(`/cmo/grievances/${g._id}/review-report`, { decision: 'approve' }),
                  )
                }
              >
                {actions[reviewKey]?.status === 'pending'
                  ? 'Reviewing…'
                  : actions[reviewKey]?.status === 'done'
                    ? 'Reviewed'
                    : 'Approve · Resolve'}
              </Button>
              <Button
                variant="outline"
                disabled={
                  actions[reviewKey]?.status === 'pending' || actions[reviewKey]?.status === 'done'
                }
                onClick={() =>
                  act(reviewKey, () =>
                    api.post(`/cmo/grievances/${g._id}/review-report`, {
                      decision: 'send_back',
                      remark: 'Please provide further action',
                    }),
                  )
                }
              >
                Send back
              </Button>
            </div>
          ) : (
            <p className="mt-3 text-base font-medium text-emerald-800">Report reviewed</p>
          )}
        </div>
      )}
      <div className="my-4 grid gap-3 sm:grid-cols-[1fr_1fr_auto_auto]">
        <Select
          aria-label="Department"
          className="h-11"
          value={dept}
          onValueChange={(value) => { setDept(value); setOfficer(''); }}
          placeholder="Choose department"
          items={deps.map((x) => ({ value: x._id, label: x.name }))}
        />
        <Select
          aria-label="Officer"
          className="h-11"
          value={officer}
          onValueChange={setOfficer}
          disabled={!dept}
          placeholder="Choose officer"
          items={officers.map((x) => ({ value: x._id, label: x.name }))}
        />
        <Button
          disabled={!dept || !officer || actions[assignKey]?.status === 'pending'}
          onClick={() =>
            act(assignKey, () =>
              api.post(`/cmo/grievances/${g._id}/assign`, {
                departmentId: dept,
                officerId: officer,
              }),
            )
          }
        >
          {actions[assignKey]?.status === 'pending' ? 'Assigning…' : 'Assign / Forward'}
        </Button>
        <Button
          variant="outline"
          disabled={
            g.escalated ||
            actions[escalateKey]?.status === 'pending' ||
            actions[escalateKey]?.status === 'done'
          }
          onClick={() => act(escalateKey, () => api.post(`/cmo/grievances/${g._id}/escalate`))}
        >
          {g.escalated || actions[escalateKey]?.status === 'done' ? 'Escalated' : 'Escalate'}
        </Button>
      </div>
      <div className="flex flex-col gap-3 border-t pt-4 sm:flex-row">
        <Input
          value={remark}
          onChange={(e) => setRemark(e.target.value)}
          placeholder="Add an internal CMO remark"
        />
        <Button
          variant="outline"
          disabled={
            !remark.trim() ||
            actions[`remark:${g._id}:${user.role}:${remark.trim().toLowerCase()}`]?.status ===
              'pending'
          }
          onClick={sendRemark}
        >
          Add remark
        </Button>
      </div>
    </Card>
  );
}
