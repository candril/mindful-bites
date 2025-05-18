import { FC, ReactNode, useState } from "react";
import { Header } from "./Header";
import { BottomNav } from "./BottomNav";
import { HeaderMenuProps } from "./HeaderMenu";
import { NewEntryDrawer } from "./NewEntryDrawer";

export const Layout: FC<{
  children: ReactNode;
  title?: string;
  menu?: HeaderMenuProps;
}> = ({ children, title, menu }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-svh">
      <Header title={title} menu={menu} />
      <main className="flex flex-col flex-1 pb-16">{children}</main>

      <NewEntryDrawer
        date={new Date()}
        isOpen={isOpen}
        onOpenChange={(open) => setIsOpen(open)}
      />

      <BottomNav onAddClick={() => setIsOpen(true)} />
    </div>
  );
};
