import { useCallback, useEffect, useState } from "react";
import { MealEntry } from "./meals";
import { parseISO } from "date-fns";

function loadEntries(): MealEntry[] {
  const fromStorage = localStorage.getItem("meal-entries");
  if (fromStorage === null) {
    return [];
  }

  return JSON.parse(fromStorage);
}

function storeEntries(entries: MealEntry[]) {
  localStorage.setItem("meal-entries", JSON.stringify(entries));
}

export function useStorage() {
  return {
    loadEntries,
    storeEntries,
  };
}

async function deleteEntryRemote(id: string) {
  return fetch("/api/bites/" + id, {
    method: "DELETE",
  });
}
async function updateEntryRemote(entry: MealEntry) {
  return fetch("/api/bites/" + entry.id, {
    method: "PUT",
    body: JSON.stringify(entry),
  });
}

async function createEntryRemote(entry: MealEntry) {
  return fetch("/api/bites", {
    method: "POST",
    body: JSON.stringify(entry),
  });
}

export function useMeals() {
  const { loadEntries, storeEntries } = useStorage();
  const [entries, setEntries] = useState<MealEntry[]>(() => loadEntries());

  useEffect(() => {
    console.log("fetch from server");
    fetch("/api/bites")
      .then((res) => res.json())
      .then((data) => {
        for (const entry of data) {
          entry.date = parseISO(entry.date);
        }

        storeEntries(data);
        console.log("store result from server", data);
        return setEntries(data);
      });
  }, []);

  const createEntry = useCallback(
    async (entry: MealEntry) => {
      const updatedEntries = [...entries, entry];
      setEntries(updatedEntries);
      storeEntries(updatedEntries);

      await createEntryRemote(entry);
    },
    [entries, storeEntries],
  );

  const updateEntry = useCallback(
    async (updatedEntry: MealEntry) => {
      const updatedEntries = entries.map((entry) =>
        entry.id === updatedEntry.id ? updatedEntry : entry,
      );
      setEntries(updatedEntries);
      storeEntries(updatedEntries);

      await updateEntryRemote(updatedEntry);
    },
    [entries, storeEntries],
  );

  const deleteEntry = useCallback(
    async (id: string) => {
      const updatedEntries = entries.filter((entry) => entry.id !== id);
      setEntries(updatedEntries);
      storeEntries(updatedEntries);

      await deleteEntryRemote(id);
    },
    [entries, storeEntries],
  );

  return {
    entries,
    createEntry,
    updateEntry,
    deleteEntry,
  };
}
