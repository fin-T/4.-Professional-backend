## Description 

A project for processing routes to interact with elements from [star wars world](https://swapi.py4e.com/api/).

## Running the app on the server (ubuntu) with docker 
#### Instance must have 2 or more GiB Memory and ssd 8 or more Gb

Open port 80 and 443 for instance.

Set domain name for your instance in Hosted zones and on domain registrar site.

Connect to yur server.

Clone this repository to your server. In the root folder run the commands: 
```
git clone https://github.com/fin-T/4.-Professional-backend && cd ~/4.-Professional-backend
```

Open the file ~/4.-Professional-backend/nginx/conf/app.conf:
```
sudo vim ~/4.-Professional-backend/nginx/conf/app.conf
```

Change \<yourDomain\> to your domain (you can do this by quickly pressing `esc`, then нажмите `:` и введите `%s/<yourDomain>/existingDomain/g` and pressing `Enter`), save your changes and exit vim (command `esc`, then type `:wq` and press `Enter`)

Install Docker using a script: 
```
~/4.-Professional-backend/install_docker.sh
```

Bring up the docker-compose.yml file: 
```
sudo docker compose up
```

Wait for all containers to build and run.

After launch, wait for the following message in the console:

"The data has been successfully downloaded into the database.

You can begin."

Leave this terminal open to display logs live.
Connect to the server in a new terminal and run:
```
cd ~/4.-Professional-backend
```

Check that everything works by running (change `<yourDomain>` to your existing domain):
```
sudo docker compose run --rm  certbot certonly --webroot --webroot-path /var/www/certbot/ --dry-run -d <yourDomain>
```

Input your email and press `Enter`. After this read Terms of Service on the received link and agree, input `Y` and press `Enter`. Next, answer the following. question (`Y` or `N`) and press `Enter`.

Open the file ~/4.-Professional-backend/nginx/conf/app.conf:
```
sudo vim ~/4.-Professional-backend/nginx/conf/app.conf
```

Uncomment the commented lines, save your changes and exit vim (command `esc`, then type `:wq` and press `Enter`).
Restart Certbot without the --dry-run flag to populate the folder with certificates:
```
sudo docker compose run --rm  certbot certonly --webroot --webroot-path /var/www/certbot/ -d <yourDomain>
```
Input your email and press `Enter`. After this read Terms of Service on the received link and agree, input `Y` and press `Enter`.  

Also set up cron to run the certificate renewal script every day. Execute:
```
sudo crontab -e
```
Add a task and save: 
```
0 3 * * *  ./updateSSL.sh
```

Restart the services with the command:
```
sudo docker compose restart
```

After launch, wait for the following message in the console:
"The data has been successfully downloaded into the database.

You can begin." to begin.

Before using routes that are available only to authorized users, you must
register using the registration route so that the user data is saved in the database.

## Test

```
sudo docker compose exec nestjs_api npm test
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).