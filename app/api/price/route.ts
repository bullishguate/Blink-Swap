import { NextResponse } from "next/server";

export const revalidate = 30;

export async function GET() {
  try {
    const response = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd",
      {
        next: { revalidate: 30 },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch price");
    }

    const data = await response.json();
    const price = data.bitcoin?.usd;

    if (!price) {
      throw new Error("Invalid price data");
    }

    return NextResponse.json({ price });
  } catch (error) {
    console.error("Price fetch error:", error);
    
    // Return a fallback price in development or if API fails
    return NextResponse.json(
      { price: 68500, error: "Using cached price" },
      { status: 200 }
    );
  }
}
