import { FC, ReactNode, useState } from "react";
import { Header } from "./Header";
import { BottomNav } from "./BottomNav";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "./ui/drawer";
import { X } from "lucide-react";
import { Button } from "./ui/button";
import { MealForm } from "./MealForm";
import { useToken } from "./AuthenticationContext";
import { useMeals } from "@/data/useStorage";
import { getCommonComponents } from "@/data/getCommonComponents";

export const Layout: FC<{ children: ReactNode; title?: string }> = ({
  children,
  title,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const token = useToken();
  const { entries, createEntry } = useMeals(token);

  const commonComponents = getCommonComponents(entries);

  return (
    <div className="flex flex-col min-h-svh">
      <Header title={title} />
      <main className="flex flex-col flex-1 pb-16">{children}</main>

      <Drawer open={isOpen} onOpenChange={(open) => !open && setIsOpen(false)}>
        <DrawerContent className="max-w-3xl m-auto p-4 space-y-8">
          <DrawerHeader className="flex flex-row p-0">
            <DrawerTitle className="flex-1 self-center justify-center text-3xl">
              Create Meal Entry
            </DrawerTitle>
            <Button
              size="icon"
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="shadow-none border-none"
            >
              <X className="size-4" />
            </Button>
          </DrawerHeader>
          <div className="overflow-auto">
            <MealForm
              date={new Date()}
              commonComponents={commonComponents}
              onSubmit={(entry) => {
                createEntry(entry);
                setIsOpen(false);
              }}
            />
          </div>
        </DrawerContent>
      </Drawer>

      <BottomNav onAddClick={() => setIsOpen(true)} />
    </div>
  );
};
