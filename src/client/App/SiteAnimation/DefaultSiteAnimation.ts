import { ClassSiteAnimation } from './ClassSiteAnimation';

export class DefaultSiteAnimation extends ClassSiteAnimation {
    constructor() {
        super('animation-new-site', 'animation-end-site', 300, true);
    }
}
