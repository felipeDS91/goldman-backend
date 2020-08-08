export function unformat(value) {
  return value.replace(/[. \-*+?^${}()|[\]\\]/g, '');
}
