FROM node:16.14-alpine as node

FROM node as frontend-local-build

WORKDIR /app

COPY ./package*.json .

COPY . /app

RUN npm install

CMD ["npm","start"]