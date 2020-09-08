FROM mhart/alpine-node:12.14.1

WORKDIR /app
COPY package.json .
COPY package-lock.json .

RUN apk update && apk upgrade && \
    apk add --no-cache mplayer && \
    npm i

COPY . .
CMD npm start