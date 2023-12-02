# Use an official Node.js runtime as a parent image
FROM node:16

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# # Install application dependencies
# RUN npm install

# # Install prisma and generate Prisma client
# RUN npm install -g prisma
# RUN npx prisma generate

# Bundle app source
COPY . .

# Expose the port the app runs on
EXPOSE 8080

# Start the application
CMD ["node", "app.js"]
