FROM node:16-alpine AS build

WORKDIR /app

COPY package.json .
COPY package-lock.json .
RUN npm install
RUN npm install -g @ionic/cli
RUN npm install -g @angular/cli

COPY . .
RUN npm run build-production

FROM nginx:1.21.5-alpine

COPY --from=build /app/www/ /var/www
COPY ./nginx.conf /etc/nginx/nginx.conf
EXPOSE 80 443
CMD ["nginx"]
