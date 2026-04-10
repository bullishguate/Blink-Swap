"use client";

import { Circle, CheckCircle, XCircle, AlertCircle, Clock, Activity } from "lucide-react";
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
    <div className="bg-card rounded-xl border border-border h-full flex flex-col">
      <div className="p-4 border-b border-border flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
          <Activity className="h-4 w-4 text-muted-foreground" />
        </div>
        <div>
          <h2 className="font-semibold">Activity Log</h2>
          <p className="text-xs text-muted-foreground">{logs.length} events</p>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 min-h-[300px] max-h-[400px] lg:min-h-[500px] lg:max-h-[600px]">
        {logs.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center py-12">
            <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center mb-3">
              <Activity className="h-5 w-5 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground text-sm font-medium">No activity yet</p>
            <p className="text-muted-foreground text-xs mt-1">
              Start monitoring to see updates
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {logs.map((log) => (
              <div
                key={log.id}
                className={cn(
                  "flex items-start gap-3 text-sm p-2 rounded-lg",
                  log.type === "error" && "bg-destructive/5",
                  log.type === "success" && "bg-success/5",
                  log.type === "warning" && "bg-primary/5"
                )}
              >
                <div className="mt-0.5 shrink-0">{getIcon(log.type)}</div>
                <div className="flex-1 min-w-0">
                  <p
                    className={cn(
                      "break-words text-sm",
                      log.type === "error" && "text-destructive",
                      log.type === "success" && "text-success",
                      log.type === "warning" && "text-primary"
                    )}
                  >
                    {log.message}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
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
