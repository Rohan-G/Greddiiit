FROM node:16-alpine
RUN mkdir /frontend
WORKDIR /frontend
COPY package*.json ./
COPY package-lock.json ./
RUN npm i --legacy-peer-deps
COPY ./ ./
EXPOSE 3000
CMD ["npm","start"]