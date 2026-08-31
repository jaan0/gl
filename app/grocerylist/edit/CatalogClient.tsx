'use client';

import { useState, useTransition } from 'react';
import { addToShoppingList, addAdHocItemToList } from '@/app/actions';
import { Plus, Minus, Search, Check, ShoppingBag, Sparkles } from 'lucide-react';
import { useLanguage } from '@/components/LanguageProvider';
import { getItemName, getCategoryName } from '@/lib/translations';

interface CatalogItem {
  id: number;
  name: string;
  nameUr?: string | null;
  nameSd?: string | null;
  category: string;
  imageUrl: string | null;
  defaultQuantity: string | null;
  defaultUnit: string | null;
}

const COMMON_UNITS = ['pcs', 'kg', 'Ltr', 'g', 'ml', 'pkt', 'bottle', 'bag', 'dozen', 'box'];
const CATEGORIES = ['All', 'Produce', 'Dairy', 'Pantry', 'Meat', 'Frozen', 'Bakery', 'Other'];

export default function CatalogClient({ products }: { products: CatalogItem[] }) {
  const { t, lang } = useLanguage();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [qtyState, setQtyState] = useState<Record<number, number>>({});
  const [unitState, setUnitState] = useState<Record<number, string>>({});
  const [addedItems, setAddedItems] = useState<Record<number, boolean>>({});
  const [isPending, startTransition] = useTransition();

  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customQty, setCustomQty] = useState('1');
  const [customUnit, setCustomUnit] = useState('pcs');
  const [customCategory, setCustomCategory] = useState('Pantry');

  const getQty = (item: CatalogItem) => {
    if (qtyState[item.id] !== undefined) return qtyState[item.id];
    const parsed = parseFloat(item.defaultQuantity || '1');
    return isNaN(parsed) ? 1 : parsed;
  };

  const getUnit = (item: CatalogItem) =>
    unitState[item.id] || item.defaultUnit || 'pcs';

  const handleQtyChange = (id: number, current: number, delta: number) =>
    setQtyState((prev) => ({ ...prev, [id]: Math.max(1, current + delta) }));

  const handleUnitChange = (id: number, unit: string) =>
    setUnitState((prev) => ({ ...prev, [id]: unit }));

  const handleAdd = (item: CatalogItem) => {
    const qty = getQty(item).toString();
    const unit = getUnit(item);
    setAddedItems((prev) => ({ ...prev, [item.id]: true }));
    setTimeout(() => setAddedItems((prev) => ({ ...prev, [item.id]: false })), 1500);
    startTransition(async () => { await addToShoppingList(item.id, qty, unit); });
  };

  const handleQuickAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim()) return;
    startTransition(async () => {
      await addAdHocItemToList(customName.trim(), customCategory, customQty, customUnit);
      setCustomName('');
      setShowQuickAdd(false);
    });
  };

  const filtered = products.filter((p) => {
    const displayName = getItemName(p, lang);
    const origName = p.name || '';
    const query = search.toLowerCase();
    const matchSearch =
      displayName.toLowerCase().includes(query) ||
      origName.toLowerCase().includes(query);
    const matchCat = selectedCategory === 'All' || p.category.toLowerCase() === selectedCategory.toLowerCase();
    return matchSearch && matchCat;
  });

  return (
    <div className="px-3 sm:px-4 py-4 space-y-4">

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={17} />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t('searchCatalog')}
          className="w-full rounded-2xl border border-gray-200 bg-white py-3 pl-10 pr-4 text-sm outline-none focus:border-[#006b5f] focus:ring-1 focus:ring-[#006b5f]/20"
        />
      </div>

      {/* Category Pills */}
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-3 px-3 sm:-mx-4 sm:px-4 scrollbar-none">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`shrink-0 rounded-full px-4 py-2 text-xs font-bold whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? 'bg-[#006b5f] text-white shadow-sm'
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {getCategoryName(cat, lang)}
          </button>
        ))}
      </div>

      {/* Product Cards */}
      <div className="space-y-3">
        {filtered.map((item) => {
          const qty = getQty(item);
          const unit = getUnit(item);
          const isAdded = addedItems[item.id];
          const displayName = getItemName(item, lang);
          const displayCat = getCategoryName(item.category, lang);

          return (
            <div
              key={item.id}
              className="rounded-2xl border border-gray-100 bg-white shadow-fresh overflow-hidden"
            >
              {/* Image Banner */}
              <div className="relative w-full aspect-[16/7] bg-[#2dd4bf]/10">
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt={displayName}
                    className="absolute inset-0 h-full w-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).parentElement!.classList.add('no-img');
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                ) : null}

                {/* Fallback text when no image */}
                {!item.imageUrl && (
                  <div className="absolute inset-0 flex items-center justify-center text-[#006b5f] font-extrabold text-xl">
                    {displayName.charAt(0).toUpperCase()}
                  </div>
                )}

                {/* Category badge */}
                <span className="absolute top-2.5 left-2.5 rounded-full bg-[#2dd4bf] px-3 py-0.5 text-[10px] font-bold text-[#00574d] shadow-sm">
                  {displayCat}
                </span>
              </div>

              {/* Card Body */}
              <div className="p-3 space-y-3">
                {/* Name */}
                <div>
                  <h3 className="text-base font-extrabold text-[#1a1c1c] leading-snug">{displayName}</h3>
                  <p className="text-[11px] font-medium text-gray-400 mt-0.5">{t('qualityEssential')}</p>
                </div>

                {/* Stepper + Unit row */}
                <div className="flex items-center justify-between rounded-xl bg-[#f3f3f4] px-2 py-1.5">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleQtyChange(item.id, qty, -1)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-gray-700 shadow-sm active:scale-90 transition-transform touch-manipulation"
                      aria-label={t('decrease')}
                    >
                      <Minus size={13} />
                    </button>
                    <span className="w-6 text-center text-sm font-extrabold text-[#1a1c1c] tabular-nums">
                      {qty}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleQtyChange(item.id, qty, 1)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-gray-700 shadow-sm active:scale-90 transition-transform touch-manipulation"
                      aria-label={t('increase')}
                    >
                      <Plus size={13} />
                    </button>
                  </div>

                  <select
                    value={unit}
                    onChange={(e) => handleUnitChange(item.id, e.target.value)}
                    className="bg-transparent text-xs font-bold text-gray-600 outline-none cursor-pointer py-1 pr-1"
                  >
                    {COMMON_UNITS.map((u) => (
                      <option key={u} value={u}>{u}</option>
                    ))}
                  </select>
                </div>

                {/* Add Button */}
                <button
                  type="button"
                  onClick={() => handleAdd(item)}
                  disabled={isPending}
                  className={`w-full flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold active:scale-[0.98] transition-all touch-manipulation ${
                    isAdded
                      ? 'bg-emerald-600 text-white'
                      : 'bg-[#006b5f] text-white hover:bg-[#00574d]'
                  }`}
                >
                  {isAdded ? (
                    <><Check size={16} /> {t('added')}</>
                  ) : (
                    <><ShoppingBag size={16} /> {qty > 1 ? `${t('addToList')} (${qty} ${unit})` : t('addToList')}</>
                  )}
                </button>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="py-10 text-center bg-white rounded-2xl border border-gray-100">
            <p className="text-xs text-gray-400 font-medium">{t('noItemsFound')}</p>
          </div>
        )}
      </div>

      {/* Can't Find An Item */}
      <div className="rounded-2xl border-2 border-dashed border-indigo-200/80 bg-indigo-50/30 p-5 text-center space-y-2">
        <Sparkles className="mx-auto text-[#006b5f]" size={26} />
        <h3 className="text-xs font-extrabold tracking-wider uppercase text-[#006b5f]">
          {t('cantFindItem')}
        </h3>
        <p className="text-[11px] text-gray-500 font-medium leading-relaxed">
          {t('cantFindSubtitle')}
        </p>

        <button
          onClick={() => setShowQuickAdd(!showQuickAdd)}
          className="inline-flex items-center gap-1.5 rounded-full border border-[#006b5f] bg-white px-5 py-2 text-xs font-bold text-[#006b5f] hover:bg-emerald-50 active:scale-95 transition-all touch-manipulation"
        >
          <Plus size={13} /> {showQuickAdd ? t('close') : t('quickAddItem')}
        </button>

        {showQuickAdd && (
          <form onSubmit={handleQuickAddSubmit} className="mt-3 pt-3 space-y-3 text-left border-t border-indigo-100">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">{t('itemName')}</label>
              <input
                type="text"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                placeholder="e.g. Organic Brown Rice"
                className="w-full rounded-xl border border-gray-200 bg-white p-3 text-sm outline-none focus:border-[#006b5f]"
                required
              />
            </div>

            <div className="flex gap-2">
              <div className="flex-1">
                <label className="block text-xs font-bold text-gray-700 mb-1">{t('qty')}</label>
                <input
                  type="number"
                  min="1"
                  value={customQty}
                  onChange={(e) => setCustomQty(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-white p-3 text-sm outline-none focus:border-[#006b5f]"
                />
              </div>
              <div className="w-24">
                <label className="block text-xs font-bold text-gray-700 mb-1">{t('unit')}</label>
                <select
                  value={customUnit}
                  onChange={(e) => setCustomUnit(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-white p-3 text-sm font-bold outline-none"
                >
                  {COMMON_UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
                </select>
              </div>
              <div className="w-24">
                <label className="block text-xs font-bold text-gray-700 mb-1">{t('category')}</label>
                <select
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-white p-3 text-sm font-bold outline-none"
                >
                  {['Produce','Dairy','Pantry','Meat','Frozen','Bakery','Other'].map((c) => (
                    <option key={c} value={c}>{getCategoryName(c, lang)}</option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full rounded-xl bg-[#006b5f] py-3 text-sm font-bold text-white hover:bg-[#00574d] active:scale-[0.99] transition-all"
            >
              {t('addToMyList')}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
