import { ComponentPropsWithRef } from "react";

export type Option<Value extends string | number> = {
  label: string;
  value: Value;
};

type DropdownSelectProps<Value extends string | number> = {
  options: Option<Value>[];
  onSelect?: (value: Value) => void;
} & Omit<ComponentPropsWithRef<"select">, "onSelect">;

export default function DropdownSelect<Value extends string | number>({
  options,
  onSelect,
  ...restProps
}: DropdownSelectProps<Value>) {
  return (
    <select
      onSelect={(event) => {
        onSelect?.(event.currentTarget.value as Value);
      }}
      {...restProps}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
