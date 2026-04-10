"use client";

import { Zap, Github, ExternalLink } from "lucide-react";

export function Header() {
  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
            <Zap className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-bold text-lg">Blink Swap</h1>
            <p className="text-xs text-muted-foreground">Automated BTC/USD Trading</p>
          </div>
        </div>

        <nav className="flex items-center gap-4">
          <a
            href="https://www.blink.sv/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
          >
            Blink
            <ExternalLink className="h-3 w-3" />
          </a>
          <a
            href="https://github.com/bullishguate/Blink-Swap"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg hover:bg-secondary transition-colors"
          >
            <Github className="h-5 w-5" />
          </a>
        </nav>
      </div>
    </header>
  );
}
