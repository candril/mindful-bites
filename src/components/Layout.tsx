import { FC, ReactNode, useState } from "react";
import { Header } from "./Header";
import { BottomNav } from "./BottomNav";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "./ui/drawer";
import { X } from "lucide-react";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { useEntries } from "@/data/useStorage";
import { NewEntryForm } from "@/pages/NewEntryForm";
import { HeaderMenuProps } from "./HeaderMenu";
import { useEntryDefinitions } from "./form/useFieldDefinitions";

export const Layout: FC<{
  children: ReactNode;
  title?: string;
  menu?: HeaderMenuProps;
}> = ({ children, title, menu }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { createEntry } = useEntries();

  const definitions = useEntryDefinitions();
  const [selectedDefinitionId, setSelectedDefinition] = useState<string | null>(
    null,
  );

  function reset() {
    setIsOpen(false);
    setSelectedDefinition(null);
  }

  const definitionCount = definitions?.length ?? 0;

  const definitionId =
    definitionCount === 1 ? definitions?.[0].id : selectedDefinitionId;

  return (
    <div className="flex flex-col min-h-svh">
      <Header title={title} menu={definitionCount > 1 ? menu : undefined} />
      <main className="flex flex-col flex-1 pb-16">{children}</main>

      <Drawer open={isOpen} onOpenChange={(open) => !open && reset()}>
        <DrawerContent className="max-w-3xl m-auto p-4 space-y-8">
          <DrawerHeader className="flex flex-row p-0">
            <DrawerTitle className="flex-1 self-center justify-center text-3xl">
              Create Entry
            </DrawerTitle>
            <Button
              size="icon"
              variant="outline"
              onClick={reset}
              className="shadow-none border-none"
            >
              <X className="size-4" />
            </Button>
          </DrawerHeader>
          <div className="overflow-auto">
            {!definitionId &&
              definitions?.map((d) => (
                <div
                  key={d.id}
                  role="button"
                  className="p-4 mb-3 border rounded-lg shadow-sm hover:shadow-md transition-shadow bg-white cursor-pointer"
                  onClick={() => setSelectedDefinition(d.id)}
                >
                  <h3 className="text-lg font-semibold">{d.name}</h3>
                  {d.description && (
                    <p className="text-sm text-gray-500 mt-1">
                      {d.description}
                    </p>
                  )}
                </div>
              ))}

            {definitionId && (
              <NewEntryForm
                definitionId={definitionId}
                date={new Date()}
                onSubmit={async (entry) => {
                  try {
                    setIsOpen(false);
                    setSelectedDefinition(null);
                    await createEntry(entry);
                    return true;
                  } catch {
                    toast.error("Ooops, the entry could not be stored");
                    return false;
                  }
                }}
              />
            )}
          </div>
        </DrawerContent>
      </Drawer>

      <BottomNav onAddClick={() => setIsOpen(true)} />
    </div>
  );
};
