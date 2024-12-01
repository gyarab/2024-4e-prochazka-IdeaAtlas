# Use a base image with Bun installed
FROM oven/bun:latest

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and bun.lockb for dependency installation
COPY package.json bun.lockb ./

# Install dependencies
RUN bun install

# Copy the rest of the application code
COPY . .

# Build the Nuxt application (optional: if using a build step in Nuxt)
RUN bun run build

# Expose the default Nuxt port
EXPOSE 3000

# Command to run the Nuxt application
CMD ["bun", "run", "dev", "--host"]
