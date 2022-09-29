# 🐘 dbackup

Backups you postgres databases to cloud. Why? Because we can 😃

## Setup

Env vars:
- `DBACKUP_<db-name>` with connection URI to database you want to backup (provide as many as you want, each in a separate env var)
- `MEGA_EMAIL` and `MEGA_PWD` to backup to _mega.nz_ account. [Create account here - referral link](https://mega.nz/register/aff=rm2au3SYUXs).

Requirements:
* [pg_dump](https://www.postgresql.org/docs/current/app-pgdump.html)
* [lzop](https://www.lzop.org/)

## Usage

Run the code on your machine:
```
yarn start
```

Can be run in [docker](https://www.docker.com/):

```
docker build . -t dbackup --no-cache --progress=plain
docker run --env-file .env dbackup
```
