# FinTech Insurance Advisory Platform & Conversational AI
--> https://mrlbajajlife-2zbg.vercel.app/

A client-facing digital advisory platform engineered to eliminate drop-offs in self-serve insurance exploration. Combines dynamic actuarial calculation engines, a multilingual conversational AI copilot, and an automated lead extraction pipeline syncing customer intent directly with backend Google Forms, Sheets, and WhatsApp workflows.

🔗 **Live Application:** [mrlbajajlife-2zbg.vercel.app](https://mrlbajajlife-2zbg.vercel.app/)

---

## Key Highlights & Features

### 1. Domain-Specific Conversational AI Copilot
* **Multilingual Intent Support:** Interactive advisory assistant localized in English, Hindi, Bengali, and Nepali for regional accessibility.
* **Contextual Quick Chips:** One-tap evaluation paths for high-friction topics (*AWG vs Bank FD*, *Term Quotes*, *Retirement Planning*, *Women-Centric Portfolios*).
* **Conversational Conversion Funnel:** Answers complex policy questions dynamically and guides visitors into qualified consultations.

### 2. Automated Lead Extraction & CRM Sync Pipeline
* **Zero-Leakage Intent Ingestion:** Extracts user details (Name, Contact, Age, Selected Plan, Annual Budget, City) directly from interactive inputs and chat sessions.
* **Automated Google Forms/Sheets Webhook Sync:** Dispatches structured lead data in the background without full-page reloads, eliminating manual data entry.
* **Instant WhatsApp Bridge:** Generates pre-filled quotation requests routing directly to the advisor's WhatsApp channel for immediate turnaround.

### 3. Dynamic Actuarial & Financial Calculation Engines
* **Assured Wealth Goal (AWG):** Models 6 distinct variants (*Second Income, Lifelong Income, Step-Up, Wealth Creation, Assured, Extra*) with dynamic premium-paying terms (PPT) and payout horizons.
* **AWG Platinum Calculator:** Simulates Early Guaranteed Payouts (EGP) during the premium paying term alongside maturity return-of-premium (ROP).
* **Pure Term Risk Modeler (Smart Protect Goal):** Real-time underwriting quote estimator based on age, gender, tobacco consumption, and critical illness riders.
* **ULIP & Pension Projections:** IRDAI-compliant growth illustrations (4% & 8% rates) and annuity rate calculators across single-life and joint-life options.
* **Bajaj Life ACE:** Modular plan modeling supporting SISO (Start Income Shortly), SIDO, and Lumpsum payout variants with cash bonus projections.

### 4. Smart Client Profiler & Comparison Matrix
* **Algorithmic Profiling:** Maps demographic inputs (Age, Income bracket, Life stage) directly to tailored policy recommendations.
* **Benchmark Engine:** Side-by-side comparison matrix evaluating guaranteed returns, IRR, Section 10(10D) tax benefits, and claim settlement metrics against traditional bank fixed deposits and endowment policies.

---

## Architecture & Lead Data Flow

```text
[User Interaction]
       │
       ├──► Dynamic Financial Calculators ──┐
       │                                     ▼
       └──► Multilingual AI Assistant ──► [Lead Extraction Engine]
                                                │
                                    ┌───────────┴───────────┐
                                    ▼                       ▼
                         [Google Forms / Sheets]     [WhatsApp Dispatch]
                           (Real-Time Ingestion)     (Pre-filled Quotation)
