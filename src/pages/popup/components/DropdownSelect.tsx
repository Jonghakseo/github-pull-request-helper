import { ComponentPropsWithRef } from "react";

export type Option<Value extends string | number> = {
  label: string;
  value: Value;
};

type DropdownSelectProps<Value extends string | number> = {
  options: Option<Value>[];
  onChangeOption?: (value: Value) => void;
} & ComponentPropsWithRef<"select">;

export default function DropdownSelect<Value extends string | number>({
  options,
  onChange,
  onChangeOption,
  ...restProps
}: DropdownSelectProps<Value>) {
  return (
    <select
      onChange={(event) => {
        onChangeOption?.(event.currentTarget.value as Value);
        onChange?.(event);
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
