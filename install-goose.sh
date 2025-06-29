export GOOSE_VERSION="v1.0.29" 

curl -fsSL https://github.com/block/goose/releases/download/$GOOSE_VERSION/download_cli.sh | CONFIGURE=false GOOSE_BIN_DIR=/usr/local/bin bash