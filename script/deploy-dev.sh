#!/bin/bash

# deploy dev

echo "$#"

if [ $# -le 0 ]; then
    echo "please print work dir path"
    exit 1
fi

WORKDIR=$1
PROJECTDIR="${WORKDIR}/tr-notification-server"

if [ ! -d "$WORKDIR" ]; then
    mkdir $WORKDIR
fi

# look for empty dir
if [ ! -d $PROJECTDIR ]; then
    git clone https://github.com/Treasury-research/tr-notification-server.git $PROJECTDIR
fi

cd $PROJECTDIR
echo PROJECTDIR
sudo git pull origin dev -f
sudo docker rmi $(sudo docker images --filter "dangling=true" -q --no-trunc)
sudo docker-compose build --no-cache app
sudo docker-compose up -d
