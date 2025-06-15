import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface Option {
  value: string;
  title: string;
  color?: string;
}

interface OptionPickerProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  columns?: number;
  variant?: "default" | "color" | "dark";
}

const columnClasses: { [col: number]: string } = {
  1: "grid-cols-1",
  2: "grid-cols-2",
  3: "grid-cols-3",
  4: "grid-cols-4",
  5: "grid-cols-5",
};

const optionColorMap: { [color: string]: string } = {
  red: "bg-red-600",
  orange: "bg-orange-400",
  yellow: "bg-yellow-400",
  green: "bg-green-400",
  emerald: "bg-emerald-500",
};

export function OptionPicker({
  options,
  value,
  onChange,
  columns = 4,
  variant = "default",
}: OptionPickerProps) {
  console.log({ options, value, onChange, variant });
  return (
    <div className={`grid ${columnClasses[columns] ?? "grid-cols-3"} gap-1.5`}>
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
              (optionColorMap[option.color]
                ? `${optionColorMap[option.color]} text-white`
                : `bg-[${option.color}] text-white`), // Use arbitrary value for hex
            value === option.value &&
              variant === "dark" &&
              "bg-gray-900 text-white",
            value === option.value &&
              variant === "default" &&
              "bg-blue-50 text-blue-700 border border-blue-200",
          )}
        >
          {option.title}
        </Button>
      ))}
    </div>
  );
}
