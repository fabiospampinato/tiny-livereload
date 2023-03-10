
/* IMPROT */

import {ENDPOINT} from './constants';
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

const middleware = ( watchPath?: string | string[] ) => {

  /* VERSIONS */

  let staticVersion = Math.random ().toString ( 36 ).slice ( 2 );
  let watchVersion = 0;

  /* WATCHER */

  if ( watchPath ) {

    new Watcher ( watchPath, {
      native: true,
      recursive: true,
      ignoreInitial: true,
      debounce: 50
    }, () => {
      watchVersion += 1;
    });

  }

  /* MIDDLEWARE */

  return ( req: Request, res: Response, next: Next ): void => {

    if ( req.method !== 'GET' ) return next ();

    if ( req.path !== ENDPOINT ) return next ();

    res.status ( 200 );
    res.send ( `${staticVersion}-${watchVersion}` );
    res.end ();

  };

};

export default middleware;
