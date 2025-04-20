function setUserToken(token: string) {
  localStorage.setItem("user-info", JSON.stringify({ token }));
}

export function useUserInfo(): {
  user: { token: string } | null;
  setUserToken: (token: string) => void;
} {
  const fromStorage = localStorage.getItem("user-info");

  if (fromStorage === null) {
    return { user: null, setUserToken };
  }

  return {
    user: JSON.parse(fromStorage),
    setUserToken,
  };
}
