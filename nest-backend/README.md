# Backend NestJS – Tasks e Livros

API REST com NestJS, persistindo em arquivos JSON (`data/`).

## Rodar
```
npm install
npm run start:dev   # porta 3000
```

## Rotas (iguais para /tasks e /livros)
| Método | Rota        | Ação                      |
|--------|-------------|---------------------------|
| GET    | /tasks      | Listar                    |
| GET    | /tasks/:id  | Buscar por id             |
| POST   | /tasks      | Criar                     |
| PUT    | /tasks/:id  | Substituir tudo           |
| PATCH  | /tasks/:id  | Atualizar parcialmente    |
| DELETE | /tasks/:id  | Remover                   |
