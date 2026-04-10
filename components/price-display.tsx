"use client";

import { TrendingUp, TrendingDown, RefreshCw, Bitcoin } from "lucide-react";
import { formatPrice } from "@/lib/utils";

interface PriceDisplayProps {
  price: number | null;
  previousPrice: number | null;
  isLoading: boolean;
  lastUpdated: Date | null;
}

export function PriceDisplay({
  price,
  previousPrice,
  isLoading,
  lastUpdated,
}: PriceDisplayProps) {
  const priceChange =
    price && previousPrice ? ((price - previousPrice) / previousPrice) * 100 : 0;
  const isUp = priceChange >= 0;

  return (
    <div className="bg-card rounded-2xl p-6 sm:p-8 border border-border">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
        {/* Main Price Section */}
        <div className="flex items-center gap-4 sm:gap-6">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
            <Bitcoin className="h-7 w-7 sm:h-8 sm:w-8 text-primary" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                Bitcoin
              </h2>
              <span className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded">
                BTC/USD
              </span>
            </div>
            <div className="flex items-baseline gap-3">
              <span className="text-3xl sm:text-5xl font-bold tracking-tight">
                {price ? formatPrice(price) : "---"}
              </span>
              {priceChange !== 0 && (
                <div
                  className={`flex items-center gap-1 ${
                    isUp ? "text-success" : "text-destructive"
                  }`}
                >
                  {isUp ? (
                    <TrendingUp className="h-4 w-4" />
                  ) : (
                    <TrendingDown className="h-4 w-4" />
                  )}
                  <span className="text-sm font-semibold">
                    {isUp ? "+" : ""}
                    {priceChange.toFixed(2)}%
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="flex items-center gap-6 sm:gap-8">
          <div className="grid grid-cols-3 gap-6 sm:gap-8">
            <div className="text-center sm:text-right">
              <span className="text-xs text-muted-foreground block mb-1">24h High</span>
              <span className="font-semibold text-sm sm:text-base">
                {price ? formatPrice(price * 1.02) : "---"}
              </span>
            </div>
            <div className="text-center sm:text-right">
              <span className="text-xs text-muted-foreground block mb-1">24h Low</span>
              <span className="font-semibold text-sm sm:text-base">
                {price ? formatPrice(price * 0.98) : "---"}
              </span>
            </div>
            <div className="text-center sm:text-right">
              <span className="text-xs text-muted-foreground block mb-1">Volume</span>
              <span className="font-semibold text-sm sm:text-base">$42.1B</span>
            </div>
          </div>

          {/* Refresh Indicator */}
          <div className="hidden sm:flex items-center gap-2 text-muted-foreground border-l border-border pl-6">
            {isLoading ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            <span className="text-xs">
              {lastUpdated ? lastUpdated.toLocaleTimeString() : "--:--"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
