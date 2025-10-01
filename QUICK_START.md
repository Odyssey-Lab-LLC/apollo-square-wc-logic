# Quick Start Guide

Get up and running with Square Hidden Attributes in 5 minutes!

## Step 1: Get Your Square Credentials

1. Go to [Square Developer Dashboard](https://developer.squareup.com/apps)
2. Create a new application (or use existing)
3. Navigate to **Credentials** tab
4. Copy these values:
   - **Sandbox Access Token** (for testing)
   - **Sandbox Application ID**

## Step 2: Configure Environment

1. Copy the environment template:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` file with your credentials:
   ```
   SQUARE_ACCESS_TOKEN=EAAAELMSgWo...your_token_here
   SQUARE_APPLICATION_ID=sq0idp-abc123...your_app_id_here
   SQUARE_ENVIRONMENT=sandbox
   ```

## Step 3: Test & Run

1. Test your setup:
   ```bash
   node test.js
   ```

2. If successful, create the hidden attributes:
   ```bash
   npm start
   ```

## Step 4: Verify Success

You should see output like:
```
🚀 Starting Square Hidden Attributes Creation Tool
====================================================
Environment: sandbox

📋 Checking existing custom attribute definitions...
No existing custom attribute definitions found.

Creating hidden attribute: Metal Type...
✅ Successfully created hidden attribute: Metal Type
   Attribute ID: ABC123...

Creating hidden attribute: Stone Type...
✅ Successfully created hidden attribute: Stone Type
   Attribute ID: DEF456...

Creating hidden attribute: Jewelry Category...
✅ Successfully created hidden attribute: Jewelry Category
   Attribute ID: GHI789...

📊 Summary:
===========
✅ Successfully created: 3
❌ Failed: 0

🎉 Hidden attributes have been created successfully!
```

## Step 5: Set Up Automation (Optional)

Follow the [AUTOMATION_GUIDE.md](./AUTOMATION_GUIDE.md) to integrate with Make or Zapier.

## Troubleshooting

### "Command not found: npm"
- Node.js not installed. Run: `brew install node`

### "Missing required environment variables"
- Check your `.env` file has the correct tokens
- Make sure there are no quotes around the values

### "Authentication failed"
- Verify your access token is correct
- Make sure you're using sandbox token with sandbox environment

### "Application ID invalid"
- Double-check the application ID from Square Developer Dashboard
- Ensure no extra spaces or characters

## What's Created

This tool creates 3 hidden custom attributes:

1. **jewelry_metal_type** - Gold, Silver, Platinum, etc.
2. **jewelry_stone_type** - Diamond, Ruby, Emerald, etc. (allows multiple)
3. **jewelry_category** - Rings, Necklaces, Earrings, etc.

These are **hidden from Square Dashboard** but accessible via API for automation.

## Next Steps

1. ✅ Set up automation with Make/Zapier
2. ✅ Configure WooCommerce attributes to match
3. ✅ Test with a few products
4. ✅ Roll out to full product catalog

Need help? Check the main [README.md](./README.md) for detailed instructions.