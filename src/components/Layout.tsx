import { FC, ReactNode } from "react";
import { Header } from "./Header";

export const Layout: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-svh">
      <Header />
      {children}
    </div>
  );
};
