export GOOSE_VERSION="1.0.32"

curl -fsSL https://github.com/block/goose/releases/download/v$GOOSE_VERSION/download_cli.sh | CONFIGURE=false GOOSE_BIN_DIR=/usr/local/bin bash

