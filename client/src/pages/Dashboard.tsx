import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, Users, Brain, CheckCircle, AlertTriangle } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';
import { useData } from '@/lib/store'; // Import global store

export default function Dashboard() {
  const { stats, reports } = useData(); // Use real data from context

  // Calculate distribution dynamically
  const tumorDistribution = [
    { name: 'Glioma', value: reports.filter(r => r.tumorType === 'glioma').length, color: 'hsl(var(--chart-1))' },
    { name: 'Meningioma', value: reports.filter(r => r.tumorType === 'meningioma').length, color: 'hsl(var(--chart-2))' },
    { name: 'Pituitary', value: reports.filter(r => r.tumorType === 'pituitary').length, color: 'hsl(var(--chart-3))' },
    { name: 'No Tumor', value: reports.filter(r => r.tumorType === 'notumor').length, color: 'hsl(var(--muted))' },
  ];

  // Calculate weekly activity dynamically from real reports
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const weeklyActivity = days.map(day => {
    // In a real app with more data, we'd filter by actual dates falling on this day of the current week
    // For this prototype, we'll just mock empty or count loosely based on day string if we had it, 
    // but simpler is to just show 0 if no data for that day.
    
    // Let's just aggregate all reports by day of week for the chart
    const dayReports = reports.filter(r => {
      const reportDate = new Date(r.date);
      return days[reportDate.getDay()] === day;
    });
    
    return {
      name: day,
      scans: dayReports.length,
      detected: dayReports.filter(r => r.tumorType !== 'notumor').length
    };
  });
  // Reorder to start from Monday for the chart visual preference if needed, or keep Sun-Sat
  // Let's rotate to Mon-Sun
  const rotatedWeeklyActivity = [...weeklyActivity.slice(1), weeklyActivity[0]];

  return (
    <Layout>
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard Overview</h2>
          <p className="text-muted-foreground mt-2">Welcome back, Dr. Wilson. Here is the latest diagnostic summary.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Scans Analyzed</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalScans}</div>
              <p className="text-xs text-muted-foreground">Real-time count</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tumors Detected</CardTitle>
              <AlertTriangle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.tumorDetected}</div>
              <p className="text-xs text-muted-foreground">
                {stats.totalScans > 0 
                  ? `${((stats.tumorDetected / stats.totalScans) * 100).toFixed(1)}% of total` 
                  : '0% of total'}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Healthy Scans</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.healthy}</div>
              <p className="text-xs text-muted-foreground">
                {stats.totalScans > 0 
                  ? `${((stats.healthy / stats.totalScans) * 100).toFixed(1)}% of total` 
                  : '0% of total'}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Model Accuracy</CardTitle>
              <Brain className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.accuracy}%</div>
              <p className="text-xs text-muted-foreground">Based on validation set</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Weekly Analysis Activity</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={rotatedWeeklyActivity}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" vertical={false} />
                    <XAxis 
                      dataKey="name" 
                      stroke="#888888" 
                      fontSize={12} 
                      tickLine={false} 
                      axisLine={false} 
                    />
                    <YAxis 
                      stroke="#888888" 
                      fontSize={12} 
                      tickLine={false} 
                      axisLine={false} 
                      tickFormatter={(value) => `${value}`} 
                    />
                    <Tooltip 
                      cursor={{fill: 'transparent'}}
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                    />
                    <Legend />
                    <Bar dataKey="scans" name="Total Scans" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="detected" name="Tumors Detected" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Tumor Classification Distribution</CardTitle>
              <CardDescription>Breakdown of detected tumor types from current data</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={tumorDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {tumorDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                    <Legend verticalAlign="bottom" height={36} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent History Preview */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Analysis</CardTitle>
            <CardDescription>Latest patient reports generated</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reports.slice(0, 3).map((report) => (
                <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-md overflow-hidden bg-muted">
                      <img src={report.imageUrl} alt="Scan" className="h-full w-full object-cover" />
                    </div>
                    <div>
                      <p className="font-medium">{report.name}</p>
                      <p className="text-sm text-muted-foreground">{report.id} • {new Date(report.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className={`px-3 py-1 rounded-full text-xs font-medium capitalize 
                      ${report.tumorType === 'notumor' 
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                        : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                      {report.tumorType === 'notumor' ? 'No Tumor' : report.tumorType}
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold">{(report.confidence * 100).toFixed(1)}%</p>
                      <p className="text-xs text-muted-foreground">Confidence</p>
                    </div>
                  </div>
                </div>
              ))}
              {reports.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No reports generated yet. Start a new analysis to see results here.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
