import { ReactNode, useEffect } from "react";
import { useParams } from "wouter";
import { useUserInfo } from "./data/useUserInfo";
import { AuthenticationContext } from "./components/AuthenticationContext";

export function AuthenticatedRoute({ children }: { children: ReactNode }) {
  return <AuthCheck>{children}</AuthCheck>;
}

function AuthCheck({ children }: { children: ReactNode }) {
  const { token } = useParams();
  const { storeUserToken, user } = useUserInfo();

  useEffect(() => {
    if (token && token !== user?.token) {
      storeUserToken(token);
    }
  }, [storeUserToken, token, user, user?.token]);

  if (!token) {
    return <div className="text-red-700">Missing Token</div>;
  }

  return (
    <AuthenticationContext.Provider value={{ token }}>
      {children}
    </AuthenticationContext.Provider>
  );
}
