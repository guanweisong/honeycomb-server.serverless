FROM node:16-alpine AS Builder

WORKDIR /usr/src/app
COPY package.json yarn.lock /usr/src/app/

RUN yarn
COPY . .
RUN yarn build

FROM node:16-alpine
WORKDIR /usr/src/app

COPY --from=builder /usr/src/app .

EXPOSE 7002
CMD npm start
