import type { LibsqlError } from "@libsql/client";

import { and, eq } from "drizzle-orm";
import { customAlphabet } from "nanoid";
import slugify from "slug";

import db from "../lib/db";
import { InsertLocationSchema, location } from "../lib/db/schema";

const nanoid = customAlphabet("1234567890abcdefghijklmnopqrstuvwxyz", 5);
async function generateUniqueSlug(name: string) {
  const slug = slugify(name);
  let suffix = "";

  while (await db.query.location.findFirst({ where: eq(location.slug, slug + suffix) })) {
    suffix = `-${nanoid()}`;
  }

  return slug + suffix;
}

export default defineEventHandler(async (event) => {
  if (!event.context.user) {
    throw sendError(event, createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
    }));
  }

  const result = await readValidatedBody(event, InsertLocationSchema.safeParse);

  if (!result.success) {
    const statusMessage = result
      .error
      .issues
      .map(issue => `${issue.path.join("")}: ${issue.message}`)
      .join("; ");

    const data = result
      .error
      .issues
      .reduce((errors, issue) => {
        errors[issue.path.join("")] = issue.message;
        return errors;
      }, {} as Record<string, string>);

    throw sendError(event, createError({
      statusCode: 422,
      statusMessage,
      data,
    }));
  }

  const existingLocation = await db.query.location.findFirst({
    where: and(
      eq(location.userId, event.context.user.id),
      eq(location.name, result.data.name),
    ),
  });

  if (existingLocation) {
    throw sendError(event, createError({
      statusCode: 409,
      statusMessage: "Location with this name already exists for you!",
    }));
  }

  const slug = await generateUniqueSlug(result.data.name);

  try {
    const [created] = await db.insert(location).values({
      ...result.data,
      slug,
      userId: event.context.user.id,
    }).returning();

    return created;
  }
  catch (e) {
    const error = e as LibsqlError;
    if (error.cause instanceof Error) {
      if (error.cause.message === "SQLITE_CONSTRAINT: SQLite error: UNIQUE constraint failed: location.slug") {
        throw sendError(event, createError({
          statusCode: 409,
          statusMessage: "Slug must be unique (the location name is used to generate the slug).",
        }));
      }
    }

    throw e; // optional
  }
});
