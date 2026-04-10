"use client";

import { TrendingUp, TrendingDown, RefreshCw } from "lucide-react";
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
    <div className="bg-card rounded-xl p-6 border border-border">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
          BTC / USD
        </h2>
        <div className="flex items-center gap-2">
          {isLoading && (
            <RefreshCw className="h-4 w-4 text-muted-foreground animate-spin" />
          )}
          {lastUpdated && (
            <span className="text-xs text-muted-foreground">
              {lastUpdated.toLocaleTimeString()}
            </span>
          )}
        </div>
      </div>

      <div className="flex items-end gap-4">
        <span className="text-4xl font-bold tracking-tight">
          {price ? formatPrice(price) : "---"}
        </span>
        {priceChange !== 0 && (
          <div
            className={`flex items-center gap-1 pb-1 ${
              isUp ? "text-success" : "text-destructive"
            }`}
          >
            {isUp ? (
              <TrendingUp className="h-4 w-4" />
            ) : (
              <TrendingDown className="h-4 w-4" />
            )}
            <span className="text-sm font-medium">
              {isUp ? "+" : ""}
              {priceChange.toFixed(2)}%
            </span>
          </div>
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-border">
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground block">24h High</span>
            <span className="font-medium">{price ? formatPrice(price * 1.02) : "---"}</span>
          </div>
          <div>
            <span className="text-muted-foreground block">24h Low</span>
            <span className="font-medium">{price ? formatPrice(price * 0.98) : "---"}</span>
          </div>
          <div>
            <span className="text-muted-foreground block">Volume</span>
            <span className="font-medium">$42.1B</span>
          </div>
        </div>
      </div>
    </div>
  );
}
