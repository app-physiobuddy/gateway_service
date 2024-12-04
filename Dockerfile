FROM node:lts-slim
WORKDIR /app


COPY package*.json ./

COPY tsconfig.json ./

RUN npm install

COPY . .

EXPOSE 2999

CMD ["npm", "start"]