# syntax=docker/dockerfile:1
FROM node:22-bookworm-slim@sha256:de170b39439eb0e5a3444ad7d60b015614a381e10fecae2e30ec9e735122f38d AS base

# Create /app owned by node before WORKDIR and USER node so npm ci can write node_modules
RUN mkdir -p /app && chown -R node:node /app

WORKDIR /app

USER node

FROM base AS development

USER node
WORKDIR /app

# Copy lockfile and package manifest
COPY --chown=node:node package.json package-lock.json ./

# Install dependencies deterministically without scripts
RUN npm ci --ignore-scripts

# Copy frontend source code
COPY --chown=node:node . ./

EXPOSE 5173

CMD ["npm", "run", "dev"]
