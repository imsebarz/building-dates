const fs = require('fs');
const path = require('path');

/**
 * Test script for validating the application
 */
function runTests() {
  console.log('🧪 Running tests...');
  
  let passed = 0;
  let failed = 0;

  function test(description, testFunction) {
    try {
      testFunction();
      console.log(`✅ ${description}`);
      passed++;
    } catch (error) {
      console.error(`❌ ${description}: ${error.message}`);
      failed++;
    }
  }

  // Test 1: Check required files exist
  test('Required files exist', () => {
    const requiredFiles = ['Escalas.html', 'style.css', 'index.js'];
    requiredFiles.forEach(file => {
      if (!fs.existsSync(file)) {
        throw new Error(`Missing required file: ${file}`);
      }
    });
  });

  // Test 2: Validate HTML structure
  test('HTML structure is valid', () => {
    const htmlContent = fs.readFileSync('Escalas.html', 'utf8');
    const requiredElements = [
      'id="startDate"',
      'id="endDate"', 
      'id="apartmentList"',
      'id="scheduleContent"',
      'id="generateBtn"',
      'id="downloadBtn"'
    ];

    requiredElements.forEach(element => {
      if (!htmlContent.includes(element)) {
        throw new Error(`Missing HTML element: ${element}`);
      }
    });
  });

  // Test 3: Validate JavaScript structure
  test('JavaScript structure is valid', () => {
    const jsContent = fs.readFileSync('index.js', 'utf8');
    const requiredClasses = ['ScheduleManager', 'UIRenderer', 'ApartmentManager', 'PDFGenerator'];
    
    requiredClasses.forEach(className => {
      if (!jsContent.includes(`class ${className}`)) {
        throw new Error(`Missing JavaScript class: ${className}`);
      }
    });
  });

  // Test 4: Check CSS file
  test('CSS file is valid', () => {
    const cssContent = fs.readFileSync('style.css', 'utf8');
    if (cssContent.length < 100) {
      throw new Error('CSS file seems too small');
    }
    
    // Check for basic CSS structure
    if (!cssContent.includes('.app-container') || !cssContent.includes('.config-panel')) {
      throw new Error('Missing essential CSS classes');
    }
  });

  // Test 5: Check modular structure
  test('Modular structure exists', () => {
    if (fs.existsSync('src')) {
      const expectedDirs = ['config', 'models', 'services', 'ui', 'utils'];
      expectedDirs.forEach(dir => {
        const dirPath = path.join('src', dir);
        if (!fs.existsSync(dirPath)) {
          throw new Error(`Missing src directory: ${dir}`);
        }
      });
    }
  });

  // Test 6: Package.json validation
  test('package.json is valid', () => {
    if (!fs.existsSync('package.json')) {
      throw new Error('package.json not found');
    }
    
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    if (!packageJson.name || !packageJson.version || !packageJson.description) {
      throw new Error('package.json missing required fields');
    }
  });

  // Summary
  console.log('\n📊 Test Summary:');
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📈 Total: ${passed + failed}`);

  if (failed > 0) {
    console.log('\n💡 Some tests failed. Please fix the issues before deploying.');
    process.exit(1);
  } else {
    console.log('\n🎉 All tests passed! Ready for deployment.');
  }
}

if (require.main === module) {
  runTests();
}

module.exports = { runTests };