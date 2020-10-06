---
id: quick-start
title: Getting started with Richie
sidebar_label: Quick start
---

If you're just looking for a quick preview of `Richie`, you can take a look and have a tour of `Richie` on our dedicated [demo site](https://demo.richie.education).

Login/password are `admin`/`admin`. The database is regularly flushed.

## Architecture

`Richie` is a **container-native application** but can also be installed
[on your machine](native-installation.md).

For development, the project is defined using a [docker-compose file](../docker-compose.yml) and
consists of 4 services:

- **db**: the `Postgresql` database,
- **elasticsearch**: the search engine,
- **app**: the actual `DjangoCMS` project with all our application code,
- **node**: used for front-end related tasks, _i.e._ transpiling `TypeScript` sources, bundling
  them into a JS package, and building the CSS files from Sass sources.

At "France Université Numérique", we deploy our applications on `OpenShift`/`Kubernetes` using
[`Arnold`](https://github.com/openfun/arnold).

## Getting started

### Docker

First, make sure you have a recent version of Docker and
[Docker Compose](https://docs.docker.com/compose/install) installed on your laptop:

```bash
$ docker -v
  Docker version 1.13.1, build 092cba3

$ docker-compose --version
  docker-compose version 1.17.1, build 6d101fb
```

⚠️ You may need to run the following commands with `sudo` but this can be avoided by assigning your
user to the `docker` group.

### Project bootstrap

The easiest way to start working on the project is to use our `Makefile`:

    $ make bootstrap

This command builds the `app` container, installs front-end and back-end dependencies, builds the
front-end application and styles, and performs database migrations. It's a good idea to use this
command each time you are pulling code from the project repository to avoid dependency-related or
migration-related issues.

Now that your `Docker` services are ready to be used, start the full CMS by running:

    $ make run

### Adding content

Once the CMS is up and running, you can create a superuser account:

    $ make superuser

You can create a basic demo site by running:

    $ make demo-site

Note that if you don't create the demo site and start from a blank CMS, you will get some errors
requesting you to create some required root pages. So it is easier as a first approach to test the
CMS with the demo site.

You should be able to view the site at [localhost:8070](http://localhost:8070)

### Basic - Connecting Richie to OpenEdx

This project is pre-configured to connect with an OpenEdx instance started with
[OpenEdx Docker](https://github.com/openfun/openedx-docker], which provides a ready to use
docker-compose stack of OpenEdx in several flavors. Head over to
[OpenEdx Docker README](https://github.com/openfun/openedx-docker#readme) for instructions on how
to bootstrap an instance.

#### 1. Run OpenEDX and Richie on the same domain

Richie and OpenEDX must be on the same domain to work properly.
To do that you have to edit your hosts file (_.e.g_ `/etc/hosts` on a \*NIX system) to alias
a domain `local.dev` with two subdomains `richie` and `edx` to localhost:

```
# /etc/hosts
127.0.0.1 richie.local.dev
127.0.0.1 edx.local.dev
```

Once this has been done, the OpenEdx app should respond on http://edx.local.dev:8073
and Richie should respond on http://richie.local.dev:8070 and should be able
to make CORS XHR requests.

### Advanced - Connecting Richie to OpenEdx

#### Purpose

About the basic configuration, if you check `LMS_BACKEND` settings in `env.d/development` you will
see that we use `base.BaseLMSBackend` as `LMS_BACKEND`.
In fact, this base backend use session storage to fake enrollment to course runs.

May be are you asking why? Because, to make Create/Update/Delete requests from external domain,
OpenEDX requires the use of a CORS CSRF Cookie. This cookie is flagged as secure, that means we are
not able to use it if we not use a SSL connection.

So if you need to use the OpenEDX API to Create,Update or Delete data from Richie, you must enable
SSL on Richie and OpenEDX on your development environment. So we need a little bit more configuration.
Below, we explain how to serve OpenEDX and Richie over SSL.

#### Enable TLS

If you want to develop with OpenEDX as `LMS_BACKEND` of Richie, you need to enable TLS for your
development servers. Both Richie and OpenEdx use nginx as reverse proxy that ease the SSL setup.

##### 1. Install mkcert ans its Certificate Authority

First you will need to install mkcert and its Certificate Authority.
[mkcert](https://mkcert.org/) is a little util to ease local certificate generation.

###### a. Install `mkcert` on your local machine

- [Read the doc](https://github.com/FiloSottile/mkcert)
- Linux users who do not want to use linuxbrew : [read this article](https://www.prado.lt/how-to-create-locally-trusted-ssl-certificates-in-local-development-environment-on-linux-with-mkcert).

###### b. Install Mkcert Certificate Authority

`mkcert -install`

> If you do not want to use mkcert, you can generate [CA and certificate with openssl](https://www.freecodecamp.org/news/how-to-get-https-working-on-your-local-development-environment-in-5-minutes-7af615770eec/).
> You will have to put your certificate and its key in `docker/files/etc/nginx/ssl` directory
> and named them `richie.local.dev.pem` and `richie.local.dev.key`.

##### 2. On Richie

To setup SSL conf with mkcert, just run:
`bin/ssl setup`

> If you do not want to use mkcert, read instructions above to generate Richie certificate then
> run `bin/ssl setup --no-cert` instead.

##### 3. On OpenEDX

In the same way, about OpenEdx, you also have to update the Nginx configuration to enable SSL.
Read how to [enable SSL on OpenEdx](https://github.com/openfun/openedx-docker#ssl).

Once this has been done, the OpenEdx app should respond on https://edx.local.dev:8073
and Richie should respond on https://richie.local.dev:8070 and should be able
to share cookies with OpenEDX to allow CORS CSRF Protected XHR requests.

##### 4. Start Richie and OpenEdx over SSL

Finally just start apps over ssl with `make run-ssl`.
You can still run apps without ssl by using `make run`.
