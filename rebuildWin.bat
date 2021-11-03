Pushd "%~dp0"
cd user-microservice
docker build -t asia-southeast1-docker.pkg.dev/cs3219-g5/g5-repo/user:v1 .
docker push asia-southeast1-docker.pkg.dev/cs3219-g5/g5-repo/user:v1
cd ../match-microservice
docker build -t asia-southeast1-docker.pkg.dev/cs3219-g5/g5-repo/match:v1 .
docker push asia-southeast1-docker.pkg.dev/cs3219-g5/g5-repo/match:v1
cd ../questions-microservice
docker build -t asia-southeast1-docker.pkg.dev/cs3219-g5/g5-repo/questions:v1 .
docker push asia-southeast1-docker.pkg.dev/cs3219-g5/g5-repo/questions:v1
cd ../front-end
docker build -t asia-southeast1-docker.pkg.dev/cs3219-g5/g5-repo/front-end:v1 .
docker push asia-southeast1-docker.pkg.dev/cs3219-g5/g5-repo/front-end:v1
cd ../chat-microservice
docker build -t asia-southeast1-docker.pkg.dev/cs3219-g5/g5-repo/chat:v1 .
docker push asia-southeast1-docker.pkg.dev/cs3219-g5/g5-repo/chat:v1
cd ../text-microservice
docker build -t asia-southeast1-docker.pkg.dev/cs3219-g5/g5-repo/text:v1 .
docker push asia-southeast1-docker.pkg.dev/cs3219-g5/g5-repo/text:v1
cd ..
