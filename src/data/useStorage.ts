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

async function deleteEntryRemote(id: string, token: string) {
  return fetch(`/api/users/${token}/bites/${id}`, {
    method: "DELETE",
  });
}
async function updateEntryRemote(entry: MealEntry, user_token: string) {
  return fetch(`/api/users/${user_token}/bites/${entry.id}`, {
    method: "PUT",
    body: JSON.stringify({ ...entry, user_token }),
  });
}

async function createEntryRemote(entry: MealEntry, userToken: string) {
  return fetch(`/api/users/${userToken}/bites`, {
    method: "POST",
    body: JSON.stringify({ ...entry, userToken }),
  });
}

export function useMeals(token: string) {
  const [entries, setEntries] = useState<MealEntry[]>(() => loadEntries());

  useEffect(() => {
    fetch(`/api/users/${token}/bites`)
      .then((res) => res.json())
      .then((data) => {
        for (const entry of data) {
          entry.date = parseISO(entry.date);
        }

        storeEntries(data);
        return setEntries(data);
      });
  }, [token]);

  const createEntry = useCallback(
    async (entry: MealEntry) => {
      const updatedEntries = [...entries, entry];
      setEntries(updatedEntries);
      storeEntries(updatedEntries);

      await createEntryRemote(entry, token);
    },
    [entries, token],
  );

  const updateEntry = useCallback(
    async (updatedEntry: MealEntry) => {
      const updatedEntries = entries.map((entry) =>
        entry.id === updatedEntry.id ? updatedEntry : entry,
      );
      setEntries(updatedEntries);
      storeEntries(updatedEntries);

      await updateEntryRemote(updatedEntry, token);
    },
    [entries, token],
  );

  const deleteEntry = useCallback(
    async (id: string) => {
      const updatedEntries = entries.filter((entry) => entry.id !== id);
      setEntries(updatedEntries);
      storeEntries(updatedEntries);

      await deleteEntryRemote(id, token);
    },
    [entries, token],
  );

  return {
    entries,
    createEntry,
    updateEntry,
    deleteEntry,
  };
}
