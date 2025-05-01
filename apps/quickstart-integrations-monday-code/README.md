# Monday Code - Integration Quickstart


Follow these steps to set up the integration using **Docker Compose**.

### Prerequisites
- Install **[Docker Desktop](https://www.docker.com/products/docker-desktop/)**
- Install **Git** (if not already installed)
- Clone the repository from GitHub

### 1.  Navigate to integration directory

Clone the repository and navigate into the directory:
```
cd .\apps\quickstart-integrations-monday-code
```

### 2. Update .env with development values
The signing secret can be found at the app in the Monday.com developer overview. The ngrok token can be found at the account settings.
```
MONDAY_SIGNING_SECRET=
NGROK_AUTHTOKEN=
```

### 3. Use Docker Compose to build and run container
This command will create the image everytime and run the app locally. When the app is updated the container will need to be rebuilt.
```
docker-compose up --build 
```

### 3. Get the tunnel url
Navigate to the ngrok dashboard locally. The tunnel url will be available to be used for Monday.com
```
http://localhost:4040/
```

### 3. Use tunnel url
Use the url to redeploy the app in Monday.com and view changes in the integration section of the boards. Follow the [link](https://www.youtube.com/watch?v=Wc86Mahz6yc&ab_channel=Ethanolle-L%27agenceMonday) and follow allong with the video from 9:50 to add the url to Monday.com and use the integration. 
```
https://<random>.ngrok-free.app
```



