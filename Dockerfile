# ---- build stage: install everything and build both apps ----
FROM node:24-slim AS build
RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*
WORKDIR /app
ENV NX_DAEMON=false NX_NO_CLOUD=true

COPY . .
RUN npm ci
RUN npx prisma generate
ARG VITE_GITHUB_CLIENT_ID
ENV VITE_GITHUB_CLIENT_ID=$VITE_GITHUB_CLIENT_ID
RUN npx nx run-many -t build -p web api
RUN npm prune --omit=dev

# ---- runtime stage: only what the server needs ----
FROM node:24-slim
RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*
WORKDIR /app
ENV NODE_ENV=production

COPY --from=build /app/package.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/apps/api/package.json ./apps/api/
COPY --from=build /app/apps/api/dist ./apps/api/dist
COPY --from=build /app/apps/web/dist ./apps/web/dist

USER node
EXPOSE 3000
CMD ["node", "apps/api/dist/main.js"]
