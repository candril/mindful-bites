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
// const FAKE_RESULT = {
//   id: "happiness_entry",
//   name: "Happiness Tracker",
//   description: "Track your daily happiness level and main reason.",
//   iconName: "smile",
//   fields: [
//     {
//       id: "happiness_level",
//       definitionId: "happiness_entry",
//       name: "Happiness Level",
//       type: "choice",
//       isRequired: true,
//       label: "How happy are you today?",
//       description: "Select your overall happiness level for today.",
//       defaultValue: "3",
//       choices: [
//         {
//           key: "1",
//           title: "Very Unhappy",
//           value: 1,
//           color: "#e53935",
//           modifier: 1,
//         },
//         {
//           key: "2",
//           title: "Unhappy",
//           value: 2,
//           color: "#fb8c00",
//           modifier: 2,
//         },
//         {
//           key: "3",
//           title: "Neutral",
//           value: 3,
//           color: "#fdd835",
//           modifier: 3,
//         },
//         {
//           key: "4",
//           title: "Happy",
//           value: 4,
//           color: "#43a047",
//           modifier: 4,
//         },
//         {
//           key: "5",
//           title: "Very Happy",
//           value: 5,
//           color: "#1e88e5",
//           modifier: 5,
//         },
//       ],
//       order: 1,
//     },
//     {
//       id: "main_reason",
//       name: "Main Reason",
//       type: "text",
//       isRequired: false,
//       label: "Main reason for your happiness level",
//       description: "Optionally describe why you feel this way.",
//       order: 2,
//       defaultValue: "",
//       definitionId: "happiness_entry",
//     },
//   ],
//   titleTemplate: "Happiness: {happiness_level}",
//   subtitleTemplate: "Reason: {main_reason}",
//   ratingExpression: "happiness_level",
// } satisfies Omit<EntryDefinition, "parsedRatingExpression">;

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
              <pre className="bg-muted p-4 rounded-md overflow-x-auto text-sm">
                {JSON.stringify(result, null, 2)}
              </pre>

              <EntryForm
                entry={createDefaultEntry(
                  new Date(),
                  token,
                  result as EntryDefinition,
                )}
                definition={result as EntryDefinition}
                onSubmit={(x) => {
                  console.log(x);
                  return true;
                }}
              />
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default NewDefinitionPage;
