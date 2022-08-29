/// <reference types="react" />
import { TabBarButtonType } from 'react-bootstrap-mobile';
export declare type FooterButton = TabBarButtonType & {
    onClick?: () => void;
};
export declare type FooterProps = {
    buttons: FooterButton[];
    visible?: boolean;
    activeTab?: number;
};
declare function Footer({ buttons, visible, activeTab }: FooterProps): JSX.Element | null;
declare const FooterMemo: typeof Footer;
export { FooterMemo as Footer };
