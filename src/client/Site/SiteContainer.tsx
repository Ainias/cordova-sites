import * as React from 'react';
import { createRef } from 'react';
import { SiteIdContext } from '../App/SiteIdContext';
import { VisibleContext } from '../App/VisibleContext';
import { SitesTopBarButtonType, TopBar, TopBarProps } from './TopBar/TopBar';
import { SiteContainerContext } from '../App/Hooks';
import { Container } from 'react-bootstrap';
import { FooterButton } from './Footer/Footer';
import { StringMap } from 'i18next';
import { Override } from 'react-bootstrap-mobile';

export const initialTopBarOptions: TopBarProps<StringMap> = {
    visible: true,
    title: undefined,
    leftButtons: [],
    rightButtons: [],
    backButton: undefined,
    transparent: false,
    drawBehind: false,
};
export const initialFooterOptions = {
    visible: true,
    buttons: [] as FooterButton[],
};

export type TopBarOptions = Partial<TopBarProps<StringMap>>;
export type TopBarOptionsWithButtonFunctions = Partial<
    Override<
        TopBarProps<StringMap>,
        {
            rightButtons:
                | SitesTopBarButtonType<StringMap>[]
                | ((defaultButtons: SitesTopBarButtonType<StringMap>[]) => SitesTopBarButtonType<StringMap>[]);
            leftButtons:
                | SitesTopBarButtonType<StringMap>[]
                | ((defaultButtons: SitesTopBarButtonType<StringMap>[]) => SitesTopBarButtonType<StringMap>[]);
        }
    >
>;
export type FooterOptions = Partial<typeof initialFooterOptions & { activeTab: number }>;

const initialState = {
    topBarOptions: {} as TopBarOptionsWithButtonFunctions,
};

type State = Readonly<typeof initialState>;
type Props<SitePropsType> = {
    visible: boolean;
    leaving: boolean;
    id: number;
    siteComponent: React.ComponentType<SitePropsType>;
    siteProps: SitePropsType;
    siteContainerStyle?: { [key: string]: string | number };
    siteContainerClass?: string;
    onContainerListener?: (id: number, ref: React.RefObject<HTMLDivElement>) => void;
    defaultTopBarOptions: typeof initialTopBarOptions;
};

export class SiteContainer<SitePropsType> extends React.PureComponent<Props<SitePropsType>, State> {
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

    getSnapshotBeforeUpdate(prevProps: Readonly<Props<SitePropsType>>) {
        const { visible } = this.props;
        if (!prevProps.visible && visible && this.container.current && this.child.current) {
            this.container.current.appendChild(this.child.current);
        }
        return null;
    }

    componentDidUpdate(prevProps: Readonly<Props<SitePropsType>>) {
        const { visible } = this.props;
        if (!visible && prevProps.visible && this.child.current) {
            this.child.current.remove();
        }
    }

    render() {
        const { siteComponent, siteContainerStyle, siteProps, visible, id, siteContainerClass, defaultTopBarOptions } =
            this.props;
        const Base = siteComponent;

        const { topBarOptions } = this.state;

        if (typeof topBarOptions.rightButtons === 'function') {
            topBarOptions.rightButtons = topBarOptions.rightButtons([...(defaultTopBarOptions.rightButtons ?? [])]);
        }
        if (typeof topBarOptions.leftButtons === 'function') {
            topBarOptions.leftButtons = topBarOptions.leftButtons([...(defaultTopBarOptions.leftButtons ?? [])]);
        }

        return (
            <div
                ref={this.container}
                style={siteContainerStyle}
                className={(siteContainerClass ?? 'site') + (visible ? ' visible' : ' hidden')}
            >
                <div ref={this.child}>
                    <SiteContainerContext.Provider value={this}>
                        <SiteIdContext.Provider value={id}>
                            <VisibleContext.Provider value={visible}>
                                <TopBar {...defaultTopBarOptions} {...(topBarOptions as TopBarOptions)} />
                                <Container fluid="xxl">
                                    <Base {...siteProps} />
                                </Container>
                            </VisibleContext.Provider>
                        </SiteIdContext.Provider>
                    </SiteContainerContext.Provider>
                </div>
            </div>
        );
    }

    updateTopBarOptions(newOptions: TopBarOptionsWithButtonFunctions) {
        const { topBarOptions } = this.state;
        this.setState({
            topBarOptions: {
                ...topBarOptions,
                ...newOptions,
            },
        });
    }
}
