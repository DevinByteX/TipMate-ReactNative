interface ParsedPackage {
    name: string;
    version: string;
}

export const parsePackageName = (packageName: string): ParsedPackage => {
    const lastAtIndex = packageName.lastIndexOf('@');
    return {
        name: packageName.slice(0, lastAtIndex),
        version: packageName.slice(lastAtIndex + 1)
    };
};