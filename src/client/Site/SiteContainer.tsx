import * as React from 'react';
import { createRef } from 'react';
import { SiteIdContext } from '../App/SiteIdContext';
import { VisibleContext } from '../App/VisibleContext';
import { TopBar, TopBarProps } from './TopBar/TopBar';
import { SiteContainerContext } from '../App/Hooks';
import { Container, Override, Block, withMemo, TopBarButtonType, Flex } from '@ainias42/react-bootstrap-mobile';
import { FooterButton } from './Footer/Footer';

import styles from './siteContainer.scss';

export const initialTopBarOptions: TopBarProps = {
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

export type TopBarOptions = Partial<TopBarProps>;
export type TopBarOptionsWithButtonFunctions = Partial<
    Override<
        TopBarProps,
        {
            rightButtons: TopBarButtonType[] | ((defaultButtons: TopBarButtonType[]) => TopBarButtonType[]);
            leftButtons: TopBarButtonType[] | ((defaultButtons: TopBarButtonType[]) => TopBarButtonType[]);
        }
    >
>;
export type FooterOptions = Partial<typeof initialFooterOptions & { activeTab: number }>;

const initialState = {
    topBarOptions: {} as TopBarOptionsWithButtonFunctions,
    useFullWidth: false,
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

class SiteContainer<SitePropsType> extends React.PureComponent<Props<SitePropsType>, State> {
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

        const { topBarOptions, useFullWidth } = this.state;

        if (typeof topBarOptions.rightButtons === 'function') {
            topBarOptions.rightButtons = topBarOptions.rightButtons([...(defaultTopBarOptions.rightButtons ?? [])]);
        }
        if (typeof topBarOptions.leftButtons === 'function') {
            topBarOptions.leftButtons = topBarOptions.leftButtons([...(defaultTopBarOptions.leftButtons ?? [])]);
        }

        return (
            <Block
                ref={this.container}
                style={siteContainerStyle}
                className={`${siteContainerClass ?? styles.site} ${visible ? '' : styles.hidden}`}
            >
                <Block ref={this.child}>
                    <SiteContainerContext.Provider value={this}>
                        <SiteIdContext.Provider value={id}>
                            <VisibleContext.Provider value={visible}>
                                <TopBar {...defaultTopBarOptions} {...(topBarOptions as TopBarOptions)} />
                                <Flex className={styles.container}>
                                    <Container fluid="xxl" className={useFullWidth ? styles.fullWidth : undefined}>
                                        {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
                                        {/* @ts-ignore */}
                                        <Base {...siteProps} />
                                    </Container>
                                </Flex>
                            </VisibleContext.Provider>
                        </SiteIdContext.Provider>
                    </SiteContainerContext.Provider>
                </Block>
            </Block>
        );
    }

    setUseFullWidth(useFullWidth: boolean) {
        this.setState({ useFullWidth });
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

export type SiteContainerType<T> = SiteContainer<T>;
const SiteContainerMemo = withMemo(SiteContainer, styles);
export { SiteContainerMemo as SiteContainer };
