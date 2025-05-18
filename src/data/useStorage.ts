import { useCallback, useMemo } from "react";
import { useData } from "./useData";
import { useToken } from "@/components/AuthenticationContext";
import { useEntryDefinitions } from "@/components/form/useFieldDefinitions";
import { EntryDefinition } from "./EntryDefinition";
import { format } from "date-fns";

export type Entry = {
  id: string;
  date: string;
  data: Record<string, unknown>;
  definitionId: string;
  definition: EntryDefinition;
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
    body: JSON.stringify({ ...entry, userToken, definition: undefined }),
  });

  if (res.ok) {
    return res;
  }

  throw new Error(res.statusText);
}

async function createEntryRemote(entry: Entry, userToken: string) {
  const res = await fetch(`/api/users/${userToken}/entries`, {
    method: "POST",
    body: JSON.stringify({ ...entry, userToken, definition: undefined }),
  });

  if (res.ok) {
    return res;
  }

  throw new Error(res.statusText);
}

export function useEntries() {
  const token = useToken();
  const { data, mutate } = useData<Entry[]>(`/api/users/${token}/entries`);
  const definitions = useEntryDefinitions();

  const entries = useMemo(() => {
    const definitionMap = new Map<string, EntryDefinition>(
      definitions?.map((d) => [d.id, d]) ?? [],
    );

    return definitions
      ? (data?.map((e) => {
          const definition = definitionMap.get(e.definitionId);
          if (!definition) {
            throw new Error(`Missing defintion with ID '${e.definitionId}'`);
          }

          return {
            ...e,
            date: format(e.date, "yyyy-MM-dd"),
            definition,
          };
        }) ?? [])
      : [];
  }, [data, definitions]);

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
