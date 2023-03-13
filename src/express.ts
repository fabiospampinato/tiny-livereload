
/* IMPROT */

import {ENDPOINT_PAGE, ENDPOINT_STYLE} from './constants';
import {once} from 'node:events';
import Watcher from 'watcher';

/* TYPES */

type Request = {
  method: string,
  path: string
};

type Response = {
  status: ( code: number ) => void,
  send: ( text: string ) => void,
  end: () => void
};

type Next = {
  (): void
};

/* MAIN */

const middleware = ( watchPathForPage?: string | string[], watchPathForStyle?: string | string[] ) => {

  /* VERSIONS */

  let staticVersion = Math.random ().toString ( 36 ).slice ( 2 );
  let pageVersion = 0;
  let styleVersion = 0;

  const getPageVersion = () => `${staticVersion}-${pageVersion}`;
  const getStyleVersion = () => `${staticVersion}-${styleVersion}`;

  /* WATCHERS */

  const optionsWatcher = {
    native: true,
    recursive: true,
    ignoreInitial: true,
    debounce: 20
  };

  const pageWatcher = new Watcher ( watchPathForPage, optionsWatcher );
  const styleWatcher = new Watcher ( watchPathForStyle, optionsWatcher );

  pageWatcher.on ( 'all', () => pageVersion += 1 );
  styleWatcher.on ( 'all', () => styleVersion += 1 );

  /* MIDDLEWARE */

  return async ( req: Request, res: Response, next: Next ): Promise<void> => {

    if ( req.method === 'GET' && req.path.startsWith ( ENDPOINT_PAGE ) ) {

      const versionPrev = req.path.slice ( ENDPOINT_PAGE.length + 1 );

      if ( versionPrev !== getPageVersion () || await once ( pageWatcher, 'all' ) ) {

        res.status ( 200 );
        res.send ( getPageVersion () );
        res.end ();

      }

    } else if ( req.method === 'GET' && req.path.startsWith ( ENDPOINT_STYLE ) ) {

      const versionPrev = req.path.slice ( ENDPOINT_STYLE.length + 1 );

      if ( versionPrev !== getStyleVersion () || await once ( styleWatcher, 'all' ) ) {

        res.status ( 200 );
        res.send ( getStyleVersion () );
        res.end ();

      }

    } else {

      next ();

    }

  };

};

/* EXPORT */

export default middleware;
