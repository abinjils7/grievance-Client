import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ClipboardList } from 'lucide-react';
import { StatusBadge } from './StatusBadge.jsx';
import {
  Table, TableHeader, TableBody, TableHead, TableRow, TableCell,
  Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationPrevious, PaginationNext,
  Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription,
} from '../ui';

const PAGE_SIZE = 8;

export function GrievanceTable({
  items = [],
  page,
  total,
  onPageChange,
  emptyTitle = 'No grievances to show',
  emptyDescription = 'New submissions will appear here once they enter this workflow.',
}) {
  const [localPage, setLocalPage] = useState(1);
  const isServerPaged = typeof onPageChange === 'function' && Number.isFinite(page);
  const currentPage = isServerPaged ? page : localPage;
  const itemCount = Number.isFinite(total) ? total : items.length;
  const pageCount = Math.max(1, Math.ceil(itemCount / PAGE_SIZE));
  const visibleItems = isServerPaged ? items : items.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const changePage = (nextPage) => {
    const safePage = Math.min(pageCount, Math.max(1, nextPage));
    if (isServerPaged) onPageChange(safePage);
    else setLocalPage(safePage);
  };

  useEffect(() => {
    if (!isServerPaged && currentPage > pageCount) setLocalPage(pageCount);
  }, [currentPage, isServerPaged, pageCount]);

  if (!itemCount) {
    return (
      <Empty className="min-h-64 border-0">
        <EmptyHeader>
          <EmptyMedia variant="icon"><ClipboardList /></EmptyMedia>
          <EmptyTitle>{emptyTitle}</EmptyTitle>
          <EmptyDescription>{emptyDescription}</EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  const startPage = Math.max(1, currentPage - 2);
  const endPage = Math.min(pageCount, startPage + 4);
  const pages = Array.from({ length: endPage - startPage + 1 }, (_, index) => startPage + index);
  const firstRow = (currentPage - 1) * PAGE_SIZE + 1;
  const lastRow = Math.min(currentPage * PAGE_SIZE, itemCount);

  return (
    <div>
      <div className="overflow-x-auto">
        <Table className="min-w-[680px] text-sm">
          <TableHeader className="bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
            <TableRow>
              {['Reference', 'Concern', 'District', 'Status', 'Priority', ''].map((heading, index) => (
                <TableHead className="h-11 px-4" key={`${heading}-${index}`}>{heading}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {visibleItems.map((grievance) => (
              <TableRow key={grievance._id} className="group hover:bg-muted/30">
                <TableCell className="px-4 py-4 font-mono text-xs font-semibold text-primary">{grievance.referenceId}</TableCell>
                <TableCell className="max-w-[360px] px-4 py-4">
                  <span className="block truncate font-medium text-foreground">{grievance.subject}</span>
                  <span className="mt-1 block truncate text-xs text-muted-foreground">{grievance.department?.name || grievance.category || 'Awaiting assignment'}</span>
                </TableCell>
                <TableCell className="px-4 py-4 text-muted-foreground">{grievance.district}</TableCell>
                <TableCell className="px-4 py-4"><StatusBadge status={grievance.status} actionTakenReport={grievance.actionTakenReport} /></TableCell>
                <TableCell className="px-4 py-4">
                  <span className={grievance.priority === 'High' ? 'font-medium text-destructive' : 'text-muted-foreground'}>{grievance.priority || 'Normal'}</span>
                </TableCell>
                <TableCell className="px-4 py-4 text-right">
                  <Link className="font-semibold text-primary hover:underline" to={`/grievances/${grievance._id}`}>Open</Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="flex flex-col gap-3 border-t px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-muted-foreground">Showing <span className="font-medium text-foreground">{firstRow}–{lastRow}</span> of <span className="font-medium text-foreground">{itemCount}</span> grievances</p>
        {pageCount > 1 && (
          <Pagination className="mx-0 w-auto justify-end">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious href="#" aria-disabled={currentPage <= 1} className={currentPage <= 1 ? 'pointer-events-none opacity-50' : ''} onClick={(event) => { event.preventDefault(); changePage(currentPage - 1); }} />
              </PaginationItem>
              {pages.map((pageNumber) => (
                <PaginationItem key={pageNumber}>
                  <PaginationLink href="#" size="icon" isActive={pageNumber === currentPage} aria-label={`Page ${pageNumber}`} onClick={(event) => { event.preventDefault(); changePage(pageNumber); }}>{pageNumber}</PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext href="#" aria-disabled={currentPage >= pageCount} className={currentPage >= pageCount ? 'pointer-events-none opacity-50' : ''} onClick={(event) => { event.preventDefault(); changePage(currentPage + 1); }} />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>
    </div>
  );
}
