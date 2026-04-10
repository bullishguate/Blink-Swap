"use client";

import { Circle, CheckCircle, XCircle, AlertCircle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

export interface LogEntry {
  id: string;
  timestamp: Date;
  message: string;
  type: "info" | "success" | "error" | "warning" | "pending";
}

interface StatusLogProps {
  logs: LogEntry[];
}

export function StatusLog({ logs }: StatusLogProps) {
  const getIcon = (type: LogEntry["type"]) => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-success" />;
      case "error":
        return <XCircle className="h-4 w-4 text-destructive" />;
      case "warning":
        return <AlertCircle className="h-4 w-4 text-primary" />;
      case "pending":
        return <Clock className="h-4 w-4 text-muted-foreground animate-pulse" />;
      default:
        return <Circle className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="bg-card rounded-xl border border-border">
      <div className="p-4 border-b border-border">
        <h2 className="font-semibold">Activity Log</h2>
      </div>
      <div className="h-64 overflow-y-auto p-4">
        {logs.length === 0 ? (
          <p className="text-muted-foreground text-sm text-center py-8">
            No activity yet. Start monitoring to see updates.
          </p>
        ) : (
          <div className="space-y-3">
            {logs.map((log) => (
              <div
                key={log.id}
                className={cn(
                  "flex items-start gap-3 text-sm",
                  log.type === "error" && "text-destructive",
                  log.type === "success" && "text-success",
                  log.type === "warning" && "text-primary"
                )}
              >
                <div className="mt-0.5">{getIcon(log.type)}</div>
                <div className="flex-1 min-w-0">
                  <p className="break-words">{log.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {log.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
