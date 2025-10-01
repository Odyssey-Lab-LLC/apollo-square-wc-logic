require('dotenv').config();
const { spawn } = require('child_process');

const ACCESS_TOKEN = process.env.SQUARE_ACCESS_TOKEN;
const ENVIRONMENT = process.env.SQUARE_ENVIRONMENT || 'production';
const BASE_URL = ENVIRONMENT === 'production' 
  ? 'https://connect.squareup.com/v2'
  : 'https://connect.squareupsandbox.com/v2';

// Apollo Jewelry Hidden Attributes
const HIDDEN_ATTRIBUTES = [
  {
    name: 'gem_color',
    displayName: 'Gem Color',
    description: 'Color category of gems for enhanced filtering and automation',
    type: 'SELECTION',
    maxAllowedSelections: 5,
    allowedSelections: [
      { uid: '#color_purple', name: 'Purple' },
      { uid: '#color_blue', name: 'Blue' },
      { uid: '#color_aqua', name: 'Aqua' },
      { uid: '#color_green', name: 'Green' },
      { uid: '#color_yellow', name: 'Yellow' },
      { uid: '#color_orange', name: 'Orange' },
      { uid: '#color_red', name: 'Red' },
      { uid: '#color_pink', name: 'Pink' },
      { uid: '#color_black', name: 'Black' },
      { uid: '#color_grey', name: 'Grey' },
      { uid: '#color_brown', name: 'Brown' },
      { uid: '#color_white', name: 'White' }
    ]
  },
  {
    name: 'gem_type',
    displayName: 'Gem Type',
    description: 'Type/nature category of gems for enhanced filtering and automation',
    type: 'SELECTION',
    maxAllowedSelections: 3,
    allowedSelections: [
      { uid: '#type_diamond', name: 'Diamond' },
      { uid: '#type_colored_gemstone', name: 'Colored Gemstone' },
      { uid: '#type_natural_gemstones', name: 'Natural Gemstones' },
      { uid: '#type_created_gemstones', name: 'Created Gemstones' }
    ]
  },
  {
    name: 'body_placement',
    displayName: 'Body Placement',
    description: 'Body area/placement category for piercing jewelry filtering and automation',
    type: 'SELECTION',
    maxAllowedSelections: 3,
    allowedSelections: [
      { uid: '#placement_ear', name: 'Ear' },
      { uid: '#placement_face', name: 'Face' },
      { uid: '#placement_nose', name: 'Nose' },
      { uid: '#placement_oral', name: 'Oral' },
      { uid: '#placement_navel', name: 'Navel' },
      { uid: '#placement_nipple', name: 'Nipple' },
      { uid: '#placement_surface_dermal', name: 'Surface / Dermal' },
      { uid: '#placement_afam_genital', name: 'AFAM Genital' },
      { uid: '#placement_amab_genital', name: 'AMAB Genital' }
    ]
  },
  {
    name: 'metal_color',
    displayName: 'Metal Color',
    description: 'Color/finish of metal used in jewelry for enhanced filtering and automation',
    type: 'SELECTION',
    maxAllowedSelections: 1,
    allowedSelections: [
      { uid: '#metal_yellow_gold', name: 'Yellow Gold' },
      { uid: '#metal_rose_gold', name: 'Rose Gold' },
      { uid: '#metal_white_gold', name: 'White Gold' },
      { uid: '#metal_platinum', name: 'Platinum' },
      { uid: '#metal_silver', name: 'Silver' },
      { uid: '#metal_titanium', name: 'Titanium' }
    ]
  }
];

function execCurl(curlCommand) {
  return new Promise((resolve, reject) => {
    const process = spawn('curl', curlCommand, { stdio: ['pipe', 'pipe', 'pipe'] });
    
    let stdout = '';
    let stderr = '';
    
    process.stdout.on('data', (data) => {
      stdout += data.toString();
    });
    
    process.stderr.on('data', (data) => {
      stderr += data.toString();
    });
    
    process.on('close', (code) => {
      if (code === 0) {
        try {
          const response = JSON.parse(stdout);
          resolve(response);
        } catch (err) {
          reject(new Error(`Failed to parse response: ${stdout}`));
        }
      } else {
        reject(new Error(`curl failed with code ${code}: ${stderr}`));
      }
    });
  });
}

async function createHiddenAttribute(attribute) {
  console.log(`Creating hidden attribute: ${attribute.displayName}...`);
  
  const requestBody = {
    idempotency_key: `${attribute.name}_${Date.now()}`,
    object: {
      type: 'CUSTOM_ATTRIBUTE_DEFINITION',
      id: `#${attribute.name}`,
      custom_attribute_definition_data: {
        name: attribute.name,
        description: attribute.description,
        type: attribute.type,
        key: attribute.name,
        source_application: {
          application_id: process.env.SQUARE_APPLICATION_ID
        },
        allowed_object_types: ['ITEM', 'ITEM_VARIATION'],
        seller_visibility: 'SELLER_VISIBILITY_HIDDEN',
        app_visibility: 'APP_VISIBILITY_READ_WRITE_VALUES',
        selection_config: {
          max_allowed_selections: attribute.maxAllowedSelections,
          allowed_selections: attribute.allowedSelections
        }
      }
    }
  };
  
  const curlCommand = [
    '-X', 'POST',
    `${BASE_URL}/catalog/object`,
    '-H', `Authorization: Bearer ${ACCESS_TOKEN}`,
    '-H', 'Square-Version: 2023-10-18',
    '-H', 'Content-Type: application/json',
    '-d', JSON.stringify(requestBody)
  ];
  
  try {
    const response = await execCurl(curlCommand);
    
    if (response.errors && response.errors.length > 0) {
      console.error(`❌ Error creating ${attribute.displayName}:`, response.errors);
      return null;
    }
    
    console.log(`✅ Successfully created hidden attribute: ${attribute.displayName}`);
    console.log(`   Attribute ID: ${response.catalog_object.id}`);
    console.log(`   Seller Visibility: ${response.catalog_object.custom_attribute_definition_data.seller_visibility}`);
    
    return response.catalog_object;
    
  } catch (error) {
    console.error(`❌ Failed to create ${attribute.displayName}:`, error.message);
    return null;
  }
}

async function main() {
  console.log('🚀 Apollo Jewelry - Square Hidden Attributes Creator (Direct API)');
  console.log('================================================================');
  console.log(`Environment: ${ENVIRONMENT}`);
  console.log(`App ID: ${process.env.SQUARE_APPLICATION_ID}`);
  console.log('');
  
  console.log('📋 Creating 4 hidden attributes for Apollo Jewelry:');
  console.log('1. gem_color - 12 color categories');
  console.log('2. gem_type - 4 type categories'); 
  console.log('3. body_placement - 9 body area categories');
  console.log('4. metal_color - 6 metal color/finish options');
  console.log('');
  
  const results = [];
  for (const attribute of HIDDEN_ATTRIBUTES) {
    const result = await createHiddenAttribute(attribute);
    results.push({ name: attribute.name, success: result !== null, result });
    
    // Small delay between requests
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log('');
  console.log('📊 Final Summary:');
  console.log('=================');
  
  const successful = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  
  console.log(`✅ Successfully created: ${successful}`);
  console.log(`❌ Failed: ${failed}`);
  
  if (successful > 0) {
    console.log('');
    console.log('🎉 Apollo Jewelry hidden attributes created successfully!');
    console.log('');
    console.log('✨ Next steps:');
    console.log('1. Hidden attributes are now available via Square API');
    console.log('2. Set up Make/Zapier automation using AUTOMATION_GUIDE.md');
    console.log('3. Map to WooCommerce attributes: pa_gem_color, pa_gem_type, pa_body_placement');
    console.log('4. These attributes are hidden from Square Dashboard but fully API accessible');
    console.log('');
    console.log('🔗 Integration ready for Make/Zapier workflows!');
  }
}

main().catch(console.error);