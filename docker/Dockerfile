FROM node:16 AS build

WORKDIR /app
COPY . /app

RUN \
  npm ci && \
  npm run prep:codegen && \
  npm run prep:extract-messages && \
  npm run prep:compile-messages && \
  npm run build:prod


FROM nginx:1.21

RUN mkdir -p /var/www/app /var/www/server
COPY --from=build /app/dist /var/www/app
COPY support/docker/default.conf /etc/nginx/conf.d/default.conf
