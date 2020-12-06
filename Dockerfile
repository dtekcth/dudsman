FROM node:12-alpine
WORKDIR /usr/app
COPY package.json .
COPY . .
RUN npm install --quiet
RUN npm run-script build
