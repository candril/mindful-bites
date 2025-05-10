import React, { ComponentType, FC } from "react";
import { useEntryForm } from "./useMealForm";
import { Button } from "./ui/button";
import { Entry, useEntries } from "@/data/useStorage";
import { OptionPicker } from "./OptionPicker";
import {
  FieldDefinition,
  FieldType,
  useFieldDefinitions,
} from "./useFieldDefinitions";
import { ComponentPicker } from "./ComponentPicker";
import { getCommonChoices } from "@/data/getCommonChoices";

const NoopField: FC = () => {
  return <div>N/A</div>;
};

const ChoiceField: FC<FieldProps> = ({ definition, value, onChange }) => {
  const options =
    definition.choices?.map((c) => ({ ...c, value: c.value as string })) ?? [];

  return (
    <OptionPicker
      onChange={onChange}
      variant="dark"
      columns={options.length}
      options={options}
      value={value as string}
    />
  );
};

const ComboChoiceField: FC<FieldProps> = ({ definition, value, onChange }) => {
  const { entries } = useEntries();
  const commonComponents = getCommonChoices(definition, entries);
  const components = value ? (value as string[]) : [];

  return (
    <ComponentPicker
      commonComponents={commonComponents}
      components={components}
      onAdd={handleAddComponent}
      onRemove={(v) => onChange(components.filter((c) => v !== c))}
    />
  );

  function handleAddComponent(component: string) {
    const new_components = component
      .split(",")
      .map((c) => c.trim())
      .filter((c) => c.length);

    if (new_components.length === 0) {
      return;
    }

    const existingComponents = new Set(components);
    const merged_components = [...components];
    for (const c of new_components) {
      if (!existingComponents.has(c)) {
        merged_components.push(c);
        existingComponents.add(c);
      }
    }

    onChange(merged_components);
  }
};

type FieldProps = {
  definition: FieldDefinition;
  value: unknown;
  onChange: (value: unknown) => void;
};

function getFieldComponent(type: FieldType): ComponentType<FieldProps> {
  switch (type) {
    case "choice":
      return ChoiceField;
    case "combo_multi_choice":
      return ComboChoiceField;
    case "text":
    case "checkbox":
    case "date":
    case "multi_choice":
      return NoopField;
  }
}

const Field: FC<{
  definition: FieldDefinition;
  value: unknown;
  onChange: (newValue: unknown) => void;
}> = ({ definition, value, onChange }) => {
  const FieldComponent = getFieldComponent(definition.type);
  return (
    <>
      <label className="block text-sm font-bold opacity-60">
        {definition.label}
      </label>

      <FieldComponent
        definition={definition}
        value={value}
        onChange={onChange}
      />
    </>
  );
};

export const EntryForm: FC<{
  entry: Entry;
  commonComponents?: string[];
  onSubmit: (data: Entry) => Promise<boolean>;
}> = ({ onSubmit, entry }) => {
  const { getFormData, data, setDataField, resetForm } = useEntryForm(entry);

  const fields = useFieldDefinitions(entry.definitionId);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (await onSubmit(getFormData())) {
      resetForm();
    }
  };

  return (
    <form
      onSubmit={handleFormSubmit}
      className="flex flex-col space-y-10 bg-white"
    >
      {fields
        .sort((a, b) => a.order - b.order)
        .map((field) => (
          <div key={field.name} className="space-y-3">
            <Field
              definition={field}
              value={data[field.name]}
              onChange={(v) => setDataField(field.name, v)}
            />
          </div>
        ))}

      <Button type="submit" className="self-end">
        Save Meal Entry
      </Button>
    </form>
  );
};
