FROM node:18-alpine

RUN apk add --no-cache python3 make g++

WORKDIR /API

COPY package*.json ./

RUN npm install --omit=dev

COPY . .

EXPOSE 3000

CMD ["npm", "start"]