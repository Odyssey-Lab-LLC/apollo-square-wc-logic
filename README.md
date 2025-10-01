# Apollo Square Hidden Attributes

> **Professional Square API tool for creating hidden custom attributes for jewelry store automation**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green.svg)](https://nodejs.org/)
[![Square API](https://img.shields.io/badge/Square%20API-2023--10--18-blue.svg)](https://developer.squareup.com/)

A production-ready Node.js application for creating seller-hidden custom attributes in Square's Product Catalog, designed specifically for jewelry stores integrating with WooCommerce via Make/Zapier automation.

## Overview

This tool creates 3 seller-hidden custom attributes in your Square catalog:

1. **Metal Type** - Type of metal used in jewelry (Gold, Silver, Platinum, etc.)
2. **Stone Type** - Type of gemstone or stone used (Diamond, Ruby, Emerald, etc.)
3. **Jewelry Category** - Enhanced category for better filtering (Rings, Necklaces, etc.)

These attributes are hidden from the Square Dashboard but accessible via API, making them perfect for syncing with WooCommerce while keeping the Square interface clean.

## Prerequisites

1. **Square Developer Account**: Sign up at [developer.squareup.com](https://developer.squareup.com)
2. **Square Application**: Create an application in your Square Developer Dashboard
3. **Access Token**: Get your sandbox/production access token
4. **Application ID**: Note your application ID from the developer dashboard
5. **Node.js**: Version 14+ installed on your system

## Setup

1. **Clone or Download** this project to your machine

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   - Copy `.env.example` to `.env`
   - Fill in your Square API credentials:
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your values:
   ```
   SQUARE_ACCESS_TOKEN=your_sandbox_access_token_here
   SQUARE_APPLICATION_ID=your_application_id_here
   SQUARE_ENVIRONMENT=sandbox
   SQUARE_LOCATION_ID=your_location_id_here
   ```

## Getting Your Square Credentials

### 1. Access Token
1. Go to [Square Developer Dashboard](https://developer.squareup.com/apps)
2. Select your application (or create one)
3. Go to "Credentials" tab
4. Copy the "Sandbox Access Token" (for testing) or "Production Access Token" (for live)

### 2. Application ID
1. In the same "Credentials" section
2. Copy the "Sandbox Application ID" or "Production Application ID"

### 3. Location ID (Optional)
1. You can get this by calling the Locations API, or
2. Find it in your Square Dashboard under Account & Settings > Business > Locations

## Usage

### Run the Tool

```bash
npm start
```

### What It Does

1. **Lists existing attributes** to show you what's already in your catalog
2. **Creates the 3 hidden attributes** defined for jewelry stores
3. **Provides a summary** of what was created successfully

### Sample Output

```
🚀 Starting Square Hidden Attributes Creation Tool
====================================================
Environment: sandbox

📋 Checking existing custom attribute definitions...
No existing custom attribute definitions found.

Creating hidden attribute: Metal Type...
✅ Successfully created hidden attribute: Metal Type
   Attribute ID: 7E4MWXZ3EXAMPLE

Creating hidden attribute: Stone Type...
✅ Successfully created hidden attribute: Stone Type
   Attribute ID: 8F5NXYAEXAMPLE

Creating hidden attribute: Jewelry Category...
✅ Successfully created hidden attribute: Jewelry Category
   Attribute ID: 9G6OYZB4EXAMPLE

📊 Summary:
===========
✅ Successfully created: 3
❌ Failed: 0

🎉 Hidden attributes have been created successfully!
```

## Integration with Make/Zapier

Once the hidden attributes are created, you can use them in your automation workflows:

### Using with Make (formerly Integromat)

1. **Square Module**: Use the "Update Catalog Object" action
2. **Set Custom Attributes**: Add the custom attributes to your products
3. **WooCommerce Module**: Map these attributes to WooCommerce product attributes

### Using with Zapier

1. **Square Trigger**: Watch for new/updated products
2. **Code Step**: Extract and process custom attribute values
3. **WooCommerce Action**: Update product with attributes

### API Usage Example

After running this tool, you can set attribute values on products like this:

```javascript
// Example: Setting metal type on a product
const request = {
  idempotencyKey: 'unique-key',
  object: {
    type: 'ITEM',
    id: '#your-product-id',
    itemData: {
      // ... other product data
      customAttributeValues: {
        'jewelry_metal_type': {
          name: 'jewelry_metal_type',
          selectionUidValues: ['#metal_gold']
        }
      }
    }
  }
};

await catalogApi.upsertCatalogObject(request);
```

## Customization

You can modify the attributes in `index.js`:

### Adding New Selection Options

```javascript
{
  name: 'jewelry_metal_type',
  // ... other config
  selectionConfig: {
    allowedSelections: [
      // Add new options here
      { uid: '#metal_copper', name: 'Copper' }
    ]
  }
}
```

### Adding New Attributes

Add a new object to the `HIDDEN_ATTRIBUTES` array:

```javascript
{
  name: 'jewelry_size',
  displayName: 'Size',
  description: 'Size of the jewelry item',
  type: 'STRING', // or 'SELECTION', 'NUMBER', etc.
}
```

## Troubleshooting

### Common Errors

1. **Authentication Error**: Check your access token and application ID
2. **Environment Mismatch**: Make sure you're using sandbox credentials with sandbox environment
3. **Attribute Limit**: Square allows max 10 seller-hidden attributes per account
4. **Name Conflicts**: Attribute names must be unique within your account

### Testing

Start with sandbox environment first:
- Use sandbox credentials
- Test the creation process
- Verify attributes work with your automation
- Then switch to production

## Important Notes

- **One-time Setup**: You typically only need to run this once per Square account
- **Hidden Attributes**: These won't show in Square Dashboard but are accessible via API
- **Limit**: Square allows up to 10 seller-hidden custom attributes per account
- **Immutable**: Once created, you can't change the attribute type or configuration
- **Backup**: Consider keeping a record of created attribute IDs for future reference

## Support

If you encounter issues:

1. Check the Square API documentation: [developer.squareup.com](https://developer.squareup.com)
2. Verify your credentials are correct
3. Test in sandbox environment first
4. Check the Square Developer Forums for similar issues

## Next Steps

After successfully creating the attributes:

1. **Test API Calls**: Verify you can read/write the attributes via API
2. **Set up Automation**: Configure Make/Zapier to use these attributes
3. **WooCommerce Mapping**: Map these to corresponding WooCommerce attributes
4. **Product Updates**: Start setting attribute values on your existing products

## Project Structure

```
apollo-square-hidden-attributes/
├── index.js                    # Main application (Node.js SDK)
├── create-attributes-curl.js   # Direct API implementation (Production-ready)
├── oauth-helper.js            # OAuth flow helper
├── test.js                    # Setup validation script
├── package.json               # Dependencies and scripts
├── .env.example              # Environment variables template
├── .gitignore                # Git ignore rules
├── LICENSE                   # MIT License
├── README.md                 # This file
├── QUICK_START.md           # 5-minute setup guide
├── AUTOMATION_GUIDE.md      # Make/Zapier integration
├── ATTRIBUTE_MAPPINGS.md    # Complete attribute reference
└── refs - attributes and mapping/  # Source CSV files
    ├── Hidden Attribute Value Mappings.csv
    ├── Custom Attributes List.csv
    └── Standard Attribute Values.csv
```

## Development

### Prerequisites
- Node.js 18+ 
- Square Developer Account
- Valid Square Application with Catalog API permissions

### Local Development
```bash
# Clone repository
git clone <repository-url>
cd apollo-square-hidden-attributes

# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Add your Square credentials to .env
# Run setup test
node test.js

# Create attributes
npm start
```

### Environment Variables
```bash
SQUARE_ACCESS_TOKEN=your_oauth_token_here
SQUARE_APPLICATION_ID=your_app_id_here
SQUARE_APPLICATION_SECRET=your_app_secret_here
SQUARE_ENVIRONMENT=production  # or sandbox
SQUARE_LOCATION_ID=your_location_id_here
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
