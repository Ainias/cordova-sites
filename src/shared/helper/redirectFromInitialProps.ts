import { ServerResponse } from 'http';
import Router from 'next/router';

export function redirectFromInitialProps(newLocation: string, res?: ServerResponse): Promise<any> {
    if (res) {
        res.writeHead(307, { Location: newLocation });

        return new Promise<any>((r) => {
            res.end(r);
        });
    }
    return Router.replace(newLocation) as Promise<any>;
}
