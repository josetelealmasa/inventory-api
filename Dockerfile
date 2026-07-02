# --- Etapa 1: dependencias e instalación ---
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev

# --- Etapa 2: imagen final, mínima ---
FROM node:20-alpine AS runner
WORKDIR /app

# Buenas prácticas: no correr como root
RUN addgroup -S nodejs && adduser -S nodejs -G nodejs

ENV NODE_ENV=production
COPY --from=deps /app/node_modules ./node_modules
COPY src ./src
COPY package*.json ./

USER nodejs

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s \
  CMD node -e "require('http').get('http://localhost:3000/health', r => process.exit(r.statusCode === 200 ? 0 : 1)).on('error', () => process.exit(1))"

CMD ["node", "src/server.js"]
