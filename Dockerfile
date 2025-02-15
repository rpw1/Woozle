FROM node:20.17.0-alpine AS baseline

WORKDIR /opt/web
COPY package.json package-lock.json ./

ENV PATH="./node_modules/.bin:$PATH"
ENV NODE_ENV=production

COPY . ./
RUN npm ci
RUN npm run build

FROM nginx:1.26-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=baseline /opt/web/dist/woozle /usr/share/nginx/html