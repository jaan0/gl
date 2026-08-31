import { getDb } from '@/src/db';
import { catalog, shoppingList } from '@/src/db/schema';
import { eq } from 'drizzle-orm';
import { ShoppingBag, Plus } from 'lucide-react';
import ListClient from './ListClient';
import Link from 'next/link';

export const revalidate = 0;
export const dynamic = 'force-dynamic';

export default async function GroceryListPage() {
  let items;
  const db = getDb();
  
  if (!db) {
    // Database not available (missing DATABASE_URL or initialization failed)
    console.log('Database not initialized, using empty list');
    items = [];
  } else {
    try {
      items = await db
        .select({
          id: shoppingList.id,
          catalogId: shoppingList.catalogId,
          quantity: shoppingList.quantity,
          unit: shoppingList.unit,
          isBought: shoppingList.isBought,
          name: catalog.name,
          nameUr: catalog.nameUr,
          nameSd: catalog.nameSd,
          category: catalog.category,
          imageUrl: catalog.imageUrl,
        })
        .from(shoppingList)
        .leftJoin(catalog, eq(shoppingList.catalogId, catalog.id))
        .orderBy(shoppingList.addedAt);
    } catch (error) {
      // If database is unavailable (offline, connection error, etc.),
      // return empty array - the client-side offline queue will handle
      // any pending actions, and the service worker will serve cached
      // versions when available
      console.error('Database unavailable, using empty list:', error);
      items = [];
    }
  }

  return (
    <div
      className="mx-auto min-h-screen max-w-lg bg-[#f9f9f9]"
      style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 8rem)' }}
    >
      {/* Top Header matching edit page */}
      <div className="sticky top-0 z-20 bg-[#f9f9f9]/90 px-4 pb-3 pt-4 backdrop-blur-md">
        <div className="flex items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#2dd4bf] text-[#00574d]">
              <ShoppingBag size={22} />
            </div>
            <h1 className="truncate text-lg font-bold text-[#1a1c1c] sm:text-xl">Family Groceries</h1>
          </div>
          <Link href="/grocerylist/edit"
            className="flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full bg-[#2dd4bf] px-3.5 py-2 text-xs font-bold text-[#00574d] hover:bg-[#25c4af] transition-colors">
            <Plus size={16} /> Add Items
          </Link>
        </div>
      </div>

      <div className="px-4 pt-3 pb-1">
        <h2 className="text-2xl font-extrabold text-[#1a1c1c]">Your List</h2>
        <p className="mt-1 text-xs font-medium text-gray-500 max-w-xs">
          Check off items as you shop. Tap ✓ when done.
        </p>
      </div>

      {/* Render list client */}
      <ListClient items={items} />
    </div>
  );
}
