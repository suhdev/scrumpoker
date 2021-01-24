export function useQueryStringParam(key: string) {
  return new URLSearchParams(window.location.search.slice(1)).get(key);
}
