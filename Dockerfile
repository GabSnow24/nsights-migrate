FROM node:16 AS builder

WORKDIR /app

COPY package*.json ./

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

RUN yarn install --production

COPY . .

RUN yarn build

FROM node:16



COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist

CMD [ "yarn", "start:prod" ]