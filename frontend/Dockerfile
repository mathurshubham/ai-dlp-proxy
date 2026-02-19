# Stage 1: Build
FROM node:20-bullseye AS builder
WORKDIR /app

# 1. Install necessary build tools for native modules (Rust/Cargo is key for lightningcss)
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    gcc \
    libc6-dev \
    && rm -rf /var/lib/apt/lists/*

# 2. Copy only package files first to leverage Docker cache
COPY package*.json ./

# 3. Clean install. We use --platform=linux and --arch=arm64 
# to tell npm exactly what we want if it supports it.
RUN npm install --legacy-peer-deps

# 4. Copy source code
COPY . .

# 5. Execute build
# If this still fails, check if you have "next build --turbo" in package.json
# and try removing the "--turbo" flag.
RUN npm run build

# Stage 2: Run (Keep your existing Stage 2)
