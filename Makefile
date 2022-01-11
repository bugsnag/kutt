SHELL := /bin/bash
NAME=kutt
HOST=gcr.io/bugsnag-155907
IMAGE=$(HOST)/$(NAME):$(VER)

.DEFAULT_GOAL := help

tag: validate-version
	@git tag v$(VERSION)
	@git push --tags

validate-version:
	@if [ "$(VERSION)" == "" ]; then \
		echo "Please give a version to upload i.e. make <GOAL> VERSION=1.0.0"; \
		exit 1; \
	fi

build: tag
	@echo "---> [Executing docker build]"
	@docker build . -t $(IMAGE)
	@docker push $(IMAGE)
	@echo $(IMAGE)

help: ## Print help for all functions of Makefile
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {sub("\\\\n",sprintf("\n%22c"," "), $$2);printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)
