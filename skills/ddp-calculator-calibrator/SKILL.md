---
name: ddp-calculator-calibrator
description: Calibrates customs duty rates, railway freight rates, and exchange rate parameters in the Landed Cost DDP Tashkent calculator.
---

# DDP Calculator Calibrator Skill

Use this skill when adjusting commercial parameters in `src/components/islands/LandedCostCalculator.tsx`.

## Key Invariants
* VAT in Republic of Uzbekistan is strictly **12%**.
* Base currency is Uzbek Sum (UZS), converted from USD/RUB.
* All freight calculations must account for customs brokerage at Tashkent logistics hubs (Chukursay, Sergeli).
