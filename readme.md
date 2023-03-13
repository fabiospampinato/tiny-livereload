# Tiny Livereload

A tiny and basic livereload solution.

It's divided into a frontend and a backend, basically the frontend queries the backend, the backend returns a string for that query, and whenever this string changes the page is reloaded.

## Install

```sh
npm install --save tiny-livereload
```

## Usage

A `fetch` frontend is provided, which polls `/__livereload_page__` and `/__livereload_style__`  in a loop.

It reloads the page automatically when the page endpoint returns an update, and it reloads styles without reloading the page when the style endpoint returns an update.

```ts
import livereload from 'tiny-livereload/fetch';

// Check for updates

livereload ();
```

An `express` middleware for the backend is provided, which serves the `/__livereload_page__` and `/__livereload_style__` endpoints, potentially watching some paths for changes too.

```ts
import express from 'express';
import livereload from 'tiny-livereload/express';

const app = express ();

// Only handle restarts of the server

app.use ( livereload () );

// Also watch some paths for changes

const watchPathsForPage = ['./dist/client'];
const watchPathsForStyle = ['./public/style'];

app.use ( livereload ( watchPathsForPage, watchPathsForStyle ) );
```

## License

MIT © Fabio Spampinato
