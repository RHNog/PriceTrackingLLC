import type { RankedOpportunity } from "@/types/opportunity";

type ProfitBreakdownProps = {
  opportunity: RankedOpportunity;
  purchasePrice: number;
};

function formatCurrency(value: number) {
  return `$${value.toLocaleString()}`;
}

export default function ProfitBreakdown({
  opportunity,
  purchasePrice,
}: ProfitBreakdownProps) {
  return (
    <section className="rounded-lg border border-zinc-800 bg-zinc-900 p-6">
      <h3 className="text-lg font-semibold text-white">Profit Breakdown</h3>

      <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <dt className="text-xs text-zinc-500">Purchase Price</dt>
          <dd className="mt-1 font-medium text-zinc-200">
            {formatCurrency(purchasePrice)}
          </dd>
        </div>
        <div>
          <dt className="text-xs text-zinc-500">Marketplace Fees</dt>
          <dd className="mt-1 font-medium text-zinc-200">
            {formatCurrency(opportunity.estimatedFees)}
          </dd>
        </div>
        <div>
          <dt className="text-xs text-zinc-500">Shipping</dt>
          <dd className="mt-1 font-medium text-zinc-200">
            {formatCurrency(opportunity.shippingCost)}
          </dd>
        </div>
        <div>
          <dt className="text-xs text-zinc-500">Payment Processing Fee</dt>
          <dd className="mt-1 font-medium text-zinc-200">
            {formatCurrency(opportunity.paymentFee)}
          </dd>
        </div>
        <div>
          <dt className="text-xs text-zinc-500">Net Profit</dt>
          <dd className="mt-1 text-lg font-semibold text-emerald-400">
            {formatCurrency(opportunity.profit)}
          </dd>
        </div>
        <div>
          <dt className="text-xs text-zinc-500">ROI</dt>
          <dd className="mt-1 text-lg font-semibold text-cyan-300">
            {opportunity.roi}%
          </dd>
        </div>
      </dl>
    </section>
  );
}
