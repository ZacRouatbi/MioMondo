// lib/wc-settings.ts
const WC_URL = process.env.WC_URL!;
const WC_KEY = process.env.WC_KEY!;
const WC_SECRET = process.env.WC_SECRET!;
const wcAuth = `Basic ${Buffer.from(`${WC_KEY}:${WC_SECRET}`).toString("base64")}`;

export async function getTunisiaShippingSettings() {
  try {
    const zonesRes = await fetch(`${WC_URL}/wp-json/wc/v3/shipping/zones`, {
      headers: { Authorization: wcAuth },
      next: { revalidate: 60 } // Cache for 1 minute
    });
    const zones = await zonesRes.json();
    
    // Find "Tunisie" or fallback
    const activeZone = zones.find((z: any) => z.name === "Tunisie") || zones.find((z: any) => z.id !== 0) || zones[0];
    const zoneId = activeZone?.id || 0;

    const methodsRes = await fetch(`${WC_URL}/wp-json/wc/v3/shipping/zones/${zoneId}/methods`, {
      headers: { Authorization: wcAuth },
    });
    const methods = await methodsRes.json();

    const flatRate = methods.find((m: any) => m.method_id === "flat_rate" && m.enabled);
    const freeShipping = methods.find((m: any) => m.method_id === "free_shipping" && m.enabled);

    return {
      rate: flatRate?.settings?.cost?.value ? parseFloat(flatRate.settings.cost.value) : 7,
      threshold: freeShipping?.settings?.min_amount?.value ? parseFloat(freeShipping.settings.min_amount.value) : 300,
      flatRateId: flatRate?.instance_id, // Important for Woo tracking
    };
  } catch (error) {
    return { rate: 7, threshold: 300 }; // Hard fallbacks if API fails
  }
}