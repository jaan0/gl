'use client';

import { useState, useRef } from 'react';
import { bulkUploadCatalog } from '@/app/actions';
import { Upload, FileText, CheckCircle, AlertCircle, X, Download } from 'lucide-react';

type ParsedRow = {
  name: string;
  category: string;
  unit: string;
  quantity: string;
  imageUrl: string;
  nameUr: string;
  nameSd: string;
};

type UploadResult = {
  inserted: number;
  skipped: number;
  errors: string[];
};

/** Parse a CSV or pipe-separated TXT file into rows */
function parseFile(text: string): { rows: ParsedRow[]; headerDetected: boolean } {
  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  if (lines.length === 0) return { rows: [], headerDetected: false };

  // Auto-detect separator: comma or pipe
  const sep = lines[0].includes('|') ? '|' : ',';

  const firstLineLower = lines[0].toLowerCase();
  const headerDetected =
    firstLineLower.includes('name') ||
    firstLineLower.includes('product') ||
    firstLineLower.includes('category');

  const dataLines = headerDetected ? lines.slice(1) : lines;

  const rows: ParsedRow[] = dataLines.map((line) => {
    const cols = line.split(sep).map((c) => c.trim());
    return {
      name: cols[0] || '',
      category: cols[1] || 'Other',
      unit: cols[2] || 'pcs',
      quantity: cols[3] || '1',
      imageUrl: cols[4] || '',
      nameUr: cols[5] || '',
      nameSd: cols[6] || '',
    };
  });

  return { rows, headerDetected };
}

export default function BulkUpload() {
  const [preview, setPreview] = useState<ParsedRow[] | null>(null);
  const [fileName, setFileName] = useState('');
  const [result, setResult] = useState<UploadResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setResult(null);
    setError('');

    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      const { rows } = parseFile(text);
      if (rows.length === 0) {
        setError('No valid rows found in file. Check the format.');
        setPreview(null);
      } else {
        setPreview(rows);
      }
    };
    reader.readAsText(file);
  };

  const handleUpload = async () => {
    if (!preview || preview.length === 0) return;
    setLoading(true);
    setError('');
    try {
      const res = await bulkUploadCatalog(preview);
      setResult(res);
      setPreview(null);
      setFileName('');
      if (fileRef.current) fileRef.current.value = '';
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setPreview(null);
    setFileName('');
    setResult(null);
    setError('');
    if (fileRef.current) fileRef.current.value = '';
  };

  // Sample template download
  const handleDownloadTemplate = () => {
    const content = `name,category,unit,quantity,imageUrl,nameUr,nameSd
Sugar,Pantry,kg,1,,چینی,کنڊ
Whole Milk,Dairy,Ltr,2,https://example.com/milk.jpg,خالص دودھ,خالص کير
Tomatoes,Produce,kg,0.5,,ٹماٹر,ٽماٽو
Chicken Breast,Meat,kg,1,,مرغی کا گوشت,ڪڪڙ جو گوشت
White Bread,Bakery,pcs,1,,ڈبل روٹی,روٽي`;
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'catalog_template.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="rounded-3xl bg-white p-6 shadow-fresh border border-gray-100 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-[#006b5f]">
          <Upload size={20} />
          <h2 className="font-extrabold text-base">Bulk Upload Products</h2>
        </div>
        <button
          onClick={handleDownloadTemplate}
          className="flex items-center gap-1.5 rounded-full border border-gray-200 px-3 py-1.5 text-[10px] font-bold text-gray-600 hover:bg-gray-50 transition-colors"
        >
          <Download size={12} /> Template CSV
        </button>
      </div>

      {/* Format hint */}
      <div className="rounded-2xl bg-indigo-50/60 border border-indigo-100 p-3.5 space-y-1">
        <p className="text-xs font-bold text-indigo-700">File Format (CSV or pipe-separated TXT)</p>
        <code className="block text-[10px] text-indigo-600 leading-relaxed font-mono whitespace-pre overflow-x-auto">
{`name, category, unit, quantity, imageUrl, nameUr, nameSd
Sugar, Pantry, kg, 1, , چینی, کنڊ
Milk, Dairy, Ltr, 2, https://..., دودھ, کير`}
        </code>
        <p className="text-[10px] text-indigo-500 font-medium">
          Header row is optional. Columns: <strong>name · category · unit · quantity · imageUrl · nameUr · nameSd</strong>
        </p>
      </div>

      {/* File Picker */}
      {!preview && !result && (
        <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-[#2dd4bf]/60 bg-[#2dd4bf]/5 p-8 text-center hover:bg-[#2dd4bf]/10 transition-colors">
          <FileText size={32} className="text-[#006b5f]" />
          <span className="text-xs font-bold text-[#006b5f]">
            {fileName ? fileName : 'Choose .csv or .txt file'}
          </span>
          <span className="text-[10px] text-gray-400 font-medium">Tap to browse</span>
          <input
            ref={fileRef}
            type="file"
            accept=".csv,.txt,text/plain,text/csv"
            className="hidden"
            onChange={handleFile}
          />
        </label>
      )}

      {/* Error message */}
      {error && (
        <div className="flex items-center gap-2 rounded-2xl bg-[#ffdad6]/40 px-4 py-3 text-xs font-bold text-[#ba1a1a]">
          <AlertCircle size={16} /> {error}
        </div>
      )}

      {/* Preview table */}
      {preview && preview.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-[#006b5f]">
              Preview — {preview.length} product{preview.length !== 1 ? 's' : ''} found
            </p>
            <button onClick={handleClear} className="text-gray-400 hover:text-gray-600">
              <X size={16} />
            </button>
          </div>

          <div className="max-h-56 overflow-y-auto rounded-2xl border border-gray-100">
            <table className="w-full text-[10px]">
              <thead className="sticky top-0 bg-gray-50">
                <tr className="text-left text-gray-500 font-bold uppercase tracking-wider">
                  <th className="px-3 py-2">Name</th>
                  <th className="px-3 py-2">Category</th>
                  <th className="px-3 py-2">Unit</th>
                  <th className="px-3 py-2">Urdu</th>
                  <th className="px-3 py-2">Sindhi</th>
                </tr>
              </thead>
              <tbody>
                {preview.slice(0, 50).map((row, i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>
                    <td className="px-3 py-2 font-bold text-[#1a1c1c] truncate max-w-[90px]">{row.name}</td>
                    <td className="px-3 py-2 text-gray-500">{row.category}</td>
                    <td className="px-3 py-2 text-gray-500">{row.unit}</td>
                    <td className="px-3 py-2 text-gray-500">{row.nameUr || '—'}</td>
                    <td className="px-3 py-2 text-gray-500">{row.nameSd || '—'}</td>
                  </tr>
                ))}
                {preview.length > 50 && (
                  <tr>
                    <td colSpan={5} className="px-3 py-2 text-center text-gray-400 italic">
                      …and {preview.length - 50} more
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <button
            onClick={handleUpload}
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#006b5f] py-4 text-sm font-bold text-white shadow-md hover:bg-[#00574d] active:scale-[0.99] transition-all disabled:opacity-60"
          >
            {loading ? (
              <span className="animate-pulse">Uploading…</span>
            ) : (
              <><Upload size={16} /> Upload {preview.length} Products</>
            )}
          </button>
        </div>
      )}

      {/* Upload result */}
      {result && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 rounded-2xl bg-emerald-50 border border-emerald-100 px-4 py-3">
            <CheckCircle size={18} className="text-emerald-600 flex-shrink-0" />
            <div>
              <p className="text-xs font-extrabold text-emerald-700">Upload complete!</p>
              <p className="text-[10px] text-emerald-600 font-medium">
                {result.inserted} added · {result.skipped} skipped
              </p>
            </div>
          </div>

          {result.errors.length > 0 && (
            <div className="rounded-2xl bg-[#ffdad6]/30 border border-[#ffdad6] px-4 py-3 space-y-1">
              <p className="text-[10px] font-bold text-[#ba1a1a]">Errors ({result.errors.length})</p>
              {result.errors.map((e, i) => (
                <p key={i} className="text-[10px] text-[#ba1a1a] font-medium">{e}</p>
              ))}
            </div>
          )}

          <button
            onClick={handleClear}
            className="w-full rounded-2xl border border-gray-200 py-3 text-xs font-bold text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Upload Another File
          </button>
        </div>
      )}
    </div>
  );
}
