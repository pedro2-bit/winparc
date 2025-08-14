# Étape 1 : Build de l'application Angular
FROM node:20-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npx ng build --configuration production
 
# Étape 2 : Serveur Nginx pour les fichiers statiques
FROM nginx:alpine
COPY --from=build /app/dist/demo/browser /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]