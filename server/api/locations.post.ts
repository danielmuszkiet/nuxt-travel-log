import type { LibsqlError } from "@libsql/client";

import { findLocationByName, findUniqueSlugFromName, insertLocation } from "../lib/db/queries/location";
import { InsertLocationSchema } from "../lib/db/schema";
import { defineAuthenticatedEventHandler } from "../utils/define-authenticated-event-handler";

export default defineAuthenticatedEventHandler(async (event) => {
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

  const existingLocation = await findLocationByName(result.data, event.context.user.id);

  if (existingLocation) {
    sendError(
      event,
      createError({
        statusCode: 409,
        statusMessage: "Location with this name already exists for you!",
      }),
    );
    return;
  }

  const slug = await findUniqueSlugFromName(result.data.name);

  try {
    return insertLocation(result.data, slug, event.context.user.id);
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

    throw e;
  }
});
