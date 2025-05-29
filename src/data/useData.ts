import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "app-data-cache";

function readLocalStorage(): Record<string, unknown> {
  const raw = localStorage.getItem(STORAGE_KEY) ?? "{}";
  return JSON.parse(raw) as Record<string, unknown>;
}

function writeLocalStorage(data: unknown) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

interface Handler {
  (data: unknown): void;
}

const requestMap = new Map<string, Promise<unknown>>();
const handlerMap = new Map<string, Handler[]>();

const memoryCache = readLocalStorage();

export function useData<T>(
  path: string,
  options?: {
    isLocalOnly: boolean;
  },
): {
  data: T | null;
  mutate: (newData: T) => void;
} {
  const [data, setData] = useState<T | null>(() => {
    const v = memoryCache[path];
    return v != null ? (v as T) : null;
  });

  const mutate = useCallback(
    (data: T) => {
      memoryCache[path] = data;
      writeLocalStorage(memoryCache);

      const handlers = handlerMap.get(path) ?? [];
      for (const handler of handlers) {
        handler(data);
      }
    },
    [path],
  );

  useEffect(() => {
    const handler = (data: unknown) => {
      setData(data as T);
    };

    const handlers = handlerMap.get(path) ?? [];
    handlerMap.set(path, [...handlers, handler]);
    return () => {
      const handlers = handlerMap.get(path) ?? [];
      handlerMap.set(
        path,
        handlers.filter((h) => h !== handler),
      );
    };
  }, [path]);

  const isLocalOnly = options?.isLocalOnly === true;

  useEffect(() => {
    const fromCache = memoryCache[path];
    if (fromCache) {
      setData(fromCache as T);
    }

    if (!isLocalOnly) {
      let promise = requestMap.get(path);
      if (!promise) {
        promise = fetch(path).then((res) => res.json());
        requestMap.set(path, promise);
      }

      promise.then((d) => {
        requestMap.delete(path);
        mutate(d as T);
      });
    }

    return () => {
      requestMap.delete(path);
    };
  }, [path, isLocalOnly, mutate]);

  return { data, mutate };
}
