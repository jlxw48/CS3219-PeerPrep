# syntax=docker/dockerfile:1

FROM node:12.18.1
ENV NODE_ENV=local
WORKDIR /app
COPY ["package.json", "package-lock.json*", "./"]
RUN npm install
EXPOSE 3000
COPY . .
CMD ["npm", "run", "local"]