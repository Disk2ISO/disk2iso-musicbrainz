#!/bin/bash
# ===========================================================================
# disk2iso-musicbrainz Module Installation Script
# ===========================================================================
# Installation script for MusicBrainz Metadata Provider Module
# ===========================================================================

set -e  # Exit on error

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Installation directory
INSTALL_DIR="${DISK2ISO_DIR:-/opt/disk2iso}"
MODULE_NAME="disk2iso-musicbrainz"

echo -e "${GREEN}=== Installing $MODULE_NAME ===${NC}"

# Check if disk2iso is installed
if [ ! -d "$INSTALL_DIR" ]; then
    echo -e "${RED}Error: disk2iso not found at $INSTALL_DIR${NC}"
    echo "Please install disk2iso first."
    exit 1
fi

# Check if metadata framework is installed
if [ ! -f "$INSTALL_DIR/lib/libmetadata.sh" ]; then
    echo -e "${RED}Error: Metadata framework not found${NC}"
    echo "Please install disk2iso-metadata first."
    echo "This provider requires the metadata framework."
    exit 1
fi

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    echo -e "${RED}Error: This script must be run as root${NC}"
    echo "Please use: sudo ./install.sh"
    exit 1
fi

echo -e "${YELLOW}Checking dependencies...${NC}"
# Check for required tools
MISSING_DEPS=""
for cmd in curl jq cd-discid; do
    if ! command -v $cmd &> /dev/null; then
        MISSING_DEPS="$MISSING_DEPS $cmd"
    fi
done

if [ -n "$MISSING_DEPS" ]; then
    echo -e "${YELLOW}Missing dependencies:$MISSING_DEPS${NC}"
    echo "Installing dependencies..."
    apt-get update
    apt-get install -y curl jq cd-discid libcdio-utils
fi

echo -e "${YELLOW}Installing module files...${NC}"

# Copy library
cp -v lib/libmusicbrainz.sh "$INSTALL_DIR/lib/"
chmod 755 "$INSTALL_DIR/lib/libmusicbrainz.sh"

# Copy configuration
cp -v conf/libmusicbrainz.ini "$INSTALL_DIR/conf/"
chmod 644 "$INSTALL_DIR/conf/libmusicbrainz.ini"

# Copy language files
cp -v lang/libmusicbrainz.* "$INSTALL_DIR/lang/"
chmod 644 "$INSTALL_DIR/lang/libmusicbrainz".*

# Copy documentation
echo -e "${YELLOW}Installing documentation...${NC}"
cp -rv doc/04_Module "$INSTALL_DIR/doc/"
chmod -R 644 "$INSTALL_DIR/doc/04_Module/04-4_Metadaten"/*.md

echo -e "${GREEN}✓ $MODULE_NAME installed successfully${NC}"
echo ""
echo "This is a metadata provider for MusicBrainz."
echo "It requires the disk2iso-metadata framework module."
echo ""
echo "Next steps:"
echo "1. Restart disk2iso service: systemctl restart disk2iso"
echo "2. Check module status: systemctl status disk2iso"
echo "3. View documentation: cat $INSTALL_DIR/doc/04_Module/04-4_Metadaten/04-4-1_MusicBrainz.md"
echo ""
echo "The module is now ready to use!"
