# Apollo Jewelry - Square Attribute Mappings Reference

This document provides the complete attribute mapping structure for Apollo Jewelry's Square and WooCommerce integration.

## Overview

Apollo Jewelry uses a hybrid approach:
- **Standard Square Attributes** (10 max) - Visible in Square Dashboard
- **Hidden Square Attributes** (3 created via API) - Hidden from Dashboard, used for automation

## Standard Square Attributes (Seller Visible)

These are the 10 regular attributes that appear in the Square Dashboard:

| Attribute Name | Type | Purpose | Example Values |
|---------------|------|---------|---------------|
| Featured & Popular | Standard | Priority Display | Featured, Category Featured, Best Seller, Popular |
| Metal Types | Standard | Materials | 14K Gold, 18K Gold, Titanium ASTM F136, 950 Platinum |
| Metal Colors | Standard | Materials | Yellow, Rose, White |
| Gem Shapes | Standard | Discovery | Classic Round Brilliant, Square, Oval, Trillion, Emerald, Heart |
| Gems | Standard | Materials | Alexandrite, Amethyst, Ruby, Diamond, Sapphire (80+ options) |
| Shapes & Looks | Standard | Styling | Moon, Rose, Star, Bar, Heart, Sun, Flower, etc. |
| Jewelry Types | Standard | Category | Threadless Ends, Hinged Rings, Seam Rings, Straight Barbell, etc. |
| Gauge Size | Standard | Specifications | 18 ga., 16 ga., 14 ga., 12 ga. |
| Gender | Standard | Targeting | Gender Neutral, Women, Men |
| Piercing Types | Standard | Body Location | Earlobe, Helix, Nose, Navel, etc. (35+ options) |

## Hidden Square Attributes (API Controlled)

These 3 attributes are created via API and hidden from Square Dashboard:

### 1. Gem Color
Maps individual gems to standardized color categories for filtering.

| Color Category | Example Gems |
|---------------|-------------|
| Purple | Alexandrite, Amethyst, Midnight, Tanzanite |
| Blue | Blue Sapphire, Blue Zircon, Ice Blue Diamond, London Blue Topaz |
| Aqua | Aquamarine, Mint Beryl, Paraiba Topaz, Seafoam Tourmaline |
| Green | Chrome Tsavorite, Emerald, Peridot, Tsavorite |
| Yellow | Canary Yellow Diamond, Citrine, Yellow Sapphire |
| Orange | Mexican Fire Opal, Orange Sapphire, Poppy Topaz |
| Red | Ruby, Garnet, Red Spinel, Deluxe Red Diamond |
| Pink | Baby Pink Diamond, Hot Pink Sapphire, Morganite, Pink Tourmaline |
| Black | Black Diamond, Black Onyx, Tourmalinated Quartz |
| Grey | Grey Diamond, Grey Sapphire, Labradorite |
| Brown | Champagne Diamond, Chocolate Diamond, Smoky Quartz |
| White | White Diamond VS1, White Sapphire, Rainbow Moonstone |

### 2. Gem Type
Categorizes gems by their nature and value tier.

| Gem Type | Example Gems |
|----------|-------------|
| Diamond | Purple Diamond, Ice Blue Diamond, Canary Yellow Diamond |
| Colored Gemstone | Alexandrite, Amethyst, Blue Sapphire, Emerald, Ruby |
| Natural Gemstones | Lapis, Aqua Chalcedony, Chrysoprase, Mexican Fire Opal |
| Created Gemstones | Mystic Topaz, London Blue Topaz, Paraiba Topaz |

### 3. Body Placement
Maps specific piercing types to general body areas for enhanced filtering.

| Body Placement | Piercing Types |
|---------------|----------------|
| Ear | Earlobe, Helix, Forward Helix, Conch, Tragus, Rook, Daith, Industrial |
| Face | Eyebrow, Bridge, Face Dermal |
| Nose | Nostril, Septum |
| Oral | Tongue, Smiley/Frownie, Classic Lip, Vertical Lip |
| Navel | Navel |
| Nipple | Nipple |
| Surface / Dermal | Surface Piercing, Back Dermals |
| AFAM Genital | Labia, Christina, VCH, Fourchette |
| AMAB Genital | Frenum, Prince Albert, Reverse Prince Albert, Scrotum, Apadravya, Ampllang, Guchie |

## Integration Strategy

### Square → WooCommerce Mapping
- **Standard Attributes**: Direct 1:1 mapping where possible
- **Hidden Attributes**: Used for advanced filtering and SEO
- **Automation**: Make/Zapier reads hidden attributes via API and syncs to WooCommerce

### Benefits of This Approach
1. **Clean Square Interface**: Hidden attributes don't clutter the dashboard
2. **Rich WooCommerce Filtering**: Customers can filter by color, type, body placement
3. **SEO Enhancement**: Structured data improves search visibility
4. **Scalability**: Easy to add more hidden attributes (up to 10 total)

## Machine-Readable Mappings

### Gem Color Mappings
```json
{
  "Alexandrite": "Purple",
  "Amythyst": "Purple",
  "Light Amythyst": "Purple",
  "Midnight": "Purple",
  "Blue Sapphire": "Blue",
  "Ice Blue Diamond": "Blue",
  "Aquamarine Cabochon": "Aqua",
  "Emerald": "Green",
  "Canary Yellow Diamond": "Yellow",
  "Ruby": "Red",
  "Baby Pink Diamond": "Pink",
  "Black Diamond": "Black",
  "Grey Diamond": "Grey",
  "Champagne Diamond": "Brown",
  "White Diamond VS1": "White"
}
```

### Gem Type Mappings
```json
{
  "Purple Diamond": "Diamond",
  "Ice Blue Diamond": "Diamond",
  "Alexandrite": "Colored Gemstone",
  "Blue Sapphire": "Colored Gemstone",
  "Lapis Cabochon": "Natural Gemstones",
  "Mystic Topaz": "Created Gemstones"
}
```

### Body Placement Mappings
```json
{
  "Earlobe": "Ear",
  "Helix": "Ear",
  "Conch": "Ear",
  "Eyebrow": "Face",
  "Nostril": "Nose",
  "Septum": "Nose",
  "Tongue": "Oral",
  "Navel": "Navel",
  "Nipple": "Nipple"
}
```

## API Implementation Notes

### Hidden Attribute Configuration
- **sellerVisibility**: `SELLER_VISIBILITY_HIDDEN`
- **appVisibility**: `APP_VISIBILITY_READ_WRITE_VALUES`
- **allowedObjectTypes**: `['ITEM', 'ITEM_VARIATION']`
- **type**: `SELECTION` (for all 3 attributes)

### Selection Values Format
Each hidden attribute uses UID-based selection values:
- Gem Color: `#color_purple`, `#color_blue`, etc.
- Gem Type: `#type_diamond`, `#type_colored_gemstone`, etc.
- Body Placement: `#placement_ear`, `#placement_face`, etc.

## Usage in Automation

### Make/Zapier Integration
1. **Trigger**: Square product updated
2. **Parse**: Extract hidden attribute values via API
3. **Map**: Convert UIDs to readable names
4. **Sync**: Update corresponding WooCommerce attributes

### WooCommerce Attribute Names
- `pa_gem_color` - for Gem Color
- `pa_gem_type` - for Gem Type  
- `pa_body_placement` - for Body Placement

## Maintenance Notes

- Hidden attribute definitions are immutable once created
- New selection values can be added via API updates
- Standard attribute changes must be done through Square Dashboard
- Always test in sandbox before production deployment