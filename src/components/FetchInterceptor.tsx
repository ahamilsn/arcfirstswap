"use client";

import { useEffect } from "react";

/**
 * Intercepts fetch calls to api.circle.com/v1/stablecoinKits/*
 * and routes them through our Next.js proxy to bypass CORS.
 */
export function FetchInterceptor() {
  useEffect(() => {
    const original = window.fetch;

    window.fetch = async (input, init) => {
      const url =
        typeof input === "string"
          ? input
          : input instanceof URL
          ? input.href
          : (input as Request).url;

      if (
        typeof url === "string" &&
        url.includes("api.circle.com/v1/stablecoinKits")
      ) {
        const proxied = url.replace(
          "https://api.circle.com",
          "/api/circle-proxy"
        );
        return original(proxied, init);
      }

      return original(input, init);
    };

    return () => {
      window.fetch = original;
    };
  }, []);

  return null;
}
