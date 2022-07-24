FROM node:16-alpine
ADD package*.json .
RUN npm install
COPY . .
CMD [ "npm","start" ]
