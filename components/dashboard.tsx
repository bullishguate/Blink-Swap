"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import useSWR from "swr";
import { PriceDisplay } from "./price-display";
import { SwapForm, type SwapConfig } from "./swap-form";
import { StatusLog, type LogEntry } from "./status-log";
import { SettingsPanel } from "./settings-panel";
import { formatPrice } from "@/lib/utils";

interface Settings {
  apiKey: string;
  btcWalletId: string;
  usdWalletId: string;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function Dashboard() {
  const [isRunning, setIsRunning] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [settings, setSettings] = useState<Settings>({
    apiKey: "",
    btcWalletId: "",
    usdWalletId: "",
  });
  const [swapConfig, setSwapConfig] = useState<SwapConfig | null>(null);
  const previousPriceRef = useRef<number | null>(null);
  const pollingRef = useRef<NodeJS.Timeout | null>(null);

  const { data, isLoading, mutate } = useSWR<{ price: number }>(
    "/api/price",
    fetcher,
    {
      refreshInterval: isRunning ? 30000 : 60000,
      revalidateOnFocus: false,
    }
  );

  const currentPrice = data?.price || null;

  // Store previous price for comparison
  useEffect(() => {
    if (currentPrice && currentPrice !== previousPriceRef.current) {
      previousPriceRef.current = currentPrice;
    }
  }, [currentPrice]);

  const addLog = useCallback(
    (message: string, type: LogEntry["type"] = "info") => {
      const newLog: LogEntry = {
        id: crypto.randomUUID(),
        timestamp: new Date(),
        message,
        type,
      };
      setLogs((prev) => [newLog, ...prev].slice(0, 50));
    },
    []
  );

  const executeSwap = useCallback(
    async (config: SwapConfig) => {
      if (!settings.apiKey || !settings.btcWalletId || !settings.usdWalletId) {
        addLog("Missing API credentials. Please configure settings.", "error");
        return false;
      }

      addLog(`Executing ${config.mode} swap...`, "pending");

      try {
        const response = await fetch("/api/swap", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            mode: config.mode,
            amount: config.amount,
            apiKey: settings.apiKey,
            btcWalletId: settings.btcWalletId,
            usdWalletId: settings.usdWalletId,
            currentPrice: currentPrice,
          }),
        });

        const result = await response.json();

        if (result.success) {
          addLog(
            `Swap successful! ${config.mode === "SELL" ? "Sold" : "Bought"} at ${formatPrice(currentPrice || 0)}`,
            "success"
          );
          return true;
        } else {
          addLog(`Swap failed: ${result.error}`, "error");
          return false;
        }
      } catch {
        addLog("Failed to execute swap. Check your connection.", "error");
        return false;
      }
    },
    [settings, currentPrice, addLog]
  );

  // Monitor price and trigger swap
  useEffect(() => {
    if (!isRunning || !swapConfig || !currentPrice) return;

    const shouldExecute =
      (swapConfig.mode === "SELL" && currentPrice >= swapConfig.targetPrice) ||
      (swapConfig.mode === "BUY" && currentPrice <= swapConfig.targetPrice);

    if (shouldExecute) {
      addLog("Target price reached!", "warning");
      executeSwap(swapConfig).then((success) => {
        if (success) {
          setIsRunning(false);
          setSwapConfig(null);
          addLog("Bot stopped after successful swap.", "info");
        }
      });
    } else {
      addLog(
        `Current: ${formatPrice(currentPrice)} | Target: ${formatPrice(swapConfig.targetPrice)}`,
        "info"
      );
    }
  }, [currentPrice, isRunning, swapConfig, executeSwap, addLog]);

  const handleStartBot = useCallback(
    (config: SwapConfig) => {
      if (!settings.apiKey) {
        addLog("Please configure your Blink API settings first.", "error");
        return;
      }

      setSwapConfig(config);
      setIsRunning(true);
      addLog(
        `Bot started in ${config.mode} mode. Target: ${formatPrice(config.targetPrice)}`,
        "success"
      );

      // Force immediate price refresh
      mutate();
    },
    [settings.apiKey, addLog, mutate]
  );

  const handleStopBot = useCallback(() => {
    setIsRunning(false);
    setSwapConfig(null);
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
    }
    addLog("Bot stopped.", "info");
  }, [addLog]);

  const handleSaveSettings = useCallback(
    (newSettings: Settings) => {
      setSettings(newSettings);
      addLog("Settings saved successfully.", "success");
    },
    [addLog]
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column - Price & Settings */}
        <div className="lg:col-span-1 space-y-6">
          <PriceDisplay
            price={currentPrice}
            previousPrice={previousPriceRef.current}
            isLoading={isLoading}
            lastUpdated={data ? new Date() : null}
          />
          <SettingsPanel onSave={handleSaveSettings} initialSettings={settings} />
        </div>

        {/* Middle Column - Swap Form */}
        <div className="lg:col-span-1">
          <SwapForm
            currentPrice={currentPrice}
            onStartBot={handleStartBot}
            onStopBot={handleStopBot}
            isRunning={isRunning}
          />
        </div>

        {/* Right Column - Activity Log */}
        <div className="lg:col-span-1">
          <StatusLog logs={logs} />
        </div>
      </div>

      {/* Running Indicator */}
      {isRunning && swapConfig && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-card border border-border rounded-full px-6 py-3 shadow-lg flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
          <span className="text-sm">
            Monitoring for {swapConfig.mode} at{" "}
            {formatPrice(swapConfig.targetPrice)}
          </span>
        </div>
      )}
    </div>
  );
}
