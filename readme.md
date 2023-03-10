# Tiny Livereload

A tiny and basic livereload solution.

It's divided into a frontend and a backend, basically the frontend queries the backend, the backend returns a string for that query, and whenever this string changes the page is reloaded.

## Install

```sh
npm install --save tiny-livereload
```

## Usage

A `fetch` frontend is provided, which requests `/__livereload__` in a loop:

```ts
import livereload from 'tiny-livereload/fetch';

// Check for updates every 200ms

livereload ( 200 );
```

An `express` middleware for the backend is provided, which servers the `/__livereload__` request, potentially watching some file paths for changes too:

```ts
import express from 'express';
import livereload from 'tiny-livereload/express';

const app = express ();

// Only handle restarts of the server

app.use ( livereload () );

// Also watch some paths for changes

app.use ( livereload ( './dist/client' ) );
```

## License

MIT © Fabio Spampinato
