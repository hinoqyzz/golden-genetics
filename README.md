# Golden Genetics — Laboratório

Site educativo da feira de ciências. O laboratório é fictício e não oferece atendimento médico.

## Como abrir

```bash
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

## Rotas

- `/` início
- `/sobre` o projeto e a equipe
- `/servicos` explicações científicas
- `/simulador` cruzamentos de um gene
- `/consultas` agendamento demonstrativo
- `/admin` painel local da feira

Os agendamentos ficam no `localStorage` do navegador. Para trocar os nomes da equipe, edite `lib/content.ts`.
