require('dotenv').config();
const { SquareClient, SquareEnvironment } = require('square');

// Initialize Square client
const client = new SquareClient({
  accessToken: process.env.SQUARE_ACCESS_TOKEN,
  environment: process.env.SQUARE_ENVIRONMENT === 'production' ? SquareEnvironment.Production : SquareEnvironment.Sandbox,
});

const catalogApi = client.catalog;

// Define the 3 hidden attributes for Apollo Jewelry
const HIDDEN_ATTRIBUTES = [
  {
    name: 'gem_color',
    displayName: 'Gem Color',
    description: 'Color category of gems for enhanced filtering and automation',
    type: 'SELECTION',
    selectionConfig: {
      maxAllowedSelections: 5, // Allow multiple gem colors
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
    }
  },
  {
    name: 'gem_type',
    displayName: 'Gem Type',
    description: 'Type/nature category of gems for enhanced filtering and automation',
    type: 'SELECTION',
    selectionConfig: {
      maxAllowedSelections: 3, // Allow multiple gem types
      allowedSelections: [
        { uid: '#type_diamond', name: 'Diamond' },
        { uid: '#type_colored_gemstone', name: 'Colored Gemstone' },
        { uid: '#type_natural_gemstones', name: 'Natural Gemstones' },
        { uid: '#type_created_gemstones', name: 'Created Gemstones' }
      ]
    }
  },
  {
    name: 'body_placement',
    displayName: 'Body Placement',
    description: 'Body area/placement category for piercing jewelry filtering and automation',
    type: 'SELECTION',
    selectionConfig: {
      maxAllowedSelections: 3, // Allow multiple placements
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
    }
  }
];

/**
 * Create a hidden custom attribute definition in Square
 */
async function createHiddenAttribute(attribute) {
  try {
    console.log(`Creating hidden attribute: ${attribute.displayName}...`);
    
    const request = {
      idempotencyKey: `${attribute.name}_${Date.now()}`, // Unique key for this request
      object: {
        type: 'CUSTOM_ATTRIBUTE_DEFINITION',
        id: `#${attribute.name}`,
        customAttributeDefinitionData: {
          name: attribute.name,
          description: attribute.description,
          type: attribute.type,
          sourceApplication: {
            applicationId: process.env.SQUARE_APPLICATION_ID
          },
          allowedObjectTypes: ['ITEM', 'ITEM_VARIATION'],
          // This is the key setting - makes the attribute hidden from sellers
          sellerVisibility: 'SELLER_VISIBILITY_HIDDEN',
          appVisibility: 'APP_VISIBILITY_READ_WRITE_VALUES',
          ...(attribute.type === 'SELECTION' && {
            selectionConfig: {
              maxAllowedSelections: attribute.selectionConfig.maxAllowedSelections,
              allowedSelections: attribute.selectionConfig.allowedSelections
            }
          })
        }
      }
    };

    const response = await catalogApi.object.upsert(request);
    
    if (response.result.errors && response.result.errors.length > 0) {
      console.error(`Error creating ${attribute.displayName}:`, response.result.errors);
      return null;
    }
    
    console.log(`✅ Successfully created hidden attribute: ${attribute.displayName}`);
    console.log(`   Attribute ID: ${response.result.catalogObject.id}`);
    
    return response.result.catalogObject;
    
  } catch (error) {
    console.error(`❌ Failed to create ${attribute.displayName}:`, error.message);
    return null;
  }
}

/**
 * List existing custom attribute definitions to check what's already created
 */
async function listExistingAttributes() {
  try {
    console.log('📋 Checking existing custom attribute definitions...');
    
    const response = await catalogApi.search({
      objectTypes: ['CUSTOM_ATTRIBUTE_DEFINITION'],
      limit: 100
    });
    
    if (response.result.objects) {
      console.log(`Found ${response.result.objects.length} existing custom attribute definitions:`);
      
      response.result.objects.forEach(attr => {
        const data = attr.customAttributeDefinitionData;
        console.log(`  - ${data.name} (${attr.id}) - Seller Visibility: ${data.sellerVisibility}`);
      });
      
      return response.result.objects;
    } else {
      console.log('No existing custom attribute definitions found.');
      return [];
    }
    
  } catch (error) {
    console.error('❌ Failed to list existing attributes:', error.message);
    return [];
  }
}

/**
 * Main function to create all hidden attributes
 */
async function createAllHiddenAttributes() {
  console.log('🚀 Apollo Jewelry - Square Hidden Attributes Creation Tool');
  console.log('=========================================================');
  
  // Validate environment variables
  if (!process.env.SQUARE_ACCESS_TOKEN || !process.env.SQUARE_APPLICATION_ID) {
    console.error('❌ Missing required environment variables. Please check your .env file.');
    console.log('Required variables: SQUARE_ACCESS_TOKEN, SQUARE_APPLICATION_ID');
    return;
  }
  
  console.log(`Environment: ${process.env.SQUARE_ENVIRONMENT || 'sandbox'}`);
  console.log('');
  
  // First, list existing attributes to avoid conflicts
  await listExistingAttributes();
  console.log('');
  
  // Create each hidden attribute
  const results = [];
  for (const attribute of HIDDEN_ATTRIBUTES) {
    const result = await createHiddenAttribute(attribute);
    results.push({ name: attribute.name, success: result !== null, result });
    
    // Small delay between requests to be nice to the API
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  console.log('');
  console.log('📊 Summary:');
  console.log('===========');
  
  const successful = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  
  console.log(`✅ Successfully created: ${successful}`);
  console.log(`❌ Failed: ${failed}`);
  
  if (successful > 0) {
    console.log('');
    console.log('🎉 Apollo Jewelry hidden attributes created successfully!');
    console.log('');
    console.log('Next steps:');
    console.log('1. Hidden attributes are now available via Square API');
    console.log('2. Set up Make/Zapier automation using AUTOMATION_GUIDE.md');
    console.log('3. Map to WooCommerce attributes: pa_gem_color, pa_gem_type, pa_body_placement');
    console.log('4. These attributes are hidden from Square Dashboard but fully API accessible');
  }
}

// Run the main function if this file is executed directly
if (require.main === module) {
  createAllHiddenAttributes()
    .then(() => {
      console.log('\n✨ Process completed!');
      process.exit(0);
    })
    .catch(error => {
      console.error('💥 Fatal error:', error.message);
      process.exit(1);
    });
}

module.exports = {
  createHiddenAttribute,
  createAllHiddenAttributes,
  listExistingAttributes,
  HIDDEN_ATTRIBUTES
};