# Usa l'immagine di Node.js per la build
FROM node:18 AS build

# Imposta la cartella di lavoro
WORKDIR /app

# Copia i file package.json e package-lock.json
COPY package*.json ./

# Installa le dipendenze
RUN  npm install --legacy-peer-deps

# Copia il codice e costruisci il progetto
COPY . .
RUN npm run build

# Usa Nginx per servire l'app
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html

# Esporta la porta
EXPOSE 80

# Avvia Nginx
CMD ["nginx", "-g", "daemon off;"]
