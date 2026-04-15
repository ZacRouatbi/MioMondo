import { NextRequest, NextResponse } from "next/server";
import { getCache, setCache } from "@/lib/core/cache"; // Adjust path as needed
import { secureRequest } from "@/lib/core/gateway";

const WC_URL = process.env.WC_URL!;
const WC_KEY = process.env.WC_KEY!;
const WC_SECRET = process.env.WC_SECRET!;
const wcAuth = `Basic ${Buffer.from(`${WC_KEY}:${WC_SECRET}`).toString("base64")}`;

export async function GET(req: NextRequest) {
  const CACHE_KEY = "wc_shipping_settings";

  try {
    const gateway = await secureRequest(req as any, "settings");
    if (!gateway.ok) {
      return NextResponse.json({ message: "Too many requests" }, { status: 429 });
    }

    const cached = await getCache(CACHE_KEY);
    if (cached) {
      return NextResponse.json(cached);
    }
    const zonesRes = await fetch(`${WC_URL}/wp-json/wc/v3/shipping/zones`, {
      headers: { Authorization: wcAuth },
    });
    
    if (!zonesRes.ok) throw new Error("Failed to fetch zones");
    const zones = await zonesRes.json();
    const zoneId = zones[0]?.id || 0;

    const methodsRes = await fetch(`${WC_URL}/wp-json/wc/v3/shipping/zones/${zoneId}/methods`, {
      headers: { Authorization: wcAuth }
    });
    
    if (!methodsRes.ok) throw new Error("Failed to fetch methods");
    const methods = await methodsRes.json();

    const flatRate = methods.find((m: any) => m.method_id === "flat_rate" && m.enabled);
    const freeShipping = methods.find((m: any) => m.method_id === "free_shipping" && m.enabled);

    const settings = {
      rate: parseFloat(flatRate?.settings?.cost?.value || "7"),
      threshold: parseFloat(freeShipping?.settings?.min_amount?.value || "300"),
    };
    
    await setCache(CACHE_KEY, settings, 3600);

    return NextResponse.json(settings);
  } catch (error) {
    console.error("[settings-api] Error:", error);
    // Silent fallback so the UI doesn't break
    return NextResponse.json({ rate: 7, threshold: 300 });
  }
}