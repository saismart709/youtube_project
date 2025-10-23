import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  TrendingUp, 
  TrendingDown, 
  Target, 
  ThumbsUp,
  Eye,
  Clock,
  Tag,
  Image as ImageIcon,
  FileText
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from "recharts";

const BeginnerAnalyzer = () => {
  const [videoUrl, setVideoUrl] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState<any>(null);
  const { toast } = useToast();

  const handleAnalyze = async () => {
    if (!videoUrl.trim()) {
      toast({
        variant: "destructive",
        title: "URL Required",
        description: "Please enter a valid YouTube video URL",
      });
      return;
    }

    setAnalyzing(true);
    setResults(null);
    
    try {
      const { data, error } = await supabase.functions.invoke('analyze-video', {
        body: { videoUrl }
      });

      if (error) {
        console.error('Analysis error:', error);
        toast({
          variant: "destructive",
          title: "Analysis Failed",
          description: error.message || "Failed to analyze video. Please try again.",
        });
        setAnalyzing(false);
        return;
      }

      if (data.error) {
        toast({
          variant: "destructive",
          title: "Analysis Failed",
          description: data.error,
        });
        setAnalyzing(false);
        return;
      }

      // Map icon names to actual icon components
      const iconMap: Record<string, any> = {
        FileText,
        ImageIcon,
        Tag,
        Clock,
        ThumbsUp,
        Eye
      };

      const processedData = {
        ...data,
        recommendations: data.recommendations.map((rec: any) => ({
          ...rec,
          icon: iconMap[rec.icon] || FileText
        }))
      };

      setResults(processedData);
      toast({
        title: "Analysis Complete",
        description: "Your video has been analyzed with AI insights",
      });
    } catch (error) {
      console.error('Analysis error:', error);
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: "An unexpected error occurred. Please try again.",
      });
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <Card className="p-6 bg-card/50 backdrop-blur-sm border-border">
        <h3 className="text-xl font-semibold mb-4">Analyze Your Video</h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="video-url">YouTube Video URL</Label>
            <Input
              id="video-url"
              type="url"
              placeholder="https://youtube.com/watch?v=..."
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              className="mt-2"
            />
          </div>
          <Button 
            onClick={handleAnalyze}
            disabled={analyzing}
            className="w-full bg-gradient-primary hover:shadow-glow"
          >
            {analyzing ? (
              <>
                <Target className="w-4 h-4 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Target className="w-4 h-4 mr-2" />
                Analyze Video
              </>
            )}
          </Button>
        </div>
      </Card>

      {/* Results Section */}
      {results && (
        <>
          {/* Metrics Overview with Visualizations */}
          <Card className="p-6 bg-card/50 backdrop-blur-sm border-border">
            <h3 className="text-xl font-semibold mb-6">Video Score Breakdown</h3>
            
            <div className="grid lg:grid-cols-2 gap-8 mb-8">
              {/* Score Progress Bars */}
              <div className="space-y-6">
                {Object.entries(results.metrics).map(([key, value]: [string, any]) => (
                  <div key={key} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="capitalize font-medium">{key.replace('Score', '')}</span>
                      <span className="text-2xl font-bold text-primary">{value}/100</span>
                    </div>
                    <Progress value={value} className="h-4" />
                  </div>
                ))}
              </div>

              {/* Radar Chart */}
              <div className="h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={Object.entries(results.metrics).map(([key, value]: [string, any]) => ({
                    metric: key.replace('Score', ''),
                    score: value,
                    fullMark: 100
                  }))}>
                    <PolarGrid stroke="hsl(var(--border))" />
                    <PolarAngleAxis dataKey="metric" stroke="hsl(var(--foreground))" />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} stroke="hsl(var(--muted-foreground))" />
                    <Radar 
                      name="Score" 
                      dataKey="score" 
                      stroke="hsl(var(--primary))" 
                      fill="hsl(var(--primary))" 
                      fillOpacity={0.5} 
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--background))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }} 
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Bar Chart */}
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={Object.entries(results.metrics).map(([key, value]: [string, any]) => ({
                  name: key.replace('Score', ''),
                  score: value
                }))}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" stroke="hsl(var(--foreground))" />
                  <YAxis domain={[0, 100]} stroke="hsl(var(--foreground))" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--background))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }} 
                  />
                  <Legend />
                  <Bar 
                    dataKey="score" 
                    fill="hsl(var(--primary))" 
                    radius={[8, 8, 0, 0]} 
                    name="Score"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Advantages & Drawbacks */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6 bg-card/50 backdrop-blur-sm border-success/30">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-success" />
                <h3 className="text-xl font-semibold">Advantages</h3>
              </div>
              <ul className="space-y-2">
                {results.advantages.map((advantage: string, index: number) => (
                  <li key={index} className="flex items-start gap-2">
                    <ThumbsUp className="w-4 h-4 text-success mt-1 flex-shrink-0" />
                    <span>{advantage}</span>
                  </li>
                ))}
              </ul>
            </Card>

            <Card className="p-6 bg-card/50 backdrop-blur-sm border-warning/30">
              <div className="flex items-center gap-2 mb-4">
                <TrendingDown className="w-5 h-5 text-warning" />
                <h3 className="text-xl font-semibold">Areas for Improvement</h3>
              </div>
              <ul className="space-y-2">
                {results.drawbacks.map((drawback: string, index: number) => (
                  <li key={index} className="flex items-start gap-2">
                    <Eye className="w-4 h-4 text-warning mt-1 flex-shrink-0" />
                    <span>{drawback}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>

          {/* Actionable Recommendations */}
          <Card className="p-6 bg-card/50 backdrop-blur-sm border-border">
            <h3 className="text-xl font-semibold mb-4">Actionable Recommendations</h3>
            <div className="space-y-4">
              {results.recommendations.map((rec: any, index: number) => (
                <div key={index} className="flex items-start gap-4 p-4 rounded-lg bg-muted/50 border border-border hover:border-primary/50 transition-colors">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    rec.priority === 'High' ? 'bg-destructive/20' : 'bg-warning/20'
                  }`}>
                    <rec.icon className={`w-5 h-5 ${
                      rec.priority === 'High' ? 'text-destructive' : 'text-warning'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold">{rec.title}</h4>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        rec.priority === 'High' 
                          ? 'bg-destructive/20 text-destructive' 
                          : 'bg-warning/20 text-warning'
                      }`}>
                        {rec.priority} Priority
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{rec.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </>
      )}
    </div>
  );
};

export default BeginnerAnalyzer;
