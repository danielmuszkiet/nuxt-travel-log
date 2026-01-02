import { int, real, sqliteTable, text, unique } from "drizzle-orm/sqlite-core";
import { z } from "zod";

import { user } from "./auth";

export const location = sqliteTable("location", {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  slug: text().notNull().unique(),
  description: text(),
  lat: real().notNull(),
  long: real().notNull(),
  userId: int().notNull().references(() => user.id),
  createdAt: int().notNull().$default(() => Date.now()),
  updatedAt: int().notNull().$default(() => Date.now()).$onUpdate(() => Date.now()),
}, t => [
  unique().on(t.name, t.userId),
]);

export const InsertLocationSchema = z.object({
  name: z.string().min(1, "Name cannot be empty").max(100, "Maximum 100 characters"),
  description: z.string().max(1000, "Maximum 1000 characters").optional(),
  lat: z.number().min(-90, "Latitude must be ≥ -90").max(90, "Latitude must be ≤ 90"),
  long: z.number().min(-180, "Longitude must be ≥ -180").max(180, "Longitude must be ≤ 180"),
});

export type InsertLocation = z.infer<typeof InsertLocationSchema>;
