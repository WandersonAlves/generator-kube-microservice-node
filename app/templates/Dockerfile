FROM node:8.9-alpine
ENV NODE_ENV production
WORKDIR /api
COPY ./node_modules ./node_modules
COPY ./dist ./dist
COPY .env .env
EXPOSE 3000
CMD node dist/index.js