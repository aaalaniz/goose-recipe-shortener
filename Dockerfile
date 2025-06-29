FROM node:20

# Set the working directory
WORKDIR /goose-recipe-shortener

# Copy versions.sh
COPY versions.sh ./

# Install goose 
RUN . versions.sh && \
    curl -fsSL https://github.com/block/goose/releases/download/$GOOSE_VERSION/download_cli.sh | CONFIGURE=false GOOSE_BIN_DIR=/usr/local/bin bash

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci --only=production

# Copy the rest of the application code
COPY src ./src

# Set the default command to run the action
CMD ["node", "/goose-recipe-shortener/src/index.js"] 