import { Config, Context } from "@netlify/functions";
import { MongoClient, ObjectId } from "mongodb";
import { MealEntry } from "../../src/data/meals.ts";

const mongoUri = process.env.MONGODB_URI;
let _client: MongoClient | null = null;

async function getClient(): Promise<MongoClient> {
  if (_client) {
    return _client;
  }

  if (!mongoUri) {
    throw new Error("Missing MongoDB configuration");
  }

  _client = new MongoClient(mongoUri);
  return _client;
}

async function getCollection() {
  const client = await getClient();
  return client.db("mindful_bites").collection("entries");
}

async function updateBite(req: Request, context: Context) {
  const mealEntry: MealEntry = await req.json();
  if (!mealEntry.id || !mealEntry.date || !mealEntry.mealType) {
    return new Response(JSON.stringify({ error: "Missing required fields" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { id, token } = context.params;
  if (mealEntry.userToken !== token) {
    return new Response(JSON.stringify({ error: "User token mismatch" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const collection = await getCollection();

    const result = await collection.updateOne(
      { _id: new ObjectId(id), userToken: token },
      {
        $set: {
          date: new Date(mealEntry.date),
          components: mealEntry.components,
          healthRating: mealEntry.healthRating,
          portionSize: mealEntry.portionSize,
          mealType: mealEntry.mealType,
          userToken: mealEntry.userToken,
        },
      },
    );

    if (result.matchedCount === 0) {
      return new Response(
        JSON.stringify({ error: "Entry not found or unauthorized" }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    return new Response(null, {
      status: 204,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Failed to update entry" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

async function getBites(context: Context) {
  const { token } = context.params;

  try {
    const collection = await getCollection();

    const data = await collection.find({ userToken: token }).toArray();

    const mappedData = data.map((entry) => ({
      id: entry._id.toString(),
      date: new Date(entry.date).toISOString(),
      components: entry.components,
      healthRating: entry.healthRating,
      portionSize: entry.portionSize,
      mealType: entry.mealType,
      userToken: entry.userToken,
    }));

    return new Response(JSON.stringify(mappedData), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to load bites" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

async function deleteBite(context: Context) {
  const { id, token } = context.params;

  if (!id || !token) {
    return new Response(null, { status: 400 });
  }

  try {
    const collection = await getCollection();

    const result = await collection.deleteOne({
      _id: new ObjectId(id),
      userToken: token,
    });

    if (result.deletedCount === 0) {
      return new Response(
        JSON.stringify({ error: "Entry not found or unauthorized" }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    return new Response(null, { status: 204 });
  } catch (error) {
    console.error(error);
    return new Response(null, { status: 500 });
  }
}

async function createBite(req: Request) {
  const mealEntry: MealEntry = await req.json();
  if (!mealEntry.id || !mealEntry.date || !mealEntry.mealType) {
    return new Response(JSON.stringify({ error: "Missing required fields" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const collection = await getCollection();

    const result = await collection.insertOne({
      date: new Date(mealEntry.date),
      components: mealEntry.components,
      healthRating: mealEntry.healthRating,
      portionSize: mealEntry.portionSize,
      mealType: mealEntry.mealType,
      userToken: mealEntry.userToken,
    });

    return new Response(
      JSON.stringify({
        success: true,
        id: result.insertedId.toString(),
      }),
      {
        status: 201,
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Failed to create entry" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export default async (req: Request, context: Context) => {
  try {
    switch (req.method) {
      case "PUT":
        return await updateBite(req, context);
      case "GET":
        return await getBites(context);
      case "POST":
        return await createBite(req);
      case "DELETE":
        return await deleteBite(context);
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
  path: ["/api/users/:token/bites", "/api/users/:token/bites/:id"],
};
