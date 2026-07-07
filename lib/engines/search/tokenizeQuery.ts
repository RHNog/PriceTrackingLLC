export function tokenizeQuery(normalized: string) {
  const tokens = normalized.split(" ").filter(Boolean);

  return tokens.filter((token, index) => tokens.indexOf(token) === index);
}
