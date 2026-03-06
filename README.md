# Blink-Swap

This Python script allows you to automate swaps between your Bitcoin (BTC) and USD (Stablesats) wallets on the Blink (Galoy) platform based on your target price. 

The code is free but you can make a donation to my baby onchain: 16XzdTgbSqGQMep7DZ3Ev1ZfARjWph1KP7  or lightning: cryptobaby@blink.sv

**1. Prerequisites**

Before running the script, ensure you have the following:

Python 3.x installed on your computer.

The requests library installed. You can install it via terminal:
pip install requests

Your Blink API Key and your specific Wallet IDs for both BTC and USD accounts.

**2. Setup & Configuration**

Open the script in a text editor and fill in your credentials in the CONFIGURATION section:

API_KEY: Your secret API key from Blink. 

BTC_WALLET_ID: The unique ID for your Bitcoin wallet.

USD_WALLET_ID: The unique ID for your Stablesats (USD) wallet.

You can get this details from [dashboard.blink.sv.](https://dashboard.blink.sv/)

**3. How to Use**

Launch the script: Run the script in your terminal:
python3 blinkswap.py

You will see two options.

Choose your mode:

Option 1 (BTC -> USD): Use this if you want to sell Bitcoin when the price rises to a certain level.

Option 2 (USD -> BTC): Use this if you want to buy Bitcoin when the price drops to a certain level.

Set Target Price: Enter the price at which you want the swap to trigger (e.g., 85000 for selling or 60000 for buying).

Set Amount:

If selling BTC, enter the amount in Satoshis.

If buying BTC, enter the amount in USD Cents (e.g., 1000 for $10).

4. Execution

The script will check the current Bitcoin price every 60 seconds.

It will display the current price and your target price in the terminal.

Once the target is reached, the script sends the swap request to Blink.

If successful, it will display ✅ Operation successful! and stop.

⚠️ Important Safety Notes

Units Matter: Always remember that USD swaps use cents (100 = $1) and BTC swaps use sats.

API Security: Keep your API_KEY private. Do not share your script file with others if the key is inside.

Manual Stop: You can stop the bot at any time by pressing Ctrl + C in your terminal.
