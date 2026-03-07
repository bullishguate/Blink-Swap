import requests
import time

# --- CONFIGURATION (Fill once) ---
API_KEY = "YOUR BLINK API"
BTC_WALLET_ID = "YOUR BTC WALLET ID"
USD_WALLET_ID = "YOUR USD WALLET ID"
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

def perform_swap(amount, from_id, to_id, memo, mode):

    if mode == "BUY":
        
        mutation_name = "intraLedgerUsdPaymentSend"
        input_type = "IntraLedgerUsdPaymentSendInput"
    else:
        
        mutation_name = "intraLedgerPaymentSend"
        input_type = "IntraLedgerPaymentSendInput"

    payload = {
        "query": f"""
        mutation {mutation_name}($input: {input_type}!) {{
          {mutation_name}(input: $input) {{
            status
            errors {{
              message
            }}
          }}
        }}
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
            
        data = result.get("data", {}).get(mutation_name, {})
        errors = data.get("errors", [])
        
        if errors:
            print(f"❌ Processing Error: {errors[0]['message']}")
            return False
            
        if data.get("status") == "SUCCESS":
            print(f"✅ Operation successful! Status: SUCCESS")
            return True
        return False
    except Exception as e:
        print(f"❌ Critical error: {e}")
        return False

def main():
    print("-" * 30)
    print("      BLINK SWAP MASTER")
    print("-" * 30)
    print("  Support the creator:")
    print("  Onchain: 16XzdTgbSqGQMep7DZ3Ev1ZfARjWph1KP7")
    print("  Lightning: cryptobaby@blink.sv")
    print("-" * 30)

    print("Choose operation type:")
    print("1. BTC -> USD (Sell BTC at high price)")
    print("2. USD -> BTC (Buy BTC at low price)")
    
    choice = input("Your choice (1 or 2): ")

    try:
        if choice == "1":
            target_price = float(input("At what price to SELL (e.g., 80000)? "))
            amount = int(input("How many SATOSHIS to sell? "))
            mode = "SELL"
        elif choice == "2":
            target_price = float(input("At what price to BUY (e.g., 63000)? "))
            amount = int(input("How many USD CENTS to spend (e.g., 33)? "))
            mode = "BUY"
        else:
            print("Invalid choice. Exiting.")
            return
    except ValueError:
        print("Error: Please enter numbers only!")
        return

    print(f"\n🚀 Bot started in {mode} mode.")
    print(f"Target: ${target_price} | Amount: {amount}")
    print("Monitoring... (Ctrl+C to stop)")

    while True:
        current_price = get_btc_price()
        
        if current_price:
            print(f"Current: ${current_price} | Target: ${target_price}")
            
            execute = False
            if mode == "SELL" and current_price >= target_price:
                execute = True
                from_w, to_w = BTC_WALLET_ID, USD_WALLET_ID
            elif mode == "BUY" and current_price <= target_price:
                execute = True
                from_w, to_w = USD_WALLET_ID, BTC_WALLET_ID

            if execute:
                print("⚡ Target reached! Executing swap...")
                memo = f"Automated {mode} at ${current_price}"
                if perform_swap(amount, from_w, to_w, memo, mode):
                    print("🏁 Done. Script finished.")
                    break
                else:
                    print("❌ Failed, retrying in 60s...")

        time.sleep(60)

if __name__ == "__main__":
    main()
