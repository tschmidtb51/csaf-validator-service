# Build Stage 1
# This build created a staging docker image
#

FROM node:18-alpine AS appbuild
WORKDIR /usr/src
RUN apk add git; \
    git clone https://github.com/secvisogram/csaf-validator-service.git; \
    cd csaf-validator-service; \
    npm ci; \
    npm run dist

# Build Stage 2
# This build takes the production build from staging build
#

FROM node:18-alpine
WORKDIR /usr/src/app
RUN apk add hunspell hunspell-en hunspell-de-de 
ENV NODE_ENV=production
COPY --from=appbuild /usr/src/csaf-validator-service/dist /usr/src/app
COPY config/local-production.json /usr/src/app/config/local-production.json
#This have to be checked
#USER node
EXPOSE 8082
CMD [ "node", "backend/server.js" ]
