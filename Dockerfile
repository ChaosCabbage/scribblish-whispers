FROM node:12
WORKDIR /app
COPY server/build /app
COPY server/package.json /app
COPY server/yarn.lock /app
COPY client/build /app/client
RUN yarn install

ENV CLIENT_PATH=/app/client 

CMD ["node", "./express/src/main.js"]
