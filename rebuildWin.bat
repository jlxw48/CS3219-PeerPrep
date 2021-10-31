Pushd "%~dp0"
cd user-microservice
docker build -t asia-southeast1-docker.pkg.dev/cs3219-g5/cs3219-g5/user:v1 .
docker push asia-southeast1-docker.pkg.dev/cs3219-g5/cs3219-g5/user:v1
cd ../match-microservice
docker build -t asia-southeast1-docker.pkg.dev/cs3219-g5/cs3219-g5/match:v1 .
docker push asia-southeast1-docker.pkg.dev/cs3219-g5/cs3219-g5/match:v1
cd ../questions-microservice
docker build -t asia-southeast1-docker.pkg.dev/cs3219-g5/cs3219-g5/questions:v1 .
docker push asia-southeast1-docker.pkg.dev/cs3219-g5/cs3219-g5/questions:v1
cd ../front-end
docker build -t asia-southeast1-docker.pkg.dev/cs3219-g5/cs3219-g5/front-end:v1 .
docker push asia-southeast1-docker.pkg.dev/cs3219-g5/cs3219-g5/front-end:v1
cd ../chat-microservice
docker build -t asia-southeast1-docker.pkg.dev/cs3219-g5/cs3219-g5/chat:v1 .
docker push asia-southeast1-docker.pkg.dev/cs3219-g5/cs3219-g5/chat:v1
cd ../text-microservice
docker build -t asia-southeast1-docker.pkg.dev/cs3219-g5/cs3219-g5/text:v1 .
docker push asia-southeast1-docker.pkg.dev/cs3219-g5/cs3219-g5/text:v1
cd ..
