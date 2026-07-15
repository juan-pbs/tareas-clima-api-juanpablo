# Tarea API segura con Express

API en Express con Helmet, variables de entorno, validaciones con `express-validator`, autenticacion JWT y servidor HTTPS con certificado autofirmado.

## Requisitos cubiertos

- Servidor con Helmet.
- Archivo `.env` ignorado por Git.
- Dos endpoints con validacion usando `express-validator`.
- Servidor HTTPS con `server.key` y `server.cert`.
- Endpoint `POST /api/registro` que valida `nombre` y `correo`.
- Comentario en el codigo explicando el principio de codificacion segura aplicado.
- CRUD de tareas con GET, POST, PUT y DELETE.
- Endpoint de clima independiente usando `axios`.
- Endpoint que combina una tarea propia con clima externo.
- Registro e inicio de sesion con passwords cifrados mediante `bcryptjs`.
- Middleware de autenticacion con JWT.
- Ruta protegida `GET /api/auth/perfil` que devuelve los datos disponibles en `req.usuario`.
- Coleccion de Postman con registro, login y perfil; el script de login guarda el token automaticamente.

## Instalacion

```bash
npm install
```

Crea tu archivo `.env` tomando como base `.env.example` y coloca tu API key de OpenWeatherMap:

```text
WEATHERAPI_KEY=tu_api_key_aqui
JWT_SECRET=reemplaza_esto_con_un_secreto_largo_y_aleatorio
```

## Ejecucion

Si no existen los archivos `server.key` y `server.cert`, genera un certificado autofirmado local:

```bash
npm run cert
```

```bash
npm start
```

Servidor disponible en:

```text
https://localhost:3000
```

Como el certificado es autofirmado, el cliente debe aceptar el certificado local.

`server.key` no se sube a GitHub porque es una llave privada. Esa es una practica de codificacion segura para evitar exponer secretos del servidor.

## Endpoints

### Salud

```bash
curl -k https://localhost:3000/api/salud
```

### Echo

```bash
curl -k -X POST https://localhost:3000/api/echo \
  -H "Content-Type: application/json" \
  -d "{\"mensaje\":\"hola\"}"
```

### Registro

```bash
curl -k -X POST https://localhost:3000/api/registro \
  -H "Content-Type: application/json" \
  -d "{\"nombre\":\"Juan Pablo\",\"correo\":\"juan@example.com\"}"
```

Ejemplo invalido:

```bash
curl -k -X POST https://localhost:3000/api/registro \
  -H "Content-Type: application/json" \
  -d "{\"nombre\":\"\",\"correo\":\"correo-invalido\"}"
```

### Autenticacion JWT

Los usuarios se conservan en memoria durante esta actividad, por lo que se eliminan cada vez que se reinicia el servidor. Primero registra un usuario:

```bash
curl -k -X POST https://localhost:3000/api/auth/registro \
  -H "Content-Type: application/json" \
  -d "{\"correo\":\"alumno@demo.com\",\"password\":\"123456\"}"
```

Despues inicia sesion para obtener un JWT:

```bash
curl -k -X POST https://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"correo\":\"alumno@demo.com\",\"password\":\"123456\"}"
```

Usa el token devuelto para consultar la ruta protegida:

```bash
curl -k https://localhost:3000/api/auth/perfil \
  -H "Authorization: Bearer TU_TOKEN"
```

El middleware valida el token y guarda su contenido en `req.usuario`. Por eso la respuesta del perfil contiene `id`, `correo`, `iat` y `exp`. Las rutas `/api/tareas` y `/api/clima` tambien requieren el encabezado Bearer.

En Postman importa `CRUD - Tareas.postman_collection.json` y ejecuta, en orden, **Registro**, **Login** y **Perfil protegido**. La prueba de Login ejecuta este script para guardar el JWT como variable de la coleccion:

```javascript
pm.environment.set("token", pm.response.json().token);
```

### Tareas

```bash
curl -k https://localhost:3000/api/tareas
curl -k https://localhost:3000/api/tareas/1
curl -k -X POST https://localhost:3000/api/tareas \
  -H "Content-Type: application/json" \
  -d "{\"titulo\":\"Revisar clima\"}"
curl -k -X PUT https://localhost:3000/api/tareas/1 \
  -H "Content-Type: application/json" \
  -d "{\"completada\":true}"
curl -k -X DELETE https://localhost:3000/api/tareas/1
```

### Clima

```bash
curl -k https://localhost:3000/api/clima/Toluca
curl -k "https://localhost:3000/api/tareas/1/clima?ciudad=Toluca"
```
