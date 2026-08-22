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

interface RealtimePage {
  page: string;
  activeUsers: number;
}

interface RealtimeLocation {
  country: string;
  city: string;
  activeUsers: number;
}

interface Realtime {
  activeUsers: number;
  screenPageViews: number;
  topPages: RealtimePage[];
  locations: RealtimeLocation[];
}

interface AnalyticsData {
  realtime: Realtime;
  overview: Overview;
  locations: Location[];
  trafficSources: TrafficSource[];
}

const formatDuration = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.round(seconds % 60);
  return `${minutes}m ${remainingSeconds}s`;
};

const StatCard = ({
  label,
  value,
  isEmpty,
}: {
  label: string;
  value: string;
  isEmpty: boolean;
}) => (
  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">
    <p className="text-xs uppercase tracking-[0.14em] text-white/45">{label}</p>
    <p
      className={`mt-3 font-[Tillana] text-3xl sm:text-4xl ${
        isEmpty ? "text-white/25" : "text-[#f2e8d5]"
      }`}
    >
      {value}
    </p>
  </div>
);

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
    const interval = setInterval(loadAnalytics, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex justify-center items-center bg-[#0d0d0d]">
        <div className="w-9 h-9 border-2 border-[#C9A227] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[70vh] bg-[#0d0d0d] px-4 py-10">
        <div className="max-w-6xl mx-auto rounded-2xl border border-red-500/20 bg-red-500/[0.06] p-5 text-red-300">
          {error}
        </div>
      </div>
    );
  }

  if (!data) return null;

  const overviewIsEmpty =
    data.overview.activeUsers === 0 &&
    data.overview.sessions === 0 &&
    data.overview.screenPageViews === 0;

  return (
    <div className="min-h-screen bg-[#0d0d0d]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Header */}
        <div className="mb-8 sm:mb-10">
          <h1 className="font-[Tillana] text-3xl sm:text-4xl text-[#f2e8d5]">
            Website Insights
          </h1>
          <p className="text-white/45 mt-1.5 text-sm sm:text-base">
            Traffic and engagement for lagngatha.in
          </p>
        </div>

        {/* Live now — hero card */}
        <div className="rounded-2xl border border-[#C9A227]/25 bg-gradient-to-br from-[#C9A227]/[0.08] to-transparent p-6 sm:p-8 mb-6 sm:mb-8">
          <div className="flex items-center gap-2 mb-4">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C9A227] opacity-60" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#C9A227]" />
            </span>
            <p className="text-xs uppercase tracking-[0.14em] text-[#C9A227]/90">
              Live · last 30 minutes
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6 sm:gap-10">
            <div>
              <p className="font-[Tillana] text-4xl sm:text-5xl text-[#f2e8d5]">
                {data.realtime.activeUsers}
              </p>
              <p className="text-white/45 text-sm mt-1">
                {data.realtime.activeUsers === 1 ? "person" : "people"} on site now
              </p>
            </div>
            <div>
              <p className="font-[Tillana] text-4xl sm:text-5xl text-[#f2e8d5]">
                {data.realtime.screenPageViews}
              </p>
              <p className="text-white/45 text-sm mt-1">page views</p>
            </div>
          </div>

          {data.realtime.topPages.length > 0 && (
            <div className="mt-6 pt-5 border-t border-white/10">
              <p className="text-xs uppercase tracking-[0.14em] text-white/35 mb-3">
                Where they are
              </p>
              <div className="space-y-2">
                {data.realtime.topPages.slice(0, 4).map((page, i) => (
                  <div
                    key={`${page.page}-${i}`}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="text-white/75 truncate pr-3">
                      {page.page || "Unknown page"}
                    </span>
                    <span className="text-[#f2e8d5] font-medium shrink-0">
                      {page.activeUsers}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 30-day overview */}
        <div className="mb-3 flex items-baseline justify-between">
          <h2 className="text-sm uppercase tracking-[0.14em] text-white/45">
            Last 30 days
          </h2>
          {overviewIsEmpty && (
            <span className="text-xs text-white/35">Still gathering data</span>
          )}
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <StatCard
            label="Visitors"
            value={overviewIsEmpty ? "—" : data.overview.activeUsers.toLocaleString()}
            isEmpty={overviewIsEmpty}
          />
          <StatCard
            label="Sessions"
            value={overviewIsEmpty ? "—" : data.overview.sessions.toLocaleString()}
            isEmpty={overviewIsEmpty}
          />
          <StatCard
            label="Page Views"
            value={overviewIsEmpty ? "—" : data.overview.screenPageViews.toLocaleString()}
            isEmpty={overviewIsEmpty}
          />
          <StatCard
            label="Avg. Session"
            value={overviewIsEmpty ? "—" : formatDuration(data.overview.averageSessionDuration)}
            isEmpty={overviewIsEmpty}
          />
        </div>

        {overviewIsEmpty && (
          <p className="text-white/35 text-sm mb-8 -mt-3">
            New properties can take a day or two before historical reports populate.
            The live panel above updates instantly in the meantime.
          </p>
        )}

        {/* Locations + Traffic */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">
            <h2 className="font-[Tillana] text-xl text-[#f2e8d5] mb-4">
              Visitor Locations
            </h2>
            {data.locations.length === 0 ? (
              <p className="text-white/35 text-sm">No location data yet.</p>
            ) : (
              <div className="divide-y divide-white/[0.06]">
                {data.locations.map((location, index) => (
                  <div
                    key={`${location.country}-${location.city}-${index}`}
                    className="flex items-center justify-between py-3"
                  >
                    <div className="min-w-0 pr-3">
                      <p className="text-white/85 font-medium truncate">
                        {location.city || "Unknown"}
                      </p>
                      <p className="text-sm text-white/40 truncate">
                        {location.region || "Unknown"}, {location.country || "Unknown"}
                      </p>
                    </div>
                    <p className="text-[#f2e8d5] font-semibold shrink-0">
                      {location.users.toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">
            <h2 className="font-[Tillana] text-xl text-[#f2e8d5] mb-4">
              Traffic Sources
            </h2>
            {data.trafficSources.length === 0 ? (
              <p className="text-white/35 text-sm">No traffic source data yet.</p>
            ) : (
              <div className="divide-y divide-white/[0.06]">
                {data.trafficSources.map((source, index) => (
                  <div
                    key={`${source.source}-${source.medium}-${index}`}
                    className="flex items-center justify-between py-3"
                  >
                    <div className="min-w-0 pr-3">
                      <p className="text-white/85 font-medium truncate">
                        {source.source || "Direct"}
                      </p>
                      <p className="text-sm text-white/40 truncate">
                        {source.medium || "none"}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-[#f2e8d5] font-semibold">
                        {source.users.toLocaleString()} users
                      </p>
                      <p className="text-sm text-white/40">
                        {source.sessions.toLocaleString()} sessions
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Insights;