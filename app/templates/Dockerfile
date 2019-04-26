FROM node:10.15-alpine
ENV NODE_ENV production
WORKDIR /api
COPY ./build ./dist
# Only necessary to debug container in developer machine
# Kubernetes uses ConfigMaps to handle environment variables
# COPY .env .env

EXPOSE 3000
CMD node dist/build.js
