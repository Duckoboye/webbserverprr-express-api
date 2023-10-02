import { readFileSync, writeFileSync } from 'fs';

// Function to read a JSON file and parse its content.
export function readFile(path: string): any {
    return JSON.parse(readFileSync(path).toString());
}

// Function to change and update a name property in a JSON file.
export function ChangeName(name: string, path: string): any {
    const file: any = readFile(path);
    file.name = name;
    writeFileSync(path, JSON.stringify(file));
    return file;
}