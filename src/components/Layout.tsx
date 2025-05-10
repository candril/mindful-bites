import { FC, ReactNode, useState } from "react";
import { Header } from "./Header";
import { BottomNav } from "./BottomNav";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "./ui/drawer";
import { X } from "lucide-react";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { useEntries } from "@/data/useStorage";
import { NewEntryForm } from "@/pages/NewEntryForm";

export const Layout: FC<{ children: ReactNode; title?: string }> = ({
  children,
  title,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { createEntry } = useEntries();

  return (
    <div className="flex flex-col min-h-svh">
      <Header title={title} />
      <main className="flex flex-col flex-1 pb-16">{children}</main>

      <Drawer open={isOpen} onOpenChange={(open) => !open && setIsOpen(false)}>
        <DrawerContent className="max-w-3xl m-auto p-4 space-y-8">
          <DrawerHeader className="flex flex-row p-0">
            <DrawerTitle className="flex-1 self-center justify-center text-3xl">
              Create Entry
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
            <NewEntryForm
              date={new Date()}
              onSubmit={async (entry) => {
                try {
                  setIsOpen(false);
                  await createEntry(entry);
                  return true;
                } catch {
                  toast.error("Ooops, the entry could not be stored");
                  return false;
                }
              }}
            />
          </div>
        </DrawerContent>
      </Drawer>

      <BottomNav onAddClick={() => setIsOpen(true)} />
    </div>
  );
};
