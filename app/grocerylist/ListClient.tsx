'use client';

import { useEffect, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { toggleBought, removeFromList } from '@/app/actions';
import { Check, Trash2, Search, ShoppingBag, Plus, ChevronDown, ChevronUp, WifiOff, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/components/LanguageProvider';
import { getItemName, getCategoryName } from '@/lib/translations';
import { getQueue, queueAction, clearQueue, type OfflineAction } from '@/lib/offlineQueue';

interface ListItem {
  id: number;
  catalogId: number | null;
  quantity: string | null;
  unit: string | null;
  isBought: boolean | null;
  name: string | null;
  nameUr?: string | null;
  nameSd?: string | null;
  category: string | null;
  imageUrl: string | null;
}

function applyAction(items: ListItem[], action: OfflineAction): ListItem[] {
  if (action.type === 'toggle') {
    return items.map((i) => (i.id === action.id ? { ...i, isBought: !action.currentStatus } : i));
  }
  return items.filter((i) => i.id !== action.id);
}

export default function ListClient({ items }: { items: ListItem[] }) {
  const { t, lang } = useLanguage();
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState<'active' | 'all' | 'bought'>('active');
  const [searchQuery, setSearchQuery] = useState('');
  const [showBought, setShowBought] = useState(true);
  const [isPending, startTransition] = useTransition();
  const [isOffline, setIsOffline] = useState(
    () => typeof navigator !== 'undefined' && !navigator.onLine
  );
  const [isSyncing, setIsSyncing] = useState(false);
  // Local, optimistic copy of the list — what actually renders. Kept in
  // sync with the server-provided `items` prop, except while offline
  // actions are queued and not yet replayed on top of it.
  const [localItems, setLocalItems] = useState(items);
  const [pendingCount, setPendingCount] = useState(0);

  // When fresh data arrives from the server (normal online refresh, or
  // right after a sync), replay any still-unsynced queued actions on top
  // of it so nothing is momentarily "lost" on screen.
  useEffect(() => {
    const queue = getQueue();
    /* eslint-disable react-hooks/set-state-in-effect -- syncing local
       state from localStorage, an external system unavailable during
       SSR, not from component state/props. */
    setLocalItems(queue.reduce(applyAction, items));
    setPendingCount(queue.length);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [items]);

  const syncQueue = async () => {
    const queue = getQueue();
    if (queue.length === 0) return;
    setIsSyncing(true);
    for (const action of queue) {
      try {
        if (action.type === 'toggle') {
          await toggleBought(action.id, action.currentStatus);
        } else {
          await removeFromList(action.id);
        }
      } catch {
        // Leave a failed action out of the cleared queue so it isn't
        // silently dropped — the item may have been changed/removed by
        // someone else in the meantime, which is fine to skip.
      }
    }
    clearQueue();
    setPendingCount(0);
    setIsSyncing(false);
    router.refresh();
  };

  useEffect(() => {
    // If the app was closed while offline and reopened with a connection
    // already restored, flush whatever's still queued from last time.
    if (typeof navigator !== 'undefined' && navigator.onLine) {
      /* eslint-disable-next-line react-hooks/set-state-in-effect -- kicks
         off a queue flush against localStorage/the server, not a plain
         state derivation. */
      syncQueue();
    }
    const goOnline = () => {
      setIsOffline(false);
      syncQueue();
    };
    const goOffline = () => setIsOffline(true);
    window.addEventListener('online', goOnline);
    window.addEventListener('offline', goOffline);
    return () => {
      window.removeEventListener('online', goOnline);
      window.removeEventListener('offline', goOffline);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleToggle = (id: number, currentStatus: boolean) => {
    if (isOffline) {
      const action: OfflineAction = { type: 'toggle', id, currentStatus };
      setLocalItems((prev) => applyAction(prev, action));
      queueAction(action);
      setPendingCount((n) => n + 1);
      return;
    }
    startTransition(async () => {
      await toggleBought(id, currentStatus);
    });
  };

  const handleRemove = (id: number) => {
    if (isOffline) {
      const action: OfflineAction = { type: 'remove', id };
      setLocalItems((prev) => applyAction(prev, action));
      queueAction(action);
      setPendingCount((n) => n + 1);
      return;
    }
    startTransition(async () => {
      await removeFromList(id);
    });
  };

  const activeItems = localItems.filter((i) => !i.isBought);
  const boughtItems = localItems.filter((i) => i.isBought);

  const filteredActive = activeItems.filter((item) => {
    const displayName = getItemName(item, lang);
    const origName = item.name || '';
    const query = searchQuery.toLowerCase();
    return (
      displayName.toLowerCase().includes(query) ||
      origName.toLowerCase().includes(query)
    );
  });

  const filteredBought = boughtItems.filter((item) => {
    const displayName = getItemName(item, lang);
    const origName = item.name || '';
    const query = searchQuery.toLowerCase();
    return (
      displayName.toLowerCase().includes(query) ||
      origName.toLowerCase().includes(query)
    );
  });

  const groupedActive = filteredActive.reduce<Record<string, ListItem[]>>((acc, item) => {
    const cat = item.category || 'Other';
    (acc[cat] ??= []).push(item);
    return acc;
  }, {});

  return (
    <div className="space-y-4 px-4 pt-2 pb-4">

      {/* Offline / syncing banner */}
      {isOffline && (
        <div className="flex items-center gap-2 rounded-2xl bg-amber-50 border border-amber-200 px-3.5 py-2.5 text-amber-800">
          <WifiOff size={16} className="shrink-0" />
          <p className="text-xs font-semibold">
            You&apos;re offline — changes you make now are saved on this phone and will sync
            {pendingCount > 0 ? ` (${pendingCount} pending)` : ''} once you&apos;re back online.
          </p>
        </div>
      )}
      {!isOffline && isSyncing && (
        <div className="flex items-center gap-2 rounded-2xl bg-[#e8f8f5] border border-[#2dd4bf]/40 px-3.5 py-2.5 text-[#006b5f]">
          <RefreshCw size={16} className="shrink-0 animate-spin" />
          <p className="text-xs font-semibold">Syncing your offline changes…</p>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex gap-1.5 overflow-x-auto scrollbar-none -mx-1 px-1">
          {(['active', 'all', 'bought'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`shrink-0 rounded-full px-4 py-2 text-xs font-bold transition-all ${
                activeFilter === f
                  ? 'bg-[#006b5f] text-white shadow-xs'
                  : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {f === 'active'
                ? `${t('filterToBuy')} (${activeItems.length})`
                : f === 'all'
                ? `${t('filterAll')} (${localItems.length})`
                : `${t('filterBought')} (${boughtItems.length})`}
            </button>
          ))}
        </div>
        <span className="shrink-0 whitespace-nowrap text-xs font-medium text-gray-400">{activeItems.length} {t('itemsLeft')}</span>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t('searchPlaceholder')}
          className="w-full rounded-2xl border border-gray-200 bg-white py-3 pl-10 pr-4 text-sm outline-none focus:border-[#006b5f]"
        />
      </div>

      {/* Active Items grouped by Category */}
      {(activeFilter === 'active' || activeFilter === 'all') && (
        <div className="space-y-5 pt-1">
          {Object.entries(groupedActive).map(([category, categoryItems]) => (
            <div key={category} className="space-y-3">
              {/* Category Header */}
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-[#2dd4bf]/20 px-3.5 py-1 text-xs font-extrabold uppercase tracking-wider text-[#006b5f]">
                  {getCategoryName(category, lang)}
                </span>
                <span className="text-xs text-gray-400 font-medium">{categoryItems.length} item{categoryItems.length !== 1 ? 's' : ''}</span>
              </div>

              {/* Item Cards */}
              <div className="space-y-3">
                {categoryItems.map((item) => {
                  const displayName = getItemName(item, lang);
                  return (
                    <div
                      key={item.id}
                      className="flex items-center gap-3.5 rounded-3xl border border-gray-100 bg-white p-3.5 shadow-fresh transition-all"
                    >
                      {/* Thumbnail */}
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={displayName}
                          className="h-14 w-14 flex-shrink-0 rounded-2xl object-cover border border-gray-100"
                          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                        />
                      ) : (
                        <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-[#2dd4bf]/20 text-[#006b5f] font-extrabold text-lg">
                          {displayName.charAt(0).toUpperCase()}
                        </div>
                      )}

                      {/* Name & Qty Badge */}
                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-base text-[#1a1c1c] truncate">{displayName}</p>
                        <span className="mt-1 inline-block rounded-xl bg-[#2dd4bf]/20 px-2.5 py-0.5 text-xs font-bold text-[#00574d]">
                          {item.quantity} {item.unit}
                        </span>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button
                          onClick={() => handleToggle(item.id, !!item.isBought)}
                          disabled={isPending}
                          className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e8f8f5] text-[#006b5f] hover:bg-[#2dd4bf]/30 active:scale-90 transition-all disabled:opacity-40 disabled:active:scale-100"
                          aria-label={t('markBought')}
                        >
                          <Check size={20} />
                        </button>
                        <button
                          onClick={() => handleRemove(item.id)}
                          disabled={isPending}
                          className="flex h-10 w-10 items-center justify-center rounded-full bg-[#ffdad6]/40 text-[#ba1a1a] hover:bg-[#ffdad6]/80 active:scale-90 transition-all disabled:opacity-40 disabled:active:scale-100"
                          aria-label={t('removeItem')}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Empty active state */}
          {activeItems.length === 0 && (
            <div className="py-14 text-center rounded-3xl border-2 border-dashed border-gray-200 bg-white">
              <ShoppingBag className="mx-auto mb-3 text-gray-300" size={44} />
              <p className="text-sm font-bold text-gray-500">{t('listEmpty')}</p>
              <Link
                href="/grocerylist/edit"
                className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-[#006b5f] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#00574d] transition-colors"
              >
                <Plus size={14} /> {t('browseCatalog')}
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Bought Section */}
      {(activeFilter === 'bought' || activeFilter === 'all') && (
        <div className="pt-2 space-y-3">
          <div className="flex items-center justify-between">
            <span className="rounded-full bg-gray-200/80 px-3.5 py-1 text-xs font-extrabold uppercase tracking-wider text-gray-500">
              {t('boughtSection')}
            </span>
            <button
              onClick={() => setShowBought(!showBought)}
              className="flex items-center gap-1 text-xs font-medium text-gray-400 hover:text-gray-600"
            >
              {showBought ? t('hide') : t('show')} {showBought ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
          </div>

          {showBought && (
            <>
              {filteredBought.length > 0 ? (
                <div className="space-y-2.5">
                  {filteredBought.map((item) => {
                    const displayName = getItemName(item, lang);
                    return (
                      <div
                        key={item.id}
                        className="flex items-center gap-3.5 rounded-3xl border border-gray-100 bg-white/60 p-3.5 opacity-55 transition-all"
                      >
                        {item.imageUrl ? (
                          <img
                            src={item.imageUrl}
                            alt={displayName}
                            className="h-12 w-12 flex-shrink-0 rounded-2xl object-cover"
                          />
                        ) : (
                          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-gray-100 text-gray-400 font-bold text-sm">
                            {displayName.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="font-bold text-sm text-gray-500 line-through truncate">{displayName}</p>
                          <span className="text-xs text-gray-400 font-medium">{item.quantity} {item.unit}</span>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <button
                            onClick={() => handleToggle(item.id, !!item.isBought)}
                            disabled={isPending}
                            className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 active:scale-90 transition-all disabled:opacity-40 disabled:active:scale-100"
                            aria-label={t('unmarkBought')}
                          >
                            <Check size={16} />
                          </button>
                          <button
                            onClick={() => handleRemove(item.id)}
                            disabled={isPending}
                            className="flex h-9 w-9 items-center justify-center rounded-full bg-[#ffdad6]/40 text-[#ba1a1a] hover:bg-[#ffdad6]/60 active:scale-90 transition-all disabled:opacity-40 disabled:active:scale-100"
                            aria-label={t('removeItem')}
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-gray-200 p-8 text-center bg-white/40">
                  <ShoppingBag size={32} className="text-gray-300 mb-2" />
                  <p className="text-xs text-gray-400 font-medium">{t('boughtEmpty')}</p>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Floating + FAB */}
      <Link
        href="/grocerylist/edit"
        style={{ bottom: 'calc(env(safe-area-inset-bottom, 0px) + 5rem)' }}
        className="fixed right-5 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-[#006b5f] text-white shadow-lg hover:bg-[#00574d] active:scale-90 transition-all"
        aria-label={t('addFromCatalog')}
      >
        <Plus size={26} />
      </Link>
    </div>
  );
}
