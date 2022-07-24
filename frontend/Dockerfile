FROM node:16-alpine AS builder
WORKDIR /app
ADD package*.json .
RUN npm install
COPY . .
RUN npm run build

FROM nginx
COPY --from=builder /app/build /usr/share/nginx/html