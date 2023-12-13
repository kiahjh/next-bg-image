export default function getImageData(inputImages: Array<{
    src: string;
    width: number;
    height: number;
} | string>, lazyLoad: boolean): {
    decls: Array<CssDecl>;
    blurry?: string[];
};
export type CssDecl = {
    images: Array<DeclImage>;
    min: number;
    max: number;
};
export type DeclImage = {
    type: 'url' | 'gradient';
    value: string;
};
export declare function generateMediaQuery(decl: CssDecl, id: string, lazyLoad: boolean, initialWindowWidth: number | null): string;
export declare function lazyCss(blurry: string[] | undefined, id: string, position: Rule, size: Rule): string;
export type TWSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl';
export type Rule = string | ({
    [key in TWSize]?: string;
} & {
    [key in number]: string;
} & {
    default: string;
});
export declare function generateResponsiveRuleCSS(type: 'size' | 'position', rule: Rule, id: string, pseudoSelector?: '::before' | '::after'): string;
