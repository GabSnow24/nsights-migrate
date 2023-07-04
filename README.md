## Dependencies & Services
- RabbitMQ - https://www.rabbitmq.com
- NestJs - https://nestjs.com




## Get started Notes:
- Configure `.env` file while working on local environment  
- Health endpoint: `host:port/api/health`
- Swagger docs endpoint: `host:port/api/docs`


## Installation

```bash
$ yarn install
```
## Run in local

start core services first (rabbitmq)
```bash
$ yarn infra:up
```

Now, first place `.env` file in service folder
```bash
$ yarn start:dev
```

to stop core services, run
```bash
$ yarn infra:down
```

## Run in local with docker-compose

start core services
```bash
$ yarn infra:up
```

docker-compose command - this will take env variables from .env.local 
```bash
docker-compose up "service name" 
```

rebuild
```bash
docker-compose up "service name" --build
```

## Test

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```


