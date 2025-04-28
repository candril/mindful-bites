import { useEffect } from "react";
import { State, useSWRConfig } from "swr";
import { useLocalStorage, useEventListener } from "usehooks-ts";

type PersistedCache = Record<string, State | undefined>;

export const useSWRCache = () => {
  const [swrCache, setSWRCache] = useLocalStorage("data-cache", "{}");
  const parsedSWRCache = JSON.parse(swrCache) as PersistedCache;
  const { cache, mutate } = useSWRConfig();

  useEffect(() => {
    Object.entries(parsedSWRCache).forEach(([key, value]) => {
      if (!value) return;
      cache.set(key, value);
    });

    Array.from(cache.keys()).forEach((key) => {
      mutate(key);
    });
  });

  useEventListener("beforeunload", () => {
    const newCache: PersistedCache = {};

    Array.from(cache.keys()).forEach((key) => {
      newCache[key] = cache.get(key);
    });

    setSWRCache(JSON.stringify(newCache));
  });
};
