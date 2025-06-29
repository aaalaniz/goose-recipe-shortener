FROM node:20

# Set the working directory
WORKDIR /goose-recipe-shortener

# Copy goose installation script
COPY install-goose.sh ./

# Install goose 
RUN ./install-goose.sh

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci --only=production

# Copy the rest of the application code
COPY src ./src

# Set the default command to run the action
CMD ["node", "/goose-recipe-shortener/src/index.js"] 