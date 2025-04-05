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
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={`rounded-lg px-3 py-2 text-sm transition-colors ${
            value === option.value
              ? variant === "color" && option.color
                ? `${option.color} text-white`
                : variant === "dark"
                  ? "bg-gray-900 text-white"
                  : "bg-blue-50 text-blue-700 border border-blue-200"
              : "bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100"
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
