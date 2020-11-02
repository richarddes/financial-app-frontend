# this Dockerfile is made solely for testing the app
# it includes the src and public dir as well (not only the build dir)
# for production purposes use the Dockerfile.prod
FROM node:12.7.0-alpine 

COPY . /app

WORKDIR /app

RUN npm i --silent && \
  npm run build && \
  rm -r node_modules
