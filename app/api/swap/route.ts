import { NextRequest, NextResponse } from "next/server";

const BLINK_URL = "https://api.blink.sv/graphql";

interface SwapRequest {
  mode: "BUY" | "SELL";
  amount: number;
  apiKey: string;
  btcWalletId: string;
  usdWalletId: string;
  currentPrice: number;
}

export async function POST(request: NextRequest) {
  try {
    const body: SwapRequest = await request.json();
    const { mode, amount, apiKey, btcWalletId, usdWalletId, currentPrice } = body;

    // Validate inputs
    if (!apiKey || !btcWalletId || !usdWalletId) {
      return NextResponse.json(
        { success: false, error: "Missing API credentials" },
        { status: 400 }
      );
    }

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { success: false, error: "Invalid amount" },
        { status: 400 }
      );
    }

    // Determine wallet IDs and mutation based on mode
    const fromWalletId = mode === "SELL" ? btcWalletId : usdWalletId;
    const toWalletId = mode === "SELL" ? usdWalletId : btcWalletId;
    
    const mutationName = mode === "BUY" 
      ? "intraLedgerUsdPaymentSend" 
      : "intraLedgerPaymentSend";
    
    const inputType = mode === "BUY" 
      ? "IntraLedgerUsdPaymentSendInput" 
      : "IntraLedgerPaymentSendInput";

    const memo = `Automated ${mode} at $${currentPrice?.toFixed(2) || "N/A"}`;

    const payload = {
      query: `
        mutation ${mutationName}($input: ${inputType}!) {
          ${mutationName}(input: $input) {
            status
            errors {
              message
            }
          }
        }
      `,
      variables: {
        input: {
          amount,
          memo,
          walletId: fromWalletId,
          recipientWalletId: toWalletId,
        },
      },
    };

    const response = await fetch(BLINK_URL, {
      method: "POST",
      headers: {
        "X-API-KEY": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    // Check for API-level errors
    if (result.errors && result.errors.length > 0) {
      return NextResponse.json(
        { success: false, error: result.errors[0].message },
        { status: 400 }
      );
    }

    // Check for mutation-level errors
    const data = result.data?.[mutationName];
    if (data?.errors && data.errors.length > 0) {
      return NextResponse.json(
        { success: false, error: data.errors[0].message },
        { status: 400 }
      );
    }

    // Check status
    if (data?.status === "SUCCESS") {
      return NextResponse.json({
        success: true,
        status: data.status,
        mode,
        amount,
        price: currentPrice,
      });
    }

    return NextResponse.json(
      { success: false, error: "Unknown error occurred" },
      { status: 500 }
    );
  } catch (error) {
    console.error("Swap error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to execute swap" },
      { status: 500 }
    );
  }
}
