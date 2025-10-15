'use client';

import { useState, useEffect } from 'react';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { VideoFeed } from '@/components/dashboard/video-feed';
import { StatCard } from '@/components/dashboard/stat-card';
import { ControlPanel } from '@/components/dashboard/control-panel';
import { DensityChart } from '@/components/dashboard/density-chart';
import { ObjectTracking } from '@/components/dashboard/object-tracking';
import { UploadDialog } from '@/components/dashboard/upload-dialog';
import {
  adjustAlertThresholds,
  AdjustAlertThresholdsOutput,
} from '@/ai/flows/adjust-alert-thresholds';
import {
  summarizeCrowdBehavior,
  SummarizeCrowdBehaviorOutput,
} from '@/ai/flows/summarize-crowd-behavior';
import { Users, AlertTriangle, Route, Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';


export type AlertStatus = 'Normal' | 'Caution' | 'Warning' | 'Critical';

const objectTrackingData = JSON.stringify([
    { id: 1, timestamps: [{ t: 0, x: 10, y: 20 }, { t: 5, x: 12, y: 22 }] },
    { id: 2, timestamps: [{ t: 0, x: 50, y: 80 }, { t: 5, x: 55, y: 81 }] },
    { id: 3, timestamps: [{ t: 0, x: 100, y: 120 }, { t: 5, x: 100, y: 125 }] },
]);

export default function DashboardClient() {
  const [currentDensity, setCurrentDensity] = useState(45);
  const [densityThreshold, setDensityThreshold] = useState(60);
  const [alertInfo, setAlertInfo] = useState<AdjustAlertThresholdsOutput>({
    alertMessage: 'Loading...',
    crowdStatusLevel: 'Normal',
  });
  const [behaviorSummary, setBehaviorSummary] =
    useState<SummarizeCrowdBehaviorOutput>({
      summary: 'Analyzing crowd behavior...',
      riskAreas: [],
      commonMovementFlows: [],
    });
  const [isLoadingAlert, setIsLoadingAlert] = useState(true);
  const [isUploadOpen, setUploadOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDensity(prev => {
        const change = Math.floor(Math.random() * 5) - 2; // -2 to +2
        const newDensity = prev + change;
        return Math.max(0, Math.min(100, newDensity)); // Clamp between 0 and 100
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    async function getAlerts() {
        setIsLoadingAlert(true);
      const res = await adjustAlertThresholds({
        crowdDensityThreshold: densityThreshold,
        currentCrowdDensity: currentDensity,
      });
      setAlertInfo(res);
      setIsLoadingAlert(false);
    }
    getAlerts();
  }, [currentDensity, densityThreshold]);

  useEffect(() => {
    async function getSummary() {
      const res = await summarizeCrowdBehavior({ objectTrackingData });
      setBehaviorSummary(res);
    }
    getSummary();
  }, []);
  
  const handleFileUpload = (file: File) => {
    toast({
        title: 'Upload Successful',
        description: `${file.name} has been uploaded for processing.`,
    });
    setUploadOpen(false);
  };

  return (
    <>
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
      <DashboardHeader onUploadClick={() => setUploadOpen(true)} />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Current Density"
          value={`${currentDensity}%`}
          icon={<Users className="text-accent-foreground" />}
        />
        <StatCard
          title="Crowd Status"
          value={alertInfo.crowdStatusLevel}
          icon={<Shield className="text-accent-foreground" />}
          status={alertInfo.crowdStatusLevel as AlertStatus}
        />
        <StatCard
          title="Risk Areas"
          value={behaviorSummary.riskAreas.length}
          icon={<AlertTriangle className="text-accent-foreground" />}
        />
        <StatCard
          title="Common Flows"
          value={behaviorSummary.commonMovementFlows.length}
          icon={<Route className="text-accent-foreground" />}
        />
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <VideoFeed />
        </div>
        <ControlPanel
          threshold={densityThreshold}
          onThresholdChange={setDensityThreshold}
          alertMessage={alertInfo.alertMessage}
          crowdStatus={alertInfo.crowdStatusLevel as AlertStatus}
          isLoading={isLoadingAlert}
        />
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <DensityChart />
        </div>
        <div className="lg:col-span-2">
          <ObjectTracking
            summary={behaviorSummary.summary}
          />
        </div>
      </div>
    </div>
    <UploadDialog
        isOpen={isUploadOpen}
        onOpenChange={setUploadOpen}
        onFileUpload={handleFileUpload}
      />
    </>
  );
}
