import { Config, Context } from "@netlify/functions";
import { createClient } from "@supabase/supabase-js";
import { MealEntry } from "../../src/data/meals.ts";

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

async function updateBite(req: Request, context: Context) {
  const mealEntry: MealEntry = await req.json();
  if (!mealEntry.id || !mealEntry.date || !mealEntry.mealType) {
    return new Response(JSON.stringify({ error: "Missing required fields" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { id } = context.params;

  const supabase = getClient();

  const { error } = await supabase
    .from("meal_entries")
    .update({
      date: new Date(mealEntry.date).toISOString(),
      components: mealEntry.components,
      health_rating: mealEntry.healthRating,
      portion_size: mealEntry.portionSize,
      meal_type: mealEntry.mealType,
    })
    .eq("id", id);

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

async function getBites() {
  const supabase = getClient();
  const { data, error } = await supabase.from("meal_entries").select("*");

  if (error) {
    throw new Error("Failed to load bites");
  }

  const mappedData = data.map((entry: any) => ({
    id: entry.id,
    date: new Date(entry.date).toISOString(),
    components: entry.components,
    healthRating: entry.health_rating,
    portionSize: entry.portion_size,
    mealType: entry.meal_type,
  }));

  return new Response(JSON.stringify(mappedData), { status: 200 });
}

async function deleteBite(context: Context) {
  const { id } = context.params;

  if (!id) {
    return new Response(null, { status: 400 });
  }
  const supabase = getClient();
  const { error } = await supabase
    .from("meal_entries") // Replace 'bites' with your table name
    .delete()
    .eq("id", id);

  if (error) {
    console.error(error);
    return new Response(null, { status: 500 });
  }

  return new Response(null, { status: 204 });
}

async function createBite(req: Request) {
  const mealEntry: MealEntry = await req.json();
  if (!mealEntry.id || !mealEntry.date || !mealEntry.mealType) {
    return new Response(JSON.stringify({ error: "Missing required fields" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const supabase = getClient();

  const { data, error } = await supabase.from("meal_entries").insert([
    {
      id: mealEntry.id,
      date: new Date(mealEntry.date).toISOString(),
      components: mealEntry.components,
      health_rating: mealEntry.healthRating,
      portion_size: mealEntry.portionSize,
      meal_type: mealEntry.mealType,
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
        updateBite(req, context);
      case "GET":
        return getBites();
      case "POST":
        return createBite(req);
      case "DELETE":
        return deleteBite(context);
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
  path: ["/api/bites", "/api/bites/:id"],
};
