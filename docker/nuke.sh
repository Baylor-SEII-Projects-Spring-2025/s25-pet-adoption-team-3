#!/bin/sh


./downdocker.sh
docker volume rm docker_mysql-data
./updocker.sh

#pushd ../pet-generator
#python3 add-characteristics-to-db.py
#python3 pet-generator.py
