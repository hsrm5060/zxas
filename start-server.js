const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 بدء تشغيل نظام إدارة السائقين...\n');

// تشغيل الخادم الخلفي
const server = spawn('npm', ['run', 'server:dev'], {
  cwd: __dirname,
  stdio: 'inherit',
  shell: true
});

server.on('error', (err) => {
  console.error('❌ خطأ في تشغيل الخادم:', err);
});

// تشغيل الواجهة الأمامية بعد 3 ثواني
setTimeout(() => {
  console.log('\n🌐 بدء تشغيل الواجهة الأمامية...\n');
  
  const frontend = spawn('npm', ['run', 'dev'], {
    cwd: __dirname,
    stdio: 'inherit',
    shell: true
  });

  frontend.on('error', (err) => {
    console.error('❌ خطأ في تشغيل الواجهة الأمامية:', err);
  });
}, 3000);

process.on('SIGINT', () => {
  console.log('\n🛑 إيقاف النظام...');
  process.exit(0);
});