'use client';

import { useState, useTransition, useRef } from 'react';
import { upload } from '@vercel/blob/client';
import {
  deleteCatalogItem,
  deleteMultipleCatalogItems,
  deleteAllCatalogItems,
  updateCatalogItem,
} from '@/app/actions';
import { Trash2, Pencil, X, ImageUp, Camera, Save, PackagePlus, CheckSquare, Square, AlertTriangle, Loader2 } from 'lucide-react';
import { useLanguage } from './LanguageProvider';
import { getItemName, getCategoryName } from '@/lib/translations';
import Link from 'next/link';

interface CatalogProduct {
  id: number;
  name: string;
  nameUr?: string | null;
  nameSd?: string | null;
  category: string;
  imageUrl: string | null;
  defaultQuantity: string | null;
  defaultUnit: string | null;
}

interface EditState {
  id: number;
  name: string;
  nameUr: string;
  nameSd: string;
  imageUrl: string;
  previewUrl: string;
}

export default function AdminCatalogClient({ products }: { products: CatalogProduct[] }) {
  const { t, lang } = useLanguage();
  const [isPending, startTransition] = useTransition();
  const [editState, setEditState] = useState<EditState | null>(null);
  const [saveError, setSaveError] = useState('');
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [showConfirmDeleteAll, setShowConfirmDeleteAll] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const toggleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === products.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(products.map((p) => p.id));
    }
  };

  const handleBulkDeleteSelected = () => {
    if (selectedIds.length === 0) return;
    if (!confirm(`Are you sure you want to delete ${selectedIds.length} selected product(s)?`)) return;
    startTransition(async () => {
      await deleteMultipleCatalogItems(selectedIds);
      setSelectedIds([]);
    });
  };

  const handleBulkDeleteAll = () => {
    startTransition(async () => {
      await deleteAllCatalogItems();
      setSelectedIds([]);
      setShowConfirmDeleteAll(false);
    });
  };

  const openEdit = (item: CatalogProduct) => {
    setEditState({
      id: item.id,
      name: item.name,
      nameUr: item.nameUr || '',
      nameSd: item.nameSd || '',
      imageUrl: item.imageUrl || '',
      previewUrl: item.imageUrl || '',
    });
    setSaveError('');
  };

  const closeEdit = () => {
    setEditState(null);
    setSaveError('');
  };

  // Uploads the file directly to Vercel Blob from the browser and stores
  // only the resulting URL — avoids the 1MB Server Action body limit that
  // base64 data URLs used to hit.
  const handleImageFile = async (file: File) => {
    if (!file) return;
    setSaveError('');
    setIsUploading(true);
    try {
      const blob = await upload(file.name, file, {
        access: 'public',
        handleUploadUrl: '/api/upload',
      });
      setEditState((prev) =>
        prev ? { ...prev, imageUrl: blob.url, previewUrl: blob.url } : prev
      );
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Image upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = () => {
    if (!editState) return;
    setSaveError('');
    startTransition(async () => {
      try {
        await updateCatalogItem(
          editState.id,
          editState.name.trim(),
          editState.imageUrl,
          editState.nameUr,
          editState.nameSd
        );
        closeEdit();
      } catch (e) {
        setSaveError(e instanceof Error ? e.message : 'Failed to save');
      }
    });
  };

  const handleDelete = (id: number) => {
    startTransition(async () => {
      await deleteCatalogItem(id);
      setSelectedIds((prev) => prev.filter((i) => i !== id));
    });
  };

  return (
    <>
      {/* Catalog Header & Bulk Toolbar */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-xs font-extrabold uppercase tracking-wider text-gray-500">
            {t('catalogCount')} ({products.length} items)
          </h2>
          <div className="flex items-center gap-3">
            <Link href="/grocerylist/edit" className="text-xs font-bold text-[#006b5f] hover:underline">
              {t('viewInShop')}
            </Link>
            {products.length > 0 && (
              <button
                type="button"
                onClick={() => setShowConfirmDeleteAll(true)}
                className="flex items-center gap-1 text-xs font-bold text-[#ba1a1a] hover:underline"
              >
                <Trash2 size={13} /> Delete All
              </button>
            )}
          </div>
        </div>

        {/* Selection / Bulk Action Bar */}
        {products.length > 0 && (
          <div className="flex items-center justify-between rounded-2xl bg-white p-3 border border-gray-100 shadow-fresh">
            <button
              type="button"
              onClick={toggleSelectAll}
              className="flex items-center gap-2 text-xs font-bold text-gray-700 hover:text-[#006b5f]"
            >
              {selectedIds.length === products.length ? (
                <CheckSquare size={18} className="text-[#006b5f]" />
              ) : (
                <Square size={18} className="text-gray-400" />
              )}
              Select All ({products.length})
            </button>

            {selectedIds.length > 0 && (
              <button
                type="button"
                onClick={handleBulkDeleteSelected}
                disabled={isPending}
                className="flex items-center gap-1.5 rounded-xl bg-[#ffdad6]/60 px-3 py-1.5 text-xs font-bold text-[#ba1a1a] hover:bg-[#ffdad6] active:scale-95 transition-all"
              >
                <Trash2 size={14} /> Delete Selected ({selectedIds.length})
              </button>
            )}
          </div>
        )}

        {/* Product Cards */}
        <div className="space-y-2.5">
          {products.map((item) => {
            const displayName = getItemName(item, lang);
            const displayCat = getCategoryName(item.category, lang);
            const isSelected = selectedIds.includes(item.id);

            return (
              <div
                key={item.id}
                className={`flex items-center justify-between rounded-2xl border p-3.5 shadow-fresh transition-all ${
                  isSelected ? 'border-[#006b5f] bg-emerald-50/20' : 'border-gray-100 bg-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  {/* Select Checkbox */}
                  <button
                    type="button"
                    onClick={() => toggleSelect(item.id)}
                    className="text-gray-400 hover:text-[#006b5f]"
                  >
                    {isSelected ? (
                      <CheckSquare size={20} className="text-[#006b5f]" />
                    ) : (
                      <Square size={20} />
                    )}
                  </button>

                  <div className="flex items-center gap-3">
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={displayName}
                        className="h-14 w-14 rounded-2xl object-cover border border-gray-100"
                      />
                    ) : (
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#2dd4bf]/20 text-[#006b5f] font-extrabold text-lg">
                        {displayName.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <p className="font-bold text-base text-[#1a1c1c]">{displayName}</p>
                      {lang !== 'en' && item.name !== displayName && (
                        <p className="text-[11px] text-gray-400 font-medium">{item.name}</p>
                      )}
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="rounded-full bg-[#2dd4bf]/20 px-2.5 py-0.5 text-[10px] font-bold text-[#00574d]">
                          {displayCat}
                        </span>
                        <span className="text-xs text-gray-400 font-medium">
                          {item.defaultQuantity} {item.defaultUnit}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* Edit button */}
                  <button
                    type="button"
                    onClick={() => openEdit(item)}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e8f8f5] text-[#006b5f] hover:bg-[#2dd4bf]/40 active:scale-95 transition-all"
                    aria-label={t('editItem')}
                  >
                    <Pencil size={17} />
                  </button>

                  {/* Delete button */}
                  <button
                    type="button"
                    onClick={() => handleDelete(item.id)}
                    disabled={isPending}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-[#ffdad6]/40 text-[#ba1a1a] hover:bg-[#ffdad6]/80 active:scale-95 transition-all"
                    aria-label={t('deleteItem')}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            );
          })}

          {products.length === 0 && (
            <div className="py-12 text-center rounded-2xl border border-dashed border-gray-200 bg-white">
              <PackagePlus className="mx-auto mb-2 text-gray-300" size={36} />
              <p className="text-xs text-gray-400 font-medium">{t('catalogEmpty')}</p>
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Modal for Delete All */}
      {showConfirmDeleteAll && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowConfirmDeleteAll(false)} />
          <div className="relative z-10 w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl space-y-4 animate-slide-up text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#ffdad6]/60 text-[#ba1a1a]">
              <AlertTriangle size={28} />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-[#1a1c1c]">Delete Entire Catalog?</h3>
              <p className="text-xs text-gray-500 font-medium mt-1 leading-relaxed">
                This will delete all <strong>{products.length}</strong> products from the catalog. This action cannot be undone.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowConfirmDeleteAll(false)}
                className="rounded-2xl border border-gray-200 py-3 text-xs font-bold text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleBulkDeleteAll}
                disabled={isPending}
                className="rounded-2xl bg-[#ba1a1a] py-3 text-xs font-bold text-white shadow-md hover:bg-red-700 active:scale-95 transition-all"
              >
                Delete All Products
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editState && (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={closeEdit}
          />

          {/* Modal Sheet */}
          <div className="relative z-10 w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl bg-white shadow-2xl p-6 space-y-4 animate-slide-up">
            {/* Header */}
            <div className="flex items-center justify-between sticky top-0 bg-white pt-1 pb-2 z-10">
              <div>
                <h2 className="font-extrabold text-lg text-[#1a1c1c]">{t('editProduct')}</h2>
                <p className="text-xs text-gray-500 font-medium mt-0.5">{t('editProductSubtitle')}</p>
              </div>
              <button
                onClick={closeEdit}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all"
              >
                <X size={18} />
              </button>
            </div>

            {/* Image Preview */}
            <div className="relative w-full aspect-[16/7] rounded-2xl bg-[#2dd4bf]/10 overflow-hidden border border-gray-100">
              {editState.previewUrl ? (
                <img
                  src={editState.previewUrl}
                  alt={t('imagePreview')}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-[#006b5f] font-extrabold text-3xl">
                  {editState.name.charAt(0).toUpperCase() || '?'}
                </div>
              )}

              {isUploading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                  <div className="flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-xs font-bold text-[#006b5f]">
                    <Loader2 size={16} className="animate-spin" />
                    Uploading…
                  </div>
                </div>
              )}
            </div>

            {/* Name fields */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">{t('editName')}</label>
              <input
                type="text"
                value={editState.name}
                onChange={(e) => setEditState((prev) => prev ? { ...prev, name: e.target.value } : prev)}
                className="w-full rounded-2xl border border-gray-200 p-3 text-sm outline-none focus:border-[#006b5f] focus:ring-1 focus:ring-[#006b5f]/20"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">{t('editNameUr')}</label>
                <input
                  type="text"
                  dir="rtl"
                  value={editState.nameUr}
                  onChange={(e) => setEditState((prev) => prev ? { ...prev, nameUr: e.target.value } : prev)}
                  placeholder="مثلاً چینی"
                  className="w-full rounded-2xl border border-gray-200 p-3 text-sm outline-none focus:border-[#006b5f] focus:ring-1 focus:ring-[#006b5f]/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">{t('editNameSd')}</label>
                <input
                  type="text"
                  dir="rtl"
                  value={editState.nameSd}
                  onChange={(e) => setEditState((prev) => prev ? { ...prev, nameSd: e.target.value } : prev)}
                  placeholder="مثال: کنڊ"
                  className="w-full rounded-2xl border border-gray-200 p-3 text-sm outline-none focus:border-[#006b5f] focus:ring-1 focus:ring-[#006b5f]/20"
                />
              </div>
            </div>

            {/* Image URL */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">{t('editImageUrl')}</label>
              <input
                type="text"
                value={editState.imageUrl.startsWith('data:') ? '' : editState.imageUrl}
                onChange={(e) =>
                  setEditState((prev) =>
                    prev ? { ...prev, imageUrl: e.target.value, previewUrl: e.target.value } : prev
                  )
                }
                placeholder={t('editImageUrlPlaceholder')}
                className="w-full rounded-2xl border border-gray-200 p-3 text-sm outline-none focus:border-[#006b5f] focus:ring-1 focus:ring-[#006b5f]/20"
              />
            </div>

            {/* Upload options */}
            <div className="space-y-2">
              <p className="text-xs font-bold text-gray-700">{t('orUploadImage')}</p>
              <div className="grid grid-cols-2 gap-3">
                {/* Gallery */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="flex items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-[#2dd4bf] bg-[#2dd4bf]/10 py-3 text-xs font-bold text-[#006b5f] hover:bg-[#2dd4bf]/20 active:scale-95 transition-all disabled:opacity-50"
                >
                  <ImageUp size={18} />
                  {t('uploadFromGallery')}
                </button>

                {/* Camera */}
                <button
                  type="button"
                  onClick={() => cameraInputRef.current?.click()}
                  disabled={isUploading}
                  className="flex items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-violet-300 bg-violet-50 py-3 text-xs font-bold text-violet-700 hover:bg-violet-100 active:scale-95 transition-all disabled:opacity-50"
                >
                  <Camera size={18} />
                  {t('takePhoto')}
                </button>
              </div>
            </div>

            {/* Hidden file inputs */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (file) await handleImageFile(file);
                e.target.value = '';
              }}
            />
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (file) await handleImageFile(file);
                e.target.value = '';
              }}
            />

            {/* Error */}
            {saveError && (
              <p className="text-xs text-[#ba1a1a] font-bold rounded-xl bg-[#ffdad6]/30 p-2.5">
                {saveError}
              </p>
            )}

            {/* Actions */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <button
                type="button"
                onClick={closeEdit}
                className="rounded-2xl border border-gray-200 py-3.5 text-sm font-bold text-gray-600 hover:bg-gray-50 active:scale-[0.99] transition-all"
              >
                {t('cancel')}
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={isPending || isUploading || !editState.name.trim()}
                className="flex items-center justify-center gap-2 rounded-2xl bg-[#006b5f] py-3.5 text-sm font-bold text-white shadow-md hover:bg-[#00574d] active:scale-[0.99] disabled:opacity-50 transition-all"
              >
                <Save size={16} />
                {t('saveChanges')}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}