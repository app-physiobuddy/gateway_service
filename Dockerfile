FROM node:lts-slim
WORKDIR /app


COPY package*.json ./

COPY tsconfig.json ./

COPY src ./src
RUN mkdir -p ./dist

RUN npm install
RUN npm run build


EXPOSE ${APP_GATEWAY_PORT}

CMD ["npm", "start"]