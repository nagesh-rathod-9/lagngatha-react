// api/analytics.ts
import { BetaAnalyticsDataClient } from "@google-analytics/data";

const client = new BetaAnalyticsDataClient({
  credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  },
});

export default async function handler(req: any, res: any) {
  try {
    if (req.method !== "GET") {
      return res.status(405).json({ message: "Method not allowed" });
    }

    const propertyId = process.env.GA4_PROPERTY_ID;
    if (!propertyId) {
      return res.status(500).json({ message: "GA4_PROPERTY_ID is not configured" });
    }

    // Overview
    const [overviewResponse] = await client.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate: "30daysAgo", endDate: "today" }],
      metrics: [
        { name: "activeUsers" },
        { name: "sessions" },
        { name: "screenPageViews" },
        { name: "averageSessionDuration" },
      ],
    });

    // Locations
    const [locationResponse] = await client.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate: "30daysAgo", endDate: "today" }],
      dimensions: [{ name: "country" }, { name: "region" }, { name: "city" }],
      metrics: [{ name: "activeUsers" }],
      limit: 10,
      orderBys: [{ metric: { metricName: "activeUsers" }, desc: true }],
    });

    // Traffic Sources
    const [trafficResponse] = await client.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate: "30daysAgo", endDate: "today" }],
      dimensions: [{ name: "sessionSource" }, { name: "sessionMedium" }],
      metrics: [{ name: "activeUsers" }, { name: "sessions" }],
      limit: 10,
      orderBys: [{ metric: { metricName: "activeUsers" }, desc: true }],
    });

    const overviewRow = overviewResponse.rows?.[0];
    const overview = {
      activeUsers: Number(overviewRow?.metricValues?.[0]?.value || 0),
      sessions: Number(overviewRow?.metricValues?.[1]?.value || 0),
      screenPageViews: Number(overviewRow?.metricValues?.[2]?.value || 0),
      averageSessionDuration: Number(overviewRow?.metricValues?.[3]?.value || 0),
    };

    const locations = locationResponse.rows?.map((row) => ({
      country: row.dimensionValues?.[0]?.value || "",
      region: row.dimensionValues?.[1]?.value || "",
      city: row.dimensionValues?.[2]?.value || "",
      users: Number(row.metricValues?.[0]?.value || 0),
    })) || [];

    const trafficSources = trafficResponse.rows?.map((row) => ({
      source: row.dimensionValues?.[0]?.value || "",
      medium: row.dimensionValues?.[1]?.value || "",
      users: Number(row.metricValues?.[0]?.value || 0),
      sessions: Number(row.metricValues?.[1]?.value || 0),
    })) || [];

    return res.status(200).json({ overview, locations, trafficSources });
  } catch (error) {
    console.error("GA4 Analytics Error:", error);
    return res.status(500).json({ message: "Failed to fetch Google Analytics data" });
  }
}