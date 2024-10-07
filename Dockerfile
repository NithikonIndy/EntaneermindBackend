# Use the official Bun image as a base
FROM oven/bun:latest

# Set the working directory
WORKDIR /app

# Copy package files and install dependencies
COPY bun.lockb ./
COPY package.json ./
RUN bun install

# Copy the rest of your application files
COPY . .

# Expose the port your application runs on (change if necessary)
EXPOSE 3001

# Start your Bun application
CMD ["bun", "run", "dev"]
