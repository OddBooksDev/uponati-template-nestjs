FROM node:20-alpine

WORKDIR /usr/src/app

COPY package.json tsconfig.json ./

RUN yarn

RUN yarn build

# 앱 실행
CMD ["yarn", "start:dev"]