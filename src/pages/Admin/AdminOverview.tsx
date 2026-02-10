import { useEffect, useState } from "react";
import axios from "@/utils/axiosInstance";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Users,
  FileText,
  FileDown,
  MessageCircle,
  Activity,
  TrendingUp,
  AlertCircle,
} from "lucide-react";

interface Stats {
  totalUsers: number;
  totalStories: number;
  totalArtifacts: number;
  totalChats: number;
  dailyActiveUsers: number;
  monthlyActiveUsers: number;
}

function StatCard({
  title,
  value,
  icon: Icon,
  description,
}: {
  title: string;
  value: number | string;
  icon: React.ElementType;
  description?: string;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}

function OverviewSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-48" />
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-3 w-32 mt-2" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default function AdminOverview() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get("/admin-dashboard/stats");
        setStats(res.data);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load stats");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <OverviewSkeleton />;

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!stats) return null;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Overview</h1>
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Total Users"
          value={stats.totalUsers.toLocaleString()}
          icon={Users}
          description="Registered accounts"
        />
        <StatCard
          title="Total Stories"
          value={stats.totalStories.toLocaleString()}
          icon={FileText}
          description="Stories created"
        />
        <StatCard
          title="Total Artifacts"
          value={stats.totalArtifacts.toLocaleString()}
          icon={FileDown}
          description="Generated artifacts"
        />
        <StatCard
          title="Total Chats"
          value={stats.totalChats.toLocaleString()}
          icon={MessageCircle}
          description="Chat conversations"
        />
        <StatCard
          title="Daily Active Users"
          value={stats.dailyActiveUsers.toLocaleString()}
          icon={Activity}
          description="Active today"
        />
        <StatCard
          title="Monthly Active Users"
          value={stats.monthlyActiveUsers.toLocaleString()}
          icon={TrendingUp}
          description="Active this month"
        />
      </div>
    </div>
  );
}
