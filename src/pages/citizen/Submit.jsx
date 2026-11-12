import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/client';
import { useActionStore } from '../../stores/actionStore';
import { Button, Input, Card, Label, Select, Textarea, Alert, AlertTitle, AlertDescription } from '../../components/ui';
import { PageHeader } from '../../components/common';
import { districts, categories, field } from '../../constants.js';
import AttachmentCard from '../../components/AttachmentCard.jsx';
import { toast } from 'sonner';

export default function Submit() {
  const nav = useNavigate(),
    [ai, setAi] = useState(null),
    [busy, setBusy] = useState(false),
    [district, setDistrict] = useState(''),
    [category, setCategory] = useState(''),
    [selectedFile, setSelectedFile] = useState(null),
    [err, setErr] = useState('');
  const actionKey = useRef(`submit:${Math.random().toString(36).slice(2)}`).current;
  const status = useActionStore((s) => s.actions[actionKey]?.status);
  const runOnce = useActionStore((s) => s.runOnce);
  async function analyse() {
    const form = document.querySelector('#grievance-form');
    const description = new FormData(form).get('description')?.toString().trim() || '';
    if (!district) {
      setErr('Choose a district before asking for AI suggestions.');
      return;
    }
    if (description.length < 20) {
      setErr('Enter at least 20 characters in the description before asking for AI suggestions.');
      return;
    }
    setBusy(true);
    try {
      const r = await api.post('/ai/analyze', {
        description,
        district,
      });
      setAi(r.data.data);
      setErr('');
      toast.success('AI review is ready', { description: 'Check the suggestions and possible matches below.' });
    } catch (error) {
      const message = error.response?.data?.message || (error.response ? 'AI analysis failed. You can still submit your grievance.' : 'Could not reach the server. Check your connection and try again.');
      setErr(message);
      toast.error('AI review could not be completed', { description: message });
    } finally {
      setBusy(false);
    }
  }
  async function send(e) {
    e.preventDefault();
    if (status === 'pending' || status === 'done') return;
    setErr('');
    const f = new FormData(e.currentTarget);
    if (ai) {
      f.set('category', ai.category);
      f.set('priority', ai.priority);
      f.set('aiSuggestion', JSON.stringify(ai));
    }
    try {
      const result = await runOnce(actionKey, () => api.post('/grievances', f));
      if (!result.skipped) {
        toast.success('Grievance submitted', { description: 'Your reference number is ready.' });
        nav('/submitted', { state: result.result.data });
      }
    } catch (x) {
      const message = x.response?.data?.message || 'Submission failed';
      setErr(message);
      toast.error('Submission failed', { description: message });
    }
  }
  return (
    <>
      <PageHeader
        title="Submit a grievance"
        subtitle="Describe your concern clearly. You can attach one JPG, PNG, or PDF (max 5 MB)."
      />
      {err && (
        <Alert variant="destructive" className="mb-4">
          <AlertTitle>There’s something to fix</AlertTitle>
          <AlertDescription>{err}</AlertDescription>
        </Alert>
      )}
      <Card className="overflow-hidden border-slate-200 bg-white p-0 shadow-md">
        <form
          id="grievance-form"
          className="grid gap-x-6 gap-y-5 p-5 sm:p-8 md:grid-cols-2"
          onSubmit={send}
        >
          <div className="border-b border-slate-200 pb-4 md:col-span-2">
            <p className="text-base font-semibold text-slate-900">Concern details</p>
            <p className="mt-1 text-sm leading-5 text-slate-500">
              Add enough information for the review team to understand what happened and where.
            </p>
          </div>
          <Label className={field}>
            District
            <Select
              items={districts.map((x) => ({ value: x, label: x }))}
              value={district}
              placeholder="Choose district"
              onValueChange={setDistrict}
            />
            <input name="district" type="hidden" value={district} readOnly required />
          </Label>
          <Label className={field}>
            Category
            <Select
              items={categories.map((x) => ({ value: x, label: x }))}
              value={category}
              placeholder="Choose category"
              onValueChange={setCategory}
            />
            <input name="category" type="hidden" value={category} readOnly required />
          </Label>
          <Label className={`${field} md:col-span-2`}>
            Subject
            <Input name="subject" placeholder="Summarize your concern" required maxLength="160" />
          </Label>
          <Label className={`${field} md:col-span-2`}>
            Description
            <Textarea
              name="description"
              required
              minLength="20"
              rows={6}
              className="min-h-40 resize-y text-sm leading-6"
              placeholder="Include the location, dates, and details that will help staff review your concern."
            />
          </Label>
          <div className={`${field} md:col-span-2`}>
            <Label htmlFor="supporting-document">Supporting document</Label>
            <span className="block text-sm font-normal text-muted-foreground">JPG, PNG, or PDF up to 5 MB</span>
            <Input
              id="supporting-document"
              name="file"
              type="file"
              accept=".jpg,.jpeg,.png,.pdf"
              className="h-auto cursor-pointer bg-slate-50 py-2.5 file:mr-3 file:rounded file:bg-white file:px-3 file:py-2 file:text-slate-700 hover:file:bg-blue-50"
              onChange={(event) => {
                const nextFile = event.target.files?.[0] || null;
                if (nextFile && nextFile.size > 5 * 1024 * 1024) {
                  event.target.value = '';
                  setSelectedFile(null);
                  toast.error('File is too large', { description: 'Choose a JPG, PNG, or PDF under 5 MB.' });
                  return;
                }
                if (nextFile && !['image/jpeg', 'image/png', 'application/pdf'].includes(nextFile.type)) {
                  event.target.value = '';
                  setSelectedFile(null);
                  toast.error('File type is not supported', { description: 'Choose a JPG, PNG, or PDF document.' });
                  return;
                }
                setSelectedFile(nextFile);
              }}
            />
            {selectedFile && <div className="mt-3"><AttachmentCard file={selectedFile} onRemove={() => { setSelectedFile(null); const input = document.getElementById('supporting-document'); if (input) input.value = ''; }} /></div>}
          </div>
          {ai && (
            <div className="border-l-4 border-primary bg-blue-50/80 p-4 md:col-span-2">
              <h3 className="font-semibold text-blue-950">AI suggestions · {ai.source}</h3>
              <p className="mt-2 text-base">
                Category: {ai.category} · Priority: {ai.priority} · Department: {ai.department}
              </p>
              <p className="text-base">{ai.summary}</p>
              <p className="mt-2 text-sm">
                AI suggestions are advisory. Please review before submitting.
              </p>
              {ai.duplicates?.length > 0 && (
                <p className="mt-2 text-base">
                  Possible duplicates (for human review):{' '}
                  {ai.duplicates.map((x) => x.referenceId).join(', ')}
                </p>
              )}
            </div>
          )}
          <div className="flex flex-col gap-4 border-t border-slate-200 pt-5 md:col-span-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-3">
              <Button type="button" variant="outline" disabled={busy} onClick={analyse}>
                {busy ? 'Analysing…' : 'Analyse with AI'}
              </Button>
              <Button disabled={status === 'pending' || status === 'done'}>
                {status === 'pending'
                  ? 'Submitting…'
                  : status === 'done'
                    ? 'Submitted'
                    : 'Submit grievance'}
              </Button>
            </div>
            <span className="text-xs text-slate-500">
              You can review all details before submitting.
            </span>
          </div>
        </form>
      </Card>
    </>
  );
}
