import clsx from 'clsx';
import { type ChangeEventHandler, forwardRef, type SelectHTMLAttributes } from 'react';

export interface SelectOption<T extends string | number> {
  value: T;
  label: string;
}

interface SelectProps<T extends string | number> extends Omit<
  SelectHTMLAttributes<HTMLSelectElement>,
  'value' | 'defaultValue'
> {
  label?: string;
  error?: string;
  options: readonly SelectOption<T>[];
  value?: T;
  defaultValue?: T;
  onValueChange?: (value: T) => void;
}

function SelectInner<T extends string | number>(
  {
    className,
    label,
    error,
    id,
    options,
    value,
    defaultValue,
    onValueChange,
    onChange,
    ...props
  }: SelectProps<T> & { onChange?: ChangeEventHandler<HTMLSelectElement> },
  ref: React.ForwardedRef<HTMLSelectElement>,
) {
  const handleChange: ChangeEventHandler<HTMLSelectElement> = (event) => {
    const selectedOption = options.find(
      (option) => String(option.value) === event.currentTarget.value,
    );

    if (selectedOption) {
      onValueChange?.(selectedOption.value);
    }

    onChange?.(event);
  };

  return (
    <div className={clsx(className, 'flex flex-col gap-1.5')}>
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-foreground">
          {label}
        </label>
      )}
      <select
        ref={ref}
        id={id}
        value={value}
        defaultValue={defaultValue}
        onChange={handleChange}
        className="w-full px-4 py-2.5 bg-card border border-border rounded-xl text-foreground focus:outline-none focus:border-accent transition-colors cursor-pointer"
        {...props}
      >
        {options.map((option) => (
          <option key={String(option.value)} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <span className="text-sm text-red-500">{error}</span>}
    </div>
  );
}

export const Select = forwardRef(SelectInner) as <T extends string | number>(
  props: SelectProps<T> & { ref?: React.ForwardedRef<HTMLSelectElement> },
) => React.ReactElement | null;
