"use client";

import { useState } from "react";
import { ArrowRightLeft, Play, Square, Settings } from "lucide-react";
import { cn, formatPrice } from "@/lib/utils";

type SwapMode = "SELL" | "BUY";

interface SwapFormProps {
  currentPrice: number | null;
  onStartBot: (config: SwapConfig) => void;
  onStopBot: () => void;
  isRunning: boolean;
}

export interface SwapConfig {
  mode: SwapMode;
  targetPrice: number;
  amount: number;
}

export function SwapForm({
  currentPrice,
  onStartBot,
  onStopBot,
  isRunning,
}: SwapFormProps) {
  const [mode, setMode] = useState<SwapMode>("SELL");
  const [targetPrice, setTargetPrice] = useState("");
  const [amount, setAmount] = useState("");
  const [showSettings, setShowSettings] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetPrice || !amount) return;

    onStartBot({
      mode,
      targetPrice: parseFloat(targetPrice),
      amount: parseInt(amount),
    });
  };

  const targetReached =
    currentPrice &&
    targetPrice &&
    ((mode === "SELL" && currentPrice >= parseFloat(targetPrice)) ||
      (mode === "BUY" && currentPrice <= parseFloat(targetPrice)));

  return (
    <div className="bg-card rounded-xl border border-border">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h2 className="font-semibold">Swap Configuration</h2>
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="p-2 rounded-lg hover:bg-secondary transition-colors"
        >
          <Settings className="h-4 w-4 text-muted-foreground" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-4 space-y-4">
        {/* Mode Toggle */}
        <div className="flex rounded-lg bg-secondary p-1">
          <button
            type="button"
            onClick={() => setMode("SELL")}
            className={cn(
              "flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all",
              mode === "SELL"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Sell BTC
          </button>
          <button
            type="button"
            onClick={() => setMode("BUY")}
            className={cn(
              "flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all",
              mode === "BUY"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Buy BTC
          </button>
        </div>

        {/* Visual representation */}
        <div className="flex items-center justify-center gap-4 py-4">
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-2">
              <span className="text-lg font-bold text-primary">
                {mode === "SELL" ? "BTC" : "USD"}
              </span>
            </div>
            <span className="text-xs text-muted-foreground">From</span>
          </div>
          <ArrowRightLeft className="h-5 w-5 text-muted-foreground" />
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-2">
              <span className="text-lg font-bold text-success">
                {mode === "SELL" ? "USD" : "BTC"}
              </span>
            </div>
            <span className="text-xs text-muted-foreground">To</span>
          </div>
        </div>

        {/* Target Price */}
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-2">
            Target Price (USD)
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              $
            </span>
            <input
              type="number"
              value={targetPrice}
              onChange={(e) => setTargetPrice(e.target.value)}
              placeholder={mode === "SELL" ? "e.g., 80000" : "e.g., 63000"}
              disabled={isRunning}
              className="w-full bg-input border border-border rounded-lg py-3 px-8 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
            />
          </div>
          {currentPrice && targetPrice && (
            <p className="mt-1 text-xs text-muted-foreground">
              {mode === "SELL"
                ? `Will trigger when price rises above ${formatPrice(parseFloat(targetPrice))}`
                : `Will trigger when price drops below ${formatPrice(parseFloat(targetPrice))}`}
            </p>
          )}
        </div>

        {/* Amount */}
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-2">
            {mode === "SELL" ? "Amount (Satoshis)" : "Amount (USD Cents)"}
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder={mode === "SELL" ? "e.g., 100000" : "e.g., 5000"}
            disabled={isRunning}
            className="w-full bg-input border border-border rounded-lg py-3 px-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
          />
          {amount && (
            <p className="mt-1 text-xs text-muted-foreground">
              {mode === "SELL"
                ? `${parseInt(amount).toLocaleString()} sats = ~${formatPrice((parseInt(amount) / 100000000) * (currentPrice || 0))}`
                : `${parseInt(amount)} cents = $${(parseInt(amount) / 100).toFixed(2)}`}
            </p>
          )}
        </div>

        {/* Status indicator */}
        {targetReached && isRunning && (
          <div className="bg-success/10 border border-success/20 rounded-lg p-3">
            <p className="text-success text-sm font-medium">
              Target reached! Executing swap...
            </p>
          </div>
        )}

        {/* Submit Button */}
        {isRunning ? (
          <button
            type="button"
            onClick={onStopBot}
            className="w-full bg-destructive hover:bg-destructive/90 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <Square className="h-4 w-4" />
            Stop Monitoring
          </button>
        ) : (
          <button
            type="submit"
            disabled={!targetPrice || !amount}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Play className="h-4 w-4" />
            Start Monitoring
          </button>
        )}
      </form>
    </div>
  );
}
