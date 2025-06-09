#!/usr/bin/env node

/**
 * Pipeline Test Runner
 * Specialized test runner for CI/CD pipelines that focuses on 
 * the specific issues we experienced with DOM loading and script initialization
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// ANSI color codes for better output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green');
}

function logError(message) {
  log(`❌ ${message}`, 'red');
}

function logWarning(message) {
  log(`⚠️  ${message}`, 'yellow');
}

function logInfo(message) {
  log(`ℹ️  ${message}`, 'blue');
}

/**
 * Run DOM structure validation - detects the exact issues we experienced
 */
function validateDOMStructure() {
  log('\n🔍 Validating DOM Structure...', 'cyan');
  
  try {
    const htmlContent = fs.readFileSync('Escalas.html', 'utf8');
    
    // Critical elements that caused our original issues
    const criticalElements = [
      { id: 'scheduleContent', description: 'Main schedule container' },
      { id: 'scheduleInfo', description: 'Schedule information header' },
      { id: 'apartmentList', description: 'Apartment list container' },
      { id: 'generateBtn', description: 'Generate schedule button' },
      { id: 'downloadBtn', description: 'Download PDF button' },
      { id: 'startDate', description: 'Start date input' },
      { id: 'endDate', description: 'End date input' }
    ];
    
    const missing = [];
    const found = [];
    
    criticalElements.forEach(element => {
      const pattern = `id="${element.id}"`;
      if (htmlContent.includes(pattern)) {
        found.push(element);
        logSuccess(`Found ${element.description} (${element.id})`);
      } else {
        missing.push(element);
        logError(`Missing ${element.description} (${element.id})`);
      }
    });
    
    // Validate apartment structure
    log('\n🏠 Validating apartment structure...', 'cyan');
    const apartmentPattern = /apartment-item.*data-apt="(\d+)"/g;
    const apartmentMatches = [...htmlContent.matchAll(apartmentPattern)];
    
    if (apartmentMatches.length === 4) {
      logSuccess(`Found ${apartmentMatches.length} apartment items`);
      
      // Check order
      const apartmentNumbers = apartmentMatches.map(match => match[1]);
      const expectedOrder = ['201', '202', '301', '302'];
      
      if (JSON.stringify(apartmentNumbers) === JSON.stringify(expectedOrder)) {
        logSuccess('Apartment order is correct: ' + apartmentNumbers.join(', '));
      } else {
        logWarning(`Apartment order: ${apartmentNumbers.join(', ')} (expected: ${expectedOrder.join(', ')})`);
      }
    } else {
      logError(`Expected 4 apartments, found ${apartmentMatches.length}`);
      missing.push({ id: 'apartment-structure', description: 'Complete apartment structure' });
    }
    
    if (missing.length > 0) {
      logError(`DOM validation failed! Missing ${missing.length} critical elements.`);
      return false;
    }
    
    logSuccess('DOM structure validation passed!');
    return true;
    
  } catch (error) {
    logError(`DOM validation error: ${error.message}`);
    return false;
  }
}

/**
 * Validate JavaScript structure and initialization patterns
 */
function validateJavaScriptStructure() {
  log('\n🔧 Validating JavaScript Structure...', 'cyan');
  
  try {
    const jsContent = fs.readFileSync('index.js', 'utf8');
    
    const requiredClasses = [
      { name: 'ScheduleManager', description: 'Schedule management logic' },
      { name: 'UIRenderer', description: 'UI rendering and updates' },
      { name: 'ApartmentManager', description: 'Apartment ordering and selection' },
      { name: 'PDFGenerator', description: 'PDF generation functionality' },
      { name: 'ScheduleApp', description: 'Main application controller' }
    ];
    
    const missing = [];
    
    requiredClasses.forEach(cls => {
      const pattern = `class ${cls.name}`;
      if (jsContent.includes(pattern)) {
        logSuccess(`Found ${cls.description} (${cls.name})`);
      } else {
        missing.push(cls);
        logError(`Missing ${cls.description} (${cls.name})`);
      }
    });
    
    // Check initialization patterns that caused issues
    log('\n🚀 Validating initialization patterns...', 'cyan');
    
    const initPatterns = [
      { pattern: 'DOMContentLoaded', description: 'DOM ready listener' },
      { pattern: 'window.scheduleApp', description: 'Global app instance' },
      { pattern: 'updatePositionIndicators', description: 'Position indicator updates' },
      { pattern: 'setupEventListeners', description: 'Event listener setup' }
    ];
    
    initPatterns.forEach(pattern => {
      if (jsContent.includes(pattern.pattern)) {
        logSuccess(`Found ${pattern.description}`);
      } else {
        logError(`Missing ${pattern.description} (${pattern.pattern})`);
        missing.push(pattern);
      }
    });
    
    if (missing.length > 0) {
      logError(`JavaScript validation failed! Missing ${missing.length} required components.`);
      return false;
    }
    
    logSuccess('JavaScript structure validation passed!');
    return true;
    
  } catch (error) {
    logError(`JavaScript validation error: ${error.message}`);
    return false;
  }
}

/**
 * Run specific Jest tests for DOM loading detection
 */
function runDOMLoadingTests() {
  log('\n🧪 Running DOM Loading Detection Tests...', 'cyan');
  
  try {
    execSync('npx jest tests/integration/DOMLoadingTests.test.js --verbose', { 
      stdio: 'inherit' 
    });
    logSuccess('DOM loading tests passed!');
    return true;
  } catch (error) {
    logError('DOM loading tests failed!');
    return false;
  }
}

/**
 * Run apartment structure integrity tests
 */
function runApartmentStructureTests() {
  log('\n🏠 Running Apartment Structure Tests...', 'cyan');
  
  try {
    execSync('npx jest --testNamePattern="apartment.*structure.*integrity" --verbose', { 
      stdio: 'inherit' 
    });
    logSuccess('Apartment structure tests passed!');
    return true;
  } catch (error) {
    logError('Apartment structure tests failed!');
    return false;
  }
}

/**
 * Run security and performance checks
 */
function runSecurityChecks() {
  log('\n🔒 Running Security Checks...', 'cyan');
  
  let passed = true;
  
  try {
    // Check for eval usage
    execSync('grep -r "eval(" . --include="*.js"', { stdio: 'pipe' });
    logError('Security risk: eval() usage detected');
    passed = false;
  } catch (error) {
    logSuccess('No eval() usage found');
  }
  
  try {
    // Check for innerHTML concatenation
    execSync('grep -r "innerHTML.*\\+" . --include="*.js"', { stdio: 'pipe' });
    logError('Security risk: innerHTML concatenation detected');
    passed = false;
  } catch (error) {
    logSuccess('No innerHTML concatenation found');
  }
  
  try {
    // Check for console.log in production code
    const result = execSync('grep -r "console.log" index.js src/ 2>/dev/null || true', { encoding: 'utf8' });
    if (result.trim()) {
      logWarning('console.log statements found in production code');
      console.log(result);
    } else {
      logSuccess('No console.log statements in production code');
    }
  } catch (error) {
    // Grep not finding anything is actually good
    logSuccess('No console.log statements in production code');
  }
  
  return passed;
}

/**
 * Main test runner
 */
function main() {
  const args = process.argv.slice(2);
  const testType = args[0] || 'all';
  
  log(`\n🚀 Pipeline Test Runner - Mode: ${testType}`, 'bright');
  log('=' .repeat(60), 'blue');
  
  let allPassed = true;
  
  switch (testType) {
    case 'dom':
      allPassed = validateDOMStructure();
      break;
      
    case 'js':
      allPassed = validateJavaScriptStructure();
      break;
      
    case 'structure':
      allPassed = validateDOMStructure() && validateJavaScriptStructure();
      break;
      
    case 'tests':
      allPassed = runDOMLoadingTests() && runApartmentStructureTests();
      break;
      
    case 'security':
      allPassed = runSecurityChecks();
      break;
      
    case 'all':
    default:
      allPassed = validateDOMStructure() && 
                 validateJavaScriptStructure() && 
                 runDOMLoadingTests() && 
                 runApartmentStructureTests() && 
                 runSecurityChecks();
      break;
  }
  
  log('\n' + '=' .repeat(60), 'blue');
  
  if (allPassed) {
    logSuccess('🎉 All pipeline tests passed!');
    log('✅ The application is ready for deployment', 'green');
    process.exit(0);
  } else {
    logError('💥 Pipeline tests failed!');
    log('❌ Issues detected that prevent deployment', 'red');
    process.exit(1);
  }
}

// Help text
if (process.argv.includes('--help') || process.argv.includes('-h')) {
  console.log(`
Pipeline Test Runner

Usage: node scripts/pipeline-test.js [mode]

Modes:
  all        Run all tests (default)
  dom        Validate DOM structure only
  js         Validate JavaScript structure only  
  structure  Validate both DOM and JS structure
  tests      Run Jest-based DOM loading tests
  security   Run security checks only

Examples:
  node scripts/pipeline-test.js
  node scripts/pipeline-test.js dom
  node scripts/pipeline-test.js security
  `);
  process.exit(0);
}

main();