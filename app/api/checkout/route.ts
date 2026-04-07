export async function POST(request: Request) {
  try {
    const data = await request.json();
    console.log("Received checkout data:", data);
    // Here you would typically process the checkout, e.g., create an order, charge payment, etc.
    return new Response(JSON.stringify({ message: "Checkout successful", receivedData: data }), { status: 200 });
  } catch (error) {
    console.error("Error processing checkout:", error);
    return new Response(JSON.stringify({ error: "Failed to process checkout" }), { status: 500 });
  } }