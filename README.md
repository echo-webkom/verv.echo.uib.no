# verv.echo.uib.no

Webkom sin nettside laget for å verve nye studenter til undergruppene i echo.

Bygget med Next.js, Drizzle ORM, og PostgreSQL.

## Lokal utvikling

### Forutsetninger

- Node.js (v24 helst)
- pnpm
- Docker (for postgres database)

### Setup

```sh
git clone git@github.com:echo-webkom/verv.echo.uib.no
cd verv.echo.uib.no
pnpm install
```

Opprett en `.env` fil basert på `.env.example` og fyll inn nødvendige verdier.

### Kjør applikasjonen

```sh
pnpm dev
```

Applikasjonen kjører på `http://localhost:3000`.

Om du ikke har satt opp databasen før må du følge instruksjonene under.

### Database

Du kan starte bare PostgreSQL databasen med Docker:

```sh
docker compose up postgres
```

Nyttige kommandoer for databasehåndtering:

```sh
# For å sette opp databasen første gang:

# Generer migrasjoner
pnpm db:generate

# Kjør migrasjoner
pnpm db:migrate

# Etter du har satt opp databasen første gang kan du bruke disse kommandoene:

# Åpne database studio / frontend
pnpm db:studio

# Seed database med testdata
pnpm db:seed
```

## Docker setup

### Kjør med Docker Compose

```sh
docker compose up
```

Dette starter både applikasjonen og en PostgreSQL database. Applikasjonen blir tilgjengelig på `http://localhost:3000`.

## Hjelp?

Send melding til Ole Magnus om du trenger hjelp.
