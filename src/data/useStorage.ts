import { useCallback } from "react";
import { MealEntry } from "./meals";
import { useData } from "./useData";

async function deleteEntryRemote(id: string, token: string) {
  const res = await fetch(`/api/users/${token}/bites/${id}`, {
    method: "DELETE",
  });

  if (res.ok) {
    return res;
  }

  throw new Error(res.statusText);
}
async function updateEntryRemote(entry: MealEntry, userToken: string) {
  const res = await fetch(`/api/users/${userToken}/bites/${entry.id}`, {
    method: "PUT",
    body: JSON.stringify({ ...entry, userToken }),
  });

  if (res.ok) {
    return res;
  }

  throw new Error(res.statusText);
}

async function createEntryRemote(entry: MealEntry, userToken: string) {
  const res = await fetch(`/api/users/${userToken}/bites`, {
    method: "POST",
    body: JSON.stringify({ ...entry, userToken }),
  });

  if (res.ok) {
    return res;
  }

  throw new Error(res.statusText);
}

export function useMeals(token: string) {
  const { data, mutate } = useData<MealEntry[]>(`/api/users/${token}/bites`);

  const entries = data ?? [];

  const createEntry = useCallback(
    async (entry: MealEntry) => {
      mutate([...entries, entry]);
      try {
        await createEntryRemote(entry, token);
      } catch (error) {
        mutate([...entries]);
        throw error;
      }
    },
    [entries, token, mutate],
  );

  const updateEntry = useCallback(
    async (updatedEntry: MealEntry) => {
      mutate(
        entries.map((entry) =>
          entry.id === updatedEntry.id ? updatedEntry : entry,
        ),
      );
      try {
        await updateEntryRemote(updatedEntry, token);
      } catch (error) {
        mutate(entries);
        throw error;
      }
    },
    [entries, token, mutate],
  );

  const deleteEntry = useCallback(
    async (id: string) => {
      mutate(entries.filter((entry) => entry.id !== id));
      try {
        await deleteEntryRemote(id, token);
      } catch (error) {
        mutate(entries);
        throw error;
      }
    },
    [entries, token, mutate],
  );

  return {
    entries,
    createEntry,
    updateEntry,
    deleteEntry,
  };
}
