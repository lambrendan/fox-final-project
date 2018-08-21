FROM node:8

COPY . /usr/app

#Create app directory
WORKDIR /usr/app

RUN npm install concurrently

EXPOSE 3001

CMD [ "npm", "run", "server"]




