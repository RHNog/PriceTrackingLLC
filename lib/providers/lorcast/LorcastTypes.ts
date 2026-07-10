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
  cost?: number;
  flavor_text?: string | null;
  id?: string;
  image_uris?: LorcastImageUris;
  ink?: string | null;
  inkwell?: boolean;
  lang?: string;
  layout?: string;
  legalities?: Record<string, string>;
  lore?: number | null;
  move_cost?: number | null;
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
  strength?: number | null;
  tcgplayer_id?: number;
  text?: string;
  type?: string[];
  version?: string;
  willpower?: number | null;
  illustrators?: string[];
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
