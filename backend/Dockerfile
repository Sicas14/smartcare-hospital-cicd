
FROM node:22-bookworm-slim

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends python3 make g++ && rm -rf /var/lib/apt/lists/*

COPY package*.json ./

RUN npm ci --omit=dev --build-from-source

COPY src ./src

RUN mkdir -p /app/data

ENV NODE_ENV=production

EXPOSE 5000

CMD ["node", "src/server.js"]
