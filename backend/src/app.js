const express = require('express');
const { createClient } = require('redis');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

// Leer configuración de Redis desde un archivo
const configPath = process.env.REDIS_CONFIG_PATH || './redis-config.json';
const redisConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));

dotenv.config();

const app = express();
const client = createClient({
  url: `redis://${redisConfig.REDIS_HOST}:${redisConfig.REDIS_PORT}`,
  password: redisConfig.REDIS_PASSWORD
});

client.connect()
  .then(() => {
    console.log('Connected to Redis...');
  })
  .catch(err => {
    console.error('Could not connect to Redis:', err);
  });

app.use(express.static(path.join(__dirname, '../public')));

app.get('/api/connections', async (req, res) => {
  try {
    const result = await client.sendCommand(['CLIENT', 'LIST']);
    const clients = result.split('\n').filter(line => line).map(line => {
      const client = {};
      line.split(' ').forEach(field => {
        const [key, value] = field.split('=');
        client[key] = value;
      });
      return client;
    });

    const groupedClients = clients.reduce((acc, client) => {
      const appName = client.name ? client.name.split(':')[0] : 'unknown';
      if (!acc[appName]) {
        acc[appName] = { active: 0, inactive: 0, ageSum: 0, idleSum: 0, clients: [] };
      }
      acc[appName].clients.push(client);
      acc[appName].ageSum += parseInt(client.age, 10);
      acc[appName].idleSum += parseInt(client.idle, 10);
      if (client.flags.includes('N')) {
        acc[appName].inactive += 1;
      } else {
        acc[appName].active += 1;
      }
      return acc;
    }, {});

    for (const appName in groupedClients) {
      const app = groupedClients[appName];
      const count = app.clients.length;
      app.ageAvg = (app.ageSum / count).toFixed(2);
      app.idleAvg = (app.idleSum / count).toFixed(2);
      app.totalConnections = count;
    }

    res.json(groupedClients);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
