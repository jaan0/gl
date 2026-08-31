import Link from 'next/link';
import { WifiOff } from 'lucide-react';

export default function OfflineFallbackPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#f9f9f9] px-6 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#2dd4bf]/20 text-[#006b5f]">
        <WifiOff size={28} />
      </div>
      <h1 className="text-lg font-bold text-[#1a1c1c]">This page needs a connection</h1>
      <p className="max-w-xs text-sm text-gray-500">
        Only your grocery list is saved for offline viewing. Reconnect to use this page.
      </p>
      <Link
        href="/grocerylist"
        className="mt-2 rounded-full bg-[#006b5f] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#00574d] transition-colors"
      >
        Go to your list
      </Link>
    </div>
  );
}
