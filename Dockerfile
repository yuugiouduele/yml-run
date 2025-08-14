FROM node:23-alpine

RUN apk update && apk add --no-cache xdg-utils 
    / git / 

WORKDIR /nest

COPY package*.json ./
RUN npm install --include=dev

COPY . .

CMD ["npm", "run", "dev"]
