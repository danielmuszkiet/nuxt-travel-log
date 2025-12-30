import { InsertLocationSchema } from "../lib/db/schema";

export default defineEventHandler(async (event) => {
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

  return result.data;
});
