type StaticImageData = {
    src: string;
    height: number;
    width: number;
    placeholder?: string;
};

declare module '*.gif' {
    const content: StaticImageData;
    export default content;
}
