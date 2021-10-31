Pushd "%~dp0"
cd user-microservice
docker build -t cs3219-g5/user .
cd ../match-microservice
docker build -t cs3219-g5/match .
cd ../questions-microservice
docker build -t cs3219-g5/questions .
cd ../front-end
docker build -t cs3219-g5/front-end .
cd ../chat-microservice
docker build -t cs3219-g5/chat .
cd ../text-microservice
docker build -t cs3219-g5/text .
cd ../kubernetes-local
kubectl delete -f .
kubectl apply -f .
cd ..
