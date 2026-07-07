export interface SearchResult<T> {
  item: T;
  score: number;
  matchedTerms: string[];
}
