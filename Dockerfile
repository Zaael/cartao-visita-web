FROM node:20-bullseye

WORKDIR /app

# Instala dependências de sistema necessárias para o Sharp
RUN apt-get update && apt-get install -y \
    libvips-dev \
    --no-install-recommends && \
    rm -rf /var/lib/apt/lists/*

COPY package*.json ./

RUN npm install

# Garante que o Sharp seja compilado para o Linux do container
RUN npm rebuild sharp

COPY . .

EXPOSE 8000 9000

CMD ["npm", "run", "develop", "--", "-H", "0.0.0.0", "-p", "8000"]
