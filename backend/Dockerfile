FROM node:20-alpine

WORKDIR /app

COPY backend/package*.json ./
RUN npm install

COPY backend/src ./src
COPY backend/tsconfig.json ./
COPY backend/prisma ./prisma
COPY backend/prisma.config.ts ./

RUN npm run build
RUN npx prisma generate

EXPOSE 3000

CMD ["npm", "start"]
