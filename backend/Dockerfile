FROM node:16-alpine
RUN mkdir -p /backend
WORKDIR /backend
COPY package*.json ./
COPY package-lock.json ./
RUN npm i --legacy-peer-deps
COPY . .
EXPOSE 8000
CMD ["npm","run","devStart"]