import { FC, ReactNode } from "react";
import { Header } from "./Header";
import { BottomNav } from "./BottomNav";

export const Layout: FC<{ children: ReactNode; title?: string }> = ({
  children,
  title,
}) => {
  return (
    <div className="flex flex-col min-h-svh">
      <Header title={title} />
      <main className="flex flex-col flex-1 pb-16">{children}</main>
      <BottomNav />
    </div>
  );
};
