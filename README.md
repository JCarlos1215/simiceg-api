# Visor modelo express rest API

Desarrollo Typescript REST API con Express JS para visor modelo.

## Uso

Instalar dependencias de código con Node.js

```sh
npm install
```

Abrir o crear el archivo .env en la raiz del proyecto para agregar las variables de entorno necesarias para ejecutar el API

```
ENV=                  # Tipo de entorno donde corre el servidor API (prod | dev)
CWD=                  # Directorio actual donde se encuentra el API
LOG_ENABLED=          # Indica si se habilitan o no los logs pino (true | false)
PORT=                 # Puerto donde se ejecuta el API
CORS_ALLOW_ORIGIN=    # Origen que acepta las peticiones CORS
DB_CONNECTION=        # Conexión PostgreSQL a la base de datos geográfica
WEBDB_CONNECTION=     # Conexión PostgreSQL a la base de datos del webapp
GEOSERVER=            # URL de Geoserver
GEOSERVER_AUTH=       # Autentificación del API de Geoserver
ACCESS_TOKEN_SECRET=  # Token secreto para generar Json Web Tokens
```

Para iniciar el servidor ejecutar

```sh
npm start
# o en modo watch
npm run watch
```

## Comandos

- `npm start` para iniciar el servidor del API localmente.
- `npm run serve`: para ejecutar el API compilada localmente.
- `npm run serve-watch`: para ejecutar el API compilada localemtne en modo watch.
- `npm run watch`: para compilar y ejecutar el API de forma local en modo watch.
- `npm run build`: para compilar el código del API y copiar los assets estáticos.
- `npm run build-ts`: para compilar solo el código del API.
- `npm run build-watch`: para compilar el código del API en modo watch.
- `npm run test`: para ejecutar los tests
- `npm run test-coverage`: para ejecutar los tests y generar reportes de cobertura.
- `npm run test-watch`: para ejecutar los tests en modo watch.
- `npm run lint`: para ejecutar lint con eslint (estándar de codificación).
- `npm run lint:fix`: para arreglar errores con eslint.

## Tecnología

- typescript
- express
- dotenv-safe
- pg-promise
- pino
- jest
- husky
- commitlint / config-conventional
- prettier
- eslint
- nodemon
- tsyringe
- reflect-metadata
- joi
- geojson
- passport
- passport-http-bearer
- jsonwebtoken
- apidoc
