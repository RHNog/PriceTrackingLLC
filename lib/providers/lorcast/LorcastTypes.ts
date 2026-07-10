export type LorcastImageUris = {
  digital?: {
    large?: string;
    normal?: string;
    small?: string;
  };
};

export type LorcastCard = {
  classifications?: string[] | null;
  collector_number?: string;
  id?: string;
  image_uris?: LorcastImageUris;
  ink?: string | null;
  lang?: string;
  layout?: string;
  name?: string;
  prices?: {
    usd?: string | null;
    usd_foil?: string | null;
  };
  rarity?: string;
  released_at?: string;
  set?: {
    code?: string;
    id?: string;
    name?: string;
  };
  tcgplayer_id?: number;
  type?: string[];
  version?: string;
};

export type LorcastSearchResponse = {
  results?: LorcastCard[];
};

export type LorcastErrorKind =
  | "MALFORMED_QUERY"
  | "NETWORK_FAILURE"
  | "NO_MATCH"
  | "PROVIDER_OFFLINE"
  | "RATE_LIMITED";
