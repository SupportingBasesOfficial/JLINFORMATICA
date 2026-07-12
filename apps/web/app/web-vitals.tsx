"use client";

import { useReportWebVitals } from "next/web-vitals";
import { logger } from "@repo/logger";

export function WebVitalsReporter() {
  useReportWebVitals((metric) => {
    if (process.env.NODE_ENV === "production") {
      logger.info(
        { name: metric.name, value: metric.value, rating: metric.rating },
        "Web Vital reportado",
      );
    } else {
      logger.debug(
        { name: metric.name, value: metric.value, rating: metric.rating },
        "Web Vital (dev)",
      );
    }
  });

  return null;
}
