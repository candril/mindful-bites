import { FC, FormEvent, useState } from "react";
import { Layout } from "@/components/Layout";
import { EntryDefinition } from "@/data/EntryDefinition";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { createDefaultEntry } from "@/data/createDefaultEntry";
import { EntryForm } from "@/components/form/EntryForm";
import { useToken } from "@/components/AuthenticationContext";
import { toast } from "sonner";

type Result = Omit<EntryDefinition, "parsedRatingExpression">;

const useCreateDefinition = (userToken: string) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown | null>(null);
  const [result, setResult] = useState<Result | null>(null);

  const createDefinition = async (prompt: string) => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch(`/api/users/${userToken}/definitions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      if (!res.ok) throw new Error("Failed to create definition");
      const data = await res.json();
      setResult(data as Result);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  };

  return { createDefinition, loading, error, result };
};

const NewDefinitionPage: FC = () => {
  const [prompt, setPrompt] = useState("");
  const token = useToken();
  const { createDefinition, loading, error, result } =
    useCreateDefinition(token);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    createDefinition(prompt);
  };

  return (
    <Layout title="New Definition">
      <div className="container mx-auto py-8 px-4 flex flex-col items-center">
        <Card className="w-full max-w-xl">
          <CardHeader>
            <CardTitle>Create New Definition</CardTitle>
            <CardDescription>
              Enter a prompt below to generate a new definition using AI.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="prompt">Prompt</Label>
                <Input
                  id="prompt"
                  type="text"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g., describe a complex concept"
                  disabled={loading}
                  className="text-base"
                />
              </div>
              <Button
                type="submit"
                disabled={loading || !prompt.trim()}
                className="w-full"
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {loading ? "Generating..." : "Generate Definition"}
              </Button>
            </form>
          </CardContent>
          {/* {error && ( */}
          {/*   <CardFooter> */}
          {/*     <Alert variant="destructive" className="w-full"> */}
          {/*       <AlertTitle>Error</AlertTitle> */}
          {/*       <AlertDescription>Failed</AlertDescription> */}
          {/*     </Alert> */}
          {/*   </CardFooter> */}
          {/* )} */}
        </Card>

        {result && !loading && (
          <Card className="w-full max-w-xl mt-6">
            <CardHeader>
              <CardTitle>Generated Definition</CardTitle>
            </CardHeader>
            <CardContent>
              <EntryForm
                entry={createDefaultEntry(
                  new Date(),
                  token,
                  result as EntryDefinition,
                )}
                definition={result as EntryDefinition}
                onSubmit={() => Promise.resolve(true)}
              />

              <Button
                className="mt-4 w-full"
                onClick={async () => {
                  const res = await fetch(
                    `/api/users/${token}/definitions/${result.id}`,
                    {
                      method: "PUT",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify(result),
                    },
                  );
                  if (res.ok) {
                    toast.success("Definition created successfully!");
                  } else {
                    toast.error("Failed to create definition.");
                  }
                }}
              >
                Create Definition
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default NewDefinitionPage;
