export const FACEBOOK_PIXEL_ID = "3409535652587632";

/** Tulivu Haven — primary Facebook ad landing property */
export const FACEBOOK_CAMPAIGN_PROPERTY_ID = 14;

export type FacebookEventName =
  | "PageView"
  | "ViewContent"
  | "Contact"
  | "Lead"
  | "Schedule";

export type FacebookPixelEventPayload = {
  event_name: FacebookEventName;
  property_id?: number | null;
  property_name?: string | null;
  page_path?: string | null;
  event_data?: Record<string, unknown>;
};
