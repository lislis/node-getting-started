# Getting Started with Formulas - Node HelloWorld Application

This repository contains all of the **node** code examples for the Getting
Started with Formula Development tutorial. Each step in the tutorial is
separated into its own directory, e.g., `Step1`.

Other languages:

-  [Python](https://github.com/geeny/python-getting-started)
-  [Ruby](https://github.com/geeny/ruby-getting-started)
-  [Java](https://github.com/geeny/java-getting-started)

## Dependencies (Local Development)

You need [Node.js version 8.4.0 or greater](https://nodejs.org/en/download/) to develop this project locally.

We use [nvm](https://github.com/creationix/nvm) for controlling the Node.js
version. To install the dependencies and run the application using nvm, execute
the following in the command line:

```
cd Step-1
nvm use v8.4.0
npm install
node app.js
```

By default the `app.js` will use the port 80, which requires root access.

## Dependencies (Docker Development)

To run the HelloWorld application, you must have [Docker](https://www.docker.com/)
installed.

At Geeny, we use Docker Edge 17.0.*, and this is the version we have used in our
tests. Other versions are not guaranteed to work with this tutorial.

We also use [docker-compose](https://github.com/docker/compose) to
declare our app dependencies more easily at the infrastructure level.

To run the Docker image locally, you can execute the following:

```
cd Step-1
docker-compose build && docker-compose up
```

The `docker-compose.yml` file re-maps the exposed port from 80 (used by Geeny)
to 3000.

When you execute the above commands, visit http://localhost:3000 and
the example should be running there.

## License

Copyright (C) 2017 Telefónica Germany Next GmbH, Charlottenstrasse 4, 10969 Berlin.

This project is licensed under the terms of the [Mozilla Public License Version 2.0](LICENSE.md).
