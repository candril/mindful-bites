import { Config, Context } from "@netlify/functions";
import { createClient } from "@supabase/supabase-js";
import { Entry } from "../../src/data/useStorage";
import { camelToSnake, snakeToCamel } from "../../src/lib/utils";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

const ENTRIES_TABLE_NAME = "meal_entries_v2";

const _supabase =
  supabaseUrl && supabaseKey && createClient(supabaseUrl, supabaseKey);

function getClient() {
  if (_supabase) {
    return _supabase;
  }

  throw new Error("Missing supabase config");
}

async function updateEntry(req: Request, context: Context) {
  const entry: Entry = await req.json();
  if (!entry.data || !entry.definitionId || !entry.userToken) {
    return new Response(JSON.stringify({ error: "Missing required fields" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { id, token } = context.params;
  if (entry.userToken !== token) {
    return new Response(JSON.stringify({ error: "User token mismatch" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const supabase = getClient();

  const { error } = await supabase
    .from(ENTRIES_TABLE_NAME)
    .update({
      date: new Date(entry.date).toISOString(),
      user_token: entry.userToken,
      data: mapToDbData(entry.data),
    })
    .eq("id", id)
    .eq("user_token", token);

  if (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(null, {
    status: 204,
    headers: { "Content-Type": "application/json" },
  });
}

async function getEntries(context: Context) {
  const supabase = getClient();

  const { token } = context.params;

  const { data, error } = await supabase
    .from(ENTRIES_TABLE_NAME)
    .select("*")
    .eq("user_token", token);

  if (error) {
    throw new Error("Failed to load bites");
  }

  const mappedEntry = data.map((entry: any) => ({
    id: entry.id,
    definitionId: entry.definition_id,
    date: new Date(entry.date).toISOString(),
    userToken: entry.user_token,
    data: mapFromDbData(entry.data),
  }));

  return new Response(JSON.stringify(mappedEntry), { status: 200 });
}

function mapToDbData(data: Record<string, unknown>) {
  return Object.keys(data).reduce<Record<string, unknown>>(
    (current, next) => ({
      ...current,
      [camelToSnake(next)]: data[next],
    }),
    {},
  );
}

function mapFromDbData(data: Record<string, unknown>) {
  return Object.keys(data).reduce<Record<string, unknown>>(
    (current, next) => ({
      ...current,
      [snakeToCamel(next)]: data[next],
    }),
    {},
  );
}

async function deleteEntry(context: Context) {
  const { id, token } = context.params;

  if (!id || !token) {
    return new Response(null, { status: 400 });
  }
  const supabase = getClient();
  const { error } = await supabase
    .from(ENTRIES_TABLE_NAME) // Replace 'bites' with your table name
    .delete()
    .eq("id", id)
    .eq("user_token", token);

  if (error) {
    console.error(error);
    return new Response(null, { status: 500 });
  }

  return new Response(null, { status: 204 });
}

async function createEntry(req: Request) {
  const entry: Entry = await req.json();
  if (!entry.id || !entry.date || !entry.data) {
    return new Response(JSON.stringify({ error: "Missing required fields" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const supabase = getClient();

  const { data, error } = await supabase.from(ENTRIES_TABLE_NAME).insert([
    {
      id: entry.id,
      definition_id: entry.definitionId,
      date: new Date(entry.date).toISOString(),
      user_token: entry.userToken,
      data: mapToDbData(entry.data),
    },
  ]);

  if (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify({ success: true, data }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
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
      case "PUT":
        updateEntry(req, context);
      case "GET":
        return getEntries(context);
      case "POST":
        return createEntry(req);
      case "DELETE":
        return deleteEntry(context);
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
  path: ["/api/users/:token/entries", "/api/users/:token/entries/:id"],
};
