import React, { useState, useEffect } from 'react';
import type { Lang } from '../../i18n/ui';
import { UI_DICTIONARY } from '../../i18n/ui';

export const LandedCostCalculator: React.FC = () => {
  const [lang, setLang] = useState<Lang>('ru');
  const [invoiceUsd, setInvoiceUsd] = useState<number>(45000);
  const [freightPercent, setFreightPercent] = useState<number>(8.5);
  const [dutyRate, setDutyRate] = useState<number>(5);
  const [vatEnabled, setVatEnabled] = useState<boolean>(true);
  const exchangeRate = 12850; // UZS / USD

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

  const t = UI_DICTIONARY[lang]?.calculator || UI_DICTIONARY.ru.calculator;

  const freightAmount = Math.round(invoiceUsd * (freightPercent / 100));
  const customsBase = invoiceUsd + freightAmount;
  const dutyAmount = Math.round(customsBase * (dutyRate / 100));
  const vatBase = customsBase + dutyAmount;
  const vatAmount = vatEnabled ? Math.round(vatBase * 0.12) : 0;
  const totalDdpUsd = customsBase + dutyAmount + vatAmount;
  const totalDdpUzs = totalDdpUsd * exchangeRate;

  const handleApplyCalculation = () => {
    const subject = lang === 'uz'
      ? `DDP Toshkent TIF shartnomasi so'rovi (Invoys: $${invoiceUsd.toLocaleString()}, Boj: ${dutyRate}%, DDP: $${totalDdpUsd.toLocaleString()} / ${(totalDdpUzs / 1e6).toFixed(1)} mln UZS)`
      : lang === 'en'
      ? `Contract Import DDP Tashkent Inquiry (Invoice: $${invoiceUsd.toLocaleString()}, Duty: ${dutyRate}%, DDP Total: $${totalDdpUsd.toLocaleString()} / ${(totalDdpUzs / 1e6).toFixed(1)}M UZS)`
      : `Запрос контракта ВЭД DDP Ташкент (Инвойс: $${invoiceUsd.toLocaleString()}, Пошлина: ${dutyRate}%, Расчет DDP: $${totalDdpUsd.toLocaleString()} / ${(totalDdpUzs / 1e6).toFixed(1)} млн UZS)`;
    window.dispatchEvent(
      new CustomEvent('open-lead-modal', {
        detail: { subject },
      })
    );
  };

  return (
    <div className="border-2 border-[#0A0A0A] bg-[#D4D8DC] p-6 font-mono">
      <div className="flex items-center justify-between border-b border-[#0A0A0A] pb-3 mb-6">
        <div>
          <span className="bg-[#0A0A0A] text-white px-2 py-0.5 text-xs font-bold mr-2">
            {t.badge}
          </span>
          <span className="font-bold text-sm text-[#0A0A0A]">
            {t.title}
          </span>
        </div>
        <div className="text-xs text-[#4A5056]">
          {t.cbRate}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Inputs */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#0A0A0A] mb-1">
              {t.invoiceLabel}
            </label>
            <div className="relative">
              <input
                type="number"
                min={1000}
                max={5000000}
                step={1000}
                value={invoiceUsd}
                onChange={(e) => setInvoiceUsd(Number(e.target.value) || 0)}
                className="w-full border border-[#0A0A0A] bg-white p-2 text-sm font-bold focus:outline-none"
              />
              <span className="absolute right-3 top-2 text-xs text-[#4A5056] font-bold">USD</span>
            </div>
            <div className="flex gap-2 mt-1.5 text-[11px]">
              {[15000, 45000, 120000, 350000].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setInvoiceUsd(preset)}
                  className="border border-[#0A0A0A]/40 px-1.5 py-0.5 bg-[#C8CDD2] hover:bg-[#0A0A0A] hover:text-white transition-colors cursor-pointer"
                >
                  ${preset.toLocaleString()}
                </button>
              ))}
            </div>
            <p className="text-[10px] text-[#4A5056] mt-1">{t.invoiceHint}</p>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#0A0A0A] mb-1">
              {t.freightLabel} {freightPercent}%
            </label>
            <input
              type="range"
              min={3}
              max={18}
              step={0.5}
              value={freightPercent}
              onChange={(e) => setFreightPercent(Number(e.target.value))}
              className="w-full accent-[#0A0A0A]"
            />
            <div className="flex justify-between text-[11px] text-[#4A5056] mt-0.5">
              <span>{lang === 'uz' ? 'Yaqin import (3%)' : lang === 'en' ? 'Near-transit (3%)' : 'Ближний импорт (3%)'}</span>
              <span className="font-bold text-[#0A0A0A]">${freightAmount.toLocaleString()}</span>
              <span>{lang === 'uz' ? 'Multimodal (18%)' : lang === 'en' ? 'Multimodal (18%)' : 'Мультимодальный (18%)'}</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#0A0A0A] mb-1">
              {t.dutyLabel}
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[0, 2, 5, 10].map((rate) => (
                <button
                  key={rate}
                  type="button"
                  onClick={() => setDutyRate(rate)}
                  className={`border border-[#0A0A0A] py-1.5 text-xs font-bold transition-colors cursor-pointer ${
                    dutyRate === rate
                      ? 'bg-[#0A0A0A] text-white'
                      : 'bg-white text-[#0A0A0A] hover:bg-[#0A0A0A]/10'
                  }`}
                >
                  {rate}% {rate === 0 ? (lang === 'uz' ? '(Imtiyoz)' : lang === 'en' ? '(Zero-duty)' : '(Льгота)') : ''}
                </button>
              ))}
            </div>
            <p className="text-[10px] text-[#4A5056] mt-1">{t.dutyHint}</p>
          </div>

          <div className="pt-2">
            <label className="flex items-center space-x-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={vatEnabled}
                onChange={(e) => setVatEnabled(e.target.checked)}
                className="w-4 h-4 accent-[#0A0A0A]"
              />
              <span className="text-xs font-bold text-[#0A0A0A]">
                {t.vatLabel}
              </span>
            </label>
            <p className="text-[11px] text-[#4A5056] mt-1 ml-6">
              {t.vatHint}
            </p>
          </div>
        </div>

        {/* Right Output Summary */}
        <div className="border border-[#0A0A0A] bg-[#C8CDD2] p-5 flex flex-col justify-between">
          <div>
            <div className="text-xs font-bold border-b border-[#0A0A0A] pb-2 mb-3 text-[#0A0A0A]">
              {t.breakdownTitle}
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-[#4A5056]">{t.baseInvoice}</span>
                <span className="font-bold text-[#0A0A0A]">${invoiceUsd.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#4A5056]">{t.freightCost}</span>
                <span className="font-bold text-[#0A0A0A]">${freightAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#4A5056]">{t.importDuty} ({dutyRate}%):</span>
                <span className="font-bold text-[#0A0A0A]">${dutyAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#4A5056]">{t.vatAmount}</span>
                <span className="font-bold text-[#0A0A0A]">${vatAmount.toLocaleString()}</span>
              </div>
              <div className="border-t-2 border-[#0A0A0A] pt-3 mt-3">
                <div className="text-[11px] text-[#4A5056] font-sans uppercase">
                  {t.totalDdpUsd}
                </div>
                <div className="text-2xl font-bold text-[#0A0A0A] tracking-tight">
                  ${totalDdpUsd.toLocaleString()} USD
                </div>
                <div className="text-sm font-bold text-[#4A5056] mt-0.5">
                  ≈ {(totalDdpUzs).toLocaleString()} UZS
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[#0A0A0A]/20">
            <button
              type="button"
              onClick={handleApplyCalculation}
              className="w-full border border-[#0A0A0A] bg-[#0A0A0A] text-white py-3 text-xs font-bold tracking-wider hover:bg-transparent hover:text-[#0A0A0A] transition-colors cursor-pointer"
            >
              {t.actionBtn}
            </button>
            <p className="text-[10px] text-center text-[#4A5056] mt-2">
              {t.fixedPriceNote}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
