# CoachHub
Plataforma web de gestion entre coaches y atletas desarrollada como Trabajo de Fin de Grado del ciclo CFGS Desarrollo de Aplicaciones Web.

## Descripcion
CoachHub conecta entrenadores personales con sus atletas. El coach puede gestionar sus clientes, asignarles rutinas de entrenamiento con ejercicios parametrizados por fecha y consultar su progreso. El atleta puede ver su rutina asignada y registrar su peso diario con seguimiento grafico.

## Stack tecnologico
- **Backend**: Java 21 + Spring Boot 3.5 + Spring Security + JWT + Hibernate/JPA
- **Frontend**: React 19 + Vite 6 + Tailwind CSS v4 + Recharts
- **Base de datos**: MySQL 8
- **Despliegue**: Netlify (frontend) + Railway (backend + MySQL)

## Demo en produccion
**URL**: https://coachhubtfg.netlify.app

Credenciales de prueba:
- Coach: `coach@coachhub.com` / `demo1234`
- Atleta: `atleta@coachhub.com` / `demo1234`

## Instalacion en local

### Requisitos
- Java 21
- Maven 3.9+
- Node.js 22
- MySQL 8

### Backend
```bash
cd backend
./mvnw spring-boot:run
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

La app estara disponible en http://localhost:5173

## Estructura del proyecto

coachhub/
├── backend/          # API REST Spring Boot
│   ├── src/main/java/com/coachhub/backend/
│   │   ├── controller/   # Endpoints REST
│   │   ├── service/      # Logica de negocio
│   │   ├── repository/   # Acceso a datos JPA
│   │   ├── entity/       # Entidades JPA (9 tablas)
│   │   ├── dto/          # Objetos de transferencia
│   │   └── security/     # JWT + Spring Security
│   └── Dockerfile
│
└── frontend/     # SPA React
└── src/
├── pages/        # Vistas completas
├── components/   # Componentes reutilizables
├── context/      # Estado global (AuthContext)
└── services/     # Comunicacion con la API

## Autor
Gonzalo Martinez Saura — CFGS DAW 2025/2026 — CIFP Carlos III, Cartagena

## Licencia
Este proyecto esta bajo licencia Creative Commons Reconocimiento - Compartir Igual 4.0 Internacional (CC BY-SA 4.0).

[![CC BY-SA 4.0](https://licensebuttons.net/l/by-sa/4.0/88x31.png)](https://creativecommons.org/licenses/by/4.0/deed.es)

Puedes compartir y adaptar el material siempre que des credito al autor y distribuyas bajo la misma licencia.