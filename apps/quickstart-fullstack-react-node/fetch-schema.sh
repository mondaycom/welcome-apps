#!/bin/bash
  curl "https://api.monday.com/v2/get_schema?format=sdl&version=stable" -o src/schema.graphql