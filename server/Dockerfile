# --- BƯỚC 1: BUILD STAGE ---
# Dùng môi trường Node.js để tải thư viện và biên dịch mã TypeScript sang JavaScript
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# --- BƯỚC 2: PRODUCTION STAGE ---
# Tạo một môi trường mới, sạch sẽ và siêu nhẹ chỉ để chạy app
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
# Chỉ cài các thư viện thật sự cần thiết cho production (bỏ qua devDependencies)
RUN npm install --only=production
# Copy thư mục dist (chứa code đã biên dịch) từ Bước 1 sang
COPY --from=builder /app/dist ./dist

EXPOSE 3000
CMD ["node", "dist/main"]