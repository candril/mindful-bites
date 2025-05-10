import { useState } from "react";
import { Entry } from "@/data/useStorage";

export function useEntryForm(entry: Entry) {
  const [data, setData] = useState<Record<string, unknown>>(entry.data);

  const setDataField = (field: string, value: unknown) => {
    setData({ ...data, [field]: value });
  };

  const resetForm = () => {
    setData({});
  };

  const getFormData = (): Entry => {
    const updatedEntry: Entry = {
      ...entry,
      data,
    };

    return updatedEntry;
  };

  return {
    data,
    setDataField,
    getFormData,
    resetForm,
  };
}
