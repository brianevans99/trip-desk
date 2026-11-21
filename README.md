# Trip Desk

A travel-planning app built to show a modern React + GraphQL stack end to end: one GraphQL API that pulls together destination guides, photos, nearby sights and flight offers from four outside providers.

> Status: work in progress. Flight data comes from Duffel's **test mode**, so the airlines and prices are samples.

## Stack

- **Monorepo:** Nx, npm, Node 24
- **Web:** React, Vite, TypeScript, Tailwind CSS v4, React Router, Apollo Client
- **API:** NestJS, code-first GraphQL (Apollo Server 5)
- **Types:** GraphQL Code Generator (client preset), so queries are typed from the schema

## How it works

The API uses one adapter service per provider. Each adapter calls its provider, maps the response into the app's own GraphQL types (`Destination`, `Photo`, `Place`, `FlightOffer`) and caches the result in memory. The UI only ever sees our schema, never a provider's raw format.

| Provider | Used for | Cache |
| --- | --- | --- |
| [Wikivoyage](https://en.wikivoyage.org/) | Destination summaries | 24 hours |
| [Unsplash](https://unsplash.com/developers) | Destination photos | 24 hours |
| [Geoapify](https://www.geoapify.com/) | Nearby sights (OpenStreetMap data) | 24 hours |
| [Duffel](https://duffel.com/) | Flight offers (test mode) | 10 minutes |

## Getting started

```bash
nvm use            # Node 24, from .nvmrc
npm install
cp .env.example .env   # then add your own keys
```

| Variable | Where to get it |
| --- | --- |
| `UNSPLASH_ACCESS_KEY` | Unsplash developer app (free demo tier) |
| `GEOAPIFY_API_KEY` | Geoapify free plan |
| `DUFFEL_ACCESS_TOKEN` | Duffel test-mode token |

Wikivoyage needs no key.

Run the API and the web app in two terminals:

```bash
npx nx serve @trip-desk/api   # http://localhost:3000, GraphiQL at /graphql
npx nx serve @trip-desk/web   # http://localhost:4200
```

After changing a query, regenerate the types:

```bash
npm run codegen
```

## Roadmap

- Flight search on the destination page
- Saved itineraries in Postgres, with DataLoader
- Sign-in with GitHub using OAuth 2.0 Authorization Code + PKCE
- Docker Compose, CI on Bitbucket Pipelines, Playwright + axe accessibility tests

## Attribution

- Destination summaries from Wikivoyage, licensed [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/)
- Photos from Unsplash, credited to each photographer under the [Unsplash License](https://unsplash.com/license)
- Places data © [OpenStreetMap contributors](https://www.openstreetmap.org/copyright) (ODbL), via Geoapify

## License

MIT, see [LICENSE](LICENSE).
