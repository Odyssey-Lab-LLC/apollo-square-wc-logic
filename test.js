// Simple test to validate the application setup
require('dotenv').config();

console.log('🧪 Testing Square Hidden Attributes Setup');
console.log('========================================');

// Test 1: Check if required modules are installed
console.log('1. Checking module imports...');
try {
  const { SquareClient, SquareEnvironment } = require('square');
  console.log('   ✅ Square SDK imported successfully');
} catch (error) {
  console.log('   ❌ Failed to import Square SDK:', error.message);
  process.exit(1);
}

// Test 2: Check environment variables
console.log('2. Checking environment variables...');
const requiredEnvVars = [
  'SQUARE_ACCESS_TOKEN',
  'SQUARE_APPLICATION_ID'
];

let envVarsValid = true;
requiredEnvVars.forEach(varName => {
  if (!process.env[varName] || process.env[varName] === 'your_sandbox_access_token_here' || process.env[varName] === 'your_application_id_here') {
    console.log(`   ❌ ${varName} is missing or not configured`);
    envVarsValid = false;
  } else {
    console.log(`   ✅ ${varName} is configured`);
  }
});

console.log(`   Environment: ${process.env.SQUARE_ENVIRONMENT || 'sandbox'}`);

// Test 3: Import the main application
console.log('3. Testing main application...');
try {
  const { HIDDEN_ATTRIBUTES } = require('./index.js');
  console.log(`   ✅ Application imported successfully`);
  console.log(`   ✅ Found ${HIDDEN_ATTRIBUTES.length} hidden attributes defined`);
  
  // List the attributes that will be created
  console.log('   📝 Attributes to be created:');
  HIDDEN_ATTRIBUTES.forEach(attr => {
    console.log(`      - ${attr.displayName} (${attr.name})`);
  });
} catch (error) {
  console.log('   ❌ Failed to import main application:', error.message);
  process.exit(1);
}

console.log('');
console.log('🎯 Setup Status:');
console.log('================');

if (envVarsValid) {
  console.log('✅ All tests passed! Your application is ready to run.');
  console.log('');
  console.log('Next steps:');
  console.log('1. Run: npm start');
  console.log('2. The app will create the hidden attributes in your Square account');
} else {
  console.log('⚠️  Environment variables need to be configured.');
  console.log('');
  console.log('Setup required:');
  console.log('1. Copy .env.example to .env: cp .env.example .env');
  console.log('2. Fill in your Square API credentials in the .env file');
  console.log('3. Run this test again: node test.js');
}