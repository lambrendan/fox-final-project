FROM node:8

COPY . /usr/app

#Create app directory
WORKDIR /usr/app

EXPOSE 3001

CMD [ "npm", "start"]




