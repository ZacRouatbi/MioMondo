import { NextRequest, NextResponse } from "next/server";
import { secureRequest } from "@/lib/core/gateway";

const WC_URL = process.env.WC_URL!;
const WC_KEY = process.env.WC_KEY!;
const WC_SECRET = process.env.WC_SECRET!;
const wcAuth = `Basic ${Buffer.from(`${WC_KEY}:${WC_SECRET}`).toString("base64")}`;

export async function GET(req: NextRequest) {
  let debugTrace: any = { step: "Init" };

  try {
    // 1. Security Check (Rate Limiting)
    const gateway = await secureRequest(req as any, "settings");
    if (!gateway.ok) {
      return NextResponse.json({ message: "Too many requests" }, { status: 429 });
    }

    // 2. Fetch All Shipping Zones
    debugTrace.step = "Fetching Zones";
    const zonesRes = await fetch(`${WC_URL}/wp-json/wc/v3/shipping/zones`, {
      headers: { Authorization: wcAuth },
      cache: 'no-store'
    });
    
    if (!zonesRes.ok) {
      const errorText = await zonesRes.text();
      throw new Error(`WC Zones API failed: ${zonesRes.status} - ${errorText}`);
    }

    const zones = await zonesRes.json();
    
    // 3. TARGET THE "TUNISIE" ZONE
    // We search for "Tunisie" first. If not found, we take the first non-zero zone.
    const activeZone = zones.find((z: any) => z.name === "Tunisie") || 
                       zones.find((z: any) => z.id !== 0) || 
                       zones[0];

    const zoneId = activeZone?.id || 0;
    
    debugTrace.selectedZone = { id: zoneId, name: activeZone?.name };
    debugTrace.allAvailableZones = zones.map((z: any) => ({ id: z.id, name: z.name }));

    // 4. Fetch Methods for the Selected Zone
    debugTrace.step = "Fetching Methods";
    const methodsRes = await fetch(`${WC_URL}/wp-json/wc/v3/shipping/zones/${zoneId}/methods`, {
      headers: { Authorization: wcAuth },
      cache: 'no-store'
    });

    if (!methodsRes.ok) {
      const errorText = await methodsRes.text();
      throw new Error(`WC Methods API failed: ${methodsRes.status} - ${errorText}`);
    }

    const methods = await methodsRes.json();
    debugTrace.rawMethods = methods;

    // 5. Extract Specific Shipping Rules
    // We look for 'flat_rate' and 'free_shipping' that are currently ENABLED in WC
    const flatRate = methods.find((m: any) => m.method_id === "flat_rate" && m.enabled);
    const freeShipping = methods.find((m: any) => m.method_id === "free_shipping" && m.enabled);

    debugTrace.step = "Parsing Results";

    // 6. Final Clean Data (with fallbacks for Sousse defaults)
    const settings = {
      rate: flatRate?.settings?.cost?.value 
        ? parseFloat(flatRate.settings.cost.value) 
        : 7, // Default 7 TND
      threshold: freeShipping?.settings?.min_amount?.value 
        ? parseFloat(freeShipping.settings.min_amount.value) 
        : 300, // Default 300 TND
    };

    return NextResponse.json({
      ...settings,
      _debug: debugTrace,
      _timestamp: new Date().toISOString()
    });

  } catch (err: any) {
    console.error("[shipping-settings-api] Fatal Error:", err.message);
    
    return NextResponse.json({ 
      error: true,
      message: err.message,
      step: debugTrace.step,
      debug: debugTrace 
    }, { status: 500 });
  }
}