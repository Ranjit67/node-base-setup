# FROM node:18-alpine as devlopment
# WORKDIR /app
# COPY *.json ./
# RUN npm install
# COPY . ./
# RUN npm run build

# FROM node:18-alpine as production
# ARG NODE_ENV=production
# ENV NODE_ENV=${NODE_ENV}

# WORKDIR /app
# COPY *.json ./
# RUN npm ci --only=production
# COPY --from=devlopment /app/build ./build
# RUN ls
# CMD ["node" "./build/server.js"]
FROM node:18-alpine
WORKDIR /app
COPY *.json ./
RUN npm install
COPY . ./
CMD ["node" "./build/server.js"]
