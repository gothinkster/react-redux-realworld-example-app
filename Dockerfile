

FROM node:13.0-alpine

RUN mkdir /app
WORKDIR /app

COPY package.json package.json

RUN npm install
RUN npm install -g yarn
RUN npm install --save-dev @babel/core
RUN npm install --save-dev babel-polyfill
RUN npm install --save-dev babel-preset-es2015
RUN npm install -g babel-cli
RUN yarn add @babel/plugin-transform-shorthand-properties --dev
COPY . .

LABEL maintainer="sohag Samajpati<sohag033@gmail.com>"

CMD ["npm", "start"]




