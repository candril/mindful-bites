import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Option<T extends string> {
  value: T;
  label: string;
  color?: string;
}

interface OptionPickerProps<T extends string> {
  options: Option<T>[];
  value: T;
  onChange: (value: T) => void;
  columns?: number;
  variant?: "default" | "color" | "dark";
}

export function OptionPicker<T extends string>({
  options,
  value,
  onChange,
  columns = 4,
  variant = "default",
}: OptionPickerProps<T>) {
  return (
    <div className={`grid grid-cols-${columns} gap-1.5`}>
      {options.map((option) => (
        <Button
          key={option.value}
          variant={value === option.value ? "secondary" : "outline"}
          onClick={(e) => {
            e.preventDefault();
            return onChange(option.value);
          }}
          className={cn(
            "px-3 py-2 text-sm h-auto",
            value === option.value &&
              variant === "color" &&
              option.color &&
              `${option.color} text-white`,
            value === option.value &&
              variant === "dark" &&
              "bg-gray-900 text-white",
            value === option.value &&
              variant === "default" &&
              "bg-blue-50 text-blue-700 border border-blue-200",
          )}
        >
          {option.label}
        </Button>
      ))}
    </div>
  );
}
