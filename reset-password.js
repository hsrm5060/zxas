const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function resetPasswords() {
  console.log('🔄 إعادة تعيين كلمات المرور...');
  
  const hashedPassword = await bcrypt.hash('123456', 12);
  
  // تحديث كلمات المرور لجميع المستخدمين
  await prisma.user.updateMany({
    data: {
      password: hashedPassword
    }
  });
  
  // عرض جميع المستخدمين
  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      isActive: true
    }
  });
  
  console.log('✅ تم تحديث كلمات المرور لجميع المستخدمين:');
  console.log('📋 بيانات الدخول:');
  users.forEach(user => {
    console.log(`- ${user.email} / 123456 (${user.role}) - ${user.isActive ? 'نشط' : 'غير نشط'}`);
  });
  
  await prisma.$disconnect();
}

resetPasswords().catch(console.error);