#!/bin/bash

# Cross-platform DevContainer build and test script
# This script helps test the devcontainer setup across different platforms

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to detect platform
detect_platform() {
    local arch=$(uname -m)
    local os=$(uname -s)
    
    case $arch in
        x86_64)
            DOCKER_PLATFORM="linux/amd64"
            ;;
        arm64|aarch64)
            DOCKER_PLATFORM="linux/arm64"
            ;;
        *)
            print_warning "Unknown architecture: $arch, defaulting to linux/amd64"
            DOCKER_PLATFORM="linux/amd64"
            ;;
    esac
    
    print_status "Detected platform: $DOCKER_PLATFORM on $os"
}

# Function to check prerequisites
check_prerequisites() {
    print_status "Checking prerequisites..."
    
    # Check Docker
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install Docker Desktop."
        exit 1
    fi
    
    # Check Docker Compose
    if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
        print_error "Docker Compose is not available. Please install Docker Desktop."
        exit 1
    fi
    
    # Check if Docker is running
    if ! docker info &> /dev/null; then
        print_error "Docker is not running. Please start Docker Desktop."
        exit 1
    fi
    
    print_success "All prerequisites are met"
}

# Function to build the devcontainer
build_devcontainer() {
    print_status "Building devcontainer for platform: $DOCKER_PLATFORM"
    
    cd "$(dirname "$0")"
    
    # Set the platform environment variable
    export DOCKER_DEFAULT_PLATFORM=$DOCKER_PLATFORM
    
    # Build the container
    if docker compose build --no-cache; then
        print_success "DevContainer built successfully"
    else
        print_error "Failed to build devcontainer"
        exit 1
    fi
}

# Function to test the devcontainer
test_devcontainer() {
    print_status "Testing devcontainer functionality..."
    
    # Start the container
    docker compose up -d
    
    # Wait for container to be ready
    sleep 5
    
    # Test Node.js installation
    if docker compose exec app node --version; then
        print_success "Node.js is working"
    else
        print_error "Node.js test failed"
        docker compose down
        exit 1
    fi
    
    # Test npm installation
    if docker compose exec app npm --version; then
        print_success "npm is working"
    else
        print_error "npm test failed"
        docker compose down
        exit 1
    fi
    
    # Test git installation
    if docker compose exec app git --version; then
        print_success "Git is working"
    else
        print_error "Git test failed"
        docker compose down
        exit 1
    fi
    
    # Test if workspace is mounted correctly
    if docker compose exec app test -d /workspace; then
        print_success "Workspace mount is working"
    else
        print_error "Workspace mount test failed"
        docker compose down
        exit 1
    fi
    
    # Clean up
    docker compose down
    print_success "All tests passed!"
}

# Function to show usage
show_usage() {
    echo "Usage: $0 [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  build    Build the devcontainer"
    echo "  test     Build and test the devcontainer"
    echo "  clean    Clean up Docker images and containers"
    echo "  help     Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 build          # Build devcontainer for current platform"
    echo "  $0 test           # Build and test devcontainer"
    echo "  $0 clean          # Clean up Docker resources"
}

# Function to clean up
clean_up() {
    print_status "Cleaning up Docker resources..."
    
    cd "$(dirname "$0")"
    
    # Stop and remove containers
    docker compose down --volumes --remove-orphans || true
    
    # Remove images
    docker image rm $(docker images -q "*viscalyx*" "*devcontainer*") 2>/dev/null || true
    
    # Clean up build cache
    docker builder prune -f || true
    
    print_success "Cleanup completed"
}

# Main execution
main() {
    case "${1:-test}" in
        build)
            detect_platform
            check_prerequisites
            build_devcontainer
            ;;
        test)
            detect_platform
            check_prerequisites
            build_devcontainer
            test_devcontainer
            ;;
        clean)
            clean_up
            ;;
        help|--help|-h)
            show_usage
            ;;
        *)
            print_error "Unknown command: $1"
            show_usage
            exit 1
            ;;
    esac
}

# Run main function with all arguments
main "$@"
