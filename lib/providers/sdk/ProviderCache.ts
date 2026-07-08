export interface ProviderCacheRecord<TValue> {
  expiresAt: number;
  value: TValue;
}

export interface ProviderCache<TValue> {
  get(key: string): ProviderCacheRecord<TValue> | null;
  set(key: string, value: TValue, ttlMs: number): void;
}

export class MemoryProviderCache<TValue> implements ProviderCache<TValue> {
  private records = new Map<string, ProviderCacheRecord<TValue>>();

  get(key: string) {
    const record = this.records.get(key);

    if (!record) {
      return null;
    }

    if (record.expiresAt < Date.now()) {
      this.records.delete(key);
      return null;
    }

    return record;
  }

  set(key: string, value: TValue, ttlMs: number) {
    this.records.set(key, {
      expiresAt: Date.now() + ttlMs,
      value,
    });
  }
}
