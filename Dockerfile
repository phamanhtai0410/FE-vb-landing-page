# Step 1

FROM node:12-alpine as build-step

RUN mkdir /vebank

WORKDIR /vebank

COPY package.json /vebank

#COPY .env.production /vebank

RUN npm install

COPY . /vebank

RUN npm run build


# Stage 2

FROM nginx:1.17.1-alpine

COPY --from=build-step /vebank/build /usr/share/nginx/html
COPY conf.d/default.conf /etc/nginx/conf.d/default.conf