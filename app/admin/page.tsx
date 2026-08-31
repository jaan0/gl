import { getDb } from '@/src/db';
import { catalog } from '@/src/db/schema';
import { adminLogin, adminLogout, addCatalogItem } from '@/app/actions';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { ArrowLeft, Shield, PackagePlus, ShoppingBag } from 'lucide-react';
import BulkUpload from '@/components/BulkUpload';
import AdminCatalogClient from '@/components/AdminCatalogClient';

export const revalidate = 0;
export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const cookieStore = await cookies();
  const isAuthenticated = cookieStore.get('admin_token')?.value === 'authenticated';

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen flex-col bg-[#f9f9f9] pb-24">
        {/* Header */}
        <div className="sticky top-0 z-20 bg-[#f9f9f9]/90 px-4 pb-3 pt-4 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#2dd4bf] text-[#00574d]">
                <ShoppingBag size={22} />
              </div>
              <h1 className="text-xl font-bold text-[#1a1c1c]">Family Groceries</h1>
            </div>
            <Link
              href="/grocerylist"
              className="flex items-center gap-1.5 rounded-full bg-[#2dd4bf] px-4 py-2 text-xs font-bold text-[#00574d] hover:bg-[#25c4af] transition-colors"
            >
              <ArrowLeft size={16} /> Back
            </Link>
          </div>
        </div>

        {/* Login Title */}
        <div className="px-4 pt-3 pb-1">
          <h2 className="text-2xl font-extrabold text-[#1a1c1c]">Admin Login</h2>
          <p className="mt-1 text-xs font-medium text-gray-500">Manage your family product catalog.</p>
        </div>

        {/* Login Card */}
        <div className="flex flex-1 items-start justify-center px-4 pt-6">
          <form
            action={async (formData) => {
              'use server';
              await adminLogin(formData.get('password') as string);
            }}
            className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-fresh border border-gray-100 space-y-4"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#2dd4bf]/20 text-[#006b5f]">
                <Shield size={22} />
              </div>
              <div>
                <p className="font-extrabold text-base text-[#1a1c1c]">Admin Access</p>
                <p className="text-xs text-gray-500 font-medium">Enter your family password</p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Family Password</label>
              <input
                type="password"
                name="password"
                placeholder="Enter admin secret..."
                className="w-full rounded-2xl border border-gray-200 p-3.5 text-sm outline-none focus:border-[#006b5f]"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-2xl bg-[#006b5f] py-3.5 text-xs font-bold text-white shadow-md hover:bg-[#00574d] active:scale-[0.99] transition-all"
            >
              Login to Admin
            </button>

            <div className="text-center pt-1">
              <Link href="/grocerylist" className="text-xs font-bold text-gray-500 hover:text-[#006b5f] transition-colors">
                ← Return to Shopping List
              </Link>
            </div>
          </form>
        </div>
      </div>
    );
  }

  const db = getDb();
  if (!db) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#f9f9f9] px-6 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#2dd4bf]/20 text-[#006b5f]">
          <ShoppingBag size={28} />
        </div>
        <h1 className="mt-4 text-lg font-bold text-[#1a1c1c]">Database Unavailable</h1>
        <p className="mt-2 text-sm text-gray-500">Admin requires a database connection. Please check your configuration.</p>
        <Link
          href="/grocerylist"
          className="mt-4 rounded-full bg-[#006b5f] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#00574d] transition-colors"
        >
          Return to List
        </Link>
      </div>
    );
  }

  const products = await db.select().from(catalog).orderBy(catalog.name);

  return (
    <div className="mx-auto min-h-screen max-w-lg bg-[#f9f9f9] pb-32">

      {/* Top Header */}
      <div className="sticky top-0 z-20 bg-[#f9f9f9]/90 px-4 pb-3 pt-4 backdrop-blur-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#2dd4bf] text-[#00574d]">
              <ShoppingBag size={22} />
            </div>
            <h1 className="text-xl font-bold text-[#1a1c1c]">Family Groceries</h1>
          </div>

          <form action={adminLogout}>
            <button type="submit" className="rounded-full border border-[#ba1a1a]/30 bg-[#ffdad6]/30 px-4 py-2 text-xs font-bold text-[#ba1a1a] hover:bg-[#ffdad6]/60 transition-colors">
              Logout
            </button>
          </form>
        </div>
      </div>

      {/* Page Title & Subtitle */}
      <div className="px-4 pt-3 pb-1">
        <h2 className="text-2xl font-extrabold text-[#1a1c1c]">Catalog Admin</h2>
        <p className="mt-1 text-xs font-medium text-gray-500 max-w-xs">
          Add, manage and remove products from the family catalog.
        </p>
      </div>

      <div className="p-4 space-y-6">

        {/* Add New Product Form Card */}
        <form
          action={addCatalogItem}
          className="rounded-3xl bg-white p-6 shadow-fresh border border-gray-100 space-y-4"
        >
          <div className="flex items-center gap-2 text-[#006b5f]">
            <PackagePlus size={20} />
            <h2 className="font-extrabold text-base">Add New Product</h2>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Product Name</label>
            <input
              name="name"
              type="text"
              required
              placeholder="e.g. Sugar, Whole Milk"
              className="w-full rounded-2xl border border-gray-200 p-3.5 text-sm outline-none focus:border-[#006b5f]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Category</label>
              <select
                name="category"
                className="w-full rounded-2xl border border-gray-200 p-3.5 text-sm outline-none bg-white font-medium"
              >
                <option>Produce</option>
                <option>Dairy</option>
                <option>Pantry</option>
                <option>Meat</option>
                <option>Frozen</option>
                <option>Bakery</option>
                <option>Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Default Unit</label>
              <select
                name="defaultUnit"
                className="w-full rounded-2xl border border-gray-200 p-3.5 text-sm outline-none bg-white font-medium"
              >
                <option>kg</option>
                <option>g</option>
                <option>pcs</option>
                <option>Ltr</option>
                <option>ml</option>
                <option>pkt</option>
                <option>bottle</option>
                <option>bag</option>
                <option>dozen</option>
                <option>box</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Default Quantity</label>
            <div className="flex items-center justify-between rounded-2xl bg-[#f3f3f4] p-2">
              <span className="px-4 text-sm font-bold text-gray-400">—</span>
              <input
                name="defaultQuantity"
                type="text"
                defaultValue="1"
                className="w-16 text-center bg-transparent font-extrabold text-base outline-none text-[#1a1c1c]"
              />
              <span className="px-4 text-sm font-bold text-gray-400">+</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Image URL (optional)</label>
            <input
              name="imageUrl"
              type="url"
              placeholder="https://..."
              className="w-full rounded-2xl border border-gray-200 p-3.5 text-sm outline-none focus:border-[#006b5f]"
            />
          </div>

          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#006b5f] py-4 text-sm font-bold text-white shadow-md hover:bg-[#00574d] active:scale-[0.99] transition-all"
          >
            <PackagePlus size={18} /> Save to Catalog
          </button>
        </form>

        {/* Bulk Upload Card */}
        <BulkUpload />

        {/* Current Catalog List — now with edit support */}
        <AdminCatalogClient products={products} />

      </div>
    </div>
  );
}
