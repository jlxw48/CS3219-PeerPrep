#!/bin/bash
docker build -t cs3219-g5/front-end .
cd ../kubernetes
kubectl delete -f front-end-deploy.yaml
kubectl apply -f front-end-deploy.yaml
cd ../front-end