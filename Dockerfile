#
# Builder stage.
# This state compile our TypeScript to get the JavaScript code
#
FROM node:24-slim AS builder

WORKDIR /usr/src/app

COPY package*.json ./
COPY tsconfig*.json ./
COPY ./src ./src
COPY ./public ./public
RUN npm install --ignore-scripts && npm run build

#
# Production stage.
# This state compile get back the JavaScript code from builder stage
# It will also install the production package only
#
FROM node:24-alpine

WORKDIR /app
ENV CI=true
ENV NODE_ENV=production

COPY package*.json ./
RUN npm install --ignore-scripts --only=production

## We just need the build to execute the command
COPY --from=builder /usr/src/app/dist ./dist

## Copy public directory with all HTML, CSS, JS files
COPY --from=builder /usr/src/app/public ./public

EXPOSE 8080

RUN chown -R node /app
USER node
CMD ["npm", "start"]