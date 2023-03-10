
/* IMPORT */

import {ENDPOINT} from './constants';

/* HELPERS */

let versionPage: string = '';
let versionStyle: string = '';

/* MAIN */

//TODO: Add a websocket-based alternative

const fetchPage = async (): Promise<void> => {

  const versionPrev = versionPage;
  const response = await globalThis.fetch ( ENDPOINT );
  const version = await response.text ();

  versionPage = version;

  if ( !versionPrev ) return; // First fetch

  if ( versionPage === versionPrev ) return; // Nothing changed

  location.reload ();

};

const fetchStyle = async (): Promise<void> => {

  const links = Array.from ( document.querySelectorAll ( 'link[rel="stylesheet"]' ) ) as HTMLLinkElement[]; //TSC
  const hrefs = links.map ( link => link.href );

  const versionPrev = versionStyle;
  const responses = await Promise.all ( hrefs.map ( href => globalThis.fetch ( href, { method: 'HEAD' } ) ) );
  const versions = responses.map ( response => response.headers.get ( 'last-modified' ) );
  const version = versions.join ( '-' );

  versionStyle = version;

  if ( !versionPrev ) return; // First fetch

  if ( versionStyle === versionPrev ) return; // Nothing changed

  /* REFRESHING */

  for ( let i = 0, l = links.length; i < l; i++ ) {

    const link = links[i];
    const url = new URL ( link.href );
    const timestamp = String ( Date.now () );

    url.searchParams.set ( 'v', timestamp );

    link.href = url.href;

  }

};

const fetch = async ( ms: number = 200 ): Promise<void> => {

  try {

    await fetchPage ();
    await fetchStyle ();

  } catch {

    // The server is probably restarting, or "/__livereload__" isn't set-up properly

  } finally {

    setTimeout ( fetch, ms, ms );

  }

};

/* EXPORT */

export default fetch;
