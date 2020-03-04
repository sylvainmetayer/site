FROM node:13
ADD . /app
WORKDIR /app
RUN npm ci
CMD ["npm", "start"]