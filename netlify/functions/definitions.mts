import { Config, Context } from "@netlify/functions";
import { createClient } from "@supabase/supabase-js";
import { snakeToCamel } from "../../src/lib/utils";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

const ENTRY_DEFINITIONS_TABLE_NAME = "entry_data_definitions";

const _supabase =
  supabaseUrl && supabaseKey && createClient(supabaseUrl, supabaseKey);

function getClient() {
  if (_supabase) {
    return _supabase;
  }

  throw new Error("Missing supabase config");
}
async function getDefinition(context: Context) {
  const supabase = getClient();

  const { id } = context.params;

  const { data, error } = await supabase
    .from(ENTRY_DEFINITIONS_TABLE_NAME)
    .select(
      `
id,
name, 
field_definitions(id, type, name, label, description, choices, default_value, order)
`,
    )
    .eq("id", id)
    // todo: filter for user token!
    .limit(1);

  if (error) {
    throw new Error("Failed to load definition");
  }

  const definition = data.map((entry: any) => ({
    id: entry.id,
    name: entry.name,
    fields: entry.field_definitions.map((f) => ({
      defaultValue: f.default_value,
      description: f.description,
      id: f.id,
      label: f.label,
      name: snakeToCamel(f.name),
      order: f.order,
      type: f.type,
      choices: f.choices,
    })),
  }))[0];

  return new Response(JSON.stringify(definition), {
    status: 200,
    headers: { "content-type": "application/json" },
  });
}

export default async (req: Request, context: Context) => {
  // Check if Supabase credentials are available
  if (!_supabase) {
    return new Response(
      JSON.stringify({ error: "Supabase configuration missing" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }

  try {
    switch (req.method) {
      // case "PUT":
      //   updateEntry(req, context);
      case "GET":
        return getDefinition(context);
      // case "POST":
      //   return createEntry(req);
      // case "DELETE":
      //   return deleteEntry(context);
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
  path: ["/api/users/:token/definitions", "/api/users/:token/definitions/:id"],
};
