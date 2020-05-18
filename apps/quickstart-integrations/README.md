[![CircleCI](https://circleci.com/gh/DaPulse/google-translate-integration/tree/master.svg?style=svg&circle-token=3953a6aede9815412b3ab3ba191e8a1e5649906f)](https://circleci.com/gh/DaPulse/google-translate-integration/tree/master)

## Post Creation

1. Rename `.npmignore` file to `.gitignore` (yeoman converts .gitignore to .npmignore)
2. Create new `Internal` repository on GitHub and follow init steps to initialize new git repo.
3. Contact Infrastructure team, with your repo url, so they will configure infra dependencies.
   For infra: `https://github.com/DaPulse/dapulse-infra/tree/master/scripts/microservice`
   Guidelines for new microservices.
4. Update local port for your microservice, so it would not overlap with other docker ports.
   at `docker-compose`:

```
ports:
      - '3002:3000'
```

## Install

1. Make sure you have Docker for Mac installed.

2. Use the correct node version:

```
$ nvm use
```

3. Run node modules install:

```
$ yarn install
```

## Run

1. Run the Docker composition:

```
$ yarn start-dev
```

2. Open http://localhost:3002 (or other port you have configured at `docker-compose.yml`)

If you need to refresh your Docker image, run:

```
$ yarn start-dev-fresh
```

## Other functionality

1. Added integration with AWS Parameter Store.
   Reading the secrets from AWS Parameter Store and loads it into process.env.SECRET_NAME.

## Deploying

Go to [CircleCI](https://circleci.com/gh/DaPulse/workflows/google-translate-integration)
Follow your new project on CircleCI
