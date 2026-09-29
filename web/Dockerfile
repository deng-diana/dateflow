# Build the DateFlow web image (Next.js).
FROM node:24-slim

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]

