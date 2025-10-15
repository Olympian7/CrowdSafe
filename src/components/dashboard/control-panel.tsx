import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  CheckCircle2,
  ShieldAlert,
  AlertTriangle,
  OctagonAlert,
  Loader,
} from 'lucide-react';
import type { AlertStatus } from '@/app/dashboard-client';
import { cn } from '@/lib/utils';

type ControlPanelProps = {
  threshold: number;
  onThresholdChange: (value: number) => void;
  alertMessage: string;
  crowdStatus: AlertStatus;
  isLoading: boolean;
};

const statusConfig: Record<
  AlertStatus,
  { icon: React.ElementType; color: string; title: string }
> = {
  Normal: {
    icon: CheckCircle2,
    color: 'border-green-500/50 text-green-400',
    title: 'Status: Normal',
  },
  Caution: {
    icon: ShieldAlert,
    color: 'border-yellow-500/50 text-yellow-400',
    title: 'Status: Caution',
  },
  Warning: {
    icon: AlertTriangle,
    color: 'border-orange-500/50 text-orange-400',
    title: 'Status: Warning',
  },
  Critical: {
    icon: OctagonAlert,
    color: 'border-red-500/50 text-red-500',
    title: 'Status: Critical',
  },
};

export function ControlPanel({
  threshold,
  onThresholdChange,
  alertMessage,
  crowdStatus,
  isLoading,
}: ControlPanelProps) {
  const config = statusConfig[crowdStatus];
  const Icon = config?.icon || Loader;

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>System Controls</CardTitle>
        <CardDescription>
          Adjust thresholds and monitor system alerts.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col justify-between gap-6">
        <div>
          <label
            htmlFor="threshold"
            className="mb-2 block text-sm font-medium"
          >
            Density Alert Threshold ({threshold}%)
          </label>
          <Slider
            id="threshold"
            min={0}
            max={100}
            step={1}
            value={[threshold]}
            onValueChange={([value]) => onThresholdChange(value)}
          />
        </div>

        <Alert className={cn('flex-grow', config?.color)}>
          <Icon className="h-4 w-4" />
          <AlertTitle className="flex items-center gap-2">
            {isLoading ? "Analyzing..." : (config?.title || "Status")}
            {isLoading && <Loader className="h-4 w-4 animate-spin" />}
          </AlertTitle>
          <AlertDescription>{isLoading ? "Recalibrating based on new threshold..." : alertMessage}</AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}
