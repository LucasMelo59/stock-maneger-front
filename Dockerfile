FROM node:lts AS builder

WORKDIR /app
COPY . .

RUN npm install --force
RUN npm run build --configuration=production

RUN chmod -R 755 /app/dist/stock-manager-front

FROM nginx:stable

COPY ./nginx-custom.conf /etc/nginx/conf.d/default.conf

COPY --from=builder /app/dist/stock-manager-front/browser /usr/share/nginx/html/stock-manager-front

EXPOSE 80