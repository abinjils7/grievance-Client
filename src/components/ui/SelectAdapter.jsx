import { Select as SelectRoot, SelectTrigger, SelectValue, SelectContent, SelectItem } from './Select.jsx';

export function Select({ value, onValueChange, items = [], placeholder = 'Select...', className = '', disabled, name, id, 'aria-label': ariaLabel, ...props }) {
  return (
    <SelectRoot value={value} onValueChange={onValueChange} name={name} {...props}>
      <SelectTrigger id={id} aria-label={ariaLabel} className={className} disabled={disabled}><SelectValue placeholder={placeholder} /></SelectTrigger>
      <SelectContent>{items.map((item) => <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>)}</SelectContent>
    </SelectRoot>
  );
}
