import { Wordlist } from './hdnode';
declare class LangEn extends Wordlist {
    constructor();
    getWord(index: number): string;
    getWordIndex(word: string): number;
}
declare const langEn: LangEn;
export { langEn };
