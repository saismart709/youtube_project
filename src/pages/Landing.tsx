import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { 
  TrendingUp, 
  BarChart3, 
  Target, 
  Users, 
  Zap, 
  Shield,
  ArrowRight,
  CheckCircle2
} from "lucide-react";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-dark opacity-50" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background" />
        
        <div className="relative container mx-auto px-4 py-24">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm">
              <Zap className="w-4 h-4 text-accent" />
              <span className="text-sm font-medium">Powered by AI & Real-Time Data</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-foreground via-primary-glow to-accent bg-clip-text text-transparent leading-tight">
              Master YouTube Trends
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
              Discover what's trending, analyze engagement metrics, and get AI-powered recommendations to grow your channel
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                onClick={() => navigate("/auth")}
                className="bg-gradient-primary hover:shadow-glow transition-all duration-300 text-lg px-8"
              >
                Get Started Free
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => navigate("/dashboard")}
                className="text-lg px-8 border-primary/30 hover:border-primary/50 hover:bg-primary/5"
              >
                View Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Everything You Need to Succeed</h2>
          <p className="text-xl text-muted-foreground">Comprehensive analytics and insights for content creators</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <Card className="p-6 bg-card/50 backdrop-blur-sm border-border hover:border-primary/50 transition-all duration-300 hover:shadow-glow">
            <div className="w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Real-Time Trends</h3>
            <p className="text-muted-foreground">
              Track trending videos across categories, regions, and languages with live updates
            </p>
          </Card>

          <Card className="p-6 bg-card/50 backdrop-blur-sm border-border hover:border-primary/50 transition-all duration-300 hover:shadow-glow">
            <div className="w-12 h-12 rounded-lg bg-gradient-accent flex items-center justify-center mb-4">
              <BarChart3 className="w-6 h-6 text-accent-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Deep Analytics</h3>
            <p className="text-muted-foreground">
              Comprehensive metrics including engagement, retention curves, and audience insights
            </p>
          </Card>

          <Card className="p-6 bg-card/50 backdrop-blur-sm border-border hover:border-primary/50 transition-all duration-300 hover:shadow-glow">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-success to-success/70 flex items-center justify-center mb-4">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Beginner Analyzer</h3>
            <p className="text-muted-foreground">
              Get personalized recommendations to improve your video's reach and engagement
            </p>
          </Card>

          <Card className="p-6 bg-card/50 backdrop-blur-sm border-border hover:border-primary/50 transition-all duration-300 hover:shadow-glow">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-warning to-warning/70 flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-warning-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Multi-Role Access</h3>
            <p className="text-muted-foreground">
              Tailored dashboards for admins, analysts, and creators with role-based features
            </p>
          </Card>

          <Card className="p-6 bg-card/50 backdrop-blur-sm border-border hover:border-primary/50 transition-all duration-300 hover:shadow-glow">
            <div className="w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center mb-4">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold mb-2">AI Recommendations</h3>
            <p className="text-muted-foreground">
              Smart suggestions for titles, thumbnails, tags, and optimal upload timing
            </p>
          </Card>

          <Card className="p-6 bg-card/50 backdrop-blur-sm border-border hover:border-primary/50 transition-all duration-300 hover:shadow-glow">
            <div className="w-12 h-12 rounded-lg bg-gradient-accent flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-accent-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Secure & Reliable</h3>
            <p className="text-muted-foreground">
              Enterprise-grade security with OAuth2 authentication and encrypted data storage
            </p>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 container mx-auto px-4">
        <Card className="p-12 bg-gradient-to-br from-primary/10 via-card to-accent/10 border-primary/30 max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Grow Your Channel?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of creators using data-driven insights to succeed on YouTube
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-success" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-success" />
              <span>Free tier available</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-success" />
              <span>Cancel anytime</span>
            </div>
          </div>
          
          <Button 
            size="lg"
            onClick={() => navigate("/auth")}
            className="bg-gradient-primary hover:shadow-glow transition-all duration-300 text-lg px-12"
          >
            Start Analyzing Now
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </Card>
      </section>
    </div>
  );
};

export default Landing;
