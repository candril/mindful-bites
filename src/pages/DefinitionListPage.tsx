import { useEntryDefinitions } from "@/components/form/useFieldDefinitions";
import { Layout } from "@/components/Layout";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { EntryDefinition } from "@/data/EntryDefinition";
import { useEntries } from "@/data/useStorage";
import { FC } from "react";

const DefinitionListPage: FC = () => {
  const definitions = useEntryDefinitions();
  const { entries } = useEntries();

  const entryCountByDefinition: Record<string, number> = entries?.reduce(
    (acc, entry) => {
      if (entry.definitionId) {
        acc[entry.definitionId] = (acc[entry.definitionId] || 0) + 1;
      }
      return acc;
    },
    {} as Record<string, number>,
  );

  return (
    <Layout title="Definitions">
      <div className="mt-3 mx-3 space-y-3">
        {(definitions || [])
          .slice()
          .sort((a, b) => {
            const countA = entryCountByDefinition[a.id] || 0;
            const countB = entryCountByDefinition[b.id] || 0;
            return countB - countA;
          })
          .map((definition) => (
            <DefinitionCard
              key={definition.id}
              definition={definition}
              entryCount={entryCountByDefinition[definition.id] || 0}
            />
          ))}
      </div>
    </Layout>
  );
};

export const DefinitionCard: FC<{
  definition: EntryDefinition;
  entryCount: number;
}> = ({ definition, entryCount }) => {
  return (
    <>
      <Card className="flex flex-col h-full">
        <CardHeader>
          <div className="flex flex-row items-center justify-between">
            <div className="flex flex-col space-y-1.5">
              <CardTitle>{definition.name}</CardTitle>
              {definition.description && (
                <CardDescription>{definition.description}</CardDescription>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-xs text-muted-foreground">
            {definition.fields?.length ?? 0} fields · {entryCount} entries
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default DefinitionListPage;
