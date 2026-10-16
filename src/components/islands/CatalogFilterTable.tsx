import React, { useState, useMemo, useEffect } from 'react';
import type { Lang } from '../../i18n/ui';
import { HudSmartImage } from './HudSmartImage';

export interface CatalogItemProps {
  slug: string;
  sku: string;
  title: string;
  title_uz?: string;
  title_en?: string;
  category?: string;
  category_uz?: string;
  category_en?: string;
  subsystem?: string;
  subsystem_uz?: string;
  subsystem_en?: string;
  warehouse?: string;
  status?: 'В наличии' | 'Резерв' | 'Под заказ' | string;
  status_uz?: string;
  status_en?: string;
  statusKey?: 'in_stock' | 'reserved' | 'on_order';
  specs?: string;
  specs_uz?: string;
  specs_en?: string;
  image?: string;
}

interface Props {
  items: CatalogItemProps[];
}

export const CatalogFilterTable: React.FC<Props> = ({ items }) => {
  const [lang, setLang] = useState<Lang>('ru');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  useEffect(() => {
    const cur =
      (document.documentElement.lang as Lang) ||
      ((typeof localStorage !== 'undefined' ? localStorage.getItem('rt_lang') : null) as Lang) ||
      'ru';
    if (cur === 'ru' || cur === 'uz' || cur === 'en') {
      setLang(cur);
    }

    const handleLang = (e: Event) => {
      const customEvent = e as CustomEvent<Lang>;
      if (
        customEvent.detail &&
        (customEvent.detail === 'ru' || customEvent.detail === 'uz' || customEvent.detail === 'en')
      ) {
        setLang(customEvent.detail);
      }
    };

    window.addEventListener('rt-lang-change', handleLang);
    return () => window.removeEventListener('rt-lang-change', handleLang);
  }, []);

  const base =
    typeof window !== 'undefined' && window.location.pathname.startsWith('/rt-corporate-website')
      ? '/rt-corporate-website'
      : (import.meta.env.BASE_URL?.replace(/\/$/, '') || '');

  // Extract unique categories (RU key is unique identifier)
  const categories = useMemo(() => {
    const set = new Set<string>();
    items.forEach((item) => {
      const cat = item.category || item.subsystem;
      if (cat) set.add(cat);
    });
    return Array.from(set);
  }, [items]);

  const getCategoryLabel = (catRu: string) => {
    const sample = items.find((it) => (it.category || it.subsystem) === catRu);
    if (!sample) return catRu;
    if (lang === 'uz' && (sample.category_uz || sample.subsystem_uz)) {
      return sample.category_uz || sample.subsystem_uz || catRu;
    }
    if (lang === 'en' && (sample.category_en || sample.subsystem_en)) {
      return sample.category_en || sample.subsystem_en || catRu;
    }
    return catRu;
  };

  const getItemTitle = (item: CatalogItemProps) => {
    if (lang === 'uz' && item.title_uz) return item.title_uz;
    if (lang === 'en' && item.title_en) return item.title_en;
    return item.title;
  };

  const getItemCategory = (item: CatalogItemProps) => {
    const cat = item.category || item.subsystem || 'Оборудование';
    if (lang === 'uz') return item.category_uz || item.subsystem_uz || cat;
    if (lang === 'en') return item.category_en || item.subsystem_en || cat;
    return cat;
  };

  const getItemSpecs = (item: CatalogItemProps) => {
    if (lang === 'uz' && item.specs_uz) return item.specs_uz;
    if (lang === 'en' && item.specs_en) return item.specs_en;
    return item.specs || '';
  };

  const getItemStatus = (item: CatalogItemProps) => {
    if (lang === 'uz') {
      if (item.status_uz) return item.status_uz;
      return item.statusKey === 'in_stock'
        ? 'Mavjud'
        : item.statusKey === 'reserved'
        ? 'Zaxirada'
        : 'Buyurtma asosida';
    }
    if (lang === 'en') {
      if (item.status_en) return item.status_en;
      return item.statusKey === 'in_stock'
        ? 'In Stock'
        : item.statusKey === 'reserved'
        ? 'Reserved'
        : 'On Order';
    }
    return item.status || 'В наличии';
  };

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const itemCat = item.category || item.subsystem || '';
      const matchCat = selectedCategory === 'ALL' || itemCat === selectedCategory;
      const query = searchQuery.trim().toLowerCase();
      const matchQuery =
        !query ||
        item.title.toLowerCase().includes(query) ||
        (item.title_uz && item.title_uz.toLowerCase().includes(query)) ||
        (item.title_en && item.title_en.toLowerCase().includes(query)) ||
        item.sku.toLowerCase().includes(query) ||
        (item.specs && item.specs.toLowerCase().includes(query)) ||
        (item.specs_uz && item.specs_uz.toLowerCase().includes(query)) ||
        (item.specs_en && item.specs_en.toLowerCase().includes(query));
      return matchCat && matchQuery;
    });
  }, [items, selectedCategory, searchQuery]);

  const handleOpenModal = (item: CatalogItemProps) => {
    const title = getItemTitle(item);
    const subject =
      lang === 'uz'
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
      {/* Controls Bar: Horizontal Category Chips + Search + View Mode Switcher */}
      <div className="hud-glass-card p-4 flex flex-col gap-4">
        {/* Horizontal Scrollable Category Chips on Mobile & Wrap on Desktop */}
        <div className="flex items-center overflow-x-auto no-scrollbar gap-2 pb-1 font-mono text-xs">
          <button
            type="button"
            onClick={() => setSelectedCategory('ALL')}
            className={`flex-none px-3 py-1.5 border border-[#0A0A0A] font-bold transition-colors cursor-pointer ${
              selectedCategory === 'ALL'
                ? 'bg-[#0A0A0A] text-white'
                : 'bg-white/40 text-[#0A0A0A] hover:bg-[#0A0A0A] hover:text-white'
            }`}
          >
            {lang === 'uz' ? 'Barcha tovarlar' : lang === 'en' ? 'All items' : 'Все позиции'} ({items.length})
          </button>
          {categories.map((catRu) => {
            const count = items.filter((it) => (it.category || it.subsystem) === catRu).length;
            const isSelected = selectedCategory === catRu;
            const label = getCategoryLabel(catRu);
            return (
              <button
                key={catRu}
                type="button"
                onClick={() => setSelectedCategory(catRu)}
                className={`flex-none px-3 py-1.5 border border-[#0A0A0A] transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-[#0A0A0A] text-white font-bold'
                    : 'bg-white/40 text-[#0A0A0A] hover:bg-[#0A0A0A] hover:text-white'
                }`}
              >
                {label} ({count})
              </button>
            );
          })}
        </div>

        {/* Search Input and View Mode Switcher */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2 border-t border-[#0A0A0A]/15 font-mono text-xs">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                lang === 'uz'
                  ? 'Nom, SKU yoki parametrlar bo‘yicha qidiruv...'
                  : lang === 'en'
                  ? 'Search by title, SKU or specification...'
                  : 'Поиск по наименованию, артикулу или параметрам...'
              }
              className="w-full border border-[#0A0A0A] bg-white/60 px-3 py-2 font-mono text-xs placeholder:text-[#4A5056] focus:outline-none focus:bg-white"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2.5 text-xs text-[#0A0A0A] font-mono hover:font-bold cursor-pointer"
                aria-label="Очистить поиск"
              >
                ✕
              </button>
            )}
          </div>

          {/* Results Counter and View Mode Toggle */}
          <div className="flex items-center justify-between sm:justify-end gap-3 text-xs">
            <span className="text-[#4A5056]">
              {lang === 'uz' ? 'Topildi:' : lang === 'en' ? 'Found:' : 'Найдено:'}{' '}
              <b className="text-[#0A0A0A]">{filteredItems.length}</b>
            </span>

            {/* Desktop View Toggle */}
            <div className="hidden md:inline-flex border border-[#0A0A0A] bg-[#C8CDD2] p-0.5" role="group">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`px-2.5 py-1 text-xs font-bold transition-colors cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-[#0A0A0A] text-white'
                    : 'text-[#0A0A0A] hover:bg-white/40'
                }`}
                title="Сетка карточек"
              >
                ⊞ СЕТКА
              </button>
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`px-2.5 py-1 text-xs font-bold transition-colors cursor-pointer ${
                  viewMode === 'table'
                    ? 'bg-[#0A0A0A] text-white'
                    : 'text-[#0A0A0A] hover:bg-white/40'
                }`}
                title="Таблица"
              >
                ☰ ТАБЛИЦА
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 1. GRID OF CARDS VIEW (Standard & Mobile Responsive) */}
      {(viewMode === 'grid' || filteredItems.length === 0) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => {
            const title = getItemTitle(item);
            const category = getItemCategory(item);
            const specs = getItemSpecs(item);
            const status = getItemStatus(item);

            const statusClass =
              item.statusKey === 'in_stock'
                ? 'bg-emerald-100/70 text-emerald-900 border-emerald-600'
                : item.statusKey === 'reserved'
                ? 'bg-amber-100/70 text-amber-900 border-amber-600'
                : 'bg-zinc-200 text-zinc-900 border-zinc-600';

            return (
              <div
                key={item.sku}
                className="hud-glass-card p-5 flex flex-col justify-between gap-3 group relative"
              >
                {/* Target Corners for Hover Reticle */}
                <span className="hud-target-corner hud-tc-tl" aria-hidden="true">┌</span>
                <span className="hud-target-corner hud-tc-tr" aria-hidden="true">┐</span>
                <span className="hud-target-corner hud-tc-bl" aria-hidden="true">└</span>
                <span className="hud-target-corner hud-tc-br" aria-hidden="true">┘</span>

                <div>
                  {/* Top Header: SKU and Status Badge */}
                  <div className="flex items-center justify-between border-b border-[#0A0A0A]/15 pb-2 font-mono text-xs">
                    <span className="font-bold text-[#0A0A0A]">{item.sku}</span>
                    <span className={`px-2 py-0.5 text-[10px] font-bold border ${statusClass}`}>
                      {status}
                    </span>
                  </div>

                  {/* Photo with Smart Fallback */}
                  <div className="hud-card-media aspect-[16/10] my-3">
                    <HudSmartImage
                      src={item.image}
                      alt={title}
                      sku={item.sku}
                      category={category}
                      aspect="w-full h-full"
                    />
                  </div>

                  {/* Title */}
                  <h3 className="font-sans font-bold text-base text-[#0A0A0A] leading-snug mb-1">
                    <a href={`${base}/catalog/${item.slug}`} className="hover:underline">
                      {title}
                    </a>
                  </h3>

                  {/* Category and Specs */}
                  <div className="text-[11px] font-mono text-[#4A5056] space-y-1 mt-2">
                    <div className="truncate">
                      <span className="text-[#0A0A0A]/60">
                        {lang === 'uz' ? 'Kategoriya:' : lang === 'en' ? 'Category:' : 'Категория:'}{' '}
                      </span>
                      <span className="text-[#0A0A0A] font-semibold">{category}</span>
                    </div>
                    {specs && (
                      <p className="line-clamp-2 text-xs text-[#4A5056] font-sans">
                        {specs}
                      </p>
                    )}
                  </div>
                </div>

                {/* Bottom Action Buttons (min-h-[44px] for touch ergonomics) */}
                <div className="pt-3 border-t border-[#0A0A0A]/15 mt-auto flex items-center gap-2 font-mono text-xs">
                  <a
                    href={`${base}/catalog/${item.slug}`}
                    className="flex-1 min-h-[44px] border border-[#0A0A0A] flex items-center justify-center text-center hover:bg-[#0A0A0A] hover:text-white transition-colors"
                  >
                    {lang === 'uz' ? 'PASPORT ↗' : lang === 'en' ? 'DATASHEET ↗' : 'ПАСПОРТ ↗'}
                  </a>
                  <button
                    type="button"
                    onClick={() => handleOpenModal(item)}
                    className="flex-1 min-h-[44px] border border-[#0A0A0A] bg-[#0A0A0A] text-white flex items-center justify-center text-center font-bold hover:bg-transparent hover:text-[#0A0A0A] transition-colors cursor-pointer"
                  >
                    {lang === 'uz' ? 'BUYURTMA' : lang === 'en' ? 'RFQ' : 'ЗАПРОС КП'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 2. TABLE VIEW (Desktop only — mobile automatically falls back to clean card list) */}
      {viewMode === 'table' && filteredItems.length > 0 && (
        <div className="hidden md:block border border-[#0A0A0A] overflow-x-auto bg-[#D4D8DC]">
          <table className="w-full text-left font-mono text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#0A0A0A] bg-[#0A0A0A] text-white">
                <th className="p-3 font-semibold">SKU</th>
                <th className="p-3 font-semibold">
                  {lang === 'uz' ? 'Nomi va parametrlari' : lang === 'en' ? 'Product & Specs' : 'Наименование и параметры'}
                </th>
                <th className="p-3 font-semibold">
                  {lang === 'uz' ? 'Kategoriya' : lang === 'en' ? 'Category' : 'Категория'}
                </th>
                <th className="p-3 font-semibold">
                  {lang === 'uz' ? 'Holat' : lang === 'en' ? 'Status' : 'Статус'}
                </th>
                <th className="p-3 font-semibold text-right">
                  {lang === 'uz' ? 'Harakat' : lang === 'en' ? 'Action' : 'Действие'}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#0A0A0A]/20">
              {filteredItems.map((item) => {
                const title = getItemTitle(item);
                const category = getItemCategory(item);
                const specs = getItemSpecs(item);
                const status = getItemStatus(item);

                const statusClass =
                  item.statusKey === 'in_stock'
                    ? 'bg-emerald-100 text-emerald-900 border border-emerald-500'
                    : item.statusKey === 'reserved'
                    ? 'bg-amber-100 text-amber-900 border border-amber-500'
                    : 'bg-zinc-200 text-zinc-900 border border-zinc-500';

                return (
                  <tr key={item.sku} className="hover:bg-white/40 transition-colors group">
                    <td className="p-3 font-bold text-[#0A0A0A] whitespace-nowrap">
                      <a href={`${base}/catalog/${item.slug}`} className="underline group-hover:no-underline">
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
                      {specs && <div className="text-[11px] text-[#4A5056] mt-0.5">{specs}</div>}
                    </td>
                    <td className="p-3 text-[#4A5056] whitespace-nowrap">{category}</td>
                    <td className="p-3 whitespace-nowrap">
                      <span className={`px-2 py-0.5 text-[10px] font-bold ${statusClass}`}>
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
                          {lang === 'uz' ? 'BUYURTMA' : lang === 'en' ? 'RFQ' : 'ЗАПРОС КП'}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Zero Results State */}
      {filteredItems.length === 0 && (
        <div className="hud-glass-card p-8 text-center font-mono text-xs space-y-2">
          <div className="text-base font-bold text-[#0A0A0A]">
            {lang === 'uz' ? 'Hech narsa topilmadi' : lang === 'en' ? 'No items found' : 'Позиции не найдены'}
          </div>
          <p className="text-[#4A5056] max-w-md mx-auto">
            {lang === 'uz'
              ? 'Qidiruv so‘zini o‘zgartirib ko‘ring yoki barcha tovarlar filtrini tanlang.'
              : lang === 'en'
              ? 'Try modifying your search query or reset the category filter.'
              : 'Попробуйте изменить поисковый запрос или сбросить фильтр категорий.'}
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('ALL');
            }}
            className="hud-btn mt-3 text-xs"
          >
            {lang === 'uz' ? 'Filtrni tozalash' : lang === 'en' ? 'Reset filters' : 'Сбросить фильтры'}
          </button>
        </div>
      )}
    </div>
  );
};

export default CatalogFilterTable;
