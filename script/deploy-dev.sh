#!/bin/bash          

# deploy dev
# WORKDIR="/data/treasure"
WORKDIR="/Users/wei/Desktop"
PROJECTDIR="${WORKDIR}/tr-notification-server"

if [ ! -d "$WORKDIR" ];then
    mkdir $WORKDIR
fi

# look for empty dir
if [ ! -d $PROJECTDIR ]; then
    git clone https://github.com/Treasury-research/tr-notification-server.git $PROJECTDIR
fi

cd $PROJECTDIR
echo PROJECTDIR
git pull origin dev -f 
sudo docker-compose build --no-cache  app
sudo docker-compose up -d