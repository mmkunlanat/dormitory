export function extractAmount(text: string) {
  const m = text.match(/(\d{1,3}(?:,\d{3})*|\d+)\s*(บาท|THB)?/i);
  if (!m) return null;
  return Number(m[1].replace(/,/g,""));
}
