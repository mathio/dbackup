# 🐘 dbackup

Backup you postgres databases to cloud. Manage using web UI.

Why? Because we can 😃

## Setup

Env vars:
- `DBACKUP_<db-name>` with connection URI to database you want to backup (provide as many as you want, each in a separate env var)
- `MEGA_EMAIL` and `MEGA_PWD` to backup to _mega.nz_ account. [Create account here - referral link](https://mega.nz/register/aff=rm2au3SYUXs).
- `ADMIN_PWD` with web UI password

Requirements:
* [pg_dump](https://www.postgresql.org/docs/current/app-pgdump.html)
* [lzop](https://www.lzop.org/)

## Usage

### On you machine

Run backup task:
```
yarn backup
```

Run server with web UI to manage backups:
```
yarn server
```

### Docker

Can run in [docker](https://www.docker.com/).

Build and run backup task:
```
docker build . -t dbackup --no-cache --progress=plain
docker run --env-file .env dbackup
```

Build and run server with web UI to manage backups:
```
docker build . -t dbackup --no-cache --progress=plain
docker run --env-file .env --publish=3000:3000 dbackup yarn server
```

The app is also [deployed to heroku as docker image](https://devcenter.heroku.com/articles/build-docker-images-heroku-yml).
Heroku app needs to be setup for docker: 
```
heroku stack:set container
```

## Local development

Load `.env` and run backup task:
```
yarn dev-backup
```

Load `.env`, run server and watch for changes:
```
yarn dev
```
