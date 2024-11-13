FROM node:22
ADD . /app
WORKDIR /app
RUN npm ci
CMD ["npm", "start"]