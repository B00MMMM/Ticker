export function countWords(text: string): number {
  return text.trim() ? text.trim().split(/\s+/u).length : 0;
}

export function canApprove(record: { ticker: string; status: string; isGenerating?: boolean }): boolean {
  return Boolean(record.ticker.trim()) && countWords(record.ticker) <= 10 &&
    record.status !== "needs_review" && !record.isGenerating;
}

export function makeId(prefix = "news"): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export function parseTxt(text: string): string[] {
  return text.split(/\r?\n/u).map((line) => line.trim()).filter(Boolean);
}
