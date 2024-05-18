# Redis Watcher

Redis Watch App is a monitoring tool for Redis clusters, designed to track active and inactive connections, idle times, and more. Built with React for the frontend and Node.js for the backend, this app provides real-time insights into the status of your Redis connections.

## Features

- Monitor active and inactive connections to Redis
- Track average age and idle time of connections
- Group connections by application
- Real-time updates every second
- Dockerized for easy deployment

## Prerequisites

- [Docker](https://www.docker.com/)
- [Node.js](https://nodejs.org/)
- [Redis](https://redis.io/)

## Getting Started

### Cloning the Repository

```bash
git https://github.com/rodrigo-ponce/redis-watcher.git

cd redis-watcher

```
### Running the App

```bash
docker pull rponcepy/redis-watcher
```
