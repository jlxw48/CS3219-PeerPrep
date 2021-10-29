#!/bin/bash
docker build -t swayongshen/front-end .
cd ../kubernetes
kubectl delete -f front-end-deploy.yaml
kubectl apply -f front-end-deploy.yaml
cd ../front-end