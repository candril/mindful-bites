import { useToken } from "@/components/AuthenticationContext";
import { useEntryDefinitions } from "@/components/form/useFieldDefinitions";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { EntryDefinition } from "@/data/EntryDefinition";
import { useEntries } from "@/data/useStorage";
import { Trash2 } from "lucide-react";
import { FC, useState } from "react";

const DefinitionListPage: FC = () => {
  const { definitions, mutate: mutateDefinitions } = useEntryDefinitions();
  const { entries, mutate: mutateEntries } = useEntries();

  const entryCountMap =
    entries?.reduce<Record<string, number>>((acc, entry) => {
      acc[entry.definitionId] = (acc[entry.definitionId] || 0) + 1;
      return acc;
    }, {}) ?? {};

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedDefinition, setSelectedDefinition] =
    useState<EntryDefinition | null>(null);
  const userToken = useToken();

  const { deleteDefinition, loading } = useDeleteDefinition(userToken);

  const handleDeleteClick = (definition: EntryDefinition) => {
    setSelectedDefinition(definition);
    setDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedDefinition && definitions) {
      const definitionId = selectedDefinition.id;
      await deleteDefinition(definitionId);
      setDeleteOpen(false);
      setSelectedDefinition(null);

      mutateEntries([]);
      mutateDefinitions(definitions.filter((d) => d.id !== definitionId));
    }
  };

  return (
    <Layout title="Definitions">
      <div className="space-y-3 m-3">
        {definitions?.map((definition) => (
          <DefinitionCard
            key={definition.id}
            definition={definition}
            entryCount={entryCountMap[definition.id] || 0}
            onDeleteClick={() => handleDeleteClick(definition)}
          />
        ))}
      </div>
      <Drawer open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DrawerContent className="max-w-md m-auto p-6">
          <DrawerHeader>
            <DrawerTitle>Delete Definition</DrawerTitle>
          </DrawerHeader>
          <div className="mb-4">
            Are you sure you want to delete <b>{selectedDefinition?.name}</b>?
            This action cannot be undone.
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setDeleteOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
              disabled={loading}
            >
              {loading ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </DrawerContent>
      </Drawer>
    </Layout>
  );
};

const DefinitionCard: FC<{
  definition: EntryDefinition;
  entryCount: number;
  onDeleteClick?: () => void;
}> = ({ definition, entryCount, onDeleteClick }) => {
  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <div className="flex flex-row items-center justify-between">
          <div className="flex flex-col space-y-1.5">
            <CardTitle>{definition.name}</CardTitle>
            {definition.description && (
              <CardDescription>{definition.description}</CardDescription>
            )}
          </div>
          {onDeleteClick && (
            <Button
              size="icon"
              variant="destructive"
              onClick={onDeleteClick}
              className="ml-2"
              aria-label="Delete Definition"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-xs text-muted-foreground">
          {definition.fields?.length ?? 0} fields · {entryCount} entries
        </div>
      </CardContent>
    </Card>
  );
};

const useDeleteDefinition = (userToken: string) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown | null>(null);

  const deleteDefinition = async (definitionId: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `/api/users/${userToken}/definitions/${definitionId}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        },
      );
      if (!res.ok) throw new Error("Failed to delete definition");
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  };

  return { deleteDefinition, loading, error };
};

export default DefinitionListPage;
