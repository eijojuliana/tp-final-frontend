// Es mejor tener una variable global para la IP de la API Rest antes que multiples declaraciones de la misma en cada service.
export const environment = {
  production: false,
  apiBaseUrl: 'http://localhost:8080/api',
  apiIp: 'localhost',
  // PARA NGROK
  //apiBaseUrl: '/api',
  //apiPort: 4200,

  apiPort: 8080
};
