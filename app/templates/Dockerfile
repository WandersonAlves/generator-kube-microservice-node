FROM astefanutti/scratch-node
ENV NODE_ENV production
COPY ./build ./
# Only necessary to debug container in developer machine
# Kubernetes uses ConfigMaps to handle environment variables
# COPY .env .env

EXPOSE 3000
ENTRYPOINT [ "node", "./build.js" ]