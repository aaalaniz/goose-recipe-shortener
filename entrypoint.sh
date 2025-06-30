#!/bin/bash

if [ "$1" = "github-action" ]; then
  exec node /goose-recipe-shortener/src/github-action.js
else
  echo "Usage: $0 {github-action}"
  exit 1
fi 