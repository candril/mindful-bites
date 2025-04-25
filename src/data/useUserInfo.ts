function storeUserToken(token: string) {
  localStorage.setItem("user-info", JSON.stringify({ token }));
}

export function useUserInfo(): {
  user: { token: string } | null;
  storeUserToken: (token: string) => void;
} {
  const fromStorage = localStorage.getItem("user-info");

  if (fromStorage === null) {
    return { user: null, storeUserToken };
  }

  return {
    user: JSON.parse(fromStorage),
    storeUserToken,
  };
}
