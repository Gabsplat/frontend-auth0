# 🦷 Sistema de Gestión de Consultorio Odontológico

Cátedra Sistemas Distribuidos, Universidad del Aconcagua, Mendoza (2025).

## 🧑‍🎓 Autores

- **[Gabriel Pérez Diez]**
- **[Germán Hidalgo]**

## 📋 Descripción del Proyecto

Sistema de gestión integral para consultorios odontológicos desarrollado como proyecto universitario. La aplicación permite administrar pacientes, dentistas, especialidades y turnos mediante una interfaz web moderna con autenticación segura y diferentes roles de usuario.

## 🎯 Características Principales

### 👥 Gestión de Usuarios

- **Autenticación segura** con Auth0
- **Tres roles diferenciados**:
  - **Administrador**: Gestión completa del sistema
  - **Dentista**: Manejo de turnos y consultas
  - **Paciente**: Visualización de turnos e historial clínico

### 🏥 Funcionalidades del Sistema

#### Para Administradores

- 👨‍⚕️ **Gestión de Dentistas**: Registrar y administrar profesionales
- 👥 **Gestión de Pacientes**: Control de información de pacientes
- 🏷️ **Gestión de Especialidades**: Crear y modificar especialidades odontológicas
- 📅 **Gestión de Turnos**: Programación y administración de citas

#### Para Dentistas

- 📅 **Agenda Personal**: Visualización de turnos programados
- 👁️ **Turnos del Día**: Vista dedicada para el día actual
- 📋 **Gestión de Consultas**: Iniciar y completar consultas
- 📄 **Historial de Pacientes**: Acceso al historial clínico completo
- ✏️ **Notas de Tratamiento**: Registro de observaciones y tratamientos

#### Para Pacientes

- 📅 **Visualización de Turnos**: Consulta de citas programadas y completadas
- 📋 **Historia Clínica**: Acceso al historial médico personal
- 📊 **Estado de Turnos**: Seguimiento del estado de las citas

## 🛠️ Tecnologías Utilizadas

### Frontend

- **React 19** - Biblioteca de interfaz de usuario
- **TypeScript** - Tipado estático para JavaScript
- **Vite** - Herramienta de construcción y desarrollo
- **Tailwind CSS** - Framework de CSS utilitario
- **Radix UI** - Componentes de interfaz accesibles
- **React Router** - Enrutamiento del lado del cliente

### Autenticación y Seguridad

- **Auth0** - Servicio de autenticación y autorización
- **JWT Tokens** - Manejo seguro de sesiones

### Herramientas de Desarrollo

- **ESLint** - Linter para mantener calidad del código
- **TypeScript Compiler** - Verificación de tipos
- **Lucide React** - Biblioteca de iconos

## 📦 Instalación y Configuración

### Prerrequisitos

- Node.js (versión 18 o superior)
- npm o yarn
- Cuenta de Auth0 configurada
- Backend Spring Boot en funcionamiento

### 1. Clonar el repositorio

```bash
git clone [URL_DEL_REPOSITORIO]
cd frontend-auth0
```

### 2. Instalar dependencias

```bash
npm install
# o
yarn install
```

### 3. Configurar variables de entorno

Crear un archivo `.env` en la raíz del proyecto:

```env
VITE_API_URL=http://localhost:8080/api
VITE_AUTH0_DOMAIN=tu-dominio.auth0.com
VITE_AUTH0_CLIENT_ID=tu-client-id
VITE_AUTH0_CALLBACK_URL=http://localhost:5173/callback
```

### 4. Ejecutar en modo desarrollo

```bash
npm run dev
# o
yarn dev
```

La aplicación estará disponible en `http://localhost:5173`

### 5. Construir para producción

```bash
npm run build
# o
yarn build
```

## 🏗️ Estructura del Proyecto

```
src/
├── auth/                   # Componentes de autenticación
├── components/
│   ├── auth0/             # Configuración Auth0
│   ├── dashboard/         # Componentes del dashboard
│   ├── modals/            # Modales de la aplicación
│   └── ui/                # Componentes de interfaz reutilizables
├── constants/             # Constantes de la aplicación
├── context/               # Contextos de React
├── pages/                 # Páginas principales
│   └── dashboard/         # Dashboards por rol
├── types/                 # Definiciones de TypeScript
└── utils/                 # Utilidades y helpers
```

## 🔧 Scripts Disponibles

- `npm run dev` - Ejecuta el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm run preview` - Previsualiza la construcción de producción
- `npm run lint` - Ejecuta ESLint para verificar el código

## 🌐 Arquitectura del Sistema

### Autenticación

El sistema utiliza Auth0 para el manejo de autenticación y autorización, proporcionando:

- Login/logout seguro
- Gestión de sesiones
- Roles y permisos diferenciados

### Comunicación con Backend

- API REST con Spring Boot
- Tokens JWT para autenticación
- Endpoints específicos para cada funcionalidad

### Estado de la Aplicación

- Context API de React para estado global
- Estados locales para componentes específicos
- Manejo de tokens de autenticación

## 👨‍💻 Desarrollo

### Convenciones de Código

- Uso de TypeScript estricto
- Componentes funcionales con hooks
- Nomenclatura en español para el dominio del negocio
- ESLint para mantener consistencia

### Estructura de Componentes

- Componentes reutilizables en `/components/ui`
- Lógica específica del dominio en `/components/dashboard`
- Modales centralizados en `/components/modals`

### Desarrollo Local

1. Fork del repositorio
2. Crear rama feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit de cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crear Pull Request
