FROM mhart/alpine-node:16 AS Builder

WORKDIR /usr/src/app
COPY package.json yarn.lock /usr/src/app/

RUN yarn
COPY . .
RUN yarn build

FROM mhart/alpine-node
WORKDIR /usr/src/app

COPY --from=builder /usr/src/app .

EXPOSE 7002
CMD npm start
