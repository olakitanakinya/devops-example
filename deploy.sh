# deploy.sh
#!/bin/bash

docker build -t devops-example .
docker run -d -p 3002:3000 --name devops-example-container devops-example

