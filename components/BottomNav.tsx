'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ListChecks, PackageSearch, Settings } from 'lucide-react';
import { useLanguage } from './LanguageProvider';

export default function BottomNav() {
  const pathname = usePathname();
  const { t } = useLanguage();

  const navItems = [
    {
      name: t('navList'),
      href: '/grocerylist',
      icon: ListChecks,
      active: pathname === '/grocerylist',
    },
    {
      name: t('navCatalog'),
      href: '/grocerylist/edit',
      icon: PackageSearch,
      active: pathname.startsWith('/grocerylist/edit'),
    },
    {
      name: t('navSettings'),
      href: '/admin',
      icon: Settings,
      active: pathname.startsWith('/admin'),
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 border-t border-gray-100 backdrop-blur-md pb-safe">
      <div className="mx-auto flex max-w-lg items-center justify-around px-2 py-2 sm:px-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-1 rounded-full px-3 py-1.5 sm:px-5 transition-all ${
                item.active
                  ? 'bg-[#2dd4bf] text-[#00574d] font-bold shadow-xs'
                  : 'text-gray-600 hover:text-gray-900 font-medium'
              }`}
            >
              <Icon size={20} />
              <span className="text-[11px] leading-none">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
