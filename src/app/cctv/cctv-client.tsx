'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { StatCard } from '@/components/dashboard/stat-card';
import { PeopleCountChart } from '@/components/cctv/people-count-chart';
import { Upload, Play, Pause, StopCircle, Users, Signal, ShieldAlert, ScanLine, Loader } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { analyzeCctvFrame, AnalyzeCctvFrameOutput } from '@/ai/flows/analyze-cctv-frame';
import { Slider } from '@/components/ui/slider';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { cn } from '@/lib/utils';
import { AlertStatus } from '@/app/dashboard-client';

const statusConfig: Record<
  AlertStatus,
  { icon: React.ElementType; color: string; title: string }
> = {
  Normal: {
    icon: ShieldAlert,
    color: 'border-green-500/50 text-green-400',
    title: 'Status: Normal',
  },
  Caution: {
    icon: ShieldAlert,
    color: 'border-yellow-500/50 text-yellow-400',
    title: 'Status: Caution',
  },
  Warning: {
    icon: ShieldAlert,
    color: 'border-orange-500/50 text-orange-400',
    title: 'Status: Warning',
  },
  Critical: {
    icon: ShieldAlert,
    color: 'border-red-500/50 text-red-500',
    title: 'Status: Critical',
  },
};


export default function CctvClient() {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalyzeCctvFrameOutput | null>(null);
  const [peopleCountHistory, setPeopleCountHistory] = useState<{ time: number, count: number }[]>([]);
  const [thresholds, setThresholds] = useState({
    medium: 15,
    high: 25,
    critical: 40,
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { toast } = useToast();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('video/')) {
      const url = URL.createObjectURL(file);
      setVideoUrl(url);
      setAnalysisResult(null);
      setPeopleCountHistory([]);
      setIsPlaying(false);
      toast({
        title: 'Video Loaded',
        description: `Ready to analyze ${file.name}.`,
      });
    } else {
      toast({
        variant: 'destructive',
        title: 'Invalid File Type',
        description: 'Please select a valid video file.',
      });
    }
  };

  const handleAnalyzeFrame = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current) {
        toast({
            variant: 'destructive',
            title: 'Analysis Failed',
            description: 'Video not ready for analysis.',
        });
        return;
    }
    setIsAnalyzing(true);

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
        setIsAnalyzing(false);
        return;
    }

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const frameDataUrl = canvas.toDataURL('image/jpeg');

    toast({
      title: 'Analyzing Frame...',
      description: 'Please wait while the AI processes the video frame.',
    });

    try {
      const result = await analyzeCctvFrame({ videoFrame: frameDataUrl, thresholds });
      setAnalysisResult(result);
      setPeopleCountHistory(prev => [...prev, { time: video.currentTime, count: result.peopleCount }].slice(-50));
      toast({
        title: 'Analysis Complete',
        description: `Found ${result.peopleCount} people. Density is ${result.densityLevel}.`,
      });
    } catch (error) {
      console.error("Frame analysis failed:", error);
      toast({
        variant: 'destructive',
        title: 'Analysis Failed',
        description: 'Could not analyze the video frame.',
      });
    } finally {
        setIsAnalyzing(false);
    }
  }, [thresholds, toast]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(e => console.error("Play failed:", e));
    }
  };

  const stopVideo = () => {
    if (!videoRef.current) return;
    videoRef.current.pause();
    videoRef.current.currentTime = 0;
    setIsPlaying(false);
  };

  const config = analysisResult ? statusConfig[analysisResult.densityLevel as AlertStatus] : statusConfig['Normal'];
  const Icon = config.icon;

  return (
    <div className="flex h-full flex-col gap-4 p-4 md:gap-8 md:p-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">CCTV Footage Analysis</h1>
          <p className="text-muted-foreground">Upload and analyze crowd behavior in video footage.</p>
        </div>
      </header>
      <div className="grid flex-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
        <div className="md:col-span-2 lg:col-span-3 flex flex-col gap-4">
           <Card className="flex-grow">
            <CardContent className="p-4 h-full">
              <div className="aspect-video h-full w-full overflow-hidden rounded-lg border bg-card-foreground">
                {videoUrl ? (
                  <video ref={videoRef} src={videoUrl} className="h-full w-full object-contain" onEnded={() => setIsPlaying(false)} />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-muted">
                    <p className="text-muted-foreground">Upload a video to begin analysis</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          <PeopleCountChart data={peopleCountHistory} />
        </div>
        <div className="md:col-span-1 lg:col-span-1 flex flex-col gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Controls</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <Button onClick={() => fileInputRef.current?.click()}>
                <Upload className="mr-2 h-4 w-4" /> Upload Video
              </Button>
              <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="video/*" className="hidden" />
              <div className="grid grid-cols-2 gap-2">
                <Button onClick={togglePlay} disabled={!videoUrl}>
                  {isPlaying ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
                  {isPlaying ? 'Pause' : 'Play'}
                </Button>
                <Button onClick={stopVideo} disabled={!videoUrl}>
                  <StopCircle className="mr-2 h-4 w-4" /> Stop
                </Button>
              </div>
              <Button onClick={handleAnalyzeFrame} disabled={!videoUrl || isAnalyzing}>
                {isAnalyzing ? <Loader className="mr-2 h-4 w-4 animate-spin" /> : <ScanLine className="mr-2 h-4 w-4" />}
                 {isAnalyzing ? 'Analyzing...' : 'Analyze Frame'}
              </Button>
            </CardContent>
          </Card>
           <Card>
            <CardHeader>
              <CardTitle>Real-time Statistics</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <StatCard title="People Count" value={analysisResult?.peopleCount ?? 0} icon={<Users />} />
              <StatCard title="Density Level" value={analysisResult?.densityLevel ?? 'Normal'} icon={<Signal />} status={(analysisResult?.densityLevel as AlertStatus) ?? 'Normal'} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
                <CardTitle>System Status</CardTitle>
            </CardHeader>
            <CardContent>
                <Alert className={cn(config.color)}>
                    <Icon className="h-4 w-4" />
                    <AlertTitle>{config.title}</AlertTitle>
                    <AlertDescription>{analysisResult?.alertMessage ?? 'System is operating normally.'}</AlertDescription>
                </Alert>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Density Thresholds</CardTitle>
              <CardDescription>Adjust sensitivity levels.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
                <div>
                  <label htmlFor="medium" className="mb-2 block text-sm font-medium">Medium ({thresholds.medium})</label>
                  <Slider id="medium" min={1} max={100} step={1} value={[thresholds.medium]} onValueChange={([v]) => setThresholds(t => ({ ...t, medium: v }))} />
                </div>
                <div>
                  <label htmlFor="high" className="mb-2 block text-sm font-medium">High ({thresholds.high})</label>
                  <Slider id="high" min={1} max={100} step={1} value={[thresholds.high]} onValueChange={([v]) => setThresholds(t => ({ ...t, high: v }))} />
                </div>
                <div>
                  <label htmlFor="critical" className="mb-2 block text-sm font-medium">Critical ({thresholds.critical})</label>
                  <Slider id="critical" min={1} max={100} step={1} value={[thresholds.critical]} onValueChange={([v]) => setThresholds(t => ({ ...t, critical: v }))} />
                </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
