FROM node:20-bullseye

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8000 9000

CMD ["npm", "run", "develop", "--", "-H", "0.0.0.0", "-p", "8000"]
