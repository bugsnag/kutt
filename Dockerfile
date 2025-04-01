FROM node:22-alpine

RUN apk add --no-cache bash

# Setting working directory.
WORKDIR /usr/src/app

RUN corepack enable yarn

# Installing dependencies
COPY package*.json yarn.lock .yarnrc.yml ./
RUN corepack pack && yarn install && yarn cache clean

# Copying source files
COPY . .

# Give permission to run script
RUN chmod +x ./wait-for-it.sh

# Build files
RUN yarn build

EXPOSE 3000

# Running the app
CMD [ "yarn", "start" ]
