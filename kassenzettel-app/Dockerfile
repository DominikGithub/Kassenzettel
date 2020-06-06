# build stage
FROM node:lts-alpine as build-stage

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# production stage
FROM nginx:stable-alpine as production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html
COPY ./nginx_data /etc/nginx/

# NOTE: FRONTEND_PORT -> .env
EXPOSE 81
CMD ["nginx", "-g", "daemon off;"]