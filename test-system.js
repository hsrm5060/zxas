const axios = require('axios');

// Test configuration
const BASE_URL = 'http://localhost:5000';
const TEST_USER = {
  email: 'admin@test.com',
  password: 'admin123'
};

let authToken = '';

// Test utilities
const log = (message, type = 'info') => {
  const timestamp = new Date().toISOString();
  const colors = {
    info: '\x1b[36m',
    success: '\x1b[32m',
    error: '\x1b[31m',
    warning: '\x1b[33m',
    reset: '\x1b[0m'
  };
  console.log(`${colors[type]}[${timestamp}] ${message}${colors.reset}`);
};

const makeRequest = async (method, endpoint, data = null, useAuth = true) => {
  try {
    const config = {
      method,
      url: `${BASE_URL}${endpoint}`,
      headers: {}
    };

    if (useAuth && authToken) {
      config.headers.Authorization = `Bearer ${authToken}`;
    }

    if (data) {
      config.data = data;
      config.headers['Content-Type'] = 'application/json';
    }

    const response = await axios(config);
    return { success: true, data: response.data, status: response.status };
  } catch (error) {
    return { 
      success: false, 
      error: error.response?.data || error.message,
      status: error.response?.status || 500
    };
  }
};

// Test functions
const testServerConnection = async () => {
  log('اختبار الاتصال بالخادم...', 'info');
  
  try {
    const response = await axios.get(`${BASE_URL}/api/auth/test`, { timeout: 5000 });
    log('✓ الخادم يعمل بشكل صحيح', 'success');
    return true;
  } catch (error) {
    log('✗ فشل الاتصال بالخادم', 'error');
    log(`خطأ: ${error.message}`, 'error');
    return false;
  }
};

const testAuthentication = async () => {
  log('اختبار نظام المصادقة...', 'info');
  
  // Test login
  const loginResult = await makeRequest('POST', '/api/auth/login', TEST_USER, false);
  
  if (loginResult.success) {
    authToken = loginResult.data.token;
    log('✓ تسجيل الدخول نجح', 'success');
    
    // Test protected route
    const profileResult = await makeRequest('GET', '/api/auth/profile');
    if (profileResult.success) {
      log('✓ الوصول للمسارات المحمية نجح', 'success');
      return true;
    } else {
      log('✗ فشل الوصول للمسارات المحمية', 'error');
      return false;
    }
  } else {
    log('✗ فشل تسجيل الدخول', 'error');
    log(`خطأ: ${JSON.stringify(loginResult.error)}`, 'error');
    return false;
  }
};

const testDatabaseConnection = async () => {
  log('اختبار الاتصال بقاعدة البيانات...', 'info');
  
  const result = await makeRequest('GET', '/api/users?limit=1');
  
  if (result.success) {
    log('✓ قاعدة البيانات متصلة وتعمل', 'success');
    return true;
  } else {
    log('✗ فشل الاتصال بقاعدة البيانات', 'error');
    log(`خطأ: ${JSON.stringify(result.error)}`, 'error');
    return false;
  }
};

const testCRUDOperations = async () => {
  log('اختبار العمليات الأساسية (CRUD)...', 'info');
  
  let allTestsPassed = true;
  
  // Test Users CRUD
  log('اختبار إدارة المستخدمين...', 'info');
  const usersResult = await makeRequest('GET', '/api/users');
  if (usersResult.success) {
    log('✓ جلب المستخدمين نجح', 'success');
  } else {
    log('✗ فشل جلب المستخدمين', 'error');
    allTestsPassed = false;
  }
  
  // Test Drivers CRUD
  log('اختبار إدارة السائقين...', 'info');
  const driversResult = await makeRequest('GET', '/api/drivers');
  if (driversResult.success) {
    log('✓ جلب السائقين نجح', 'success');
  } else {
    log('✗ فشل جلب السائقين', 'error');
    allTestsPassed = false;
  }
  
  // Test Transactions CRUD
  log('اختبار إدارة المعاملات...', 'info');
  const transactionsResult = await makeRequest('GET', '/api/transactions');
  if (transactionsResult.success) {
    log('✓ جلب المعاملات نجح', 'success');
  } else {
    log('✗ فشل جلب المعاملات', 'error');
    allTestsPassed = false;
  }
  
  // Test Documents CRUD
  log('اختبار إدارة المستندات...', 'info');
  const documentsResult = await makeRequest('GET', '/api/documents');
  if (documentsResult.success) {
    log('✓ جلب المستندات نجح', 'success');
  } else {
    log('✗ فشل جلب المستندات', 'error');
    allTestsPassed = false;
  }
  
  // Test Notifications CRUD
  log('اختبار إدارة الإشعارات...', 'info');
  const notificationsResult = await makeRequest('GET', '/api/notifications');
  if (notificationsResult.success) {
    log('✓ جلب الإشعارات نجح', 'success');
  } else {
    log('✗ فشل جلب الإشعارات', 'error');
    allTestsPassed = false;
  }
  
  return allTestsPassed;
};

const testReportsSystem = async () => {
  log('اختبار نظام التقارير...', 'info');
  
  const reportsResult = await makeRequest('GET', '/api/reports/dashboard');
  
  if (reportsResult.success) {
    log('✓ نظام التقارير يعمل', 'success');
    return true;
  } else {
    log('✗ فشل نظام التقارير', 'error');
    log(`خطأ: ${JSON.stringify(reportsResult.error)}`, 'error');
    return false;
  }
};

const testAdminFunctions = async () => {
  log('اختبار وظائف الإدارة...', 'info');
  
  let allTestsPassed = true;
  
  // Test system stats
  const statsResult = await makeRequest('GET', '/api/admin/stats');
  if (statsResult.success) {
    log('✓ إحصائيات النظام تعمل', 'success');
  } else {
    log('✗ فشل جلب إحصائيات النظام', 'error');
    allTestsPassed = false;
  }
  
  // Test health check
  const healthResult = await makeRequest('GET', '/api/admin/health');
  if (healthResult.success) {
    log('✓ فحص صحة النظام يعمل', 'success');
    log(`حالة النظام: ${healthResult.data.status}`, 'info');
  } else {
    log('✗ فشل فحص صحة النظام', 'error');
    allTestsPassed = false;
  }
  
  // Test backup stats
  const backupStatsResult = await makeRequest('GET', '/api/admin/backup/stats');
  if (backupStatsResult.success) {
    log('✓ إحصائيات النسخ الاحتياطية تعمل', 'success');
  } else {
    log('✗ فشل جلب إحصائيات النسخ الاحتياطية', 'error');
    allTestsPassed = false;
  }
  
  return allTestsPassed;
};

const testSecurityFeatures = async () => {
  log('اختبار ميزات الأمان...', 'info');
  
  let allTestsPassed = true;
  
  // Test unauthorized access
  const unauthorizedResult = await makeRequest('GET', '/api/admin/stats', null, false);
  if (!unauthorizedResult.success && unauthorizedResult.status === 401) {
    log('✓ حماية المسارات تعمل', 'success');
  } else {
    log('✗ فشل حماية المسارات', 'error');
    allTestsPassed = false;
  }
  
  // Test invalid token
  const oldToken = authToken;
  authToken = 'invalid-token';
  const invalidTokenResult = await makeRequest('GET', '/api/users');
  if (!invalidTokenResult.success && invalidTokenResult.status === 403) {
    log('✓ التحقق من الرموز المميزة يعمل', 'success');
  } else {
    log('✗ فشل التحقق من الرموز المميزة', 'error');
    allTestsPassed = false;
  }
  
  // Restore valid token
  authToken = oldToken;
  
  return allTestsPassed;
};

// Main test runner
const runAllTests = async () => {
  log('🚀 بدء اختبار النظام الشامل', 'info');
  log('================================', 'info');
  
  const tests = [
    { name: 'اختبار الاتصال بالخادم', fn: testServerConnection },
    { name: 'اختبار نظام المصادقة', fn: testAuthentication },
    { name: 'اختبار قاعدة البيانات', fn: testDatabaseConnection },
    { name: 'اختبار العمليات الأساسية', fn: testCRUDOperations },
    { name: 'اختبار نظام التقارير', fn: testReportsSystem },
    { name: 'اختبار وظائف الإدارة', fn: testAdminFunctions },
    { name: 'اختبار ميزات الأمان', fn: testSecurityFeatures }
  ];
  
  let passedTests = 0;
  let totalTests = tests.length;
  
  for (const test of tests) {
    log(`\n--- ${test.name} ---`, 'info');
    try {
      const result = await test.fn();
      if (result) {
        passedTests++;
        log(`✓ ${test.name} نجح`, 'success');
      } else {
        log(`✗ ${test.name} فشل`, 'error');
      }
    } catch (error) {
      log(`✗ ${test.name} فشل: ${error.message}`, 'error');
    }
  }
  
  log('\n================================', 'info');
  log(`📊 نتائج الاختبار: ${passedTests}/${totalTests} نجح`, passedTests === totalTests ? 'success' : 'warning');
  
  if (passedTests === totalTests) {
    log('🎉 جميع الاختبارات نجحت! النظام جاهز للاستخدام', 'success');
  } else {
    log('⚠️  بعض الاختبارات فشلت. يرجى مراجعة الأخطاء أعلاه', 'warning');
  }
  
  return passedTests === totalTests;
};

// Run tests if this file is executed directly
if (require.main === module) {
  runAllTests().then(success => {
    process.exit(success ? 0 : 1);
  }).catch(error => {
    log(`خطأ في تشغيل الاختبارات: ${error.message}`, 'error');
    process.exit(1);
  });
}

module.exports = {
  runAllTests,
  testServerConnection,
  testAuthentication,
  testDatabaseConnection,
  testCRUDOperations,
  testReportsSystem,
  testAdminFunctions,
  testSecurityFeatures
};
