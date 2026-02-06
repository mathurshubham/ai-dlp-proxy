# Stage 1: Build
FROM node:20-slim AS builder
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copy source code
COPY . .

# Build Next.js app
RUN npm run build

# Stage 2: Run
FROM node:20-slim AS runner
WORKDIR /app
ENV NODE_ENV=production

# Copy only what we need from builder
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# Expose Next.js default port
EXPOSE 3000

CMD ["npm", "run", "start"]
