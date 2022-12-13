FROM node:8-alpine
ENV APP_ENV=dev

WORKDIR /app

COPY ["package.json", "package-lock.json*", "./"]

RUN npm install

COPY . .

CMD [ "node", "app.js" ]