export type RateLimitMode = "normal" | "strict";

export type RouteType =
  | "public"
  | "auth"
  | "checkout"
  | "coupon"
  | "login"
  | "account"
  | "settings";

export interface RoutePolicy {
  limit: number;
  windowSec: number;
  mode: RateLimitMode;
}

/**
 * Centralized security rules per endpoint type
 */
export const ROUTE_POLICIES: Record<RouteType, RoutePolicy> = {
  public: {
    limit: 60,
    windowSec: 60,
    mode: "normal",
  },

  auth: {
    limit: 10,
    windowSec: 60,
    mode: "strict",
  },

  login: {
    limit: 5,
    windowSec: 450,
    mode: "strict",
  },

  coupon: {
    limit: 5,
    windowSec: 60,
    mode: "strict",
  },
  settings: {
    limit: 15,        // Allows for navigation & refreshes
    windowSec: 150,   // 2.5 minute window
    mode: "normal",   // Normal mode avoids aggressive blacklisting
  },

  checkout: {
    limit: 3,
    windowSec: 300,
    mode: "strict",
  },

  account: {
    limit: 30,
    windowSec: 60,
    mode: "normal",
  },
};