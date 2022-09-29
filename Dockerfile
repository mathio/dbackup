FROM alpine:latest
WORKDIR /app
RUN apk update
RUN apk add --no-cache lzo
RUN apk add --no-cache postgresql-client
RUN apk add --no-cache libuv
RUN apk add --no-cache --update-cache nodejs npm
RUN npm i -g corepack

COPY src/ ./src
COPY package.json .
COPY yarn.lock .
RUN yarn install

CMD ["yarn", "start"]
