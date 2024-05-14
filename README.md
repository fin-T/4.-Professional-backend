## Description 

A project for processing routes to interact with elements from [star wars world](https://swapi.py4e.com/api/).

## Running the application locally

For launch application you must have installed node.js, npm and mysql services on your machine.

Uncomment lines in `main.ts` file:

    // .addBearerAuth()
    // .addSecurityRequirements('bearer')

Create a mysql database for the project.

In mysql create a user or use an existing one and configure user privileges over the created database. 

Set your values in the file .env

Execute:
```
npm i
```

If you have installed nest.js you can use a fast compiler:
```
nest start -b swc -w
```

Or you can run with next command:
```
npm run start
```

The application will be available with using swagger at: https://localhost/api

## Running the app and db on the servers (ubuntu) with docker compose 
#### Instances must have 4 or more GiB Memory and ssd 30 or more Gb. 

### Configuring and running a database server:

Launch the server. 

Open port 3306 and 22 (ports 80 and 443 can close on this server).

Connect to the server to work in it through the terminal.

Clone this repository to your server. In the root folder run the commands: 
```
git clone https://github.com/fin-T/SWapi && cd ~/SWapi
```

Install docker compose with script:
```
sudo ./install_docker_compose.sh
```

Set your values in the file . env

Do the following:
```
sudo docker compose -f docker-compose.db.yml up -d
```

### Configure and start the server with the application:

Launch the server. 

Open port 22, 80 and 443 for instance (and 8111 for teamcity if you will use it) in server for app. 

Set domain name for your instance in Hosted zones and on domain registrar site.

Connect to the server to work in it through the terminal.

Clone this repository to your server. In the root folder run the commands: 
```
git clone https://github.com/fin-T/SWapi && cd ~/SWapi
```

Install docker compose with script:
```
sudo ./install_docker_compose.sh
```

Uncomment lines in `main.ts` file:

    // .addBearerAuth()
    // .addSecurityRequirements('bearer')

Set your values in the file .env.

In the Caddyfile file, specify your domain.

Do the following:
```
sudo docker compose -f docker-compose.app.yml up
```

Wait for all containers to build and run.

After launch, wait for the following message in the console:
"The data has been successfully downloaded into the database.

You can begin." to begin.

The application will be available from swagger at: https://yourDomain/api

GET routes are available for and for unregistered users. 

To work with other routes, you must be authenticated with the role "admin". 

After inserting the received token into the Swagger Authotize Api.

## Test

```
sudo docker compose exec nestjs_api npm test
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).