import React, { useState, useMemo } from 'react';
import { HudSmartImage } from './HudSmartImage';
import { webpSrcSet, SIZES } from '../../utils/images';
import { withBase } from '../../utils/url';
import { useLang } from '../../utils/useLang';
import { stockLabel } from '../../utils/stock';
import { localeHref, makeT, pick, tField, type Lang } from '../../i18n';
import islandsUi from '../../data/cms/ui/islands.json';
import catalogUi from '../../data/cms/ui/catalog.json';

export interface CatalogItemAttribute {
  label: string;
  label_uz?: string;
  label_en?: string;
  value: string;
  value_uz?: string;
  value_en?: string;
}

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
  gost?: string;
  tnved?: string;
  status?: string;
  status_uz?: string;
  status_en?: string;
  statusKey?: 'in_stock' | 'reserved' | 'on_order';
  specs?: string;
  specs_uz?: string;
  specs_en?: string;
  image?: string;
  price?: string;
  attributes?: CatalogItemAttribute[];
}

interface Props {
  items: CatalogItemProps[];
  lang: Lang;
}

const t = makeT([islandsUi, catalogUi]);
export const CatalogFilterTable: React.FC<Props> = (props) => {
  const { items } = props;
  const lang = useLang(props.lang);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  const productHref = (item: CatalogItemProps) => localeHref(`/catalog/${item.slug}/`, lang);

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
    return pick(lang, catRu, sample.category_uz || sample.subsystem_uz, sample.category_en || sample.subsystem_en);
  };

  const getItemTitle = (item: CatalogItemProps): string => tField(item, 'title', lang);

  const getItemCategory = (item: CatalogItemProps): string =>
    pick(
      lang,
      item.category || item.subsystem || t(lang, 'islands.defaultCategory'),
      item.category_uz || item.subsystem_uz,
      item.category_en || item.subsystem_en,
    );

  const getItemSpecs = (item: CatalogItemProps): string => tField(item, 'specs', lang) || '';

  const getItemStatus = (item: CatalogItemProps): string => stockLabel(item, lang, t);

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
    // Subject in the visitor's language (the lead message also states the site language).
    const subject = t(lang, 'lead.subject.catalogTableItem', { title: tField(item, 'title', lang), sku: item.sku });

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
        {/* Horizontal Scrollable Category Chips */}
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
            {t(lang, 'catalogTable.allItems', { count: items.length })}
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
              placeholder={t(lang, 'catalogTable.searchPlaceholder')}
              className="w-full border border-[#0A0A0A] bg-white/60 px-3 py-2 font-mono text-xs placeholder:text-[#4A5056] focus:outline-none focus:bg-white"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2.5 text-xs text-[#0A0A0A] font-mono hover:font-bold cursor-pointer"
                aria-label={t(lang, 'catalogTable.clearSearchAria')}
              >
                <span aria-hidden="true">✕</span>
              </button>
            )}
          </div>

          {/* Results Counter and View Mode Toggle (Grid vs Table) */}
          <div className="flex items-center justify-between sm:justify-end gap-3 text-xs">
            <span className="text-[#4A5056]">
              {t(lang, 'catalogTable.found')}{' '}
              <b className="text-[#0A0A0A]">{filteredItems.length}</b>
            </span>

            {/* View Mode Toggle Switcher */}
            <div className="inline-flex border border-[#0A0A0A] bg-[#C8CDD2] p-0.5" role="group" aria-label={t(lang, 'catalogTable.viewSwitchAria')}>
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`px-2.5 py-1 text-xs font-mono font-bold transition-colors cursor-pointer flex items-center gap-1 ${
                  viewMode === 'grid'
                    ? 'bg-[#0A0A0A] text-white'
                    : 'text-[#0A0A0A] hover:bg-white/40'
                }`}
                title={t(lang, 'catalogTable.gridTitle')}
              >
                <span aria-hidden="true">⊞</span>
                <span>{t(lang, 'catalogTable.gridLabel')}</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`px-2.5 py-1 text-xs font-mono font-bold transition-colors cursor-pointer flex items-center gap-1 ${
                  viewMode === 'table'
                    ? 'bg-[#0A0A0A] text-white'
                    : 'text-[#0A0A0A] hover:bg-white/40'
                }`}
                title={t(lang, 'catalogTable.tableTitle')}
              >
                <span aria-hidden="true">≡</span>
                <span>{t(lang, 'catalogTable.tableLabel')}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 1. GRID OF CARDS VIEW */}
      {(viewMode === 'grid' || filteredItems.length === 0) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredItems.map((item) => {
            const title = getItemTitle(item);
            const category = getItemCategory(item);
            const status = getItemStatus(item);

            const statusClass =
              item.statusKey === 'in_stock'
                ? 'bg-emerald-100/70 text-emerald-900 border-emerald-600'
                : item.statusKey === 'reserved'
                ? 'bg-amber-100/70 text-amber-900 border-amber-600'
                : 'bg-zinc-200 text-zinc-900 border-zinc-600';

            const itemAttrs = item.attributes || [];

            return (
              <div
                key={item.sku}
                className="hud-glass-card p-5 flex flex-col justify-between gap-3 group relative hover:border-[#0A0A0A] transition-all"
              >
                {/* Target Corners for Reticle */}
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
                  <div className="hud-card-media aspect-[16/10] my-3 border border-[#0A0A0A]/15 overflow-hidden">
                    <HudSmartImage
                      src={item.image || withBase(`/images/catalog/${item.sku.toLowerCase()}.jpg`)}
                      alt={title}
                      sku={item.sku}
                      category={category}
                      lang={lang}
                      aspect="w-full h-full"
                      objectFit="cover"
                      loading="lazy"
                    />
                  </div>

                  {/* Title */}
                  <h3 className="font-sans font-bold text-base text-[#0A0A0A] leading-snug mb-1">
                    <a href={productHref(item)} className="hover:underline">
                      {title}
                    </a>
                  </h3>

                  {/* Category and Key Attributes */}
                  <div className="text-[11px] font-mono text-[#4A5056] space-y-1.5 mt-2">
                    <div className="flex justify-between items-center text-[10px] text-[#4A5056] border-b border-[#0A0A0A]/10 pb-1">
                      <span>{t(lang, 'catalogTable.categoryLabel')}</span>
                      <span className="font-bold text-[#0A0A0A] uppercase truncate max-w-[55%]">{category}</span>
                    </div>

                    {/* First 3 Dynamic Attributes */}
                    {itemAttrs.length > 0 ? (
                      itemAttrs.slice(0, 3).map((attr, i) => {
                        const lbl = tField(attr, 'label', lang);
                        const val = tField(attr, 'value', lang);
                        return (
                          <div key={i} className="flex justify-between text-[11px] gap-2">
                            <span className="text-[#4A5056] truncate max-w-[50%]">{lbl}:</span>
                            <span className="font-bold text-[#0A0A0A] text-right truncate max-w-[50%]">{val}</span>
                          </div>
                        );
                      })
                    ) : (
                      item.specs && (
                        <p className="line-clamp-2 text-xs text-[#4A5056] font-sans">
                          {getItemSpecs(item)}
                        </p>
                      )
                    )}

                    {/* Price if available */}
                    {item.price && (
                      <div className="flex justify-between text-xs pt-1 font-bold text-[#0A0A0A]">
                        <span>{t(lang, 'catalogTable.priceLabel')}</span>
                        <span>{item.price}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Bottom Action Buttons */}
                <div className="pt-3 border-t border-[#0A0A0A]/15 mt-auto flex items-center gap-2 font-mono text-xs">
                  <a
                    href={productHref(item)}
                    className="flex-1 min-h-[44px] border border-[#0A0A0A] flex items-center justify-center text-center hover:bg-[#0A0A0A] hover:text-white transition-colors font-bold"
                  >
                    {t(lang, 'catalogTable.details')}
                  </a>
                  <button
                    type="button"
                    onClick={() => handleOpenModal(item)}
                    className="flex-1 min-h-[44px] border border-[#0A0A0A] bg-[#0A0A0A] text-white flex items-center justify-center text-center font-bold hover:bg-transparent hover:text-[#0A0A0A] transition-colors cursor-pointer"
                  >
                    {t(lang, 'catalogTable.requestCard')}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 2. TABLE VIEW WITH 48x36px THUMBNAILS */}
      {viewMode === 'table' && filteredItems.length > 0 && (
        <div className="border border-[#0A0A0A] overflow-x-auto bg-[#D4D8DC] shadow-sm">
          <table className="w-full text-left font-mono text-xs border-collapse min-w-[720px]">
            <thead>
              <tr className="border-b border-[#0A0A0A] bg-[#0A0A0A] text-white">
                <th className="p-2.5 font-semibold w-16">
                  {t(lang, 'catalogTable.th.photo')}
                </th>
                <th className="p-2.5 font-semibold">{t(lang, 'catalogTable.th.sku')}</th>
                <th className="p-2.5 font-semibold">
                  {t(lang, 'catalogTable.th.title')}
                </th>
                <th className="p-2.5 font-semibold">
                  {t(lang, 'catalogTable.th.category')}
                </th>
                <th className="p-2.5 font-semibold">
                  {t(lang, 'catalogTable.th.status')}
                </th>
                <th className="p-2.5 font-semibold text-right">
                  {t(lang, 'catalogTable.th.action')}
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
                    {/* 48x36px Photo Thumbnail */}
                    <td className="p-2.5">
                      <a href={productHref(item)} className="block w-[48px] h-[36px] border border-[#0A0A0A]/30 overflow-hidden bg-[#C8CDD2]">
                        <img
                          src={item.image || withBase(`/images/catalog/${item.sku.toLowerCase()}.jpg`)}
                          srcSet={webpSrcSet(item.image || `/images/catalog/${item.sku.toLowerCase()}.jpg`)}
                          sizes={SIZES.thumb}
                          alt={title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-200"
                          loading="lazy"
                          decoding="async"
                          onError={(e) => {
                            const t = e.currentTarget;
                            t.removeAttribute('srcset');
                            t.src = withBase('/images/hero/warehouse.jpg');
                          }}
                        />
                      </a>
                    </td>
                    <td className="p-2.5 font-bold text-[#0A0A0A] whitespace-nowrap">
                      <a href={productHref(item)} className="underline group-hover:no-underline">
                        {item.sku}
                      </a>
                    </td>
                    <td className="p-2.5 max-w-sm">
                      <a
                        href={productHref(item)}
                        className="font-sans font-bold text-xs text-[#0A0A0A] block group-hover:underline line-clamp-1"
                      >
                        {title}
                      </a>
                      {specs && <div className="text-[11px] text-[#4A5056] truncate mt-0.5">{specs}</div>}
                    </td>
                    <td className="p-2.5 text-[#4A5056] whitespace-nowrap">{category}</td>
                    <td className="p-2.5 whitespace-nowrap">
                      <span className={`px-2 py-0.5 text-[10px] font-bold ${statusClass}`}>
                        {status}
                      </span>
                    </td>
                    <td className="p-2.5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end space-x-2">
                        <a
                          href={productHref(item)}
                          className="border border-[#0A0A0A] px-2 py-1 text-[11px] hover:bg-[#0A0A0A] hover:text-white transition-colors"
                        >
                          {t(lang, 'catalogTable.details')}
                        </a>
                        <button
                          type="button"
                          onClick={() => handleOpenModal(item)}
                          className="border border-[#0A0A0A] bg-[#0A0A0A] text-white px-2.5 py-1 text-[11px] hover:bg-transparent hover:text-[#0A0A0A] transition-colors font-bold cursor-pointer"
                        >
                          {t(lang, 'catalogTable.requestRow')}
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
            {t(lang, 'catalogTable.emptyTitle')}
          </div>
          <p className="text-[#4A5056] max-w-md mx-auto">
            {t(lang, 'catalogTable.emptyText')}
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('ALL');
            }}
            className="hud-btn mt-3 text-xs"
          >
            {t(lang, 'catalogTable.reset')}
          </button>
        </div>
      )}
    </div>
  );
};

export default CatalogFilterTable;
