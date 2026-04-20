import { Card } from "@/components/ui/card";
import { ReactNode } from "react";

interface MetricCardProps {
  label: string;
  value: string;
  sub?: string;
  trend?: number;
  icon?: ReactNode;
  accent?: string;
  hint?: string;
}

export function MetricCard({ label, value, sub, trend, hint }: MetricCardProps) {
  return (
    <Card className="p-5 gap-2 bg-card border-border hover:border-primary/30 transition-colors shadow-[0_1px_2px_rgba(13,14,22,0.04)]">
      <div className="flex items-center justify-between">
        <span className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider">{label}</span>
        {hint && (
          <span title={hint} className="text-muted-foreground text-xs cursor-help">ⓘ</span>
        )}
      </div>
      <div className="text-[26px] font-semibold tracking-tight leading-none mt-2">{value}</div>
      {(sub || trend !== undefined) && (
        <div className="flex items-center gap-2 mt-1.5">
          {sub && <span className="text-xs text-muted-foreground">{sub}</span>}
          {trend !== undefined && (
            <span className={`text-xs font-semibold ${trend >= 0 ? "text-emerald-600" : "text-red-600"}`}>
              {trend >= 0 ? "↑" : "↓"} {Math.abs(trend).toFixed(1)}%
            </span>
          )}
        </div>
      )}
    </Card>
  );
}
