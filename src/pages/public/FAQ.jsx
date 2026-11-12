import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '../../components/ui/accordion.jsx';
import Info from '../../components/Info.jsx';

export default function FAQ() {
  return (
    <Info title="Frequently asked questions">
      <Accordion type="single" collapsible>
        {[
          [
            'How do I track my concern?',
            'Use the reference ID shown after submission on the Track Grievance page.',
          ],
          [
            'Can I update a submitted concern?',
            'Contact the CMO through the portal; a resolved grievance can be reopened from your dashboard.',
          ],
          [
            'Are AI suggestions final?',
            'No. AI suggestions are advisory and staff make all workflow decisions.',
          ],
        ].map(([q, a], i) => (
          <AccordionItem key={q} value={`item-${i}`} className="py-1">
            <AccordionTrigger className="text-left font-semibold">{q}</AccordionTrigger>
            <AccordionContent className="text-slate-600">{a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </Info>
  );
}
