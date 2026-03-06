import requests
import time

# --- CONFIGURATION (Fill once) ---
API_KEY = "YOUR_API_KEY"
BTC_WALLET_ID = "YOUR_BTC_WALLET_ID"
USD_WALLET_ID = "YOUR_USD_WALLET_ID"
BLINK_URL = "https://api.blink.sv/graphql"

headers = {
    "X-API-KEY": API_KEY,
    "Content-Type": "application/json"
}

def get_btc_price():
    url = "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd"
    try:
        res = requests.get(url, timeout=10)
        res.raise_for_status()
        return float(res.json()["bitcoin"]["usd"])
    except Exception as e:
        print(f"⚠️ Price fetching error: {e}")
        return None

def perform_intra_ledger_payment(amount, from_id, to_id, memo):
    payload = {
        "query": """
        mutation IntraLedgerPaymentSend($input: IntraLedgerPaymentSendInput!) {
          intraLedgerPaymentSend(input: $input) {
            status
            errors {
              message
            }
          }
        }
        """,
        "variables": {
            "input": {
                "amount": amount,
                "memo": memo,
                "walletId": from_id,
                "recipientWalletId": to_id
            }
        }
    }
    
    try:
        response = requests.post(BLINK_URL, headers=headers, json=payload)
        result = response.json()
        
        if "errors" in result and result["errors"]:
            print(f"❌ API Error: {result['errors'][0]['message']}")
            return False
            
        data = result.get("data", {}).get("intraLedgerPaymentSend", {})
        if data.get("errors"):
            print(f"❌ Processing Error: {data['errors'][0]['message']}")
            return False
            
        if data.get("status") == "SUCCESS":
            print(f"✅ Operation successful! Status: SUCCESS")
            return True
        return False
    except Exception as e:
        print(f"❌ Critical error: {e}")
        return False

def main():
    print("-" * 20)
    print("  You can support the creator of this code by donating to his baby, onchain to: 16XzdTgbSqGQMep7DZ3Ev1ZfARjWph1KP7")
    print("  Or on lightning to cryptobaby@blink.sv")
    print("-" * 20)

    print("Choose operation type:")
    print("1. BTC -> USD (Sell at high price)")
    print("2. USD -> BTC (Buy at low price)")
    
    choice = input("Your choice (1 or 2): ")

    try:
        if choice == "1":
            target_price = float(input("At what price do you want to SELL BTC (e.g., 80000)? "))
            amount = int(input("How many SATOSHIS do you want to swap? "))
            mode = "SELL"
        elif choice == "2":
            target_price = float(input("At what price do you want to BUY BTC (e.g., 63000)? "))
            amount = int(input("How many USD CENTS do you want to spend (e.g., 500 for $5)? "))
            mode = "BUY"
        else:
            print("Invalid choice. Exiting.")
            return
    except ValueError:
        print("Error: Please enter numbers only!")
        return

    print(f"\n🚀 Bot started in {mode} mode.")
    print(f"Target Price: ${target_price} | Amount: {amount} (in respective currency units)")
    print("Monitoring market... (press Ctrl+C to stop)")

    while True:
        current_price = get_btc_price()
        
        if current_price:
            print(f"Current Price: ${current_price} | Target: ${target_price}")
            
            should_execute = False
            if mode == "SELL" and current_price >= target_price:
                should_execute = True
                from_wallet, to_wallet = BTC_WALLET_ID, USD_WALLET_ID
                memo = f"Automated Sell at ${current_price}"
            
            elif mode == "BUY" and current_price <= target_price:
                should_execute = True
                from_wallet, to_wallet = USD_WALLET_ID, BTC_WALLET_ID
                memo = f"Automated Buy at ${current_price}"

            if should_execute:
                print("⚡ Target reached! Executing swap...")
                if perform_intra_ledger_payment(amount, from_wallet, to_wallet, memo):
                    print("🏁 Done. Script finished.")
                    break
                else:
                    print("❌ Operation failed, retrying in 60 seconds.")

        time.sleep(60)

if __name__ == "__main__":
    main()