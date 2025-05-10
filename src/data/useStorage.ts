import { useCallback } from "react";
import { useData } from "./useData";
import { useToken } from "@/components/AuthenticationContext";

export type Entry = {
  id: string;
  date: string;
  data: Record<string, unknown>;
  definitionId: string;
  userToken: string;
};

async function deleteEntryRemote(id: string, token: string) {
  const res = await fetch(`/api/users/${token}/entries/${id}`, {
    method: "DELETE",
  });

  if (res.ok) {
    return res;
  }

  throw new Error(res.statusText);
}
async function updateEntryRemote(entry: Entry, userToken: string) {
  const res = await fetch(`/api/users/${userToken}/entries/${entry.id}`, {
    method: "PUT",
    body: JSON.stringify({ ...entry, userToken }),
  });

  if (res.ok) {
    return res;
  }

  throw new Error(res.statusText);
}

async function createEntryRemote(entry: Entry, userToken: string) {
  const res = await fetch(`/api/users/${userToken}/entries`, {
    method: "POST",
    body: JSON.stringify({ ...entry, userToken }),
  });

  if (res.ok) {
    return res;
  }

  throw new Error(res.statusText);
}

export function useEntries() {
  const token = useToken();
  const { data, mutate } = useData<Entry[]>(`/api/users/${token}/entries`);

  const entries = data ?? [];

  const createEntry = useCallback(
    async (entry: Entry) => {
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
    async (updatedEntry: Entry) => {
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
