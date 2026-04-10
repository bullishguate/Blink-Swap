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
            className="w-full bg-input border border-border rounded-lg py-2.5 px-4 pr-10 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring font-mono text-sm"
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

      {/* Wallet IDs - Side by Side */}
      <div className="grid sm:grid-cols-2 gap-4">
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
            placeholder="BTC wallet ID"
            className="w-full bg-input border border-border rounded-lg py-2.5 px-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring font-mono text-sm"
          />
        </div>
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
            placeholder="USD wallet ID"
            className="w-full bg-input border border-border rounded-lg py-2.5 px-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring font-mono text-sm"
          />
        </div>
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        disabled={!isComplete}
        className={cn(
          "w-full font-medium py-2.5 px-4 rounded-lg transition-all flex items-center justify-center gap-2",
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
  );
}
