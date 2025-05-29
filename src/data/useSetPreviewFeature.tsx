import { useData } from "@/data/useData";

export function useSetPreviewFeature(key: "combined-rating") {
  return useData<boolean>(`preview-feature-${key}`, {
    isLocalOnly: true,
  });
}

export function usePreviewFeature(key: "combined-rating"): boolean {
  const { data } = useData<boolean>(`preview-feature-${key}`, {
    isLocalOnly: true,
  });

  return data ?? false;
}
