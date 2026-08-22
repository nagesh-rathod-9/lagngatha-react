import { useEffect, useState } from "react";
import {
  Box, Card, CardContent, CircularProgress, Container, Grid,
  Typography, Divider, Alert,
} from "@mui/material";

interface Overview {
  activeUsers: number;
  sessions: number;
  screenPageViews: number;
  averageSessionDuration: number;
}

interface Location {
  country: string;
  region: string;
  city: string;
  users: number;
}

interface TrafficSource {
  source: string;
  medium: string;
  users: number;
  sessions: number;
}

interface AnalyticsData {
  overview: Overview;
  locations: Location[];
  trafficSources: TrafficSource[];
}

const Insights = () => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/analytics");
        if (!response.ok) throw new Error("Failed to load analytics");
        const result = await response.json();
        setData(result);
      } catch (err) {
        console.error(err);
        setError("Unable to load Google Analytics data.");
      } finally {
        setLoading(false);
      }
    };

    loadAnalytics();
  }, []);

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.round(seconds % 60);
    return `${minutes}m ${remainingSeconds}s`;
  };

  if (loading) {
    return (
      <Box sx={{ minHeight: "70vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 5 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!data) return null;

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={700}>Website Insights</Typography>
        <Typography color="text.secondary" sx={{ mt: 1 }}>
          Real-time website analytics from Google Analytics
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Overview Cards */}
        <Grid item xs={12} sm={6} md={3}>
          <Card><CardContent>
            <Typography color="text.secondary">Visitors</Typography>
            <Typography variant="h4" fontWeight={700} sx={{ mt: 1 }}>
              {data.overview.activeUsers.toLocaleString()}
            </Typography>
          </CardContent></Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card><CardContent>
            <Typography color="text.secondary">Sessions</Typography>
            <Typography variant="h4" fontWeight={700} sx={{ mt: 1 }}>
              {data.overview.sessions.toLocaleString()}
            </Typography>
          </CardContent></Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card><CardContent>
            <Typography color="text.secondary">Page Views</Typography>
            <Typography variant="h4" fontWeight={700} sx={{ mt: 1 }}>
              {data.overview.screenPageViews.toLocaleString()}
            </Typography>
          </CardContent></Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card><CardContent>
            <Typography color="text.secondary">Avg. Session</Typography>
            <Typography variant="h4" fontWeight={700} sx={{ mt: 1 }}>
              {formatDuration(data.overview.averageSessionDuration)}
            </Typography>
          </CardContent></Card>
        </Grid>

        {/* Locations */}
        <Grid item xs={12} md={6}>
          <Card><CardContent>
            <Typography variant="h6" fontWeight={700}>Visitor Locations</Typography>
            <Divider sx={{ my: 2 }} />
            {data.locations.length === 0 ? (
              <Typography color="text.secondary">No location data available.</Typography>
            ) : (
              data.locations.map((location, index) => (
                <Box key={`${location.country}-${location.city}-${index}`}
                  sx={{ display: "flex", justifyContent: "space-between", py: 1.5 }}>
                  <Box>
                    <Typography fontWeight={600}>{location.city || "Unknown"}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {location.region || "Unknown"}, {location.country || "Unknown"}
                    </Typography>
                  </Box>
                  <Typography fontWeight={700}>{location.users.toLocaleString()}</Typography>
                </Box>
              ))
            )}
          </CardContent></Card>
        </Grid>

        {/* Traffic Sources */}
        <Grid item xs={12} md={6}>
          <Card><CardContent>
            <Typography variant="h6" fontWeight={700}>Traffic Sources</Typography>
            <Divider sx={{ my: 2 }} />
            {data.trafficSources.length === 0 ? (
              <Typography color="text.secondary">No traffic source data available.</Typography>
            ) : (
              data.trafficSources.map((source, index) => (
                <Box key={`${source.source}-${source.medium}-${index}`}
                  sx={{ display: "flex", justifyContent: "space-between", py: 1.5 }}>
                  <Box>
                    <Typography fontWeight={600}>{source.source || "Direct"}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {source.medium || "none"}
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: "right" }}>
                    <Typography fontWeight={700}>{source.users.toLocaleString()} users</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {source.sessions.toLocaleString()} sessions
                    </Typography>
                  </Box>
                </Box>
              ))
            )}
          </CardContent></Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Insights;