# Usa un'immagine Node.js
FROM node:18

# Imposta la cartella di lavoro
WORKDIR /app

# Copia i file package.json e package-lock.json
COPY package*.json ./

# Installa le dipendenze
RUN npm install --legacy-peer-deps

# Copia tutto il codice nel container
COPY . .

# Espone la porta su cui gira il server Node.js
EXPOSE 3000

# Avvia l'applicazione
CMD ["npm", "run dev"]
