import { FC, ReactNode } from "react";
import { Header } from "./Header";
import { BottomNav } from "./ButtonNav";

export const Layout: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-svh">
      <Header />
      <main className="flex flex-col flex-1 pb-16">{children}</main>
      <BottomNav />
    </div>
  );
};
