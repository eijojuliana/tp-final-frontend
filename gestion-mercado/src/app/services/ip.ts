// Es mejor tener una variable global para la IP de la API Rest antes que multiples declaraciones de la misma en cada service.
export const environment = {
  production: false,
  apiBaseUrl: '/api',
  apiIp: 'localhost',
  apiPort: 4200
};
