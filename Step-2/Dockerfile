FROM node:alpine

RUN mkdir -p /app
WORKDIR /app

RUN apk add --no-cache make gcc g++ python

COPY package.json /app

RUN npm install

COPY . /app

EXPOSE 80

CMD [ "node", "app.js"]
