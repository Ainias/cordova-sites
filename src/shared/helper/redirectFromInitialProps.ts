import { ServerResponse } from 'http';
import Router from 'next/router';

export function redirectFromInitialProps(newLocation: string, res?: ServerResponse) {
    if (res) {
        res.writeHead(307, { Location: newLocation });
        res.end();
        return new Promise<any>(() => {});
    }
    return Router.replace(newLocation) as Promise<any>;
}
