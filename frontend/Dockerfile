# Usa Node.js para construir y servir React
FROM node:20-alpine

WORKDIR /app

# Instala dependencias
COPY package.json .
RUN npm install

# Copia el resto del código
COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]