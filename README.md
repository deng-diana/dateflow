# dateflow

AI-native task manager with an agent that remembers you

![CI](https://github.com/deng-diana/dateflow/actions/workflows/ci.yml/badge.svg)

## Development

Three terminals:

```bash
# 1. database (once; stays up in the background)
docker compose up -d db

# 2. API
cd api && source .venv/bin/activate && fastapi dev main.py

# 3. web
cd web && npm run dev
```

Open http://localhost:3000. API docs at http://localhost:8000/docs.

### Regenerate API types

The TypeScript types in `web/src/lib/api-types.d.ts` are generated from the
API's OpenAPI schema. After changing a model or route in `api/`, with the API
running:

```bash
cd web && npm run gen:api
```

## Run the whole stack with Docker

```bash
docker compose up -d --build
```
