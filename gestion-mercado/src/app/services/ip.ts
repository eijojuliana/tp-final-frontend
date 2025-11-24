// Es mejor tener una variable global para la IP de la API Rest antes que multiples declaraciones de la misma en cada service.
export const environment = {
  production: false,
  apiBaseUrl: 'http://192.168.100.153:8080/api',
  apiIp: 'localhost',
  apiPort: 8080,
};
