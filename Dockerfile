FROM node:20-alpine
WORKDIR /app

RUN apk add python3 make g++ && \
    corepack enable && \
    corepack prepare pnpm@8.7.1 --activate

COPY package*.json pnpm*.yaml tsconfig.json ./
RUN pnpm install --frozen-lockfile

COPY src /app/src
RUN pnpm run build

CMD [ "node", "/app/dist/main.js" ]
