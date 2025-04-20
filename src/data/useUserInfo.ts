export function useUserInfo(): { token: string } | null {
  const fromStorage = localStorage.getItem("user-info");

  if (fromStorage === null) {
    return null;
  }

  return JSON.parse(fromStorage);
}
