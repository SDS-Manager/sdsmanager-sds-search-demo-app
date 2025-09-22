# Install dependencies only when needed
FROM ghcr.io/sds-manager/sds:api-demo-fe.base.v1.0 as builder

WORKDIR /app
COPY package.json yarn.lock* ./
RUN npm install --legacy-peer-deps

COPY . .
RUN npm run build
RUN ls

# nginx phase
FROM nginx:stable-alpine

COPY --from=builder /app/nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/build/ /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]