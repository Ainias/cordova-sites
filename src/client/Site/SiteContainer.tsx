import * as React from 'react';
import { createRef } from 'react';
import { SiteIdContext } from '../App/SiteIdContext';
import { SiteProps } from './Site';
import { TopBar } from './TopBar/TopBar';
import type { TopBarButtonType } from 'react-bootstrap-mobile';
import { SiteContainerContext } from '../App/Hooks';
import { Container } from 'react-bootstrap';

const initialTopBarOptions = {
    title: undefined as string | undefined,
    leftButtons: [] as TopBarButtonType[],
    rightButtons: [] as TopBarButtonType[],
    backButton: undefined as undefined | false | TopBarButtonType,
};

const initialState = {
    topBarOptions: initialTopBarOptions,
};
export type TopBarOptions = Partial<typeof initialTopBarOptions>;
type State = Readonly<typeof initialState>;
type Props = {
    visible: boolean;
    leaving: boolean;
    id: number;
    siteComponent: React.ComponentType<SiteProps>;
    siteProps: any;
    siteContainerStyle?: { [key: string]: string | number };
    siteContainerClass?: string;
    onContainerListener?: (id: number, ref: React.RefObject<HTMLDivElement>) => void;
};

export class SiteContainer extends React.PureComponent<Props, State> {
    readonly state: State = initialState;
    container: React.RefObject<HTMLDivElement> = createRef();
    child: React.RefObject<HTMLDivElement> = createRef();

    componentDidMount() {
        const { visible, onContainerListener, id } = this.props;
        if (this.child.current && !visible) {
            this.child.current.remove();
        }
        if (onContainerListener) {
            onContainerListener(id, this.container);
        }
    }

    getSnapshotBeforeUpdate(prevProps: Readonly<Props>) {
        const { visible } = this.props;
        if (!prevProps.visible && visible && this.container.current && this.child.current) {
            this.container.current.appendChild(this.child.current);
        }
        return null;
    }

    componentDidUpdate(prevProps: Readonly<Props>) {
        const { visible } = this.props;
        if (!visible && prevProps.visible && this.child.current) {
            this.child.current.remove();
        }
    }

    render() {
        const { siteComponent, siteContainerStyle, siteProps, visible, id, leaving, siteContainerClass } = this.props;
        const Base = siteComponent;

        const {
            topBarOptions: { title, rightButtons, leftButtons, backButton },
        } = this.state;

        return (
            <div ref={this.container} style={siteContainerStyle} className={siteContainerClass || 'site'}>
                <div ref={this.child}>
                    <SiteContainerContext.Provider value={this}>
                        <SiteIdContext.Provider value={id}>
                            <TopBar
                                title={title}
                                rightButtons={rightButtons}
                                leftButtons={leftButtons}
                                backButton={backButton}
                            />
                            <Container fluid="xxl">
                                <Base visible={visible} leaving={leaving} {...siteProps} id={id} />
                            </Container>
                        </SiteIdContext.Provider>
                    </SiteContainerContext.Provider>
                </div>
            </div>
        );
    }

    updateTopBarOptions(newOptions: TopBarOptions) {
        const { topBarOptions } = this.state;
        this.setState({
            topBarOptions: {
                ...topBarOptions,
                ...newOptions,
            },
        });
    }
}
