import redis
import time

def create_connection_pools(host, port, num_clients, connections_per_client, password=None):
    connection_pools = []
    for i in range(num_clients):
        if password:
            pool = redis.ConnectionPool(
                host=host,
                port=port,
                password=password,
                max_connections=connections_per_client,
                client_name=f'client-{i}'
            )
        else:
            pool = redis.ConnectionPool(
                host=host,
                port=port,
                max_connections=connections_per_client,
                client_name=f'client-{i}'
            )
        client = redis.Redis(connection_pool=pool)
        # Hacer una operación para asegurarse de que la conexión está activa
        client.ping()
        connection_pools.append(client)
        print(f'Created connection pool for client name: client-{i} with {connections_per_client} connections')
    return connection_pools

def main():
    host = 'localhost'  # Cambia esto a la IP o hostname de tu servidor Redis
    port = 6379               # Cambia esto al puerto de tu servidor Redis
    password = None           # Cambia esto a la contraseña de tu servidor Redis si es necesario, o déjalo como None
    num_clients = 3          # Número de clientes a crear
    connections_per_client = 10 # Número de conexiones por cliente

    connection_pools = create_connection_pools(host, port, num_clients, connections_per_client, password)

    try:
        while True:
            time.sleep(1)
            # Mantener las conexiones activas haciendo alguna operación periódica
            for client in connection_pools:
                client.ping()
    except KeyboardInterrupt:
        print('Stopping connections...')

if __name__ == '__main__':
    main()
