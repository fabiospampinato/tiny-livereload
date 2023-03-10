
/* IMPORT */

import {ENDPOINT} from './constants';

/* HELPERS */

let version: string = '';

/* MAIN */

//TODO: Add a websocket-based alternative

const fetch = async ( ms: number = 200 ): Promise<void> => {

  try {

    const versionPrev = version;
    const response = await globalThis.fetch ( ENDPOINT );
    const text = await response.text ();

    version = text;

    if ( !versionPrev ) return; // First fetch

    if ( version === versionPrev ) return; // Nothing changed

    location.reload ();

  } catch {

    // The server is probably restarting, or "/__livereload__" isn't set-up properly

  } finally {

    setTimeout ( fetch, ms );

  }

};

/* EXPORT */

export default fetch;
