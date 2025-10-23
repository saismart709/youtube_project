import { Card } from "@/components/ui/card";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const TrendAnalytics = () => {
  // Sample data for charts
  const viewsData = [
    { date: "Jan", views: 42000, engagement: 6.2 },
    { date: "Feb", views: 53000, engagement: 7.1 },
    { date: "Mar", views: 48000, engagement: 6.8 },
    { date: "Apr", views: 61000, engagement: 7.5 },
    { date: "May", views: 55000, engagement: 6.9 },
    { date: "Jun", views: 67000, engagement: 8.2 }
  ];

  const categoryData = [
    { category: "Gaming", videos: 450, avgViews: 125000 },
    { category: "Music", videos: 380, avgViews: 210000 },
    { category: "Education", videos: 290, avgViews: 95000 },
    { category: "Entertainment", videos: 520, avgViews: 180000 },
    { category: "Tech", videos: 310, avgViews: 140000 }
  ];

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        {/* Views & Engagement Trend */}
        <Card className="p-6 bg-card/50 backdrop-blur-sm border-border">
          <h3 className="text-xl font-semibold mb-4">Views & Engagement Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={viewsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "hsl(var(--card))", 
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px"
                }} 
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="views" 
                stroke="hsl(var(--primary))" 
                strokeWidth={2}
                dot={{ fill: "hsl(var(--primary))", r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="engagement" 
                stroke="hsl(var(--accent))" 
                strokeWidth={2}
                dot={{ fill: "hsl(var(--accent))", r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Category Performance */}
        <Card className="p-6 bg-card/50 backdrop-blur-sm border-border">
          <h3 className="text-xl font-semibold mb-4">Category Performance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="category" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "hsl(var(--card))", 
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px"
                }} 
              />
              <Legend />
              <Bar 
                dataKey="videos" 
                fill="hsl(var(--chart-1))" 
                radius={[8, 8, 0, 0]}
              />
              <Bar 
                dataKey="avgViews" 
                fill="hsl(var(--chart-2))" 
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Top Trending Videos Table */}
      <Card className="p-6 bg-card/50 backdrop-blur-sm border-border">
        <h3 className="text-xl font-semibold mb-4">Top Trending Videos</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4">Title</th>
                <th className="text-left py-3 px-4">Category</th>
                <th className="text-right py-3 px-4">Views</th>
                <th className="text-right py-3 px-4">Engagement</th>
                <th className="text-right py-3 px-4">Trend</th>
              </tr>
            </thead>
            <tbody>
              {[
                { title: "Ultimate Gaming Guide 2024", category: "Gaming", views: "1.2M", engagement: "8.5%", trend: "+45%" },
                { title: "Latest Music Hits Compilation", category: "Music", views: "890K", engagement: "7.2%", trend: "+32%" },
                { title: "Tech Review: New Devices", category: "Tech", views: "750K", engagement: "9.1%", trend: "+28%" },
                { title: "Cooking Master Class", category: "Education", views: "650K", engagement: "6.8%", trend: "+19%" },
                { title: "Comedy Sketches Collection", category: "Entertainment", views: "1.5M", engagement: "10.2%", trend: "+67%" }
              ].map((video, index) => (
                <tr key={index} className="border-b border-border hover:bg-muted/50 transition-colors">
                  <td className="py-3 px-4 font-medium">{video.title}</td>
                  <td className="py-3 px-4 text-muted-foreground">{video.category}</td>
                  <td className="py-3 px-4 text-right">{video.views}</td>
                  <td className="py-3 px-4 text-right">{video.engagement}</td>
                  <td className="py-3 px-4 text-right text-success font-medium">{video.trend}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default TrendAnalytics;
