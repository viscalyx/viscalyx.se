# Use the official Node.js 24 LTS image as base
FROM node:25-bookworm

# Install system dependencies and tools in a single layer
RUN apt-get update && \
    apt-get install -y \
        git \
        curl \
        wget \
        unzip \
        ca-certificates \
        gnupg \
        lsb-release \
        software-properties-common \
        build-essential \
        python3 \
        python3-pip \
        sudo && \
    rm -rf /var/lib/apt/lists/*

# Set the working directory
WORKDIR /workspace

# Further user and shell configuration is provided by the devcontainer "common-utils" feature
RUN git config --system --add safe.directory /workspace

# Expose the ports that Next.js, Wrangler, and Vitest typically use
EXPOSE 3000 3001 8787 51204

# Keep container running
CMD ["sleep", "infinity"]
