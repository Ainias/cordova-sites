export function encodeUrl(strings: TemplateStringsArray, ...values: (string | number | boolean)[]) {
    let encodedUrl = strings[0];
    values.forEach((val, i) => {
        encodedUrl += encodeURIComponent(val) + strings[i + 1];
    });
    return encodedUrl;
}
