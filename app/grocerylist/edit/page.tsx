import { db } from '@/src/db';
import { catalog } from '@/src/db/schema';
import { ShoppingBag, Plus } from 'lucide-react';
import Link from 'next/link';
import CatalogClient from './CatalogClient';

export const revalidate = 0;
export const dynamic = 'force-dynamic';

export default async function EditPage() {
  const products = await db.select().from(catalog).orderBy(catalog.name);

  return (
    <div className="w-full min-h-screen bg-[#f9f9f9] pb-28">
      {/* Sticky Header */}
      <div className="sticky top-0 z-20 bg-[#f9f9f9]/95 backdrop-blur-md px-4 pt-4 pb-3 border-b border-gray-100/60">
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#2dd4bf] text-[#00574d]">
              <ShoppingBag size={20} />
            </div>
            <h1 className="text-lg font-bold text-[#1a1c1c] truncate">Family Groceries</h1>
          </div>
          <Link
            href="/grocerylist/edit"
            className="flex shrink-0 items-center gap-1 rounded-full bg-[#2dd4bf] px-3.5 py-2 text-xs font-bold text-[#00574d] hover:bg-[#25c4af] active:scale-95 transition-all"
          >
            <Plus size={14} /> Add Items
          </Link>
        </div>
      </div>

      {/* Page Title */}
      <div className="px-4 pt-4 pb-2 max-w-2xl mx-auto">
        <h2 className="text-2xl font-extrabold text-[#1a1c1c]">Select Items</h2>
        <p className="mt-1 text-xs font-medium text-gray-500">
          Browse the catalog and add essentials to your list.
        </p>
      </div>

      {/* Catalog */}
      <div className="max-w-2xl mx-auto">
        <CatalogClient products={products} />
      </div>
    </div>
  );
}
