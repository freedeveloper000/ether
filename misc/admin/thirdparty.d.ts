declare module "aes-js" {
    export class Counter {
        constructor(iv: Uint8Array);
    }
    export namespace ModeOfOperation {
        class cbc{
            constructor(key: Uint8Array, iv: Uint8Array);
            decrypt(data: Uint8Array): Uint8Array;
            encrypt(data: Uint8Array): Uint8Array;
        }
        class ctr{
            constructor(key: Uint8Array, counter: Counter);
            decrypt(data: Uint8Array): Uint8Array;
            encrypt(data: Uint8Array): Uint8Array;
        }
    }
    export namespace padding {
        export namespace pkcs7 {
            export function strip(data: Uint8Array): Uint8Array;
        }
    }
}

declare module "tar" {
    export type CreateOptions = {
        sync?: boolean,
        cwd?: string,
        prefix?: string,
        gzip?: boolean,
        portable?: boolean,
        mtime?: Date
    };

    export interface Readable {
        read(): Buffer;
    }

    export function create(options: CreateOptions, files: Array<string>): Readable;
}
