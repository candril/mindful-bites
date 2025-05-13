import { Config, Context } from "@netlify/functions";
import { createClient } from "@supabase/supabase-js";
import { snakeToCamel } from "../../src/lib/utils";
import { EntryDefinition } from "../../src/data/EntryDefinition";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

const ENTRY_DEFINITIONS_TABLE_NAME = "entry_data_definitions";

const DEFINITION_QUERY = `id,
name, 
description,
title_template,
subtitle_template,
rating_expression,
field_definitions(id, type, name, label, description, choices, default_value, order)
`;

const _supabase =
  supabaseUrl && supabaseKey && createClient(supabaseUrl, supabaseKey);

function getClient() {
  if (_supabase) {
    return _supabase;
  }

  throw new Error("Missing supabase config");
}

async function getDefinitions(token: string) {
  const supabase = getClient();

  const { data, error } = await supabase
    .from(ENTRY_DEFINITIONS_TABLE_NAME)
    .select(DEFINITION_QUERY)
    .eq("user_token", token);

  if (error) {
    console.error(error);
    throw new Error("Failed to load definition");
  }

  const definitions = data.map(mapToEntry);

  return new Response(JSON.stringify(definitions), {
    status: 200,
    headers: { "content-type": "application/json" },
  });
}

async function getOneOrMany(context: Context) {
  const { token, id } = context.params;

  if (!token) {
    return new Response(JSON.stringify({ error: "Missing user token" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }
  const supabase = getClient();

  if (!id) {
    return getDefinitions(token);
  }

  const { data, error } = await supabase
    .from(ENTRY_DEFINITIONS_TABLE_NAME)
    .select(DEFINITION_QUERY)
    .eq("id", id)
    .eq("user_token", token)
    .limit(1);

  if (error) {
    console.error(error);
    throw new Error(`Failed to load definition ${error}`);
  }

  const definition = data.map(mapToEntry)[0];

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
        return getOneOrMany(context);
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

function mapToEntry(
  dbEntry: any,
): Omit<EntryDefinition, "parsedRatingExpression"> {
  return {
    id: dbEntry.id,
    name: dbEntry.name,
    description: dbEntry.description,
    titleTemplate: dbEntry.title_template,
    subtitleTemplate: dbEntry.subtitle_template,
    ratingExpression: dbEntry.rating_expression,
    fields: dbEntry.field_definitions.map((f: any) => ({
      defaultValue: f.default_value,
      description: f.description,
      id: f.id,
      label: f.label,
      name: snakeToCamel(f.name),
      order: f.order,
      type: f.type,
      choices: f.choices,
    })),
  };
}

export const config: Config = {
  path: ["/api/users/:token/definitions", "/api/users/:token/definitions/:id"],
};
