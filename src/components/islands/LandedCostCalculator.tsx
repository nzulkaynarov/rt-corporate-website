import React, { useState } from 'react';

export const LandedCostCalculator: React.FC = () => {
  const [invoiceUsd, setInvoiceUsd] = useState<number>(45000);
  const [freightPercent, setFreightPercent] = useState<number>(8.5);
  const [dutyRate, setDutyRate] = useState<number>(5);
  const [vatEnabled, setVatEnabled] = useState<boolean>(true);
  const exchangeRate = 12850; // UZS / USD

  const freightAmount = Math.round(invoiceUsd * (freightPercent / 100));
  const customsBase = invoiceUsd + freightAmount;
  const dutyAmount = Math.round(customsBase * (dutyRate / 100));
  const vatBase = customsBase + dutyAmount;
  const vatAmount = vatEnabled ? Math.round(vatBase * 0.12) : 0;
  const totalDdpUsd = customsBase + dutyAmount + vatAmount;
  const totalDdpUzs = totalDdpUsd * exchangeRate;

  const handleApplyCalculation = () => {
    const subject = `Запрос контракта ВЭД DDP Ташкент (Инвойс: $${invoiceUsd.toLocaleString()}, Пошлина: ${dutyRate}%, Расчет DDP: $${totalDdpUsd.toLocaleString()} / ${(totalDdpUzs / 1e6).toFixed(1)} млн UZS)`;
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
            CALC.DDP-UZ
          </span>
          <span className="font-bold text-sm text-[#0A0A0A]">
            КАЛЬКУЛЯТОР LANDED COST DDP ТАШКЕНТ
          </span>
        </div>
        <div className="text-xs text-[#4A5056]">
          КУРС ЦБ РУЗ: <span className="text-[#0A0A0A] font-bold">1 USD = 12 850 UZS</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Inputs */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#0A0A0A] mb-1">
              [1] СТОИМОСТЬ ОБОРУДОВАНИЯ ПО ИНВОЙСУ ЗАВОДА (USD, FOB/FCA)
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
                  className="border border-[#0A0A0A]/40 px-1.5 py-0.5 bg-[#C8CDD2] hover:bg-[#0A0A0A] hover:text-white transition-colors"
                >
                  ${preset.toLocaleString()}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#0A0A0A] mb-1">
              [2] Ж/Д ЛОГИСТИКА, СТРАХОВАНИЕ И ПЕРЕВАЛКА ({freightPercent}%)
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
              <span>Ближний импорт (3%)</span>
              <span className="font-bold text-[#0A0A0A]">${freightAmount.toLocaleString()}</span>
              <span>Мультимодальный (18%)</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#0A0A0A] mb-1">
              [3] СТАВКА ИМПОРТНОЙ ПОШЛИНЫ РУЗ ПО ТН ВЭД
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[0, 2, 5, 10].map((rate) => (
                <button
                  key={rate}
                  type="button"
                  onClick={() => setDutyRate(rate)}
                  className={`border border-[#0A0A0A] py-1.5 text-xs font-bold transition-colors ${
                    dutyRate === rate
                      ? 'bg-[#0A0A0A] text-white'
                      : 'bg-white text-[#0A0A0A] hover:bg-[#0A0A0A]/10'
                  }`}
                >
                  {rate}% {rate === 0 ? '(Льгота)' : ''}
                </button>
              ))}
            </div>
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
                ВКЛЮЧИТЬ НДС РЕСПУБЛИКИ УЗБЕКИСТАН (12%)
              </span>
            </label>
            <p className="text-[11px] text-[#4A5056] mt-1 ml-6">
              ООО «RailTech» выставляет электронный счет-фактуру (ЭСФ) с выделенным НДС 12%, подлежащим 100% зачету заказчиком.
            </p>
          </div>
        </div>

        {/* Right Output Summary */}
        <div className="border border-[#0A0A0A] bg-[#C8CDD2] p-5 flex flex-col justify-between">
          <div>
            <div className="text-xs font-bold border-b border-[#0A0A0A] pb-2 mb-3 text-[#0A0A0A]">
              КАЛЬКУЛЯЦИЯ LANDED COST DDP ТАШКЕНТ
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-[#4A5056]">Базовый инвойс (FOB/FCA):</span>
                <span className="font-bold text-[#0A0A0A]">${invoiceUsd.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#4A5056]">Ж/Д фрахт и страхование:</span>
                <span className="font-bold text-[#0A0A0A]">${freightAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#4A5056]">Таможенная пошлина ({dutyRate}%):</span>
                <span className="font-bold text-[#0A0A0A]">${dutyAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#4A5056]">НДС РУз (12%, к зачету):</span>
                <span className="font-bold text-[#0A0A0A]">${vatAmount.toLocaleString()}</span>
              </div>
              <div className="border-t-2 border-[#0A0A0A] pt-3 mt-3">
                <div className="text-[11px] text-[#4A5056] font-sans uppercase">
                  ИТОГОВАЯ СТОИМОСТЬ DDP ТАШКЕНТ С НДС 12%:
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
              [ ЗАФИКСИРОВАТЬ ЦЕНУ И ПОЛУЧИТЬ ДОГОВОР DDP ]
            </button>
            <p className="text-[10px] text-center text-[#4A5056] mt-2">
              Фиксация цены в сумах защищает от курсовых колебаний валют и задержек на таможне.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
