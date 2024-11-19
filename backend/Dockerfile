FROM node:16

# Install nodemon globally
RUN npm install -g nodemon

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json /app/


# Install dependencies
RUN npm install


COPY . .

# Expose the necessary ports
EXPOSE 3000
EXPOSE 5000

# Default command to start the application
CMD ["nodemon", "--watch", ".", "-L", "--ext", "js,vue,json", "--exec", "node", "app.js"]
