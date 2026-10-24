Simple Docker guide for your E-commerce project on Arch Linux. Save this somewhere you can easily find it.

# E-commerce: Daily Docker commands

## 1. Start the frontend and backend

Open your terminal and run:

```
cd ~/E-commerce
docker compose up -d
```

This starts the frontend, backend and MongoDB in the background.

## 2. Open your application

- Frontend: [http://localhost:5173]
- Docker GUI (Portainer): [https://localhost:9443]

Portainer lets you see your containers, images, volumes and logs in a graphical interface.

## 3. Check whether everything is running

```
cd ~/E-commerce
docker compose ps
```

You should see the frontend, backend and MongoDB containers running.

## 4. View logs if something goes wrong

```
docker compose logs -f backend
```

For frontend logs:

```
docker compose logs -f frontend
```

Press `Ctrl+C` to stop viewing logs. This does not stop the containers.

## 5. Stop and restart the project

Stop the project:

```
cd ~/E-commerce
docker compose down
```

Start it again:

```
docker compose up -d
```

Your MongoDB data is kept when you run `docker compose down`, provided you don't remove its volume.

## 6. When you change dependencies or Dockerfiles

Rebuild and restart:

```
docker compose up -d --build
```

If you add or change npm dependencies and they aren't picked up, run:

```
docker compose up -d --build -V
```

## 7. Quick reference

| What you want         | Command                           |
| --------------------- | --------------------------------- |
| Start everything      | `newgrp docker id | grep -o docker docker compose up -d`            |
| Check status          | `docker compose ps`               |
| Stop everything       | `docker compose down`             |
| View backend logs     | `docker compose logs -f backend`  |
| View frontend logs    | `docker compose logs -f frontend` |
| Rebuild after changes | `docker compose up -d --build`    |

Important: Never run `docker compose down -v` unless you intentionally want to delete the project's Docker volumes, which may contain your database data.

You can also manage the project through Portainer's Containers and Stacks pages. Docker runs in the background, so closing your browser does not stop your application.

application -> http://localhost:5173

Portainer -> https://localhost:9443