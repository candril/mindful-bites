import { Config, Context } from "@netlify/functions";
import { createClient } from "@supabase/supabase-js";
import { OpenAI } from "openai";
import { camelToSnake, snakeToCamel } from "../../src/lib/utils";
import {
  EntryDefinition,
  FieldDefinition as UserFieldDefinition,
} from "../../src/data/EntryDefinition"; // Renamed to avoid conflict

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const openaiApiKey = process.env.OPENAI_API_KEY;

const ENTRY_DEFINITIONS_TABLE_NAME = "entry_data_definitions";
const FIELD_DEFINITIONS_TABLE_NAME = "field_definitions";

let openai: OpenAI | undefined;
if (openaiApiKey) {
  openai = new OpenAI({ apiKey: openaiApiKey });
}

const DEFINITION_QUERY = `id,
name, 
description,
icon_name,
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

async function createDefinitionFromPrompt(req: Request, context: Context) {
  if (!openai) {
    return new Response(
      JSON.stringify({ error: "OpenAI configuration missing" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }

  const { token } = context.params;
  if (!token) {
    return new Response(JSON.stringify({ error: "Missing user token" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  let promptBody;
  try {
    promptBody = await req.json();
  } catch (e) {
    return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { prompt } = promptBody;
  if (!prompt || typeof prompt !== "string") {
    return new Response(
      JSON.stringify({ error: "Missing or invalid 'prompt' in body" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      },
    );
  }

  const systemPrompt = `You are a helpful assistant that helps create data tracking definitions. You aim for simple solution that generate value.
Ensure field names are unique within the definition.
The "template" fields can use single curly braces as place holders like: "Type: {type_field}".
The templates and expression only support simple math expressions. Without function calls or ternaries.
The rating_expression should produce a number between 1 and 5. Fields can be referenced with their name. No need to access the value
Focus on choice fields to give a quick an easy way to define values
Also use combo_multi_choice where possible. This gives the users the option to track specificly what they did and they can choose from previous values 

The date to track on which day has not to be included. It's implicitely already given.
`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4.1",
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "entry_definition",
          schema: {
            $schema: "http://json-schema.org/draft-07/schema#",
            title: "EntryDefinition",
            type: "object",
            required: [
              "id",
              "name",
              "description",
              "fields",
              "titleTemplate",
              "subtitleTemplate",
              "ratingExpression",
              "parsedRatingExpression",
            ],
            properties: {
              id: { type: "string" },
              name: { type: "string" },
              description: { type: "string" },
              iconName: { type: "string" },
              fields: {
                type: "array",
                items: {
                  type: "object",
                  required: [
                    "id",
                    "name",
                    "type",
                    "isRequired",
                    "label",
                    "description",
                    "order",
                    "defaultValue",
                    "definitionId",
                  ],
                  properties: {
                    id: { type: "string" },
                    name: { type: "string" },
                    type: {
                      type: "string",
                      enum: [
                        "text",
                        "checkbox",
                        "date",
                        "time",
                        "choice",
                        "multi_choice",
                        "combo_multi_choice",
                        "boolean",
                      ],
                    },
                    isRequired: { type: "boolean" },
                    label: { type: "string" },
                    description: { type: "string" },
                    choices: {
                      type: "array",
                      items: {
                        type: "object",
                        required: ["key", "title", "value"],
                        properties: {
                          key: { type: "string" },
                          title: { type: "string" },
                          value: {},
                          color: {
                            type: "string",
                            enum: [
                              "red",
                              "orange",
                              "yellow",
                              "green",
                              "emerald",
                            ],
                          },
                          modifier: { type: "number" },
                        },
                      },
                    },
                    order: { type: "number" },
                    defaultValue: { type: "string" },
                    definitionId: { type: "string" },
                  },
                },
              },
              titleTemplate: { type: "string" },
              subtitleTemplate: { type: "string" },
              ratingExpression: { type: "string" },
              parsedRatingExpression: {},
            },
          },
        },
      },
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt },
      ],
    });

    const aiResponseJson = completion.choices[0]?.message?.content;
    if (!aiResponseJson) {
      throw new Error("OpenAI returned an empty response.");
    }

    // Define a type for the AI's output structure, more flexible for fields
    type AiFieldDefinition = Omit<
      UserFieldDefinition,
      "id" | "definitionId" | "order" | "isRequired" | "name"
    > & { name: string };
    type AiEntryDefinition = Omit<
      EntryDefinition,
      "id" | "fields" | "parsedRatingExpression"
    > & { fields?: AiFieldDefinition[] };

    const aiDefinition = JSON.parse(aiResponseJson) as AiEntryDefinition;

    if (
      !aiDefinition.name ||
      !aiDefinition.fields ||
      !aiDefinition.titleTemplate ||
      !aiDefinition.subtitleTemplate
    ) {
      throw new Error(
        "AI response is missing required fields for EntryDefinition (name, fields, titleTemplate, subtitleTemplate).",
      );
    }

    return new Response(JSON.stringify(aiDefinition), {
      status: 201,
      headers: { "content-type": "application/json" },
    });
  } catch (error: any) {
    console.error("Error in createDefinitionFromPrompt:", error);
    const errorMessage =
      error.response?.data?.error?.message ||
      error.message ||
      "Failed to process AI prompt";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export default async (req: Request, context: Context) => {
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
      case "GET":
        return getOneOrMany(context);
      case "POST":
        return createDefinitionFromPrompt(req, context);
      // case "PUT":
      //   updateEntry(req, context);
      // case "DELETE":
      //   return deleteEntry(context);
      default:
        return new Response("Method not allowed", {
          status: 405, // Method Not Allowed
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

function mapToDbEntry(entry: EntryDefinition) {
  return {
    id: entry.id,
    name: entry.name,
    description: entry.description,
    icon_name: entry.iconName,
    title_template: entry.titleTemplate,
    subtitle_template: entry.subtitleTemplate,
    rating_expression: entry.ratingExpression,
    field_definitions: entry.fields.map((field) => ({
      default_value: field.defaultValue,
      description: field.description,
      id: field.id,
      label: field.label,
      name: camelToSnake(field.name),
      order: field.order,
      type: field.type,
      choices: field.choices,
    })),
  };
}

function mapToEntry(
  dbEntry: any,
): Omit<EntryDefinition, "parsedRatingExpression"> {
  return {
    id: dbEntry.id,
    name: dbEntry.name,
    description: dbEntry.description,
    iconName: dbEntry.icon_name,
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
