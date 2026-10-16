"use client";

import { useMemo, useState } from "react";

const MONTH_OPTIONS = [6, 12, 18, 24];

function parseMoney(value?: string | null): number | null {
  if (!value) return null;
  const amounts = [...value.replace(/,/g, "").matchAll(/\d+/g)]
    .map((match) => Number(match[0]))
    .filter((amount) => amount >= 1000);
  return amounts[0] ?? null;
}

function parseMonths(value?: string | null): number | null {
  if (!value) return null;
  const labelled = value.match(/(\d+)\s*(?:month|monthly)/i);
  if (labelled) {
    const months = Number(labelled[1]);
    if (months >= 1 && months <= 60) return months;
  }
  return null;
}

function formatKes(amount: number): string {
  return `KES ${Math.max(0, Math.round(amount)).toLocaleString("en-KE")}`;
}

function extractPlanHints(text: string): { deposit: number | null; months: number | null } {
  const depositMatch = text.match(/deposit[:\s-]*kes\s*([\d,]+)/i);
  const monthsMatch = text.match(/(\d+)\s*months/i);
  const months = monthsMatch ? Number(monthsMatch[1]) : null;
  return {
    deposit: depositMatch ? parseMoney(depositMatch[1]) : null,
    months: months && months >= 1 && months <= 60 ? months : null,
  };
}

type PropertyPaymentCalculatorProps = {
  price: string;
  pricing?: Record<string, string>;
  paymentPlan?: Record<string, string>;
  details?: string;
};

export default function PropertyPaymentCalculator({
  price,
  pricing,
  paymentPlan,
  details,
}: PropertyPaymentCalculatorProps) {
  const options = useMemo(() => {
    const fromPricing = Object.entries(pricing ?? {})
      .map(([label, amount]) => ({ label, amount: parseMoney(amount) }))
      .filter((option): option is { label: string; amount: number } => option.amount !== null);

    if (fromPricing.length > 0) return fromPricing;

    const listed = parseMoney(price);
    return listed ? [{ label: "Listed price", amount: listed }] : [];
  }, [price, pricing]);

  const [selectedLabel, setSelectedLabel] = useState(options[0]?.label ?? "");
  const selected = options.find((option) => option.label === selectedLabel) ?? options[0];
  const listedPrice = parseMoney(price) ?? selected?.amount ?? 0;
  const hints = extractPlanHints(details ?? "");
  const planDeposit = parseMoney(paymentPlan?.Deposit) ?? hints.deposit;
  const planMonths =
    parseMonths(
      paymentPlan?.Installments ?? paymentPlan?.["Monthly Installments"] ?? paymentPlan?.["Payment Plan"]
    ) ?? hints.months;

  const depositRatio =
    planDeposit && listedPrice > 0 ? Math.min(planDeposit / listedPrice, 0.9) : 0.33;

  const [months, setMonths] = useState(planMonths && MONTH_OPTIONS.includes(planMonths) ? planMonths : 12);
  const [depositInput, setDepositInput] = useState(() =>
    String(planDeposit && listedPrice > 0 ? planDeposit : Math.round((selected?.amount ?? 0) * depositRatio))
  );

  if (!selected) return null;

  const activeMonths = MONTH_OPTIONS.includes(months) ? months : 12;
  const deposit = Math.min(
    selected.amount,
    Math.max(0, Number(depositInput.replace(/[^\d]/g, "")) || 0)
  );
  const balance = Math.max(0, selected.amount - deposit);
  const monthly = activeMonths > 0 ? balance / activeMonths : balance;

  const chooseSize = (label: string) => {
    const next = options.find((option) => option.label === label);
    setSelectedLabel(label);
    if (!next) return;
    const nextDeposit =
      planDeposit && listedPrice > 0 && Math.abs(next.amount - listedPrice) < 1
        ? planDeposit
        : Math.round(next.amount * depositRatio);
    setDepositInput(String(nextDeposit));
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
      <h2 className="text-2xl font-bold text-dark-900 mb-2 font-montserrat">Payment calculator</h2>
      <p className="text-dark-600 mb-6">
        Estimate a zero-interest installment for this property. Adjust the deposit and the number of months.
      </p>

      {options.length > 1 && (
        <label className="mb-4 block text-sm font-semibold text-dark-900">
          Plot size
          <select
            className="mt-1.5 w-full rounded-lg border border-dark-200 px-3 py-3 outline-none focus:ring-2 focus:ring-primary-500"
            value={selected.label}
            onChange={(event) => chooseSize(event.target.value)}
          >
            {options.map((option) => (
              <option key={option.label} value={option.label}>
                {option.label} — {formatKes(option.amount)}
              </option>
            ))}
          </select>
        </label>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-semibold text-dark-900">
          Deposit (KES)
          <input
            inputMode="numeric"
            className="mt-1.5 w-full rounded-lg border border-dark-200 px-3 py-3 outline-none focus:ring-2 focus:ring-primary-500"
            value={depositInput}
            onChange={(event) => setDepositInput(event.target.value)}
          />
        </label>
        <label className="block text-sm font-semibold text-dark-900">
          Months
          <select
            className="mt-1.5 w-full rounded-lg border border-dark-200 px-3 py-3 outline-none focus:ring-2 focus:ring-primary-500"
            value={activeMonths}
            onChange={(event) => setMonths(Number(event.target.value))}
          >
            {MONTH_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option} months
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg bg-primary-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-primary-700">Price</p>
          <p className="mt-1 text-xl font-bold text-primary-700">{formatKes(selected.amount)}</p>
        </div>
        <div className="rounded-lg bg-dark-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-dark-500">Balance</p>
          <p className="mt-1 text-xl font-bold text-dark-900">{formatKes(balance)}</p>
        </div>
        <div className="rounded-lg bg-dark-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-dark-500">Monthly</p>
          <p className="mt-1 text-xl font-bold text-dark-900">{formatKes(monthly)}</p>
        </div>
      </div>
      <p className="mt-4 text-xs text-dark-500">
        This is an estimate for planning. Confirm the final deposit and installment with Inuka Afrika Properties.
      </p>
    </div>
  );
}
