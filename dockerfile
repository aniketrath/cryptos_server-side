FROM node:22
WORKDIR /usr/src/backend
COPY ./package* .
RUN npm i
COPY . .
CMD ["npm","run","start"]