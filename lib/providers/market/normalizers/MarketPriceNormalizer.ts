export function normalizeMarketPrice(value?: string | null) {
  if (!value) {
    return null;
  }

  const price = Number(value);

  if (!Number.isFinite(price) || price <= 0) {
    return null;
  }

  return Math.round(price * 100) / 100;
}
