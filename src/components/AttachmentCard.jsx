import { useEffect, useState } from 'react';
import { Download, FileText, Image as ImageIcon, X } from 'lucide-react';
import { Badge, Button, Card, Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui';

function formatBytes(bytes = 0) {
  return bytes < 1024 * 1024 ? `${Math.max(1, Math.round(bytes / 1024))} KB` : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function AttachmentCard({ file, href, onRemove }) {
  const [open, setOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');
  const isLocalFile = typeof File !== 'undefined' && file instanceof File;
  const fileName = file?.name || file?.filename || 'Attachment';
  const mimeType = file?.type || file?.mimeType || '';
  const isImage = mimeType.startsWith('image/');

  useEffect(() => {
    if (!isLocalFile) return undefined;
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file, isLocalFile]);

  return (
    <>
      <Card className="flex items-center gap-3 rounded-xl border-slate-200 p-3 shadow-none">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          {isImage ? <ImageIcon className="h-5 w-5" /> : <FileText className="h-5 w-5" />}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-foreground">{fileName}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">{isLocalFile ? formatBytes(file.size) : mimeType || 'Uploaded document'}</p>
        </div>
        {isLocalFile ? <Badge variant="info">Ready</Badge> : null}
        {onRemove ? (
          <Button type="button" size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground" aria-label={`Remove ${fileName}`} onClick={onRemove}>
            <X className="h-4 w-4" />
          </Button>
        ) : href ? (
          <Button asChild size="sm" variant="outline"><a href={href} target="_blank" rel="noreferrer"><Download className="h-4 w-4" /> Open</a></Button>
        ) : null}
        {isLocalFile && previewUrl && (
          <Button type="button" size="sm" variant="ghost" onClick={() => setOpen(true)}>Preview</Button>
        )}
      </Card>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{fileName}</DialogTitle>
            <DialogDescription>Preview the attachment before submitting your grievance.</DialogDescription>
          </DialogHeader>
          {isImage ? (
            <img src={previewUrl} alt={fileName} className="max-h-[70vh] w-full rounded-lg object-contain" />
          ) : (
            <iframe src={previewUrl} title={fileName} className="h-[70vh] w-full rounded-lg border" />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
