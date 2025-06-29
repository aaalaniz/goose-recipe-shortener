#!/bin/bash

if [ "$1" = "github-action" ]; then
  exec node /goose-recipe-shortener/src/github-action.js
elif [ "$1" = "circleci-step" ]; then
  exec node /goose-recipe-shortener/src/circleci-step.js
else
  echo "Usage: $0 {github-action|circleci-step}"
  exit 1
fi 