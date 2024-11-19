FROM node:16

WORKDIR /app

RUN npm install -g nodemon
# Copy package.json and package-lock.json
COPY package*.json /app/
# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port for the frontend
EXPOSE 8000

# Command to start the frontend
CMD ["nodemon", "--watch", ".", "-L", "--ext", "js,vue,json", "--exec", "npm", "run", "serve"]