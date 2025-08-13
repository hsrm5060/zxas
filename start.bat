@echo off
echo ========================================
echo    نظام إدارة السائقين والمحاسبة
echo ========================================
echo.

echo جاري تثبيت المتطلبات...
call npm install

echo.
echo جاري إعداد قاعدة البيانات...
call npx prisma migrate dev --name init

echo.
echo جاري إدخال البيانات التجريبية...
call npx prisma db seed

echo.
echo ========================================
echo تم إعداد النظام بنجاح!
echo ========================================
echo.
echo لتشغيل النظام:
echo 1. افتح terminal جديد وشغل: npm run server:dev
echo 2. افتح terminal آخر وشغل: npm run dev
echo.
echo أو شغل الملف run.bat لتشغيل النظام تلقائياً
echo.
pause