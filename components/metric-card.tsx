import { Card } from "@/components/ui/card";
import { ReactNode } from "react";

interface MetricCardProps {
  label: string;
  value: string;
  sub?: string;
  trend?: number;
  icon?: ReactNode;
  accent?: string;
}

export function MetricCard({ label, value, sub, trend, icon, accent }: MetricCardProps) {
  return (
    <Card className="p-5 flex flex-col gap-3 bg-card border-border">
      <div className="flex items-start justify-between">
        <span className="text-xs text-muted-foreground uppercase tracking-wider">{label}</span>
        {icon && (
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: accent ? `${accent}20` : undefined }}>
            {icon}
          </div>
        )}
      </div>
      <div>
        <div className="text-2xl font-bold tracking-tight">{value}</div>
        {(sub || trend !== undefined) && (
          <div className="flex items-center gap-2 mt-1">
            {sub && <span className="text-xs text-muted-foreground">{sub}</span>}
            {trend !== undefined && (
              <span className={`text-xs font-medium ${trend >= 0 ? "text-green-400" : "text-red-400"}`}>
                {trend >= 0 ? "+" : ""}{trend.toFixed(1)}%
              </span>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}
