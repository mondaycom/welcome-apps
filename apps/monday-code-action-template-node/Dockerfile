# Use the official lightweight Node.js 14 image.
# https://hub.docker.com/_/node
FROM node:14-slim

ARG ARG_PORT=3000
ARG ARG_ENV=production

# Create and change to the app directory.
WORKDIR /app

# Copy application dependency manifests to the container image.
# A wildcard is used to ensure both package.json AND package-lock.json are copied.
# Copying this separately prevents re-running npm install on every code change.
COPY --chown=node package*.json /app/

# Install dependencies.
# If you add a package-lock.json speed your build by switching to 'npm ci'.
# RUN npm ci --only=production
RUN npm install --production

# Copy local code to the container image.
COPY --chown=node . /app/

EXPOSE 3000
WORKDIR /app

ENV PORT=$ARG_PORT
ENV NODE_ENV=$ARG_ENV

# Run the web service on container startup.
CMD ["node", "./src/app.js"]
