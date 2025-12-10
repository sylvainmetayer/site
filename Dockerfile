FROM node:24
ADD . /app
WORKDIR /app
RUN npm ci
CMD ["npm", "start"]