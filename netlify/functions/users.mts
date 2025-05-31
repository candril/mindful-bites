import { Config } from "@netlify/functions";
import { createClient } from "@supabase/supabase-js";
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

export default async (req: Request) => {
  try {
    switch (req.method) {
      case "POST":
        const userToken = generateUniqueUsername();

        await createDefaultEntryDefinition(userToken);

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

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

const _supabase =
  supabaseUrl && supabaseKey && createClient(supabaseUrl, supabaseKey);

function getClient() {
  if (_supabase) {
    return _supabase;
  }

  throw new Error("Missing supabase config");
}

async function createDefaultEntryDefinition(userToken: string) {
  const supabase = getClient();

  const { data: entryDef, error: entryDefError } = await supabase
    .from("entry_data_definitions")
    .insert([
      {
        id: crypto.randomUUID(),
        name: "Food Tracking",
        description: "Default definition for meal entries",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        user_token: userToken,
        title_template: "{components}",
        subtitle_template: "{meal_type}",
        rating_expression: "3 + portion_size + health_rating",
        icon_name: "Apple",
      },
    ])
    .select()
    .single();

  if (entryDefError) throw entryDefError;

  const fieldDefs = [
    {
      id: crypto.randomUUID(),
      definition_id: entryDef.id,
      type: "combo_multi_choice",
      name: "components",
      label: "Components",
      description: "Main components of the meal",
      required: false,
      choices: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      default_value: null,
      order: 3,
    },
    {
      id: crypto.randomUUID(),
      definition_id: entryDef.id,
      type: "choice",
      name: "health_rating",
      label: "How healthy was it?",
      description: "Rate how healthy this meal was",
      required: true,
      choices: [
        {
          key: "very-unhealthy",
          color: "red",
          title: "1",
          value: "very-unhealthy",
          modifier: -2,
        },
        {
          key: "unhealthy",
          color: "orange",
          title: "2",
          value: "unhealthy",
          modifier: -1,
        },
        {
          key: "neutral",
          color: "yellow",
          title: "3",
          value: "neutral",
          modifier: 0,
        },
        {
          key: "healthy",
          color: "green",
          title: "4",
          value: "healthy",
          modifier: 1,
        },
        {
          key: "very-healthy",
          color: "emerald",
          title: "5",
          value: "very-healthy",
          modifier: 2,
        },
      ],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      default_value: "neutral",
      order: 2,
    },
    {
      id: crypto.randomUUID(),
      definition_id: entryDef.id,
      type: "choice",
      name: "meal_type",
      label: "What type of meal was it?",
      description: "The type of meal consumed",
      required: true,
      choices: [
        { key: "breakfast", title: "Breakfast", value: "breakfast" },
        { key: "lunch", title: "Lunch", value: "lunch" },
        { key: "dinner", title: "Dinner", value: "dinner" },
        { key: "snack", title: "Snack", value: "snack" },
      ],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      default_value: "lunch",
      order: 0,
    },
    {
      id: crypto.randomUUID(),
      definition_id: entryDef.id,
      type: "choice",
      name: "portion_size",
      label: "How much did you eat?",
      description: null,
      required: true,
      choices: [
        { key: "small", title: "Moderat", value: "small", modifier: 1 },
        {
          key: "just-right",
          title: "Normal",
          value: "just-right",
          modifier: 0,
        },
        { key: "large", title: "Too much", value: "large", modifier: -1 },
      ],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      default_value: "just-right",
      order: 1,
    },
  ];

  const { error: fieldDefsError } = await supabase
    .from("field_definitions")
    .insert(fieldDefs);

  if (fieldDefsError) throw fieldDefsError;
}
