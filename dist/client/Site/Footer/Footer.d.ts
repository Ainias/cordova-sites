/// <reference types="react" />
import { TabBarButtonType } from '@ainias42/react-bootstrap-mobile';
export type FooterButton = TabBarButtonType & {
    onClick?: () => void;
};
export type FooterProps = {
    buttons: FooterButton[];
    visible?: boolean;
    activeTab?: number;
};
declare function Footer({ buttons, visible, activeTab }: FooterProps): JSX.Element | null;
declare const FooterMemo: typeof Footer;
export { FooterMemo as Footer };
