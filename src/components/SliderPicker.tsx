import { Slider } from "./ui/slider";

interface Option<T extends string> {
  value: T;
  label: string;
  color?: string;
}

interface Props<T extends string> {
  options: Option<T>[];
  value: T;
  onChange: (value: T) => void;
}

export function SliderPicker<T extends string>({
  options,
  onChange,
  value,
}: Props<T>) {
  return (
    <div className="flex flex-col space-y-3">
      <Slider
        max={options.length - 1}
        min={0}
        step={1}
        defaultValue={[options.length / 2]}
        onValueChange={([v]) => onChange(options[v].value)}
      />
      <div className="text-sm opacity-60 self-end">
        {options.find((o) => o.value === value)?.label}
      </div>
    </div>
  );
}
