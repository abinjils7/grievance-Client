import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/ui/tabs.jsx';
import { Star, RotateCcw, Paperclip } from 'lucide-react';
import api from '../../api/client';
import { useAuthStore } from '../../stores/authStore';
import { useActionStore } from '../../stores/actionStore';
import { Alert, AlertDescription, Button, Input, Card, Textarea, AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogAction, AlertDialogCancel } from '../../components/ui';
import StaffTools from '../../components/StaffTools';
import { StatusBadge, PageHeader, HistoryTimeline } from '../../components/common';
import AttachmentCard from '../../components/AttachmentCard.jsx';
import { toast } from 'sonner';

export default function Detail() {
  const { id } = useParams(),
    user = useAuthStore((s) => s.user),
    [g, setG] = useState(null),
    [feedback, setFeedback] = useState(''),
    [rating, setRating] = useState(5),
    [reopenOpen, setReopenOpen] = useState(false),
    [reopenReason, setReopenReason] = useState(''),
    [error, setError] = useState('');
  const runOnce = useActionStore((s) => s.runOnce);
  const load = () => api.get(`/grievances/${id}`).then((r) => setG(r.data.data));
  useEffect(() => {
    load().catch((requestError) => {
      const message = requestError.response?.data?.message || 'Unable to load grievance details';
      setError(message);
      toast.error('Grievance could not be loaded', { description: message });
    });
  }, [id]);
  const feedbackKey = `feedback:${id}`,
    reopenKey = `reopen:${id}:${g?.updatedAt || 'pending'}`;
  const feedbackStatus = useActionStore((s) => s.actions[feedbackKey]?.status),
    reopenStatus = useActionStore((s) => s.actions[reopenKey]?.status);
  if (!g) return <p className="p-6 text-muted-foreground">Loading grievance…</p>;
  async function reopen() {
    const reason = reopenReason.trim();
    if (!reason) return;
    try {
      const result = await runOnce(reopenKey, () =>
        api.post(`/grievances/${id}/reopen`, { reason }),
      );
      if (!result.skipped) {
        toast.success('Reopen request sent', { description: 'Your reason is now in the grievance history.' });
        setReopenOpen(false);
        setReopenReason('');
        await load();
      }
    } catch (e) {
      const message = e.response?.data?.message || 'Could not reopen grievance';
      setError(message);
      toast.error('Could not reopen grievance', { description: message });
    }
  }
  async function sendFeedback() {
    try {
      await runOnce(feedbackKey, () =>
        api.post(`/grievances/${id}/feedback`, { rating, comment: feedback }),
      );
      setFeedback('');
      toast.success('Feedback received', { description: 'Thank you for sharing your experience.' });
    } catch (e) {
      const message = e.response?.data?.message || 'Could not send feedback';
      setError(message);
      toast.error('Feedback could not be sent', { description: message });
    }
  }
  return (
    <>
      <PageHeader title={g.subject} subtitle={g.referenceId} />
      {error && <Alert variant="destructive" className="mb-4"><AlertDescription>{error}</AlertDescription></Alert>}
      {user.role !== 'citizen' && <StaffTools g={g} reload={load} />}
      <Tabs defaultValue="details">
        <TabsList className="mb-4 h-auto w-full justify-start gap-1 rounded-none border-b bg-transparent p-0 text-muted-foreground">
          <TabsTrigger
            className="p-2 data-[state=active]:border-b-2 data-[state=active]:border-primary"
            value="details"
          >
            Details
          </TabsTrigger>
          <TabsTrigger className="p-2" value="history">
            History
          </TabsTrigger>
          <TabsTrigger className="p-2" value="attachments">
            Attachments
          </TabsTrigger>
        </TabsList>
        <TabsContent value="details">
          <Card>
            <p>
              Status: <StatusBadge status={g.status} actionTakenReport={g.actionTakenReport} />
            </p>
            <p className="mt-3">
              District: {g.district} · Category: {g.category} · Priority: {g.priority}
            </p>
            <p className="mt-3 whitespace-pre-wrap">{g.description}</p>
            {g.status === 'Resolved' && user.role === 'citizen' && (
              <div className="mt-6 grid gap-4 border-t pt-5 sm:grid-cols-[auto_1fr_auto]">
                <Button
                  disabled={reopenStatus === 'pending' || reopenStatus === 'done'}
                  onClick={() => setReopenOpen(true)}
                >
                  {reopenStatus === 'pending'
                    ? 'Reopening…'
                    : reopenStatus === 'done'
                      ? 'Reopened'
                      : 'Reopen grievance'}
                </Button>
                <div className="space-y-2">
                  <div className="flex items-center gap-1" role="group" aria-label="Rate your experience">
                    <span className="mr-1 text-xs text-muted-foreground">Rate resolution</span>
                    {[1, 2, 3, 4, 5].map((value) => (
                      <Button key={value} type="button" variant="ghost" size="icon" className="h-8 w-8" aria-label={`${value} star${value === 1 ? '' : 's'}`} aria-pressed={rating === value} onClick={() => setRating(value)}>
                        <Star className={`h-4 w-4 ${value <= rating ? 'fill-amber-400 text-amber-500' : 'text-muted-foreground'}`} />
                      </Button>
                    ))}
                  </div>
                  <Input placeholder="Optional feedback comment" value={feedback} onChange={(e) => setFeedback(e.target.value)} />
                </div>
                <Button
                  variant="outline"
                  disabled={feedbackStatus === 'pending' || feedbackStatus === 'done'}
                  onClick={sendFeedback}
                >
                  {feedbackStatus === 'pending'
                    ? 'Sending…'
                    : feedbackStatus === 'done'
                      ? 'Feedback sent'
                      : `Send ${rating}-star feedback`}
                </Button>
              </div>
            )}
          </Card>
        </TabsContent>
        <TabsContent value="history">
          <Card>
            <HistoryTimeline items={g.history} />
          </Card>
        </TabsContent>
        <TabsContent value="attachments">
          <Card className="space-y-3">
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold"><Paperclip className="h-4 w-4 text-primary" /> Supporting documents <span className="ml-auto text-xs font-normal text-muted-foreground">{g.attachments?.length || 0}</span></div>
            {(g.attachments || []).map((attachment) => (
              <AttachmentCard key={attachment._id} file={attachment} href={`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/attachments/${attachment._id}`} />
            ))}
            {!g.attachments?.length && <p className="text-sm text-muted-foreground">No supporting documents were included with this submission.</p>}
          </Card>
        </TabsContent>
      </Tabs>
      <AlertDialog open={reopenOpen} onOpenChange={setReopenOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Request to reopen this grievance?</AlertDialogTitle>
            <AlertDialogDescription>Tell the review team what remains unresolved. Your reason will be added to the grievance history.</AlertDialogDescription>
          </AlertDialogHeader>
          <Textarea autoFocus rows={4} value={reopenReason} onChange={(event) => setReopenReason(event.target.value)} placeholder="Explain what still needs attention" />
          <AlertDialogFooter>
            <AlertDialogCancel>Keep closed</AlertDialogCancel>
            <AlertDialogAction disabled={!reopenReason.trim()} onClick={(event) => { event.preventDefault(); reopen(); }}><RotateCcw className="mr-2 h-4 w-4" /> Request reopen</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
