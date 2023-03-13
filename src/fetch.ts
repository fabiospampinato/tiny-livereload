
/* IMPORT */

import {ENDPOINT_PAGE, ENDPOINT_STYLE} from './constants';

/* MAIN */

const onPageUpdate = (): void => {

  location.reload ();

};

const onStyleUpdate = (): void => {

  const links = Array.from ( document.getElementsByTagName ( 'link' ) ).filter ( link => link.rel === 'stylesheet' );

  for ( let i = 0, l = links.length; i < l; i++ ) {

    const link = links[i];
    const url = new URL ( link.href );
    const timestamp = String ( Date.now () );

    url.searchParams.set ( 'v', timestamp );

    link.href = url.href;

  }

};

const onEndpointUpdate = ( endpoint: string, onUpdate: () => void ): void => {

  let versionLast = '';

  const check = async (): Promise<void> => {

    const versionPrev = versionLast;
    const response = await globalThis.fetch ( `${endpoint}/${versionPrev}` );
    const version = await response.text ();

    versionLast = version;

    if ( !version ) return; // No updates

    if ( !versionPrev ) return; // First fetch

    if ( version === versionPrev ) return; // No updates

    await onUpdate ();

  };

  const loop = async (): Promise<void> => {

    try {

      await check ();

    } catch {

      // The server is probably restarting, or the endpoint isn't set-up properly

    } finally {

      setTimeout ( loop, 0 );

    }

  };

  loop ();

};

const fetch = (): void => {

  onEndpointUpdate ( ENDPOINT_PAGE, onPageUpdate );
  onEndpointUpdate ( ENDPOINT_STYLE, onStyleUpdate );

};

/* EXPORT */

export default fetch;
