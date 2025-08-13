const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function debugLogin() {
  console.log('🔍 تشخيص مشكلة تسجيل الدخول...\n');
  
  try {
    // جلب المستخدم الأول
    const user = await prisma.user.findFirst({
      where: { email: 'admin@example.com' }
    });
    
    if (!user) {
      console.log('❌ المستخدم غير موجود');
      return;
    }
    
    console.log('✅ المستخدم موجود:');
    console.log(`- البريد: ${user.email}`);
    console.log(`- الاسم: ${user.name}`);
    console.log(`- الدور: ${user.role}`);
    console.log(`- نشط: ${user.isActive}`);
    console.log(`- كلمة المرور المشفرة: ${user.password.substring(0, 20)}...`);
    
    // اختبار كلمة المرور
    const testPassword = '123456';
    console.log(`\n🔐 اختبار كلمة المرور: "${testPassword}"`);
    
    const isValid = await bcrypt.compare(testPassword, user.password);
    console.log(`نتيجة المقارنة: ${isValid ? '✅ صحيحة' : '❌ خاطئة'}`);
    
    if (!isValid) {
      console.log('\n🔧 إعادة تشفير كلمة المرور...');
      const newHashedPassword = await bcrypt.hash(testPassword, 12);
      
      await prisma.user.update({
        where: { email: 'admin@example.com' },
        data: { password: newHashedPassword }
      });
      
      console.log('✅ تم تحديث كلمة المرور');
      
      // اختبار مرة أخرى
      const updatedUser = await prisma.user.findFirst({
        where: { email: 'admin@example.com' }
      });
      
      const isValidNow = await bcrypt.compare(testPassword, updatedUser.password);
      console.log(`اختبار جديد: ${isValidNow ? '✅ صحيحة الآن' : '❌ ما زالت خاطئة'}`);
    }
    
    // اختبار تسجيل الدخول عبر API
    console.log('\n🌐 اختبار API...');
    const { default: fetch } = await import('node-fetch');
    
    const response = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin@example.com',
        password: '123456'
      }),
    });
    
    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ API يعمل بشكل طبيعي');
      console.log(`مرحباً ${result.user.name}!`);
    } else {
      console.log('❌ خطأ في API:', result.error);
    }
    
  } catch (error) {
    console.error('❌ خطأ:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

debugLogin();