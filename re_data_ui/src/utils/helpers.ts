export const stripQuotes = (str: string) => {
    return str.replaceAll('"', '');
};

export const extractComponentsFromModelIdentifier = (identifier: string): Array<string> => {
    return identifier.split('.');
};
