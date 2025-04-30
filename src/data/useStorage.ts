import { useCallback } from "react";
import { MealEntry } from "./meals";
import { useData } from "./useData";

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
  const { data, mutate } = useData<MealEntry[]>(`/api/users/${token}/bites`);

  const entries = data ?? [];

  const createEntry = useCallback(
    async (entry: MealEntry) => {
      mutate([...entries, entry]);
      await createEntryRemote(entry, token);
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
      await updateEntryRemote(updatedEntry, token);
    },
    [entries, token, mutate],
  );

  const deleteEntry = useCallback(
    async (id: string) => {
      mutate(entries.filter((entry) => entry.id !== id));
      await deleteEntryRemote(id, token);
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
