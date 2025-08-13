@echo off
echo ========================================
echo    تشغيل نظام إدارة السائقين
echo ========================================
echo.

echo بدء تشغيل الخادم الخلفي...
start "Server" cmd /k "npm run server:dev"

timeout /t 3 /nobreak > nul

echo بدء تشغيل الواجهة الأمامية...
start "Frontend" cmd /k "npm run dev"

echo.
echo ========================================
echo تم تشغيل النظام بنجاح!
echo ========================================
echo.
echo الواجهة الأمامية: http://localhost:3000
echo الخادم الخلفي: http://localhost:5000
echo.
echo حسابات تجريبية:
echo المدير: admin@example.com / 123456
echo المحاسب: accountant@example.com / 123456
echo المشرف: supervisor@example.com / 123456
echo السائق: driver1@example.com / 123456
echo.
pause