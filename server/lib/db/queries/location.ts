import { and, eq } from "drizzle-orm";
import { customAlphabet } from "nanoid";
import slugify from "slug";

import type { InsertLocation } from "../schema";

import db from "..";
import { location } from "../schema";

const nanoid = customAlphabet("1234567890abcdefghijklmnopqrstuvwxyz", 5);

export async function findLocationByName(locationObjToSearch: InsertLocation, userId: number) {
  return db.query.location.findFirst({
    where: and(
      eq(location.name, locationObjToSearch.name),
      eq(location.userId, userId),
    ),
  });
}

export async function findLocationBySlug(slug: string) {
  return db.query.location.findFirst({ where: eq(location.slug, slug) });
}

export async function findUniqueSlugFromName(name: string) {
  const slug = slugify(name);
  let suffix = "";

  while (await findLocationBySlug(slug + suffix)) {
    suffix = `-${nanoid()}`;
  }

  return slug + suffix;
}

export async function insertLocation(locationToInsert: InsertLocation, slug: string, userId: number) {
  const [created] = await db.insert(location).values({
    ...locationToInsert,
    slug,
    userId,
  }).returning();

  return created;
}

export async function findLocations(userId: number) {
  return await db.query.location.findMany({
    where: eq(location.userId, userId),
  });
}
