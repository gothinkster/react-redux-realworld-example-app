FROM node:12
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json /usr/src/app/
RUN npm install && npm cache clean -f
COPY . /usr/src/app

CMD [ "npm", "start" ]