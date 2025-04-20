import { Config, Context } from "@netlify/functions";
import crypto from "node:crypto";

function generateUniqueUsername(): string {
  const timestamp = Date.now().toString();
  const randomBytes = crypto.randomBytes(32).toString("hex");
  const seedData = timestamp + randomBytes;

  const hash = crypto.createHash("sha256").update(seedData).digest("hex");
  const adjectiveIndex = parseInt(hash.substring(0, 8), 16) % adjectives.length;
  const nounIndex = parseInt(hash.substring(8, 16), 16) % nouns.length;
  const qualifierIndex =
    parseInt(hash.substring(16, 24), 16) % qualifiers.length;

  const adjective = adjectives[adjectiveIndex];
  const noun = nouns[nounIndex];
  const qualifier = qualifiers[qualifierIndex];

  const uniqueSuffix = hash.substring(24, 56);

  return `${adjective}${noun}${qualifier}_${uniqueSuffix}`;
}

export default async (req: Request, context: Context) => {
  try {
    switch (req.method) {
      case "POST":
        const userToken = generateUniqueUsername();

        return new Response(JSON.stringify({ userToken }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });

      default:
        return new Response("Not found", {
          status: 404,
        });
    }
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ error: "Failed to process request" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
};

export const config: Config = {
  path: ["/api/users"],
};

const adjectives = [
  "happy",
  "clever",
  "brave",
  "calm",
  "bright",
  "kind",
  "swift",
  "wise",
  "cool",
  "eager",
];
const nouns = [
  "tiger",
  "eagle",
  "panda",
  "fox",
  "wolf",
  "bear",
  "hawk",
  "lion",
  "orca",
  "lynx",
];
const qualifiers = [
  "master",
  "hero",
  "pro",
  "ace",
  "prime",
  "elite",
  "alpha",
  "mega",
  "ultra",
  "super",
  "epic",
  "mighty",
  "royal",
];
