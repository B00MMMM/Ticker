export type TickerStatus = "pending" | "draft" | "approved" | "needs_review";

export type TickerRecord = {
  id: string;
  sourceTitle: string;
  sourceAnnouncement: string;
  ticker: string;
  status: TickerStatus;
  generationError?: string;
  generatedTicker?: string;
  isGenerating?: boolean;
};
