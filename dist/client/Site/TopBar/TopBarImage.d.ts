/// <reference types="react" />
export type TopBarImageProps = {
    image: string;
    maxHeight?: string;
};
declare function TopBarImage({ image, maxHeight }: TopBarImageProps): JSX.Element;
declare const TopBarImageMemo: typeof TopBarImage;
export { TopBarImageMemo as TopBarImage };
