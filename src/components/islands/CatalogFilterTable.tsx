import React, { useState, useMemo, useEffect } from 'react';
import type { Lang } from '../../i18n/ui';
import { UI_DICTIONARY } from '../../i18n/ui';

export interface CatalogItemProps {
  slug: string;
  sku: string;
  title: string;
  title_uz?: string;
  title_en?: string;
  subsystem: string;
  subsystem_uz?: string;
  subsystem_en?: string;
  gost: string;
  tnved: string;
  warehouse: string;
  status: 'В наличии' | 'Резерв' | 'Под заказ' | string;
  status_uz?: string;
  status_en?: string;
  statusKey: 'in_stock' | 'reserved' | 'on_order';
  specs: string;
  specs_uz?: string;
  specs_en?: string;
  image?: string;
}

interface Props {
  items: CatalogItemProps[];
}

export const CatalogFilterTable: React.FC<Props> = ({ items }) => {
  const [lang, setLang] = useState<Lang>('ru');
  const [selectedSubsystem, setSelectedSubsystem] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    const cur = (document.documentElement.lang as Lang) || 
      ((typeof localStorage !== 'undefined' ? localStorage.getItem('rt_lang') : null) as Lang) || 
      'ru';
    if (cur === 'ru' || cur === 'uz' || cur === 'en') {
      setLang(cur);
    }

    const handleLang = (e: Event) => {
      const customEvent = e as CustomEvent<Lang>;
      if (customEvent.detail && (customEvent.detail === 'ru' || customEvent.detail === 'uz' || customEvent.detail === 'en')) {
        setLang(customEvent.detail);
      }
    };

    window.addEventListener('rt-lang-change', handleLang);
    return () => window.removeEventListener('rt-lang-change', handleLang);
  }, []);

  const t = UI_DICTIONARY[lang]?.catalog || UI_DICTIONARY.ru.catalog;

  const base = (typeof window !== 'undefined' && window.location.pathname.startsWith('/rt-corporate-website'))
    ? '/rt-corporate-website'
    : (import.meta.env.BASE_URL?.replace(/\/$/, '') || '');

  // Subsystems mapping in original RU key for consistent filtering
  const subsystems = useMemo(() => {
    const set = new Set<string>();
    items.forEach((item) => {
      if (item.subsystem) set.add(item.subsystem);
    });
    return Array.from(set);
  }, [items]);

  const getSubsystemLabel = (subRu: string, currentLang: Lang) => {
    const sample = items.find((it) => it.subsystem === subRu);
    if (!sample) return subRu;
    if (currentLang === 'uz' && sample.subsystem_uz) return sample.subsystem_uz;
    if (currentLang === 'en' && sample.subsystem_en) return sample.subsystem_en;
    return subRu;
  };

  const getItemTitle = (item: CatalogItemProps) => {
    if (lang === 'uz' && item.title_uz) return item.title_uz;
    if (lang === 'en' && item.title_en) return item.title_en;
    return item.title;
  };

  const getItemSubsystem = (item: CatalogItemProps) => {
    if (lang === 'uz' && item.subsystem_uz) return item.subsystem_uz;
    if (lang === 'en' && item.subsystem_en) return item.subsystem_en;
    return item.subsystem;
  };

  const getItemSpecs = (item: CatalogItemProps) => {
    if (lang === 'uz' && item.specs_uz) return item.specs_uz;
    if (lang === 'en' && item.specs_en) return item.specs_en;
    return item.specs;
  };

  const getItemStatus = (item: CatalogItemProps) => {
    if (lang === 'uz') {
      if (item.status_uz) return item.status_uz;
      return item.statusKey === 'in_stock' ? t.statusInStock : item.statusKey === 'reserved' ? t.statusReserved : t.statusOnOrder;
    }
    if (lang === 'en') {
      if (item.status_en) return item.status_en;
      return item.statusKey === 'in_stock' ? t.statusInStock : item.statusKey === 'reserved' ? t.statusReserved : t.statusOnOrder;
    }
    return item.status;
  };

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchCat =
        selectedSubsystem === 'ALL' || item.subsystem === selectedSubsystem;
      const query = searchQuery.trim().toLowerCase();
      const matchQuery =
        !query ||
        item.title.toLowerCase().includes(query) ||
        (item.title_uz && item.title_uz.toLowerCase().includes(query)) ||
        (item.title_en && item.title_en.toLowerCase().includes(query)) ||
        item.sku.toLowerCase().includes(query) ||
        item.gost.toLowerCase().includes(query) ||
        item.tnved.toLowerCase().includes(query) ||
        item.specs.toLowerCase().includes(query) ||
        (item.specs_uz && item.specs_uz.toLowerCase().includes(query)) ||
        (item.specs_en && item.specs_en.toLowerCase().includes(query));
      return matchCat && matchQuery;
    });
  }, [items, selectedSubsystem, searchQuery]);

  const handleOpenModal = (item: CatalogItemProps) => {
    const title = getItemTitle(item);
    const subject = lang === 'uz'
      ? `Tijorat taklifi / hisob so'rovi: ${title} (${item.sku})`
      : lang === 'en'
      ? `Quotation / Invoice Request: ${title} (${item.sku})`
      : `Запрос счета/КП на позицию: ${title} (${item.sku})`;

    window.dispatchEvent(
      new CustomEvent('open-lead-modal', {
        detail: { subject },
      })
    );
  };

  return (
    <div className="flex flex-col space-y-6">
      {/* Search and Filters Bar */}
      <div className="border border-[#0A0A0A] bg-[#C8CDD2] p-4 flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
        {/* Subsystem Tabs */}
        <div className="flex flex-wrap gap-1 font-mono text-xs">
          <button
            type="button"
            onClick={() => setSelectedSubsystem('ALL')}
            className={`px-3 py-1.5 border border-[#0A0A0A] font-bold transition-colors cursor-pointer ${
              selectedSubsystem === 'ALL'
                ? 'bg-[#0A0A0A] text-white'
                : 'bg-[#D4D8DC] text-[#0A0A0A] hover:bg-[#0A0A0A] hover:text-white'
            }`}
          >
            {t.filterAll} ({items.length})
          </button>
          {subsystems.map((subRu) => {
            const count = items.filter((it) => it.subsystem === subRu).length;
            const isSelected = selectedSubsystem === subRu;
            const label = getSubsystemLabel(subRu, lang);
            return (
              <button
                key={subRu}
                type="button"
                onClick={() => setSelectedSubsystem(subRu)}
                className={`px-3 py-1.5 border border-[#0A0A0A] transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-[#0A0A0A] text-white font-bold'
                    : 'bg-[#D4D8DC] text-[#0A0A0A] hover:bg-[#0A0A0A] hover:text-white'
                }`}
              >
                {label} ({count})
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[280px]">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="w-full border border-[#0A0A0A] bg-[#D4D8DC] px-3 py-1.5 font-mono text-xs placeholder:text-[#4A5056] focus:outline-none focus:bg-white"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2 top-1.5 text-xs text-[#0A0A0A] font-mono hover:font-bold cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Results Telemetry */}
      <div className="flex items-center justify-between font-mono text-xs text-[#4A5056] px-1">
        <div>
          {t.foundCount} <span className="text-[#0A0A0A] font-bold">{filteredItems.length}</span>
        </div>
        <div>
          {t.dispatchWarehouse}
        </div>
      </div>

      {/* Data Table */}
      <div className="border border-[#0A0A0A] overflow-x-auto bg-[#D4D8DC]">
        <table className="w-full text-left font-mono text-xs border-collapse">
          <thead>
            <tr className="border-b border-[#0A0A0A] bg-[#0A0A0A] text-white">
              <th className="p-3 font-semibold">{t.colSku}</th>
              <th className="p-3 font-semibold">{t.colTitleSpecs}</th>
              <th className="p-3 font-semibold">{t.colSubsystem}</th>
              <th className="p-3 font-semibold">{t.colGost}</th>
              <th className="p-3 font-semibold">{t.colTnved}</th>
              <th className="p-3 font-semibold">{t.colStatus}</th>
              <th className="p-3 font-semibold text-right">{t.colAction}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#0A0A0A]/20">
            {filteredItems.map((item) => {
              const statusBadgeClass =
                item.statusKey === 'in_stock'
                  ? 'bg-emerald-100 text-emerald-900 border border-emerald-500'
                  : item.statusKey === 'reserved'
                  ? 'bg-amber-100 text-amber-900 border border-amber-500'
                  : 'bg-zinc-200 text-zinc-900 border border-zinc-500';

              const title = getItemTitle(item);
              const subsystem = getItemSubsystem(item);
              const specs = getItemSpecs(item);
              const status = getItemStatus(item);

              return (
                <tr
                  key={item.sku}
                  className="hover:bg-[#C8CDD2]/60 transition-colors group"
                >
                  <td className="p-3 font-bold text-[#0A0A0A] whitespace-nowrap">
                    <a
                      href={`${base}/catalog/${item.slug}`}
                      className="underline group-hover:no-underline"
                    >
                      {item.sku}
                    </a>
                  </td>
                  <td className="p-3 max-w-md">
                    <a
                      href={`${base}/catalog/${item.slug}`}
                      className="font-sans font-bold text-sm text-[#0A0A0A] block group-hover:underline"
                    >
                      {title}
                    </a>
                    <div className="text-[11px] text-[#4A5056] mt-0.5">
                      {specs}
                    </div>
                  </td>
                  <td className="p-3 text-[#4A5056] whitespace-nowrap">
                    {subsystem}
                  </td>
                  <td className="p-3 font-bold text-[#0A0A0A] whitespace-nowrap">
                    {item.gost}
                  </td>
                  <td className="p-3 text-[#4A5056] whitespace-nowrap">
                    {item.tnved}
                  </td>
                  <td className="p-3 whitespace-nowrap">
                    <span className={`px-2 py-0.5 text-[10px] font-bold ${statusBadgeClass}`}>
                      {status}
                    </span>
                  </td>
                  <td className="p-3 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end space-x-2">
                      <a
                        href={`${base}/catalog/${item.slug}`}
                        className="border border-[#0A0A0A] px-2.5 py-1 text-[11px] hover:bg-[#0A0A0A] hover:text-white transition-colors"
                      >
                        {lang === 'uz' ? 'PASPORT ↗' : lang === 'en' ? 'DATASHEET ↗' : 'ПАСПОРТ ↗'}
                      </a>
                      <button
                        type="button"
                        onClick={() => handleOpenModal(item)}
                        className="border border-[#0A0A0A] bg-[#0A0A0A] text-white px-2.5 py-1 text-[11px] hover:bg-transparent hover:text-[#0A0A0A] transition-colors font-bold cursor-pointer"
                      >
                        {t.orderBtn}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
