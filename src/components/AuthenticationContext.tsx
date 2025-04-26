import { useContext, createContext } from "react";

export const AuthenticationContext = createContext<
  { token: string } | undefined
>(undefined);

export function useToken() {
  const ctx = useContext(AuthenticationContext);
  if (!ctx) {
    throw new Error("AuthenticationContext is missing");
  }

  return ctx.token;
}
