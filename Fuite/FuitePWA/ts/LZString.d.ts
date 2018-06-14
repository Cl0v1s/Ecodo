interface LZString {
    compress(str: string): string;
    decompress(str: string): string;
}

declare var LZString: LZString;