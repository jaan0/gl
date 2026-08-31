'use server';

import { getDb } from '../src/db';
import { catalog, shoppingList } from '../src/db/schema';
import { eq, inArray } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

// ── Helper to get database with error handling ──
function getDbOrThrow() {
  const db = getDb();
  if (!db) {
    throw new Error('Database unavailable');
  }
  return db;
}

// ── Helper to revalidate all routes ──
function revalidateAll() {
  revalidatePath('/grocerylist');
  revalidatePath('/grocerylist/edit');
  revalidatePath('/admin');
}

// ── Admin auth check ──
async function isAdmin(): Promise<boolean> {
  const cookieStore = await cookies();
  return cookieStore.get('admin_token')?.value === 'authenticated';
}

// ── Admin login ──
export async function adminLogin(password: string): Promise<boolean> {
  if (password === process.env.ADMIN_PASSWORD) {
    const cookieStore = await cookies();
    cookieStore.set('admin_token', 'authenticated', {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 60 * 60 * 24, // 24 hours
    });
    return true;
  }
  return false;
}

export async function adminLogout() {
  const cookieStore = await cookies();
  cookieStore.delete('admin_token');
  revalidateAll();
}

// ── Admin: Add product to catalog ──
export async function addCatalogItem(formData: FormData) {
  if (!(await isAdmin())) throw new Error('Unauthorized');
  const db = getDbOrThrow();

  await db.insert(catalog).values({
    name: formData.get('name') as string,
    nameUr: (formData.get('nameUr') as string) || null,
    nameSd: (formData.get('nameSd') as string) || null,
    category: (formData.get('category') as string) || 'Other',
    imageUrl: (formData.get('imageUrl') as string) || '',
    defaultQuantity: (formData.get('defaultQuantity') as string) || '1',
    defaultUnit: (formData.get('defaultUnit') as string) || 'pcs',
  });

  revalidateAll();
}

// ── Admin: Delete single product from catalog ──
export async function deleteCatalogItem(id: number) {
  if (!(await isAdmin())) throw new Error('Unauthorized');
  const db = getDbOrThrow();
  await db.delete(catalog).where(eq(catalog.id, id));
  revalidateAll();
}

// ── Admin: Delete multiple selected products from catalog ──
export async function deleteMultipleCatalogItems(ids: number[]) {
  if (!(await isAdmin())) throw new Error('Unauthorized');
  if (ids.length === 0) return;
  const db = getDbOrThrow();
  await db.delete(catalog).where(inArray(catalog.id, ids));
  revalidateAll();
}

// ── Admin: Delete all products from catalog ──
export async function deleteAllCatalogItems() {
  if (!(await isAdmin())) throw new Error('Unauthorized');
  const db = getDbOrThrow();
  await db.delete(catalog);
  revalidateAll();
}

// ── Admin: Update product name and image ──
export async function updateCatalogItem(
  id: number,
  name: string,
  imageUrl: string,
  nameUr?: string,
  nameSd?: string
) {
  if (!(await isAdmin())) throw new Error('Unauthorized');
  if (!name.trim()) throw new Error('Name is required');
  const db = getDbOrThrow();

  await db
    .update(catalog)
    .set({
      name: name.trim(),
      imageUrl: imageUrl || '',
      nameUr: nameUr?.trim() || null,
      nameSd: nameSd?.trim() || null,
    })
    .where(eq(catalog.id, id));

  revalidateAll();
}

// ── User: Add catalog item to shopping list with custom qty/unit ──
export async function addToShoppingList(
  catalogId: number,
  customQuantity?: string,
  customUnit?: string
) {
  const db = getDbOrThrow();
  const item = await db
    .select()
    .from(catalog)
    .where(eq(catalog.id, catalogId))
    .then((r) => r[0]);

  if (!item) throw new Error('Product not found');

  await db.insert(shoppingList).values({
    catalogId: item.id,
    quantity: customQuantity || item.defaultQuantity || '1',
    unit: customUnit || item.defaultUnit || 'pcs',
  });

  revalidateAll();
}

// ── User: Add ad-hoc custom item directly to shopping list ──
export async function addAdHocItemToList(
  name: string,
  category: string,
  quantity: string,
  unit: string,
  imageUrl?: string
) {
  const db = getDbOrThrow();
  // First insert into catalog as quick item
  const [insertedCatalog] = await db
    .insert(catalog)
    .values({
      name,
      category: category || 'Other',
      imageUrl: imageUrl || '',
      defaultQuantity: quantity || '1',
      defaultUnit: unit || 'pcs',
    })
    .returning();

  // Then add to shopping list
  await db.insert(shoppingList).values({
    catalogId: insertedCatalog.id,
    quantity: quantity || '1',
    unit: unit || 'pcs',
  });

  revalidateAll();
}

// ── User: Toggle bought status ──
export async function toggleBought(id: number, currentStatus: boolean) {
  const db = getDbOrThrow();
  await db
    .update(shoppingList)
    .set({ isBought: !currentStatus })
    .where(eq(shoppingList.id, id));

  revalidateAll();
}

// ── User: Remove item from shopping list ──
export async function removeFromList(id: number) {
  const db = getDbOrThrow();
  await db.delete(shoppingList).where(eq(shoppingList.id, id));
  revalidateAll();
}

// ── User: Clear all bought items ──
export async function clearBought() {
  const db = getDbOrThrow();
  await db.delete(shoppingList).where(eq(shoppingList.isBought, true));
  revalidateAll();
}

// -- Admin: Bulk upload catalog items from parsed CSV/TXT rows --
export async function bulkUploadCatalog(
  rows: {
    name: string;
    category: string;
    unit: string;
    quantity: string;
    imageUrl: string;
    nameUr?: string;
    nameSd?: string;
  }[]
): Promise<{ inserted: number; skipped: number; errors: string[] }> {
  if (!(await isAdmin())) throw new Error('Unauthorized');
  const db = getDbOrThrow();

  let inserted = 0;
  let skipped = 0;
  const errors: string[] = [];

  for (const row of rows) {
    const name = row.name.trim();
    if (!name) {
      skipped++;
      continue;
    }

    try {
      await db.insert(catalog).values({
        name,
        category: row.category.trim() || 'Other',
        defaultUnit: row.unit.trim() || 'pcs',
        defaultQuantity: row.quantity.trim() || '1',
        imageUrl: row.imageUrl.trim() || '',
        nameUr: row.nameUr?.trim() || null,
        nameSd: row.nameSd?.trim() || null,
      });
      inserted++;
    } catch (e: unknown) {
      errors.push(`"${name}": ${e instanceof Error ? e.message : 'unknown error'}`);
      skipped++;
    }
  }

  revalidateAll();
  return { inserted, skipped, errors };
}
