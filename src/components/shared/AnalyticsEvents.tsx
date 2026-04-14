"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
    dataLayer?: Record<string, unknown>[];
  }
}

export function trackEvent(
  eventName: string,
  params?: Record<string, unknown>
) {
  if (typeof window === "undefined") return;
  if (window.gtag) window.gtag("event", eventName, params);
}

export function trackPixel(eventName: string, params?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  if (window.fbq) window.fbq("track", eventName, params);
}

export function trackAddToCart(item: string, value: number) {
  trackEvent("add_to_cart", {
    currency: "BRL",
    value,
    items: [{ item_name: item }],
  });
  trackPixel("AddToCart", { content_name: item, value, currency: "BRL" });
}

export function trackLead(source: string) {
  trackEvent("lead", { event_category: "lead", source });
  trackPixel("Lead", { content_name: source });
}

export function trackWhatsAppClick(source: string) {
  trackEvent("whatsapp_click", { event_category: "lead", source });
  trackPixel("Lead", { content_name: `whatsapp_${source}` });
}

export function trackPurchase(value: number) {
  trackEvent("purchase", { currency: "BRL", value });
  trackPixel("Purchase", { value, currency: "BRL" });
}

/** Tracks scroll depth milestones at 25%, 50%, 75%, 100% */
export function useScrollTracking() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const milestones = new Set<number>();
    const thresholds = [25, 50, 75, 100];

    const onScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) return;
      const percent = Math.round((scrollTop / docHeight) * 100);

      for (const t of thresholds) {
        if (percent >= t && !milestones.has(t)) {
          milestones.add(t);
          trackEvent("scroll", { percent_scrolled: t });
        }
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
}
