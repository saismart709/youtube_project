import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  TrendingUp, 
  BarChart3, 
  Users, 
  Video,
  LogOut,
  Target
} from "lucide-react";
import TrendAnalytics from "@/components/TrendAnalytics";
import BeginnerAnalyzer from "@/components/BeginnerAnalyzer";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check authentication
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/auth");
        return;
      }
      
      setUser(session.user);
      setLoading(false);
    };

    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT") {
        navigate("/auth");
      } else if (session) {
        setUser(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse">
          <TrendingUp className="w-12 h-12 text-primary" />
        </div>
      </div>
    );
  }

  // Sample metrics data
  const metrics = [
    {
      title: "Trending Videos",
      value: "1,234",
      change: "+12.5%",
      icon: Video,
      color: "text-primary"
    },
    {
      title: "Total Views",
      value: "45.2M",
      change: "+8.3%",
      icon: TrendingUp,
      color: "text-accent"
    },
    {
      title: "Active Creators",
      value: "892",
      change: "+23.1%",
      icon: Users,
      color: "text-success"
    },
    {
      title: "Avg Engagement",
      value: "6.7%",
      change: "+2.4%",
      icon: BarChart3,
      color: "text-warning"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold">YouTube Trends</h1>
              <p className="text-sm text-muted-foreground">
                Welcome back, {user?.user_metadata?.name || user?.email}
              </p>
            </div>
          </div>
          
          <Button
            variant="outline"
            onClick={handleSignOut}
            className="border-primary/30 hover:border-primary/50"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {metrics.map((metric, index) => (
            <Card key={index} className="p-6 bg-card/50 backdrop-blur-sm border-border hover:border-primary/50 transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <metric.icon className={`w-8 h-8 ${metric.color}`} />
                <span className="text-sm font-medium text-success">{metric.change}</span>
              </div>
              <h3 className="text-2xl font-bold mb-1">{metric.value}</h3>
              <p className="text-sm text-muted-foreground">{metric.title}</p>
            </Card>
          ))}
        </div>

        {/* Tabs for different views */}
        <Tabs defaultValue="trends" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="trends">
              <BarChart3 className="w-4 h-4 mr-2" />
              Trend Analytics
            </TabsTrigger>
            <TabsTrigger value="analyzer">
              <Target className="w-4 h-4 mr-2" />
              Beginner Analyzer
            </TabsTrigger>
          </TabsList>

          <TabsContent value="trends">
            <TrendAnalytics />
          </TabsContent>

          <TabsContent value="analyzer">
            <BeginnerAnalyzer />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Dashboard;
