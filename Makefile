SHELL := /bin/bash
NAME=kutt
GCR_HOST=gcr.io/bugsnag-155907
AWS_PROFILE="insighthub-production"
ECR_REGION=${ECR_REGION:-us-east-1}
AWS_ACCOUNT_ID="357581182020"
ECR_REGISTRY="${AWS_ACCOUNT_ID}.dkr.ecr.${ECR_REGION}.amazonaws.com"
GCR_IMAGE=$(GCR_HOST)/$(NAME):$(VERSION)
ECR_IMAGE=$(ECR_REGISTRY)/$(NAME):$(VERSION)

.DEFAULT_GOAL := help

tag: validate-version
	@git tag $(VERSION)
	@git push --tags

validate-version:
	@if [ "$(VERSION)" == "" ]; then \
		echo "Please give a version to upload i.e. make <GOAL> VERSION=1.0.0"; \
		exit 1; \
	fi

build: tag
	@echo "---> [Executing docker build]"
	@docker buildx build --platform linux/amd64 --push . -t $(GCR_IMAGE) -t $(ECR_IMAGE)
	@echo "pushed to GCR: $(GCR_IMAGE)"
	@echo "pushed to ECR: $(ECR_IMAGE)"

help: ## Print help for all functions of Makefile
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {sub("\\\\n",sprintf("\n%22c"," "), $$2);printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)
