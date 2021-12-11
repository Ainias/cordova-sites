import { ComponentType, PureComponent } from 'react';

const defaultState = {};
export type SiteProps = {
    id: number;
    visible: boolean;
};
type State = Readonly<typeof defaultState>;

export class Site<TProps extends SiteProps, TState extends State> extends PureComponent<TProps, TState> {
    componentDidMount() {
        // Direction, call componentDidAppear after didMount
        setTimeout(() => this.componentDidAppear(), 1);
    }

    getSnapshotBeforeUpdate(prevProps: Readonly<TProps>) {
        const { visible } = this.props;

        if (prevProps.visible !== visible) {
            if (visible) {
                this.componentWillAppear();
            } else {
                this.componentWillDisappear();
            }
        }
        return null;
    }

    componentDidUpdate(prevProps: Readonly<TProps>) {
        const { visible } = this.props;

        if (prevProps.visible !== visible) {
            if (visible) {
                this.componentDidAppear();
            } else {
                this.componentDidDisappear();
            }
        }
    }

    componentWillUnmount() {
        this.componentWillDisappear();
    }

    // eslint-disable-next-line class-methods-use-this,@typescript-eslint/no-empty-function
    componentWillAppear() {}

    // eslint-disable-next-line class-methods-use-this,@typescript-eslint/no-empty-function
    componentWillDisappear() {}

    // eslint-disable-next-line class-methods-use-this,@typescript-eslint/no-empty-function
    componentDidAppear() {}

    // eslint-disable-next-line class-methods-use-this,@typescript-eslint/no-empty-function
    componentDidDisappear() {}
}

export type SiteType = ComponentType<Record<string, any> & SiteProps>;