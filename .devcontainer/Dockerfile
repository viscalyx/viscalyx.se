# Multi-stage build for cross-platform compatibility
# Using Ubuntu for better compatibility with devcontainer features
FROM --platform=$BUILDPLATFORM mcr.microsoft.com/devcontainers/base:ubuntu

# Install additional system dependencies that features might need
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        build-essential \
        python3 \
        python3-pip \
        openssh-client && \
    rm -rf /var/lib/apt/lists/*

# Set the working directory with proper permissions
WORKDIR /workspace
RUN chown -R vscode:vscode /workspace

# Configure git for the workspace (security requirement)
RUN git config --system --add safe.directory /workspace && \
    git config --system --add safe.directory '*'

# Switch to non-root user (vscode user is created by base image)
USER vscode

# Expose the ports that Next.js, Wrangler, and Vitest typically use
EXPOSE 3000 3001 8787 51204

# Keep container running with proper signal handling
CMD ["sleep", "infinity"]
