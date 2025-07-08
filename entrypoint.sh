#!/bin/bash

if [ "$1" = "github-action" ]; then
  exec node /goose-recipe-shortener/src/github-action.js
elif [ "$1" = "buildkite-plugin" ]; then
  exec node /goose-recipe-shortener/src/buildkite-plugin.js
else
  echo "Usage: $0 {github-action|buildkite-plugin}"
  exit 1
fi 