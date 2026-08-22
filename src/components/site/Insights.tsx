import { useEffect, useState } from "react";

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
      <div className="min-h-[70vh] flex justify-center items-center">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto py-10">
        <div className="bg-red-100 text-red-700 p-4 rounded-lg">{error}</div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Website Insights</h1>
        <p className="text-gray-500 mt-1">Real-time website analytics from Google Analytics</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {/* Overview Cards */}
        <div className="bg-white shadow rounded-lg p-6">
          <p className="text-gray-500">Visitors</p>
          <p className="text-3xl font-bold mt-2">{data.overview.activeUsers.toLocaleString()}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-6">
          <p className="text-gray-500">Sessions</p>
          <p className="text-3xl font-bold mt-2">{data.overview.sessions.toLocaleString()}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-6">
          <p className="text-gray-500">Page Views</p>
          <p className="text-3xl font-bold mt-2">{data.overview.screenPageViews.toLocaleString()}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-6">
          <p className="text-gray-500">Avg. Session</p>
          <p className="text-3xl font-bold mt-2">{formatDuration(data.overview.averageSessionDuration)}</p>
        </div>

        {/* Locations */}
        <div className="bg-white shadow rounded-lg p-6 md:col-span-2">
          <h2 className="text-lg font-bold mb-4">Visitor Locations</h2>
          <div className="divide-y divide-gray-100">
            {data.locations.length === 0 ? (
              <p className="text-gray-500">No location data available.</p>
            ) : (
              data.locations.map((location, index) => (
                <div key={`${location.country}-${location.city}-${index}`} className="flex justify-between py-3">
                  <div>
                    <p className="font-semibold">{location.city || "Unknown"}</p>
                    <p className="text-sm text-gray-500">
                      {location.region || "Unknown"}, {location.country || "Unknown"}
                    </p>
                  </div>
                  <p className="font-bold">{location.users.toLocaleString()}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Traffic Sources */}
        <div className="bg-white shadow rounded-lg p-6 md:col-span-2">
          <h2 className="text-lg font-bold mb-4">Traffic Sources</h2>
          <div className="divide-y divide-gray-100">
            {data.trafficSources.length === 0 ? (
              <p className="text-gray-500">No traffic source data available.</p>
            ) : (
              data.trafficSources.map((source, index) => (
                <div key={`${source.source}-${source.medium}-${index}`} className="flex justify-between py-3">
                  <div>
                    <p className="font-semibold">{source.source || "Direct"}</p>
                    <p className="text-sm text-gray-500">{source.medium || "none"}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{source.users.toLocaleString()} users</p>
                    <p className="text-sm text-gray-500">{source.sessions.toLocaleString()} sessions</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Insights;