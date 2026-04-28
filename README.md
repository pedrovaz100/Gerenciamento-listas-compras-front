# Lista de Compras Front-end

Front-end em React + TypeScript + Tailwind CSS para consumir a API de Lista de Compras.

## Como rodar

1. Abra a API Spring Boot primeiro.
2. A API deve estar rodando em:

```bash
http://localhost:8081
```

3. No front, instale os pacotes:

```bash
npm install
```

4. Rode o projeto:

```bash
npm run dev
```

5. Abra no navegador:

```bash
http://localhost:5173
```

## Importante

Este projeto usa Tailwind CSS 3.4.17 para evitar o erro do Tailwind 4 com `@apply`, como:

```txt
Cannot apply unknown utility class rounded-xl
```

## Rotas do front

- `/` Dashboard
- `/mercados` CRUD de mercados
- `/listas` CRUD de listas
- `/itens` CRUD de itens
