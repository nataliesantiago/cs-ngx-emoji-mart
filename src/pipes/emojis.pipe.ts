import { Pipe, PipeTransform, Inject } from '@angular/core';

import { emojis, EmojiService } from '@ctrl/ngx-emoji-mart/ngx-emoji';


@Pipe({
    name: 'replaceEmojis'
})
export class ReplaceEmojisPipe implements PipeTransform {
    public static readonly DEFAULT_SHEET = 'apple';
    public static readonly DEFAULT_IMAGE_SIZE = 22;
    public static readonly DEFAULT_SHEET_SIZE = 64;
    private static cachedEmojiRegex: RegExp;


    /**
     * Utility method to get all text node descendants of a DOM node
     * @param node the DOM node to get text nodes for
     */
    public static getAllTextNodes(node: Node) {
        const all = [];
        for (node = node.firstChild; node; node = node.nextSibling) {
            if (node.nodeType === Node.TEXT_NODE) {
                all.push(node);
            } else {
                all.push(...ReplaceEmojisPipe.getAllTextNodes(node));
            }
        }
        return all;
    }

    constructor(private emojiService: EmojiService) { }

    /**
     * Pipe transform entry point
     * @param {string} texto HTML to parse
     */
    public transform(
        texto: string
    ): string {

        let palabras = texto.split(' ');
        palabras.forEach(p => {
            p = this.findEmojiData(p);
        });
        return palabras.join(' ');

    }


	/**
	 * Find raw emoji-mart data for a specific emoji hex code
	 * @param hexCode String representation of the emoji hex code
	 */
    private findEmojiData(hexCode: string): string {
        let emoji = '';
        for (const emojiData of emojis) {

            if (emojiData.text === hexCode) {
                return this.emojiService.unifiedToNative(emojiData.unified);
            }

        }
    }


}
