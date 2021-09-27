#!/bin/sh

docker-compose build  --no-cache app nginx postgres
docker-compose up -d 
