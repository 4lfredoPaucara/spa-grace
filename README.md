# SpaGrace - Sistema de Gestión Integral para Spa y Centro de Bienestar

**Versión:** 2.0.0  
**Estado:** En reconstrucción

## Stack

| Capa | Tecnología | Versión |
|------|-----------|---------|
| Frontend | Angular | 22.0.8 |
| Backend | NestJS | 11.1.28 |
| ORM | TypeORM | 1.1.0 |
| Base de Datos | MySQL / MariaDB | 8.4+ |
| CSS | Tailwind CSS | 4.3.3 |
| Charts | NgApexcharts | 2.4.0 |

## Estructura del Proyecto

```
spa-grace/
├── spa-backend/          # API REST (NestJS + TypeORM)
├── spa-frontend/         # SPA (Angular Standalone + Tailwind)
├── docs/                 # Documentación completa
│   ├── desarrolloGace.md           # Plan general + API contracts
│   ├── desarrolloGace_DB.md        # Esquema BD para DBA
│   ├── desarrolloGace_Frontend.md  # Especificaciones frontend
│   └── desarrolloGace_Tracker.md   # Ruta de trabajo y progreso
└── README.md
```

## Documentación

Toda la especificación técnica, contratos de API, modelo de datos y plan de reconstrucción está en la carpeta `docs/`.

- [Plan general y API](docs/desarrolloGace.md)
- [Esquema de Base de Datos](docs/desarrolloGace_DB.md)
- [Especificaciones Frontend](docs/desarrolloGace_Frontend.md)
- [Tracker de progreso](docs/desarrolloGace_Tracker.md)

## Ramas

- `main` — Producción
- `develop` — Integración
- `feature/faseX-nombre` — Desarrollo de módulos
