import React, { useState, useMemo } from 'react';

export interface CatalogItemProps {
  slug: string;
  sku: string;
  title: string;
  subsystem: string;
  gost: string;
  tnved: string;
  warehouse: string;
  status: 'В наличии' | 'Резерв' | 'Под заказ';
  statusKey: 'in_stock' | 'reserved' | 'on_order';
  specs: string;
}

interface Props {
  items: CatalogItemProps[];
}

export const CatalogFilterTable: React.FC<Props> = ({ items }) => {
  const [selectedSubsystem, setSelectedSubsystem] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const subsystems = useMemo(() => {
    const set = new Set<string>();
    items.forEach((item) => {
      if (item.subsystem) set.add(item.subsystem);
    });
    return Array.from(set);
  }, [items]);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchCat =
        selectedSubsystem === 'ALL' || item.subsystem === selectedSubsystem;
      const query = searchQuery.trim().toLowerCase();
      const matchQuery =
        !query ||
        item.title.toLowerCase().includes(query) ||
        item.sku.toLowerCase().includes(query) ||
        item.gost.toLowerCase().includes(query) ||
        item.tnved.toLowerCase().includes(query) ||
        item.specs.toLowerCase().includes(query);
      return matchCat && matchQuery;
    });
  }, [items, selectedSubsystem, searchQuery]);

  const handleOpenModal = (itemTitle: string, itemSku: string) => {
    window.dispatchEvent(
      new CustomEvent('open-lead-modal', {
        detail: {
          subject: `Запрос счета/КП на позицию: ${itemTitle} (${itemSku})`,
        },
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
            className={`px-3 py-1.5 border border-[#0A0A0A] font-bold transition-colors ${
              selectedSubsystem === 'ALL'
                ? 'bg-[#0A0A0A] text-white'
                : 'bg-[#D4D8DC] text-[#0A0A0A] hover:bg-[#0A0A0A] hover:text-white'
            }`}
          >
            ВСЕ СИСТЕМЫ ({items.length})
          </button>
          {subsystems.map((sub) => {
            const count = items.filter((it) => it.subsystem === sub).length;
            const isSelected = selectedSubsystem === sub;
            return (
              <button
                key={sub}
                type="button"
                onClick={() => setSelectedSubsystem(sub)}
                className={`px-3 py-1.5 border border-[#0A0A0A] transition-colors ${
                  isSelected
                    ? 'bg-[#0A0A0A] text-white font-bold'
                    : 'bg-[#D4D8DC] text-[#0A0A0A] hover:bg-[#0A0A0A] hover:text-white'
                }`}
              >
                {sub} ({count})
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
            placeholder="Поиск по ГОСТ, ТН ВЭД, артикулу..."
            className="w-full border border-[#0A0A0A] bg-[#D4D8DC] px-3 py-1.5 font-mono text-xs placeholder:text-[#4A5056] focus:outline-none focus:bg-white"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2 top-1.5 text-xs text-[#0A0A0A] font-mono hover:font-bold"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Results Telemetry */}
      <div className="flex items-center justify-between font-mono text-xs text-[#4A5056] px-1">
        <div>
          НАЙДЕНО ПОЗИЦИЙ: <span className="text-[#0A0A0A] font-bold">{filteredItems.length}</span>
        </div>
        <div>
          СКЛАД ОТГРУЗКИ: <span className="text-[#0A0A0A] font-bold">ТАШКЕНТ / ТПК INDEX B2-2097</span>
        </div>
      </div>

      {/* Data Table */}
      <div className="border border-[#0A0A0A] overflow-x-auto bg-[#D4D8DC]">
        <table className="w-full text-left font-mono text-xs border-collapse">
          <thead>
            <tr className="border-b border-[#0A0A0A] bg-[#0A0A0A] text-white">
              <th className="p-3 font-semibold">АРТИКУЛ (SKU)</th>
              <th className="p-3 font-semibold">НАИМЕНОВАНИЕ И ТЕХ. ХАРАКТЕРИСТИКИ</th>
              <th className="p-3 font-semibold">СИСТЕМА</th>
              <th className="p-3 font-semibold">ГОСТ / СТАНДАРТ</th>
              <th className="p-3 font-semibold">ТН ВЭД</th>
              <th className="p-3 font-semibold">СТАТУС СКЛАДА</th>
              <th className="p-3 font-semibold text-right">ДЕЙСТВИЕ</th>
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

              return (
                <tr
                  key={item.sku}
                  className="hover:bg-[#C8CDD2]/60 transition-colors group"
                >
                  <td className="p-3 font-bold text-[#0A0A0A] whitespace-nowrap">
                    <a
                      href={`/catalog/${item.slug}`}
                      className="underline group-hover:no-underline"
                    >
                      {item.sku}
                    </a>
                  </td>
                  <td className="p-3 max-w-md">
                    <a
                      href={`/catalog/${item.slug}`}
                      className="font-sans font-bold text-sm text-[#0A0A0A] block group-hover:underline"
                    >
                      {item.title}
                    </a>
                    <div className="text-[11px] text-[#4A5056] mt-0.5">
                      {item.specs}
                    </div>
                  </td>
                  <td className="p-3 text-[#4A5056] whitespace-nowrap">
                    {item.subsystem}
                  </td>
                  <td className="p-3 font-bold text-[#0A0A0A] whitespace-nowrap">
                    {item.gost}
                  </td>
                  <td className="p-3 text-[#4A5056] whitespace-nowrap">
                    {item.tnved}
                  </td>
                  <td className="p-3 whitespace-nowrap">
                    <span className={`px-2 py-0.5 text-[10px] font-bold ${statusBadgeClass}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="p-3 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end space-x-2">
                      <a
                        href={`/catalog/${item.slug}`}
                        className="border border-[#0A0A0A] px-2.5 py-1 text-[11px] hover:bg-[#0A0A0A] hover:text-white transition-colors"
                      >
                        ПАСПОРТ ↗
                      </a>
                      <button
                        type="button"
                        onClick={() => handleOpenModal(item.title, item.sku)}
                        className="border border-[#0A0A0A] bg-[#0A0A0A] text-white px-3 py-1 text-[11px] font-bold hover:bg-transparent hover:text-[#0A0A0A] transition-colors"
                      >
                        ЗАПРОС КП
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {filteredItems.length === 0 && (
              <tr>
                <td colSpan={7} className="p-8 text-center text-[#4A5056]">
                  По запросу «{searchQuery}» позиций не найдено.
                  <div className="mt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedSubsystem('ALL');
                      }}
                      className="border border-[#0A0A0A] px-3 py-1 font-bold text-[#0A0A0A] hover:bg-[#0A0A0A] hover:text-white transition-colors"
                    >
                      Сбросить фильтры
                    </button>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
