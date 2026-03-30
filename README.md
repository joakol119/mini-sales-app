# Mini Sales App

Aplicación full stack para gestión y evaluación de ventas.

## Stack

- **Backend**: Node.js + Express + SQLite (better-sqlite3)
- **Frontend**: Next.js 14 (App Router)
- **DB**: SQLite (persistida via Docker volume)
- **Entorno**: Docker Compose

## Levantar el proyecto

```bash
git clone <repo-url>
cd mini-sales-app
docker compose up --build
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:4000

## API Endpoints

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/sales` | Lista todas las ventas |
| POST | `/sales` | Crea una nueva venta |
| POST | `/sales/:id/evaluate` | Asigna un score (1-5) a una venta |

### Ejemplos

**Crear venta**
```bash
curl -X POST http://localhost:4000/sales \
  -H "Content-Type: application/json" \
  -d '{"customer": "Acme Corp", "product": "Plan Pro", "amount": 1500}'
```

**Evaluar venta**
```bash
curl -X POST http://localhost:4000/sales/1/evaluate \
  -H "Content-Type: application/json" \
  -d '{"score": 4}'
```

## Funcionalidades

- ✅ Crear venta (cliente, producto, monto)
- ✅ Listar ventas con todos los campos
- ✅ Evaluar venta con score 1-5 (estrellas interactivas)
- ✅ Promedio de score visible en el header
- ✅ Validaciones en frontend y backend
- ✅ Feedback visual al usuario

## Modelo de datos

```sql
CREATE TABLE sales (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  customer    TEXT    NOT NULL,
  product     TEXT    NOT NULL,
  amount      REAL    NOT NULL,
  score       INTEGER DEFAULT NULL,  -- 1 to 5, nullable
  created_at  DATETIME DEFAULT CURRENT_TIMESTAMP
)
```
