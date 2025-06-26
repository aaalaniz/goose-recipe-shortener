FROM node:20

# Set the working directory
WORKDIR /goose-recipe-shortener

# Install goose
RUN curl -fsSL https://github.com/block/goose/releases/download/v1.0.29/download_cli.sh | CONFIGURE=false bash

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci --only=production

# Copy the rest of the application code
COPY src ./src

# Set the default command to run the action
CMD ["node", "/goose-recipe-shortener/src/index.js"] 