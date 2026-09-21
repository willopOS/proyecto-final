# 🚗 PROYECTO FINAL Administración de Concesionario

Aplicacion web FullStack para la gestion de un concesionario de vehiculos. El proyecto permite centralizar la informacion del inventario, los clientes y las ventas, manteniendo relaciones entre estas entidades y aplicando autenticacion y control de acceso mediante JWT y roles.

El objetivo del proyecto es ofrecer una interfaz administrativa clara para consultar y mantener la informacion del concesionario desde un unico sistema.

---

## 🎯 Objetivo del proyecto

La aplicacion esta orientada a la gestion operativa de un concesionario y organiza tres areas principales:

- Vehiculos: consulta, alta, edicion y eliminacion del inventario.
- Clientes: consulta, registro, edicion y eliminacion de clientes.
- Ventas: registro, consulta, edicion y eliminacion de ventas relacionadas con un vehiculo y un cliente.

La relacion entre vehiculos, clientes y ventas permite representar un flujo de negocio coherente: una venta referencia tanto al vehiculo vendido como al cliente asociado.

---

## 🧰 Tecnologias utilizadas

### Backend

- Node.js como entorno de ejecucion.
- Express.js para la creacion de la API REST.
- MongoDB Atlas como base de datos.
- Mongoose para el modelado y acceso a MongoDB.
- JSON Web Token (JWT) para la autenticacion.
- bcryptjs para generar el hash de las contrasenas.
- csv-parser para procesar los archivos CSV utilizados en la carga inicial.
- CORS para permitir la comunicacion entre frontend y backend.
- dotenv para gestionar las variables de entorno.
- fs y path de Node.js para la lectura de los archivos de datos durante la carga de semillas.

### Frontend

- React para la construccion de la interfaz.
- React Router DOM para la navegacion entre vistas.
- Axios para las peticiones HTTP a la API.
- React-Bootstrap y Bootstrap para la interfaz, formularios, tablas, modales y navegacion responsive.

---

## 🏗️ Arquitectura del proyecto

El proyecto separa las responsabilidades principales del backend y del frontend para facilitar su mantenimiento y comprension.

```text
/Proyecto-final
|
|-- /controllers
|   |-- authController.js
|   |-- clientController.js
|   |-- saleController.js
|   `-- vehicleController.js
|
|-- /data
|   |-- Clientes.csv
|   |-- Vehiculos.csv
|   `-- Ventas.csv
|
|-- /middlewares
|   `-- authMiddleware.js
|
|-- /models
|   |-- Client.js
|   |-- Sale.js
|   |-- User.js
|   `-- Vehicle.js
|
|-- /routes
|   |-- authRoutes.js
|   |-- clientRoutes.js
|   |-- saleRoutes.js
|   `-- vehicleRoutes.js
|
|-- /seeds
|   `-- loadSeeds.js
|
|-- /frontend
|   `-- /src
|       |-- App.jsx
|       |-- index.css
|       |-- main.jsx
|       `-- /components
|           |-- ClientFormModal.jsx
|           |-- ClientList.jsx
|           |-- Login.jsx
|           |-- SaleFormModal.jsx
|           |-- SaleList.jsx
|           |-- VehicleFormModal.jsx
|           `-- VehicleList.jsx
|
|-- .env
|-- .gitignore
`-- index.js
```

### Separacion de responsabilidades

- Models: definen la estructura de los documentos de MongoDB.
- Controllers: contienen la logica de cada operacion.
- Routes: definen los endpoints de la API y aplican los middlewares de autenticacion y autorizacion cuando corresponde.
- Middlewares: centralizan la validacion de acceso.
- Seeds: cargan los datos iniciales desde CSV y crean las relaciones entre las colecciones.
- Components: contienen las vistas y formularios reutilizables del frontend.
- App.jsx: configura la navegacion principal y el estado de sesion mostrado en la interfaz.

---

## 📊 Modelo de datos

La aplicacion utiliza cuatro modelos principales.

### User

Gestiona la autenticacion de los usuarios del sistema.

Campos principales:

- nombre
- email
- password
- rol: admin o client
- createdAt y updatedAt

La contrasena se procesa mediante un middleware pre-save y se almacena mediante un hash generado con bcryptjs.

### Client

Representa a los clientes del concesionario.

Campos principales:

- idCliente
- nombreCliente
- email
- preferenciasCliente

### Vehicle

Representa el inventario de vehiculos.

Campos principales:

- vin
- marca
- modelo
- tipoVehiculo
- anioFabricacion
- kilometraje
- estado
- precioVenta
- fechaAdquisicion
- estadoVehiculo
- imagen
- color

### Sale

Representa una venta y mantiene las relaciones con las colecciones de vehiculos y clientes mediante referencias de MongoDB.

Campos principales:

- idVenta
- vehiculoVendido -> referencia a Vehicle
- clienteAsociado -> referencia a Client
- fechaVenta
- metodoPago
- fechaEntrega

La consulta de ventas utiliza populate() para recuperar la informacion relacionada del vehiculo y del cliente.

---

## 🌱 Carga inicial de datos y semillas

La aplicacion dispone de tres archivos CSV:

- Clientes.csv
- Vehiculos.csv
- Ventas.csv

El archivo seeds/loadSeeds.js utiliza fs.createReadStream() junto con csv-parser para leer los datos y convertirlos al formato de los modelos de Mongoose.

La carga se realiza siguiendo este proceso:

```text
CSV
 |
 v
fs.createReadStream()
 |
 v
csv-parser
 |
 v
Transformacion de los datos
 |
 v
insertMany() en MongoDB
 |
 v
Creacion de relaciones en ventas
```

Para relacionar las ventas, la semilla crea mapas en memoria:

- VIN -> _id del vehiculo.
- idCliente -> _id del cliente.

Posteriormente, esos _id se utilizan para completar vehiculoVendido y clienteAsociado en cada venta.

---

## 🔐 Autenticacion y control de acceso

El sistema utiliza JWT para gestionar la sesion.

### Flujo de autenticacion

1. El usuario se registra mediante POST /api/auth/register.
2. Antes de guardar el usuario, bcryptjs genera el hash de la contrasena.
3. El usuario inicia sesion mediante POST /api/auth/login.
4. El backend compara la contrasena recibida con el hash almacenado.
5. Si las credenciales son correctas, se genera un JWT con el identificador del usuario y su rol.
6. El token tiene una duracion de 1 dia.
7. El frontend guarda el token en localStorage y lo utiliza en las peticiones que necesitan autenticacion.

En App.jsx, el token almacenado se lee al iniciar la aplicacion para recuperar la informacion del usuario y mostrar su rol en la navegacion.

El cierre de sesion elimina el token de localStorage y devuelve al usuario a la pantalla de acceso.

---

## Funcionalidades del frontend

### Inicio de sesion

La vista Login.jsx permite introducir correo y contrasena, realizar la peticion de autenticacion y almacenar el JWT recibido.

### Gestion de clientes

ClientList.jsx permite:

- Consultar clientes.
- Abrir un modal para crear un cliente.
- Editar un cliente mediante el mismo modal.
- Eliminar clientes despues de una confirmacion.

ClientFormModal.jsx reutiliza el mismo formulario para los modos de creacion y edicion.

### Gestion de vehiculos

VehicleList.jsx permite:

- Consultar el inventario.
- Crear vehiculos.
- Editar vehiculos.
- Eliminar vehiculos.

VehicleFormModal.jsx concentra el formulario y reutiliza la misma interfaz para crear y modificar registros.

### Gestion de ventas

SaleList.jsx permite consultar las ventas, editar registros y eliminarlos.

SaleFormModal.jsx utiliza desplegables para seleccionar:

- El vehiculo vendido.
- El cliente asociado.

Estas listas se cargan desde la API y se solicitan de forma concurrente mediante Promise.all(), evitando que el usuario tenga que introducir manualmente los ObjectId de MongoDB.

Ademas, al crear una venta desde el backend, el vehiculo asociado pasa automaticamente al estado Vendido.

---

## ♻️ Reutilizacion y componentizacion

El frontend aplica una estructura basada en componentes reutilizables.

Los formularios de clientes, vehiculos y ventas estan separados en componentes *FormModal.jsx, mientras que las vistas de listado estan organizadas en componentes *List.jsx.

Esto permite concentrar en un unico componente las operaciones de alta y edicion de cada entidad y evita duplicar la estructura de los formularios.

Tambien se utilizan hooks de React y React Router, entre ellos:

- useState para gestionar el estado de formularios, listas, errores y modales.
- useEffect para realizar cargas iniciales y sincronizar los formularios cuando cambia el registro seleccionado.
- useNavigate para la navegacion programatica dentro de la aplicacion.

---

## 🎨 UX/UI

La interfaz utiliza React-Bootstrap y Bootstrap para mantener una presentacion consistente y responsive.

Entre los elementos implementados se encuentran:

- Barra de navegacion responsive con menu desplegable en pantallas pequenas.
- Tablas responsive para vehiculos, clientes y ventas.
- Modales para crear y editar registros.
- Formularios con validaciones HTML basicas mediante campos obligatorios.
- Mensajes de error y confirmaciones para operaciones sensibles.
- Desplegables dinamicos para las relaciones entre clientes y vehiculos.

---

## 📡 API REST

### Autenticacion

| Metodo | Endpoint | Acceso | Descripcion |
|---|---|---|---|
| POST | /api/auth/register | Publico | Registra un usuario. |
| POST | /api/auth/login | Publico | Valida credenciales y devuelve un JWT. |

### Clientes

| Metodo | Endpoint | Acceso | Descripcion |
|---|---|---|---|
| GET | /api/clients | Autenticado | Obtiene todos los clientes. |
| POST | /api/clients | Autenticado | Crea un cliente. |
| PUT | /api/clients/:id | Autenticado + Admin | Actualiza un cliente. |
| DELETE | /api/clients/:id | Autenticado + Admin | Elimina un cliente. |

### Vehiculos

| Metodo | Endpoint | Acceso | Descripcion |
|---|---|---|---|
| GET | /api/vehicles | Publico | Obtiene el inventario. |
| POST | /api/vehicles | Autenticado + Admin | Crea un vehiculo. |
| PUT | /api/vehicles/:id | Autenticado + Admin | Actualiza un vehiculo. |
| DELETE | /api/vehicles/:id | Autenticado + Admin | Elimina un vehiculo. |

### Ventas

| Metodo | Endpoint | Acceso segun la definicion actual de la ruta | Descripcion |
|---|---|---|---|
| GET | /api/sales | Autenticado | Obtiene las ventas y sus relaciones. |
| POST | /api/sales | Autenticado + Admin | Registra una venta. |
| PUT | /api/sales/:id | Sin middleware en saleRoutes.js | Actualiza una venta. |
| DELETE | /api/sales/:id | Sin middleware en saleRoutes.js | Elimina una venta. |


---

## ⚙️ Instalacion y ejecucion local

### 1. Clonar el repositorio

```bash
git clone <URL-DEL-REPOSITORIO>
cd proyecto-final
```

### 2. Configurar el backend

Desde la raiz del proyecto:

```bash
npm install
```

Crear o configurar el archivo .env con las variables necesarias:

```env
PORT=4000
MONGO_URI=mongodb+srv://willopju93_db_user:Jfc4JrBCki59nOY7@cluster0.vknmede.mongodb.net/concesionario_final?retryWrites=true&w=majority
JWT_SECRET=clave_secreta_super_segura_jwt_2026
```

Iniciar el backend:

```bash
npm run dev
```

El backend utiliza el puerto 4000 por defecto cuando asi esta configurado en el entorno.

### 3. Cargar los datos iniciales

Despues de configurar la conexion a MongoDB, ejecutar la semilla desde la raiz del proyecto:

```bash
node seeds/loadSeeds.js
```

Recuerda que la semilla elimina antes los datos de Vehicle, Client y Sale para volver a cargar el conjunto inicial.

### 4. Ejecutar el frontend

Abrir una nueva terminal:

```bash
cd frontend
npm install
npm run dev
```

La interfaz se ejecutara en el entorno de desarrollo configurado por el proyecto.

---

## 👩‍💻 Autora
Alejandra Wilches

---

*Proyecto Final FullStack - 2026*
