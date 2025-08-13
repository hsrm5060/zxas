# استخدام Node.js 18 كصورة أساسية
FROM node:18-alpine

# تعيين مجلد العمل
WORKDIR /app

# نسخ ملفات package
COPY package*.json ./

# تثبيت المتطلبات
RUN npm ci --only=production

# نسخ باقي الملفات
COPY . .

# إنشاء مجلد الرفع
RUN mkdir -p uploads/documents

# تثبيت Prisma CLI وإنشاء العميل
RUN npx prisma generate

# بناء التطبيق
RUN npm run build

# إنشاء مستخدم غير root
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# تغيير ملكية الملفات
RUN chown -R nextjs:nodejs /app
USER nextjs

# كشف المنافذ
EXPOSE 3000 5000

# أمر البدء
CMD ["sh", "-c", "npx prisma migrate deploy && npm run server & npm start"]