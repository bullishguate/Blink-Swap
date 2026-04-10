"use client";

import { useState, useEffect } from "react";
import { Key, Wallet, Eye, EyeOff, Save, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface SettingsState {
  apiKey: string;
  btcWalletId: string;
  usdWalletId: string;
}

interface SettingsPanelProps {
  onSave: (settings: SettingsState) => void;
  initialSettings?: SettingsState;
}

export function SettingsPanel({ onSave, initialSettings }: SettingsPanelProps) {
  const [settings, setSettings] = useState<SettingsState>({
    apiKey: initialSettings?.apiKey || "",
    btcWalletId: initialSettings?.btcWalletId || "",
    usdWalletId: initialSettings?.usdWalletId || "",
  });
  const [showApiKey, setShowApiKey] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (initialSettings) {
      setSettings(initialSettings);
    }
  }, [initialSettings]);

  const handleSave = () => {
    onSave(settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const isComplete = settings.apiKey && settings.btcWalletId && settings.usdWalletId;

  return (
    <div className="bg-card rounded-xl border border-border">
      <div className="p-4 border-b border-border">
        <h2 className="font-semibold">Blink API Settings</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Configure your Blink API credentials to enable swaps
        </p>
      </div>

      <div className="p-4 space-y-4">
        {/* API Key */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-2">
            <Key className="h-4 w-4" />
            API Key
          </label>
          <div className="relative">
            <input
              type={showApiKey ? "text" : "password"}
              value={settings.apiKey}
              onChange={(e) =>
                setSettings({ ...settings, apiKey: e.target.value })
              }
              placeholder="Enter your Blink API key"
              className="w-full bg-input border border-border rounded-lg py-3 px-4 pr-10 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring font-mono text-sm"
            />
            <button
              type="button"
              onClick={() => setShowApiKey(!showApiKey)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showApiKey ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        {/* BTC Wallet ID */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-2">
            <Wallet className="h-4 w-4" />
            BTC Wallet ID
          </label>
          <input
            type="text"
            value={settings.btcWalletId}
            onChange={(e) =>
              setSettings({ ...settings, btcWalletId: e.target.value })
            }
            placeholder="Enter your BTC wallet ID"
            className="w-full bg-input border border-border rounded-lg py-3 px-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring font-mono text-sm"
          />
        </div>

        {/* USD Wallet ID */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-2">
            <Wallet className="h-4 w-4" />
            USD Wallet ID
          </label>
          <input
            type="text"
            value={settings.usdWalletId}
            onChange={(e) =>
              setSettings({ ...settings, usdWalletId: e.target.value })
            }
            placeholder="Enter your USD wallet ID"
            className="w-full bg-input border border-border rounded-lg py-3 px-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring font-mono text-sm"
          />
        </div>

        {/* Status */}
        <div
          className={cn(
            "rounded-lg p-3 text-sm",
            isComplete
              ? "bg-success/10 border border-success/20 text-success"
              : "bg-muted text-muted-foreground"
          )}
        >
          {isComplete
            ? "All credentials configured. Ready to trade."
            : "Please fill in all fields to enable trading."}
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          disabled={!isComplete}
          className={cn(
            "w-full font-medium py-3 px-4 rounded-lg transition-all flex items-center justify-center gap-2",
            saved
              ? "bg-success text-white"
              : "bg-primary hover:bg-primary/90 text-primary-foreground",
            !isComplete && "opacity-50 cursor-not-allowed"
          )}
        >
          {saved ? (
            <>
              <Check className="h-4 w-4" />
              Saved
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Save Settings
            </>
          )}
        </button>
      </div>
    </div>
  );
}
