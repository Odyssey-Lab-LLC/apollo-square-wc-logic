# Square Hidden Attributes - Make/Zapier Integration Guide

This guide explains how to integrate the newly created hidden attributes with Make (formerly Integromat) or Zapier to sync between Square and WooCommerce.

## Overview

After running the hidden attributes creator tool, you'll have 3 new custom attributes in your Square catalog:

- `jewelry_metal_type` - Hidden attribute for metal types
- `jewelry_stone_type` - Hidden attribute for stone/gem types  
- `jewelry_category` - Hidden attribute for jewelry categories

These attributes are **hidden from the Square Dashboard** but fully accessible via the Square API, making them perfect for automation workflows.

## Integration with Make (Recommended)

Make offers more flexibility and better API support for complex integrations like this one.

### 1. Basic Setup

1. **Create a New Scenario** in Make
2. **Add Square Connection** using your API credentials
3. **Set up Trigger**: Watch for new/updated products in Square
4. **Add Processing Modules**: Extract and map custom attribute values
5. **Connect to WooCommerce**: Update corresponding WooCommerce attributes

### 2. Square Modules to Use

#### Trigger Module: "Watch Catalog Objects"
```
Module: Square > Watch Catalog Objects
Object Types: ITEM, ITEM_VARIATION
```

#### Action Module: "Update Catalog Object" (for setting attributes)
```
Module: Square > Update Catalog Object
Use this to SET attribute values on products
```

### 3. Sample Make Scenario Flow

```
1. Square Trigger (New/Updated Product)
   ↓
2. Parse Custom Attributes (Custom Function)
   ↓  
3. WooCommerce Action (Update Product Attributes)
```

### 4. Custom Function for Parsing Attributes

Add a custom JavaScript function in Make to extract the hidden attributes:

```javascript
// Custom Make function to extract hidden attributes
const customAttributes = input.customAttributeValues || {};

// Extract metal type
const metalType = customAttributes.jewelry_metal_type ? 
  customAttributes.jewelry_metal_type.selectionUidValues : [];

// Extract stone type  
const stoneType = customAttributes.jewelry_stone_type ?
  customAttributes.jewelry_stone_type.selectionUidValues : [];

// Extract category
const category = customAttributes.jewelry_category ?
  customAttributes.jewelry_category.selectionUidValues : [];

// Map Square UIDs to readable names
const metalMap = {
  '#metal_gold': 'Gold',
  '#metal_silver': 'Silver', 
  '#metal_platinum': 'Platinum',
  // ... add all mappings
};

return {
  metal: metalType.map(uid => metalMap[uid] || uid),
  stones: stoneType.map(uid => stoneMap[uid] || uid),
  category: category.map(uid => categoryMap[uid] || uid)
};
```

### 5. WooCommerce Integration

Map the extracted values to WooCommerce product attributes:

```
Module: WooCommerce > Update Product
Attributes: {
  "pa_metal": mapped_metal_values,
  "pa_stone": mapped_stone_values,
  "pa_category": mapped_category_values
}
```

## Integration with Zapier

Zapier has more limited custom code capabilities but can still handle basic scenarios.

### 1. Basic Zapier Zap

```
1. Trigger: Square > New/Updated Product
   ↓
2. Code by Zapier > Extract Attributes (JavaScript)
   ↓
3. WooCommerce > Update Product
```

### 2. Code by Zapier Function

```javascript
// Zapier JavaScript code to extract attributes
const item = inputData.item;
const customAttrs = item.custom_attribute_values || {};

// Extract attributes (similar to Make function above)
const metal = customAttrs.jewelry_metal_type?.selection_uid_values?.[0];
const stones = customAttrs.jewelry_stone_type?.selection_uid_values || [];
const category = customAttrs.jewelry_category?.selection_uid_values?.[0];

// Map to readable names and return
return {
  metal_type: mapMetalUid(metal),
  stone_types: stones.map(mapStoneUid),
  jewelry_category: mapCategoryUid(category)
};
```

## Setting Attribute Values on Square Products

To set the hidden attribute values on your Square products, you can use either:

### Option 1: Direct API Calls

```javascript
// Example API call to set attributes on a product
const request = {
  idempotencyKey: `update_${productId}_${Date.now()}`,
  object: {
    type: 'ITEM',
    id: productId,
    itemData: {
      customAttributeValues: {
        'jewelry_metal_type': {
          name: 'jewelry_metal_type',
          selectionUidValues: ['#metal_gold']
        },
        'jewelry_stone_type': {
          name: 'jewelry_stone_type', 
          selectionUidValues: ['#stone_diamond', '#stone_ruby']
        },
        'jewelry_category': {
          name: 'jewelry_category',
          selectionUidValues: ['#cat_rings']
        }
      }
    }
  }
};

await catalogApi.upsertCatalogObject(request);
```

### Option 2: Bulk Update Script

Create a separate Node.js script to bulk update existing products:

```javascript
// bulk-update.js - Set attributes on existing products
const products = await getExistingProducts();

for (const product of products) {
  const attributeValues = inferAttributesFromProductName(product.name);
  await updateProductAttributes(product.id, attributeValues);
}
```

## Attribute Value Mapping Reference

### Metal Types
```
Square UID           → Display Name    → WooCommerce Value
#metal_gold          → "Gold"          → "gold"
#metal_silver        → "Silver"        → "silver"  
#metal_platinum      → "Platinum"      → "platinum"
#metal_titanium      → "Titanium"      → "titanium"
#metal_stainless_steel → "Stainless Steel" → "stainless-steel"
#metal_rose_gold     → "Rose Gold"     → "rose-gold"
#metal_white_gold    → "White Gold"    → "white-gold"
```

### Stone Types  
```
Square UID           → Display Name    → WooCommerce Value
#stone_diamond       → "Diamond"       → "diamond"
#stone_ruby          → "Ruby"          → "ruby"
#stone_emerald       → "Emerald"       → "emerald"
#stone_sapphire      → "Sapphire"      → "sapphire"
#stone_pearl         → "Pearl"         → "pearl"
#stone_topaz         → "Topaz"         → "topaz"
#stone_amethyst      → "Amethyst"      → "amethyst"
#stone_opal          → "Opal"          → "opal"
#stone_turquoise     → "Turquoise"     → "turquoise"
#stone_none          → "No Stone"      → "none"
```

### Jewelry Categories
```
Square UID           → Display Name    → WooCommerce Value
#cat_rings           → "Rings"         → "rings"
#cat_necklaces       → "Necklaces"     → "necklaces"
#cat_earrings        → "Earrings"      → "earrings"
#cat_bracelets       → "Bracelets"     → "bracelets"
#cat_watches         → "Watches"       → "watches"
#cat_brooches        → "Brooches"      → "brooches"
#cat_pendants        → "Pendants"      → "pendants"
#cat_chains          → "Chains"        → "chains"
#cat_cufflinks       → "Cufflinks"     → "cufflinks"
#cat_accessories     → "Accessories"   → "accessories"
```

## WooCommerce Attribute Setup

In WooCommerce, make sure you have created matching attributes:

1. **Metal Type** (`pa_metal`)
   - Terms: gold, silver, platinum, titanium, etc.
   - Used for variations: Yes
   - Visible on product page: Yes

2. **Stone Type** (`pa_stone`) 
   - Terms: diamond, ruby, emerald, sapphire, etc.
   - Used for variations: Yes (if products have stone variations)
   - Visible on product page: Yes

3. **Jewelry Category** (`pa_category`)
   - Terms: rings, necklaces, earrings, bracelets, etc.
   - Used for variations: No (typically)
   - Visible on product page: Yes

## Testing Your Integration

1. **Create a test product** in Square with the hidden attributes set
2. **Trigger your automation** (manually or wait for automatic trigger)
3. **Check WooCommerce** to verify attributes were synced correctly
4. **Test filtering** on your WooCommerce storefront
5. **Verify SEO benefits** with properly structured product data

## Troubleshooting

### Common Issues

1. **Attributes not syncing**: Check that custom attributes are included in the Square API response
2. **Wrong attribute values**: Verify the UID mappings are correct
3. **WooCommerce errors**: Ensure WooCommerce attributes exist before syncing
4. **Rate limiting**: Add delays between API calls in bulk operations

### Debug Steps

1. **Check Square API responses** - ensure custom attributes are present
2. **Verify WooCommerce API calls** - test attribute updates manually
3. **Review Make/Zapier logs** - look for errors in automation runs
4. **Test with sandbox data** first before production

## Advanced Features

### Conditional Logic
Set up rules to only sync certain attributes based on product categories or other criteria.

### Batch Processing  
Process multiple products at once to improve efficiency and reduce API calls.

### Error Handling
Add retry logic and error notifications for failed syncs.

### Backup & Recovery
Keep logs of attribute changes for rollback capabilities.

## Performance Considerations

- **API Rate Limits**: Square has rate limits - add delays between requests
- **Webhook vs Polling**: Use webhooks when possible for real-time sync
- **Batch Updates**: Update multiple products in single requests when possible
- **Caching**: Cache attribute mappings to reduce computation

## Next Steps

1. Set up your Make/Zapier automation using this guide
2. Test with a few products first  
3. Gradually roll out to your full catalog
4. Monitor performance and adjust as needed
5. Consider additional attributes for future expansion