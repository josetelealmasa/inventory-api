# Salutia Inventory API

API REST de gestión de inventario farmacéutico para **Salutia** (empresa ficticia
usada como caso de estudio). Proyecto de ejemplo docente centrado en tres pilares:
**arquitectura hexagonal**, **buenas prácticas de código** y **un pipeline CI/CD
completo con enfoque DevSecOps**.

## Arquitectura hexagonal (puertos y adaptadores)

```
src/
├── domain/              # Núcleo de negocio. CERO dependencias externas.
│   ├── entities/         → Product: reglas de negocio (stock, validaciones)
│   ├── errors/           → Errores de dominio (no HTTP, no framework)
│   └── ports/             → Interfaces que deben cumplir los adaptadores
│
├── application/          # Casos de uso. Orquestan el dominio.
│   └── usecases/          → CreateProduct, ListProducts, UpdateStock...
│
├── infrastructure/       # Adaptadores. Aquí SÍ hay frameworks.
│   ├── http/               → Express: rutas, controladores, middlewares
│   └── persistence/        → InMemoryProductRepository (implementa el puerto)
│
├── config/
│   └── container.js      # Composition root: aquí se "enchufa" todo
│
└── server.js             # Punto de entrada
```

**Regla de dependencia (la idea clave a transmitir en clase):**
las flechas de dependencia siempre apuntan hacia dentro.

```
infrastructure  →  application  →  domain
```

El dominio no conoce ni Express ni la base de datos. Los casos de uso dependen
de **interfaces** (`ProductRepository`), no de implementaciones concretas. Esto
permite:

- Testear la lógica de negocio sin levantar un servidor HTTP ni una BD real.
- Cambiar de framework HTTP o de motor de persistencia tocando solo la capa
  de infraestructura y una línea en `container.js`.
- Que un cambio en Express no obligue a reescribir reglas de negocio.

## Buenas prácticas aplicadas

- **Separación de responsabilidades estricta** (dominio / aplicación / infraestructura).
- **Inyección de dependencias manual** vía composition root (`src/config/container.js`),
  sin necesidad de un framework de DI para un proyecto de este tamaño.
- **Validación de entrada** con Joi en el borde HTTP (no en el dominio).
- **Manejo de errores centralizado**, con jerarquía de errores de dominio que se
  traducen a códigos HTTP en un único middleware.
- **Tests desacoplados**: unitarios de dominio y aplicación (con dobles de test,
  sin mocks de librerías) + integración de la API con `supertest`.
- **Linting y formato automatizados** (ESLint + Prettier) para mantener un estándar
  de código consistente en todo el equipo.
- **Contenedor Docker multi-stage**, ejecución como usuario no root, healthcheck.
- **Pipeline CI/CD** con lint, tests en matriz de versiones de Node, análisis de
  seguridad (SAST con CodeQL, SCA con `npm audit` y Dependency Review, detección
  de secretos con Gitleaks), build/push de imagen y despliegue por entornos con
  aprobación manual en producción.

## Endpoints

| Método | Ruta                         | Descripción                             |
| ------ | ---------------------------- | --------------------------------------- |
| GET    | `/health`                    | Estado del servicio                     |
| POST   | `/api/v1/products`           | Crear producto                          |
| GET    | `/api/v1/products`           | Listar productos (`?belowMinimum=true`) |
| GET    | `/api/v1/products/:id`       | Obtener producto por id                 |
| PATCH  | `/api/v1/products/:id/stock` | Ajustar stock (`increase`/`decrease`)   |
| DELETE | `/api/v1/products/:id`       | Eliminar producto                       |

Ejemplo de creación:

```bash
curl -X POST http://localhost:3000/api/v1/products \
  -H "Content-Type: application/json" \
  -d '{
    "sku": "PARA-500",
    "name": "Paracetamol 500mg",
    "stock": 20,
    "minStock": 5,
    "requiresPrescription": false,
    "price": 3.5
  }'
```

## Cómo ejecutarlo

```bash
npm install
cp .env.example .env
npm run dev              # servidor con recarga en caliente

npm test                 # tests
npm run test:coverage    # tests con cobertura
npm run lint             # calidad estática
npm run format           # formateo automático

docker compose up --build   # levantar con Docker
```

## Pipeline CI/CD

Definido en `.github/workflows/ci-cd-pipeline.yml`. Al subir este repo a GitHub,
se activa automáticamente en cada `push`/`pull_request` a `main` o `develop`.
Para completar la configuración en GitHub:

1. **Settings → Environments**: crear `staging` y `production`, y añadir
   "required reviewers" en `production` para forzar aprobación manual.
2. **Settings → Secrets and variables → Actions**: añadir los secretos que
   se usen realmente (`SLACK_WEBHOOK_URL`, `CODECOV_TOKEN`, etc.). El
   `GITHUB_TOKEN` para el registro de contenedores ya lo provee GitHub.
3. **Settings → Branches**: proteger `main` exigiendo que los checks
   `lint`, `test` y `security` pasen antes de poder mergear.

## Siguiente nivel (para ampliar en clase)

- Sustituir `InMemoryProductRepository` por un adaptador PostgreSQL sin tocar
  dominio ni casos de uso — buen ejercicio práctico para demostrar el desacoplo.
- Añadir autenticación (JWT) como middleware en la capa HTTP.
- Documentar la API con OpenAPI/Swagger.
- Añadir pruebas de contrato entre el puerto y sus adaptadores.
