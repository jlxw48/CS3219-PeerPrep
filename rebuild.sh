#!/bin/bash

cd user-microservice
docker build -t swayongshen/user .
cd ../match-microservice
docker build -t swayongshen/match .
cd ../questions-microservice
docker build -t swayongshen/questions .
cd ../front-end
docker build -t swayongshen/front-end .
cd ../chat-microservice
docker build -t swayongshen/chat .
cd ../kubernetes
kubectl delete -f .
kubectl apply -f .
cd ..
