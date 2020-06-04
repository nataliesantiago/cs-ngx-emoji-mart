import * as tslib_1 from "tslib";
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, Output, QueryList, ViewChild, ViewChildren, } from '@angular/core';
import { categories, } from '@ctrl/ngx-emoji-mart/ngx-emoji';
import { EmojiFrequentlyService } from './emoji-frequently.service';
import { PreviewComponent } from './preview.component';
import { SearchComponent } from './search.component';
import * as icons from './svgs';
import { measureScrollbar } from './utils';
const I18N = {
    search: 'Search',
    emojilist: 'List of emoji',
    notfound: 'No Emoji Found',
    clear: 'Clear',
    categories: {
        search: 'Search Results',
        recent: 'Frequently Used',
        people: 'Smileys & People',
        nature: 'Animals & Nature',
        foods: 'Food & Drink',
        activity: 'Activity',
        places: 'Travel & Places',
        objects: 'Objects',
        symbols: 'Symbols',
        flags: 'Flags',
        custom: 'Custom',
    },
    skintones: {
        1: 'Default Skin Tone',
        2: 'Light Skin Tone',
        3: 'Medium-Light Skin Tone',
        4: 'Medium Skin Tone',
        5: 'Medium-Dark Skin Tone',
        6: 'Dark Skin Tone',
    },
};
let PickerComponent = class PickerComponent {
    constructor(ref, frequently) {
        this.ref = ref;
        this.frequently = frequently;
        this.perLine = 9;
        this.totalFrequentLines = 4;
        this.i18n = {};
        this.style = {};
        this.title = 'Emoji Mart™';
        this.emoji = 'department_store';
        this.color = '#ae65c5';
        this.hideObsolete = true;
        /** all categories shown */
        this.categories = [];
        /** used to temporarily draw categories */
        this.activeCategories = [];
        this.set = 'apple';
        this.skin = 1;
        /** Renders the native unicode emoji */
        this.isNative = false;
        this.emojiSize = 24;
        this.sheetSize = 64;
        this.showPreview = true;
        this.emojiTooltip = false;
        this.autoFocus = false;
        this.custom = [];
        this.hideRecent = true;
        this.notFoundEmoji = 'sleuth_or_spy';
        this.categoriesIcons = icons.categories;
        this.searchIcons = icons.search;
        this.showSingleCategory = false;
        this.emojiClick = new EventEmitter();
        this.emojiSelect = new EventEmitter();
        this.skinChange = new EventEmitter();
        this.scrollHeight = 0;
        this.clientHeight = 0;
        this.firstRender = true;
        this.NAMESPACE = 'emoji-mart';
        this.measureScrollbar = 0;
        this.RECENT_CATEGORY = {
            id: 'recent',
            name: 'Recent',
            emojis: null,
        };
        this.SEARCH_CATEGORY = {
            id: 'search',
            name: 'Search',
            emojis: null,
            anchor: false,
        };
        this.CUSTOM_CATEGORY = {
            id: 'custom',
            name: 'Custom',
            emojis: [],
        };
        this.backgroundImageFn = (set, sheetSize) => `https://unpkg.com/emoji-datasource-${this.set}@4.0.4/img/${this.set}/sheets-256/${this.sheetSize}.png`;
    }
    ngOnInit() {
        // measure scroll
        this.measureScrollbar = measureScrollbar();
        this.i18n = Object.assign({}, I18N, this.i18n);
        this.i18n.categories = Object.assign({}, I18N.categories, this.i18n.categories);
        this.skin =
            JSON.parse(localStorage.getItem(`${this.NAMESPACE}.skin`) || 'null') ||
                this.skin;
        const allCategories = [...categories];
        if (this.custom.length > 0) {
            this.CUSTOM_CATEGORY.emojis = this.custom.map(emoji => {
                return Object.assign({}, emoji, { 
                    // `<Category />` expects emoji to have an `id`.
                    id: emoji.shortNames[0], custom: true });
            });
            allCategories.push(this.CUSTOM_CATEGORY);
        }
        if (this.include !== undefined) {
            allCategories.sort((a, b) => {
                if (this.include.indexOf(a.id) > this.include.indexOf(b.id)) {
                    return 1;
                }
                return -1;
            });
        }
        for (const category of allCategories) {
            const isIncluded = this.include && this.include.length
                ? this.include.indexOf(category.id) > -1
                : true;
            const isExcluded = this.exclude && this.exclude.length
                ? this.exclude.indexOf(category.id) > -1
                : false;
            if (!isIncluded || isExcluded) {
                continue;
            }
            if (this.emojisToShowFilter) {
                const newEmojis = [];
                const { emojis } = category;
                // tslint:disable-next-line: prefer-for-of
                for (let emojiIndex = 0; emojiIndex < emojis.length; emojiIndex++) {
                    const emoji = emojis[emojiIndex];
                    if (this.emojisToShowFilter(emoji)) {
                        newEmojis.push(emoji);
                    }
                }
                if (newEmojis.length) {
                    const newCategory = {
                        emojis: newEmojis,
                        name: category.name,
                        id: category.id,
                    };
                    this.categories.push(newCategory);
                }
            }
            else {
                this.categories.push(category);
            }
            this.categoriesIcons = Object.assign({}, icons.categories, this.categoriesIcons);
            this.searchIcons = Object.assign({}, icons.search, this.searchIcons);
        }
        const includeRecent = this.include && this.include.length
            ? this.include.indexOf(this.RECENT_CATEGORY.id) > -1
            : true;
        const excludeRecent = this.exclude && this.exclude.length
            ? this.exclude.indexOf(this.RECENT_CATEGORY.id) > -1
            : false;
        if (includeRecent && !excludeRecent) {
            this.hideRecent = false;
            this.categories.unshift(this.RECENT_CATEGORY);
        }
        if (this.categories[0]) {
            this.categories[0].first = true;
        }
        this.categories.unshift(this.SEARCH_CATEGORY);
        this.selected = this.categories.filter(category => category.first)[0].name;
        const categoriesToLoadFirst = 3;
        this.setActiveCategories(this.activeCategories = this.categories.slice(0, categoriesToLoadFirst));
        // Trim last active category
        const lastActiveCategoryEmojis = this.categories[categoriesToLoadFirst - 1].emojis.slice();
        this.categories[categoriesToLoadFirst - 1].emojis = lastActiveCategoryEmojis.slice(0, 60);
        this.ref.markForCheck();
        setTimeout(() => {
            // Restore last category
            this.categories[categoriesToLoadFirst - 1].emojis = lastActiveCategoryEmojis;
            this.setActiveCategories(this.categories);
            this.ref.markForCheck();
            setTimeout(() => this.updateCategoriesSize());
        });
    }
    setActiveCategories(categoriesToMakeActive) {
        if (this.showSingleCategory) {
            this.activeCategories = categoriesToMakeActive.filter(x => x.name === this.selected);
        }
        else {
            this.activeCategories = categoriesToMakeActive;
        }
    }
    updateCategoriesSize() {
        this.categoryRefs.forEach(component => component.memoizeSize());
        if (this.scrollRef) {
            const target = this.scrollRef.nativeElement;
            this.scrollHeight = target.scrollHeight;
            this.clientHeight = target.clientHeight;
        }
    }
    handleAnchorClick($event) {
        this.updateCategoriesSize();
        this.selected = $event.category.name;
        this.setActiveCategories(this.categories);
        if (this.SEARCH_CATEGORY.emojis) {
            this.handleSearch(null);
            this.searchRef.clear();
            this.handleAnchorClick($event);
            return;
        }
        const component = this.categoryRefs.find(n => n.id === $event.category.id);
        if (component) {
            let { top } = component;
            if ($event.category.first) {
                top = 0;
            }
            else {
                top += 1;
            }
            this.scrollRef.nativeElement.scrollTop = top;
        }
        this.selected = $event.category.name;
        this.nextScroll = $event.category.name;
    }
    categoryTrack(index, item) {
        return item.id;
    }
    handleScroll() {
        if (this.nextScroll) {
            this.selected = this.nextScroll;
            this.nextScroll = undefined;
            return;
        }
        if (!this.scrollRef) {
            return;
        }
        if (this.showSingleCategory) {
            return;
        }
        let activeCategory = null;
        if (this.SEARCH_CATEGORY.emojis) {
            activeCategory = this.SEARCH_CATEGORY;
        }
        else {
            const target = this.scrollRef.nativeElement;
            // check scroll is not at bottom
            if (target.scrollTop === 0) {
                // hit the TOP
                activeCategory = this.categories.find(n => n.first === true);
            }
            else if (target.scrollHeight - target.scrollTop === this.clientHeight) {
                // scrolled to bottom activate last category
                activeCategory = this.categories[this.categories.length - 1];
            }
            else {
                // scrolling
                for (const category of this.categories) {
                    const component = this.categoryRefs.find(n => n.id === category.id);
                    const active = component.handleScroll(target.scrollTop);
                    if (active) {
                        activeCategory = category;
                    }
                }
            }
            this.scrollTop = target.scrollTop;
        }
        if (activeCategory) {
            this.selected = activeCategory.name;
        }
    }
    handleSearch($emojis) {
        this.SEARCH_CATEGORY.emojis = $emojis;
        for (const component of this.categoryRefs.toArray()) {
            if (component.name === 'Search') {
                component.emojis = $emojis;
                component.updateDisplay($emojis ? 'block' : 'none');
            }
            else {
                component.updateDisplay($emojis ? 'none' : 'block');
            }
        }
        this.scrollRef.nativeElement.scrollTop = 0;
        this.handleScroll();
    }
    handleEnterKey($event, emoji) {
        if (!emoji) {
            if (this.SEARCH_CATEGORY.emojis !== null && this.SEARCH_CATEGORY.emojis.length) {
                emoji = this.SEARCH_CATEGORY.emojis[0];
                if (emoji) {
                    this.emojiSelect.emit({ $event, emoji });
                }
                else {
                    return;
                }
            }
        }
        if (!this.hideRecent && !this.recent) {
            this.frequently.add(emoji);
        }
        const component = this.categoryRefs.toArray()[1];
        if (component) {
            component.getEmojis();
            component.ref.markForCheck();
        }
    }
    handleEmojiOver($event) {
        if (!this.showPreview || !this.previewRef) {
            return;
        }
        const emojiData = this.CUSTOM_CATEGORY.emojis.find(customEmoji => customEmoji.id === $event.emoji.id);
        if (emojiData) {
            $event.emoji = Object.assign({}, emojiData);
        }
        this.previewEmoji = $event.emoji;
        clearTimeout(this.leaveTimeout);
    }
    handleEmojiLeave() {
        if (!this.showPreview || !this.previewRef) {
            return;
        }
        this.leaveTimeout = setTimeout(() => {
            this.previewEmoji = null;
            this.previewRef.ref.markForCheck();
        }, 16);
    }
    handleEmojiClick($event) {
        this.emojiClick.emit($event);
        this.emojiSelect.emit($event);
        this.handleEnterKey($event.$event, $event.emoji);
    }
    handleSkinChange(skin) {
        this.skin = skin;
        localStorage.setItem(`${this.NAMESPACE}.skin`, String(skin));
        this.skinChange.emit(skin);
    }
    getWidth() {
        if (this.style.width) {
            return this.style.width;
        }
        return this.perLine * (this.emojiSize + 12) + 12 + 2 + this.measureScrollbar + 'px';
    }
};
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Object)
], PickerComponent.prototype, "perLine", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Object)
], PickerComponent.prototype, "totalFrequentLines", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Object)
], PickerComponent.prototype, "i18n", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Object)
], PickerComponent.prototype, "style", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Object)
], PickerComponent.prototype, "title", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Object)
], PickerComponent.prototype, "emoji", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Object)
], PickerComponent.prototype, "color", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Object)
], PickerComponent.prototype, "hideObsolete", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Array)
], PickerComponent.prototype, "categories", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Array)
], PickerComponent.prototype, "activeCategories", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Object)
], PickerComponent.prototype, "set", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Object)
], PickerComponent.prototype, "skin", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Object)
], PickerComponent.prototype, "isNative", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Object)
], PickerComponent.prototype, "emojiSize", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Object)
], PickerComponent.prototype, "sheetSize", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Function)
], PickerComponent.prototype, "emojisToShowFilter", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Object)
], PickerComponent.prototype, "showPreview", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Object)
], PickerComponent.prototype, "emojiTooltip", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Object)
], PickerComponent.prototype, "autoFocus", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Array)
], PickerComponent.prototype, "custom", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Object)
], PickerComponent.prototype, "hideRecent", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Array)
], PickerComponent.prototype, "include", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Array)
], PickerComponent.prototype, "exclude", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Object)
], PickerComponent.prototype, "notFoundEmoji", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Object)
], PickerComponent.prototype, "categoriesIcons", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Object)
], PickerComponent.prototype, "searchIcons", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Object)
], PickerComponent.prototype, "showSingleCategory", void 0);
tslib_1.__decorate([
    Output(),
    tslib_1.__metadata("design:type", Object)
], PickerComponent.prototype, "emojiClick", void 0);
tslib_1.__decorate([
    Output(),
    tslib_1.__metadata("design:type", Object)
], PickerComponent.prototype, "emojiSelect", void 0);
tslib_1.__decorate([
    Output(),
    tslib_1.__metadata("design:type", Object)
], PickerComponent.prototype, "skinChange", void 0);
tslib_1.__decorate([
    ViewChild('scrollRef'),
    tslib_1.__metadata("design:type", ElementRef)
], PickerComponent.prototype, "scrollRef", void 0);
tslib_1.__decorate([
    ViewChild('previewRef'),
    tslib_1.__metadata("design:type", PreviewComponent)
], PickerComponent.prototype, "previewRef", void 0);
tslib_1.__decorate([
    ViewChild('searchRef'),
    tslib_1.__metadata("design:type", SearchComponent)
], PickerComponent.prototype, "searchRef", void 0);
tslib_1.__decorate([
    ViewChildren('categoryRef'),
    tslib_1.__metadata("design:type", QueryList)
], PickerComponent.prototype, "categoryRefs", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Object)
], PickerComponent.prototype, "backgroundImageFn", void 0);
PickerComponent = tslib_1.__decorate([
    Component({
        selector: 'emoji-mart',
        template: "<div class=\"emoji-mart\"\n  [style.width]=\"getWidth()\"\n  [ngStyle]=\"style\">\n  <div class=\"emoji-mart-bar\">\n    <emoji-mart-anchors\n      [categories]=\"categories\"\n      (anchorClick)=\"handleAnchorClick($event)\"\n      [color]=\"color\"\n      [selected]=\"selected\"\n      [i18n]=\"i18n\"\n      [icons]=\"categoriesIcons\"\n    ></emoji-mart-anchors>\n  </div>\n  <emoji-search\n    #searchRef\n    [i18n]=\"i18n\"\n    (searchResults)=\"handleSearch($event)\"\n    (enterKey)=\"handleEnterKey($event)\"\n    [include]=\"include\"\n    [exclude]=\"exclude\"\n    [custom]=\"custom\"\n    [autoFocus]=\"autoFocus\"\n    [icons]=\"searchIcons\"\n    [emojisToShowFilter]=\"emojisToShowFilter\"\n  ></emoji-search>\n  <section #scrollRef class=\"emoji-mart-scroll\" (scroll)=\"handleScroll()\" [attr.aria-label]=\"i18n.emojilist\">\n    <emoji-category\n      *ngFor=\"let category of activeCategories; let idx = index; trackBy: categoryTrack\"\n      #categoryRef\n      [id]=\"category.id\"\n      [name]=\"category.name\"\n      [emojis]=\"category.emojis\"\n      [perLine]=\"perLine\"\n      [totalFrequentLines]=\"totalFrequentLines\"\n      [hasStickyPosition]=\"isNative\"\n      [i18n]=\"i18n\"\n      [hideObsolete]=\"hideObsolete\"\n      [notFoundEmoji]=\"notFoundEmoji\"\n      [custom]=\"category.id == RECENT_CATEGORY.id ? CUSTOM_CATEGORY.emojis : undefined\"\n      [recent]=\"category.id == RECENT_CATEGORY.id ? recent : undefined\"\n      [emojiIsNative]=\"isNative\"\n      [emojiSkin]=\"skin\"\n      [emojiSize]=\"emojiSize\"\n      [emojiSet]=\"set\"\n      [emojiSheetSize]=\"sheetSize\"\n      [emojiForceSize]=\"isNative\"\n      [emojiTooltip]=\"emojiTooltip\"\n      [emojiBackgroundImageFn]=\"backgroundImageFn\"\n      (emojiOver)=\"handleEmojiOver($event)\"\n      (emojiLeave)=\"handleEmojiLeave()\"\n      (emojiClick)=\"handleEmojiClick($event)\"\n    ></emoji-category>\n  </section>\n  <div class=\"emoji-mart-bar\" *ngIf=\"showPreview\">\n    <emoji-preview\n      #previewRef\n      [title]=\"title\"\n      [emoji]=\"previewEmoji\"\n      [idleEmoji]=\"emoji\"\n      [emojiIsNative]=\"isNative\"\n      [emojiSize]=\"38\"\n      [emojiSkin]=\"skin\"\n      [emojiSet]=\"set\"\n      [i18n]=\"i18n\"\n      [emojiSheetSize]=\"sheetSize\"\n      [emojiBackgroundImageFn]=\"backgroundImageFn\"\n      (skinChange)=\"handleSkinChange($event)\"\n    ></emoji-preview>\n  </div>\n</div>\n",
        changeDetection: ChangeDetectionStrategy.OnPush,
        preserveWhitespaces: false
    }),
    tslib_1.__metadata("design:paramtypes", [ChangeDetectorRef,
        EmojiFrequentlyService])
], PickerComponent);
export { PickerComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGlja2VyLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BjdHJsL25neC1lbW9qaS1tYXJ0LyIsInNvdXJjZXMiOlsicGlja2VyLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsT0FBTyxFQUNMLHVCQUF1QixFQUN2QixpQkFBaUIsRUFDakIsU0FBUyxFQUNULFVBQVUsRUFDVixZQUFZLEVBQ1osS0FBSyxFQUVMLE1BQU0sRUFDTixTQUFTLEVBQ1QsU0FBUyxFQUNULFlBQVksR0FDYixNQUFNLGVBQWUsQ0FBQztBQUV2QixPQUFPLEVBQ0wsVUFBVSxHQUtYLE1BQU0sZ0NBQWdDLENBQUM7QUFFeEMsT0FBTyxFQUFFLHNCQUFzQixFQUFFLE1BQU0sNEJBQTRCLENBQUM7QUFDcEUsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0scUJBQXFCLENBQUM7QUFDdkQsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLG9CQUFvQixDQUFDO0FBQ3JELE9BQU8sS0FBSyxLQUFLLE1BQU0sUUFBUSxDQUFDO0FBQ2hDLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLFNBQVMsQ0FBQztBQUkzQyxNQUFNLElBQUksR0FBUTtJQUNoQixNQUFNLEVBQUUsUUFBUTtJQUNoQixTQUFTLEVBQUUsZUFBZTtJQUMxQixRQUFRLEVBQUUsZ0JBQWdCO0lBQzFCLEtBQUssRUFBRSxPQUFPO0lBQ2QsVUFBVSxFQUFFO1FBQ1YsTUFBTSxFQUFFLGdCQUFnQjtRQUN4QixNQUFNLEVBQUUsaUJBQWlCO1FBQ3pCLE1BQU0sRUFBRSxrQkFBa0I7UUFDMUIsTUFBTSxFQUFFLGtCQUFrQjtRQUMxQixLQUFLLEVBQUUsY0FBYztRQUNyQixRQUFRLEVBQUUsVUFBVTtRQUNwQixNQUFNLEVBQUUsaUJBQWlCO1FBQ3pCLE9BQU8sRUFBRSxTQUFTO1FBQ2xCLE9BQU8sRUFBRSxTQUFTO1FBQ2xCLEtBQUssRUFBRSxPQUFPO1FBQ2QsTUFBTSxFQUFFLFFBQVE7S0FDakI7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c0JBQXNCO0dBN0VqQyxlQUFlLENBcVczQjtTQXJXWSxlQUFlIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gIENoYW5nZURldGVjdG9yUmVmLFxuICBDb21wb25lbnQsXG4gIEVsZW1lbnRSZWYsXG4gIEV2ZW50RW1pdHRlcixcbiAgSW5wdXQsXG4gIE9uSW5pdCxcbiAgT3V0cHV0LFxuICBRdWVyeUxpc3QsXG4gIFZpZXdDaGlsZCxcbiAgVmlld0NoaWxkcmVuLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHtcbiAgY2F0ZWdvcmllcyxcbiAgRW1vamksXG4gIEVtb2ppQ2F0ZWdvcnksXG4gIEVtb2ppRGF0YSxcbiAgRW1vamlFdmVudCxcbn0gZnJvbSAnQGN0cmwvbmd4LWVtb2ppLW1hcnQvbmd4LWVtb2ppJztcbmltcG9ydCB7IENhdGVnb3J5Q29tcG9uZW50IH0gZnJvbSAnLi9jYXRlZ29yeS5jb21wb25lbnQnO1xuaW1wb3J0IHsgRW1vamlGcmVxdWVudGx5U2VydmljZSB9IGZyb20gJy4vZW1vamktZnJlcXVlbnRseS5zZXJ2aWNlJztcbmltcG9ydCB7IFByZXZpZXdDb21wb25lbnQgfSBmcm9tICcuL3ByZXZpZXcuY29tcG9uZW50JztcbmltcG9ydCB7IFNlYXJjaENvbXBvbmVudCB9IGZyb20gJy4vc2VhcmNoLmNvbXBvbmVudCc7XG5pbXBvcnQgKiBhcyBpY29ucyBmcm9tICcuL3N2Z3MnO1xuaW1wb3J0IHsgbWVhc3VyZVNjcm9sbGJhciB9IGZyb20gJy4vdXRpbHMnO1xuXG5cblxuY29uc3QgSTE4TjogYW55ID0ge1xuICBzZWFyY2g6ICdTZWFyY2gnLFxuICBlbW9qaWxpc3Q6ICdMaXN0IG9mIGVtb2ppJyxcbiAgbm90Zm91bmQ6ICdObyBFbW9qaSBGb3VuZCcsXG4gIGNsZWFyOiAnQ2xlYXInLFxuICBjYXRlZ29yaWVzOiB7XG4gICAgc2VhcmNoOiAnU2VhcmNoIFJlc3VsdHMnLFxuICAgIHJlY2VudDogJ0ZyZXF1ZW50bHkgVXNlZCcsXG4gICAgcGVvcGxlOiAnU21pbGV5cyAmIFBlb3BsZScsXG4gICAgbmF0dXJlOiAnQW5pbWFscyAmIE5hdHVyZScsXG4gICAgZm9vZHM6ICdGb29kICYgRHJpbmsnLFxuICAgIGFjdGl2aXR5OiAnQWN0aXZpdHknLFxuICAgIHBsYWNlczogJ1RyYXZlbCAmIFBsYWNlcycsXG4gICAgb2JqZWN0czogJ09iamVjdHMnLFxuICAgIHN5bWJvbHM6ICdTeW1ib2xzJyxcbiAgICBmbGFnczogJ0ZsYWdzJyxcbiAgICBjdXN0b206ICdDdXN0b20nLFxuICB9LFxuICBza2ludG9uZXM6IHtcbiAgICAxOiAnRGVmYXVsdCBTa2luIFRvbmUnLFxuICAgIDI6ICdMaWdodCBTa2luIFRvbmUnLFxuICAgIDM6ICdNZWRpdW0tTGlnaHQgU2tpbiBUb25lJyxcbiAgICA0OiAnTWVkaXVtIFNraW4gVG9uZScsXG4gICAgNTogJ01lZGl1bS1EYXJrIFNraW4gVG9uZScsXG4gICAgNjogJ0RhcmsgU2tpbiBUb25lJyxcbiAgfSxcbn07XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2Vtb2ppLW1hcnQnLFxuICB0ZW1wbGF0ZVVybDogJy4vcGlja2VyLmNvbXBvbmVudC5odG1sJyxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG4gIHByZXNlcnZlV2hpdGVzcGFjZXM6IGZhbHNlLFxufSlcbmV4cG9ydCBjbGFzcyBQaWNrZXJDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xuICBASW5wdXQoKSBwZXJMaW5lID0gOTtcbiAgQElucHV0KCkgdG90YWxGcmVxdWVudExpbmVzID0gNDtcbiAgQElucHV0KCkgaTE4bjogYW55ID0ge307XG4gIEBJbnB1dCgpIHN0eWxlOiBhbnkgPSB7fTtcbiAgQElucHV0KCkgdGl0bGUgPSAnRW1vamkgTWFydOKEoic7XG4gIEBJbnB1dCgpIGVtb2ppID0gJ2RlcGFydG1lbnRfc3RvcmUnO1xuICBASW5wdXQoKSBjb2xvciA9ICcjYWU2NWM1JztcbiAgQElucHV0KCkgaGlkZU9ic29sZXRlID0gdHJ1ZTtcbiAgLyoqIGFsbCBjYXRlZ29yaWVzIHNob3duICovXG4gIEBJbnB1dCgpIGNhdGVnb3JpZXM6IEVtb2ppQ2F0ZWdvcnlbXSA9IFtdO1xuICAvKiogdXNlZCB0byB0ZW1wb3JhcmlseSBkcmF3IGNhdGVnb3JpZXMgKi9cbiAgQElucHV0KCkgYWN0aXZlQ2F0ZWdvcmllczogRW1vamlDYXRlZ29yeVtdID0gW107XG4gIEBJbnB1dCgpIHNldDogRW1vamlbJ3NldCddID0gJ2FwcGxlJztcbiAgQElucHV0KCkgc2tpbjogRW1vamlbJ3NraW4nXSA9IDE7XG4gIC8qKiBSZW5kZXJzIHRoZSBuYXRpdmUgdW5pY29kZSBlbW9qaSAqL1xuICBASW5wdXQoKSBpc05hdGl2ZTogRW1vamlbJ2lzTmF0aXZlJ10gPSBmYWxzZTtcbiAgQElucHV0KCkgZW1vamlTaXplOiBFbW9qaVsnc2l6ZSddID0gMjQ7XG4gIEBJbnB1dCgpIHNoZWV0U2l6ZTogRW1vamlbJ3NoZWV0U2l6ZSddID0gNjQ7XG4gIEBJbnB1dCgpIGVtb2ppc1RvU2hvd0ZpbHRlcj86ICh4OiBzdHJpbmcpID0+IGJvb2xlYW47XG4gIEBJbnB1dCgpIHNob3dQcmV2aWV3ID0gdHJ1ZTtcbiAgQElucHV0KCkgZW1vamlUb29sdGlwID0gZmFsc2U7XG4gIEBJbnB1dCgpIGF1dG9Gb2N1cyA9IGZhbHNlO1xuICBASW5wdXQoKSBjdXN0b206IGFueVtdID0gW107XG4gIEBJbnB1dCgpIGhpZGVSZWNlbnQgPSB0cnVlO1xuICBASW5wdXQoKSBpbmNsdWRlPzogc3RyaW5nW107XG4gIEBJbnB1dCgpIGV4Y2x1ZGU/OiBzdHJpbmdbXTtcbiAgQElucHV0KCkgbm90Rm91bmRFbW9qaSA9ICdzbGV1dGhfb3Jfc3B5JztcbiAgQElucHV0KCkgY2F0ZWdvcmllc0ljb25zID0gaWNvbnMuY2F0ZWdvcmllcztcbiAgQElucHV0KCkgc2VhcmNoSWNvbnMgPSBpY29ucy5zZWFyY2g7XG4gIEBJbnB1dCgpIHNob3dTaW5nbGVDYXRlZ29yeSA9IGZhbHNlO1xuICBAT3V0cHV0KCkgZW1vamlDbGljayA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuICBAT3V0cHV0KCkgZW1vamlTZWxlY3QgPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcbiAgQE91dHB1dCgpIHNraW5DaGFuZ2UgPSBuZXcgRXZlbnRFbWl0dGVyPEVtb2ppWydza2luJ10+KCk7XG4gIEBWaWV3Q2hpbGQoJ3Njcm9sbFJlZicpIHByaXZhdGUgc2Nyb2xsUmVmITogRWxlbWVudFJlZjtcbiAgQFZpZXdDaGlsZCgncHJldmlld1JlZicpIHByaXZhdGUgcHJldmlld1JlZiE6IFByZXZpZXdDb21wb25lbnQ7XG4gIEBWaWV3Q2hpbGQoJ3NlYXJjaFJlZicpIHByaXZhdGUgc2VhcmNoUmVmITogU2VhcmNoQ29tcG9uZW50O1xuICBAVmlld0NoaWxkcmVuKCdjYXRlZ29yeVJlZicpIHByaXZhdGUgY2F0ZWdvcnlSZWZzITogUXVlcnlMaXN0PENhdGVnb3J5Q29tcG9uZW50PjtcbiAgc2Nyb2xsSGVpZ2h0ID0gMDtcbiAgY2xpZW50SGVpZ2h0ID0gMDtcbiAgc2VsZWN0ZWQ/OiBzdHJpbmc7XG4gIG5leHRTY3JvbGw/OiBzdHJpbmc7XG4gIHNjcm9sbFRvcD86IG51bWJlcjtcbiAgZmlyc3RSZW5kZXIgPSB0cnVlO1xuICByZWNlbnQ/OiBzdHJpbmdbXTtcbiAgcHJldmlld0Vtb2ppOiBhbnk7XG4gIGxlYXZlVGltZW91dDogYW55O1xuICBOQU1FU1BBQ0UgPSAnZW1vamktbWFydCc7XG4gIG1lYXN1cmVTY3JvbGxiYXIgPSAwO1xuICBSRUNFTlRfQ0FURUdPUlk6IEVtb2ppQ2F0ZWdvcnkgPSB7XG4gICAgaWQ6ICdyZWNlbnQnLFxuICAgIG5hbWU6ICdSZWNlbnQnLFxuICAgIGVtb2ppczogbnVsbCxcbiAgfTtcbiAgU0VBUkNIX0NBVEVHT1JZOiBFbW9qaUNhdGVnb3J5ID0ge1xuICAgIGlkOiAnc2VhcmNoJyxcbiAgICBuYW1lOiAnU2VhcmNoJyxcbiAgICBlbW9qaXM6IG51bGwsXG4gICAgYW5jaG9yOiBmYWxzZSxcbiAgfTtcbiAgQ1VTVE9NX0NBVEVHT1JZOiBFbW9qaUNhdGVnb3J5ID0ge1xuICAgIGlkOiAnY3VzdG9tJyxcbiAgICBuYW1lOiAnQ3VzdG9tJyxcbiAgICBlbW9qaXM6IFtdLFxuICB9O1xuXG4gIEBJbnB1dCgpXG4gIGJhY2tncm91bmRJbWFnZUZuOiBFbW9qaVsnYmFja2dyb3VuZEltYWdlRm4nXSA9IChcbiAgICBzZXQ6IHN0cmluZyxcbiAgICBzaGVldFNpemU6IG51bWJlcixcbiAgKSA9PlxuICAgIGBodHRwczovL3VucGtnLmNvbS9lbW9qaS1kYXRhc291cmNlLSR7dGhpcy5zZXR9QDQuMC40L2ltZy8ke1xuICAgICAgdGhpcy5zZXRcbiAgICB9L3NoZWV0cy0yNTYvJHt0aGlzLnNoZWV0U2l6ZX0ucG5nYFxuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgcmVmOiBDaGFuZ2VEZXRlY3RvclJlZixcbiAgICBwcml2YXRlIGZyZXF1ZW50bHk6IEVtb2ppRnJlcXVlbnRseVNlcnZpY2UsXG4gICkge31cblxuICBuZ09uSW5pdCgpIHtcbiAgICAvLyBtZWFzdXJlIHNjcm9sbFxuICAgIHRoaXMubWVhc3VyZVNjcm9sbGJhciA9IG1lYXN1cmVTY3JvbGxiYXIoKTtcblxuICAgIHRoaXMuaTE4biA9IHsgLi4uSTE4TiwgLi4udGhpcy5pMThuIH07XG4gICAgdGhpcy5pMThuLmNhdGVnb3JpZXMgPSB7IC4uLkkxOE4uY2F0ZWdvcmllcywgLi4udGhpcy5pMThuLmNhdGVnb3JpZXMgfTtcbiAgICB0aGlzLnNraW4gPVxuICAgICAgSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbShgJHt0aGlzLk5BTUVTUEFDRX0uc2tpbmApIHx8ICdudWxsJykgfHxcbiAgICAgIHRoaXMuc2tpbjtcblxuICAgIGNvbnN0IGFsbENhdGVnb3JpZXMgPSBbLi4uY2F0ZWdvcmllc107XG5cbiAgICBpZiAodGhpcy5jdXN0b20ubGVuZ3RoID4gMCkge1xuICAgICAgdGhpcy5DVVNUT01fQ0FURUdPUlkuZW1vamlzID0gdGhpcy5jdXN0b20ubWFwKGVtb2ppID0+IHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAuLi5lbW9qaSxcbiAgICAgICAgICAvLyBgPENhdGVnb3J5IC8+YCBleHBlY3RzIGVtb2ppIHRvIGhhdmUgYW4gYGlkYC5cbiAgICAgICAgICBpZDogZW1vamkuc2hvcnROYW1lc1swXSxcbiAgICAgICAgICBjdXN0b206IHRydWUsXG4gICAgICAgIH07XG4gICAgICB9KTtcblxuICAgICAgYWxsQ2F0ZWdvcmllcy5wdXNoKHRoaXMuQ1VTVE9NX0NBVEVHT1JZKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5pbmNsdWRlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGFsbENhdGVnb3JpZXMuc29ydCgoYSwgYikgPT4ge1xuICAgICAgICBpZiAodGhpcy5pbmNsdWRlLmluZGV4T2YoYS5pZCkgPiB0aGlzLmluY2x1ZGUuaW5kZXhPZihiLmlkKSkge1xuICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiAtMTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGZvciAoY29uc3QgY2F0ZWdvcnkgb2YgYWxsQ2F0ZWdvcmllcykge1xuICAgICAgY29uc3QgaXNJbmNsdWRlZCA9XG4gICAgICAgIHRoaXMuaW5jbHVkZSAmJiB0aGlzLmluY2x1ZGUubGVuZ3RoXG4gICAgICAgICAgPyB0aGlzLmluY2x1ZGUuaW5kZXhPZihjYXRlZ29yeS5pZCkgPiAtMVxuICAgICAgICAgIDogdHJ1ZTtcbiAgICAgIGNvbnN0IGlzRXhjbHVkZWQgPVxuICAgICAgICB0aGlzLmV4Y2x1ZGUgJiYgdGhpcy5leGNsdWRlLmxlbmd0aFxuICAgICAgICAgID8gdGhpcy5leGNsdWRlLmluZGV4T2YoY2F0ZWdvcnkuaWQpID4gLTFcbiAgICAgICAgICA6IGZhbHNlO1xuICAgICAgaWYgKCFpc0luY2x1ZGVkIHx8IGlzRXhjbHVkZWQpIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLmVtb2ppc1RvU2hvd0ZpbHRlcikge1xuICAgICAgICBjb25zdCBuZXdFbW9qaXMgPSBbXTtcblxuICAgICAgICBjb25zdCB7IGVtb2ppcyB9ID0gY2F0ZWdvcnk7XG4gICAgICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTogcHJlZmVyLWZvci1vZlxuICAgICAgICBmb3IgKGxldCBlbW9qaUluZGV4ID0gMDsgZW1vamlJbmRleCA8IGVtb2ppcy5sZW5ndGg7IGVtb2ppSW5kZXgrKykge1xuICAgICAgICAgIGNvbnN0IGVtb2ppID0gZW1vamlzW2Vtb2ppSW5kZXhdO1xuICAgICAgICAgIGlmICh0aGlzLmVtb2ppc1RvU2hvd0ZpbHRlcihlbW9qaSkpIHtcbiAgICAgICAgICAgIG5ld0Vtb2ppcy5wdXNoKGVtb2ppKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAobmV3RW1vamlzLmxlbmd0aCkge1xuICAgICAgICAgIGNvbnN0IG5ld0NhdGVnb3J5ID0ge1xuICAgICAgICAgICAgZW1vamlzOiBuZXdFbW9qaXMsXG4gICAgICAgICAgICBuYW1lOiBjYXRlZ29yeS5uYW1lLFxuICAgICAgICAgICAgaWQ6IGNhdGVnb3J5LmlkLFxuICAgICAgICAgIH07XG5cbiAgICAgICAgICB0aGlzLmNhdGVnb3JpZXMucHVzaChuZXdDYXRlZ29yeSk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuY2F0ZWdvcmllcy5wdXNoKGNhdGVnb3J5KTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5jYXRlZ29yaWVzSWNvbnMgPSB7IC4uLmljb25zLmNhdGVnb3JpZXMsIC4uLnRoaXMuY2F0ZWdvcmllc0ljb25zIH07XG4gICAgICB0aGlzLnNlYXJjaEljb25zID0geyAuLi5pY29ucy5zZWFyY2gsIC4uLnRoaXMuc2VhcmNoSWNvbnMgfTtcbiAgICB9XG5cbiAgICBjb25zdCBpbmNsdWRlUmVjZW50ID1cbiAgICAgIHRoaXMuaW5jbHVkZSAmJiB0aGlzLmluY2x1ZGUubGVuZ3RoXG4gICAgICAgID8gdGhpcy5pbmNsdWRlLmluZGV4T2YodGhpcy5SRUNFTlRfQ0FURUdPUlkuaWQpID4gLTFcbiAgICAgICAgOiB0cnVlO1xuICAgIGNvbnN0IGV4Y2x1ZGVSZWNlbnQgPVxuICAgICAgdGhpcy5leGNsdWRlICYmIHRoaXMuZXhjbHVkZS5sZW5ndGhcbiAgICAgICAgPyB0aGlzLmV4Y2x1ZGUuaW5kZXhPZih0aGlzLlJFQ0VOVF9DQVRFR09SWS5pZCkgPiAtMVxuICAgICAgICA6IGZhbHNlO1xuICAgIGlmIChpbmNsdWRlUmVjZW50ICYmICFleGNsdWRlUmVjZW50KSB7XG4gICAgICB0aGlzLmhpZGVSZWNlbnQgPSBmYWxzZTtcbiAgICAgIHRoaXMuY2F0ZWdvcmllcy51bnNoaWZ0KHRoaXMuUkVDRU5UX0NBVEVHT1JZKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5jYXRlZ29yaWVzWzBdKSB7XG4gICAgICB0aGlzLmNhdGVnb3JpZXNbMF0uZmlyc3QgPSB0cnVlO1xuICAgIH1cblxuICAgIHRoaXMuY2F0ZWdvcmllcy51bnNoaWZ0KHRoaXMuU0VBUkNIX0NBVEVHT1JZKTtcbiAgICB0aGlzLnNlbGVjdGVkID0gdGhpcy5jYXRlZ29yaWVzLmZpbHRlcihjYXRlZ29yeSA9PiBjYXRlZ29yeS5maXJzdClbMF0ubmFtZTtcblxuICAgIGNvbnN0IGNhdGVnb3JpZXNUb0xvYWRGaXJzdCA9IDM7XG4gICAgdGhpcy5zZXRBY3RpdmVDYXRlZ29yaWVzKHRoaXMuYWN0aXZlQ2F0ZWdvcmllcyA9IHRoaXMuY2F0ZWdvcmllcy5zbGljZSgwLCBjYXRlZ29yaWVzVG9Mb2FkRmlyc3QpKTtcbiAgICAvLyBUcmltIGxhc3QgYWN0aXZlIGNhdGVnb3J5XG4gICAgY29uc3QgbGFzdEFjdGl2ZUNhdGVnb3J5RW1vamlzID0gdGhpcy5jYXRlZ29yaWVzW2NhdGVnb3JpZXNUb0xvYWRGaXJzdCAtIDFdLmVtb2ppcy5zbGljZSgpO1xuICAgIHRoaXMuY2F0ZWdvcmllc1tjYXRlZ29yaWVzVG9Mb2FkRmlyc3QgLSAxXS5lbW9qaXMgPSBsYXN0QWN0aXZlQ2F0ZWdvcnlFbW9qaXMuc2xpY2UoMCwgNjApO1xuXG4gICAgdGhpcy5yZWYubWFya0ZvckNoZWNrKCk7XG5cbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIC8vIFJlc3RvcmUgbGFzdCBjYXRlZ29yeVxuICAgICAgdGhpcy5jYXRlZ29yaWVzW2NhdGVnb3JpZXNUb0xvYWRGaXJzdCAtIDFdLmVtb2ppcyA9IGxhc3RBY3RpdmVDYXRlZ29yeUVtb2ppcztcbiAgICAgIHRoaXMuc2V0QWN0aXZlQ2F0ZWdvcmllcyh0aGlzLmNhdGVnb3JpZXMpO1xuICAgICAgdGhpcy5yZWYubWFya0ZvckNoZWNrKCk7XG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHRoaXMudXBkYXRlQ2F0ZWdvcmllc1NpemUoKSk7XG4gICAgfSk7XG4gIH1cbiAgc2V0QWN0aXZlQ2F0ZWdvcmllcyhjYXRlZ29yaWVzVG9NYWtlQWN0aXZlOiBBcnJheTxFbW9qaUNhdGVnb3J5Pikge1xuICAgIGlmICh0aGlzLnNob3dTaW5nbGVDYXRlZ29yeSkge1xuICAgICAgdGhpcy5hY3RpdmVDYXRlZ29yaWVzID0gY2F0ZWdvcmllc1RvTWFrZUFjdGl2ZS5maWx0ZXIoeCA9PiB4Lm5hbWUgPT09IHRoaXMuc2VsZWN0ZWQpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmFjdGl2ZUNhdGVnb3JpZXMgPSBjYXRlZ29yaWVzVG9NYWtlQWN0aXZlO1xuICAgIH1cbiAgfVxuICB1cGRhdGVDYXRlZ29yaWVzU2l6ZSgpIHtcbiAgICB0aGlzLmNhdGVnb3J5UmVmcy5mb3JFYWNoKGNvbXBvbmVudCA9PiBjb21wb25lbnQubWVtb2l6ZVNpemUoKSk7XG5cbiAgICBpZiAodGhpcy5zY3JvbGxSZWYpIHtcbiAgICAgIGNvbnN0IHRhcmdldCA9IHRoaXMuc2Nyb2xsUmVmLm5hdGl2ZUVsZW1lbnQ7XG4gICAgICB0aGlzLnNjcm9sbEhlaWdodCA9IHRhcmdldC5zY3JvbGxIZWlnaHQ7XG4gICAgICB0aGlzLmNsaWVudEhlaWdodCA9IHRhcmdldC5jbGllbnRIZWlnaHQ7XG4gICAgfVxuICB9XG4gIGhhbmRsZUFuY2hvckNsaWNrKCRldmVudDogeyBjYXRlZ29yeTogRW1vamlDYXRlZ29yeTsgaW5kZXg6IG51bWJlciB9KSB7XG4gICAgdGhpcy51cGRhdGVDYXRlZ29yaWVzU2l6ZSgpO1xuICAgIHRoaXMuc2VsZWN0ZWQgPSAkZXZlbnQuY2F0ZWdvcnkubmFtZTtcbiAgICB0aGlzLnNldEFjdGl2ZUNhdGVnb3JpZXModGhpcy5jYXRlZ29yaWVzKTtcblxuICAgIGlmICh0aGlzLlNFQVJDSF9DQVRFR09SWS5lbW9qaXMpIHtcbiAgICAgIHRoaXMuaGFuZGxlU2VhcmNoKG51bGwpO1xuICAgICAgdGhpcy5zZWFyY2hSZWYuY2xlYXIoKTtcbiAgICAgIHRoaXMuaGFuZGxlQW5jaG9yQ2xpY2soJGV2ZW50KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBjb21wb25lbnQgPSB0aGlzLmNhdGVnb3J5UmVmcy5maW5kKG4gPT4gbi5pZCA9PT0gJGV2ZW50LmNhdGVnb3J5LmlkKTtcbiAgICBpZiAoY29tcG9uZW50KSB7XG4gICAgICBsZXQgeyB0b3AgfSA9IGNvbXBvbmVudDtcblxuICAgICAgaWYgKCRldmVudC5jYXRlZ29yeS5maXJzdCkge1xuICAgICAgICB0b3AgPSAwO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdG9wICs9IDE7XG4gICAgICB9XG4gICAgICB0aGlzLnNjcm9sbFJlZi5uYXRpdmVFbGVtZW50LnNjcm9sbFRvcCA9IHRvcDtcbiAgICB9XG4gICAgdGhpcy5zZWxlY3RlZCA9ICRldmVudC5jYXRlZ29yeS5uYW1lO1xuICAgIHRoaXMubmV4dFNjcm9sbCA9ICRldmVudC5jYXRlZ29yeS5uYW1lO1xuICB9XG4gIGNhdGVnb3J5VHJhY2soaW5kZXg6IG51bWJlciwgaXRlbTogYW55KSB7XG4gICAgcmV0dXJuIGl0ZW0uaWQ7XG4gIH1cbiAgaGFuZGxlU2Nyb2xsKCkge1xuICAgIGlmICh0aGlzLm5leHRTY3JvbGwpIHtcbiAgICAgIHRoaXMuc2VsZWN0ZWQgPSB0aGlzLm5leHRTY3JvbGw7XG4gICAgICB0aGlzLm5leHRTY3JvbGwgPSB1bmRlZmluZWQ7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmICghdGhpcy5zY3JvbGxSZWYpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKHRoaXMuc2hvd1NpbmdsZUNhdGVnb3J5KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgbGV0IGFjdGl2ZUNhdGVnb3J5ID0gbnVsbDtcbiAgICBpZiAodGhpcy5TRUFSQ0hfQ0FURUdPUlkuZW1vamlzKSB7XG4gICAgICBhY3RpdmVDYXRlZ29yeSA9IHRoaXMuU0VBUkNIX0NBVEVHT1JZO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCB0YXJnZXQgPSB0aGlzLnNjcm9sbFJlZi5uYXRpdmVFbGVtZW50O1xuICAgICAgLy8gY2hlY2sgc2Nyb2xsIGlzIG5vdCBhdCBib3R0b21cbiAgICAgIGlmICh0YXJnZXQuc2Nyb2xsVG9wID09PSAwKSB7XG4gICAgICAgIC8vIGhpdCB0aGUgVE9QXG4gICAgICAgIGFjdGl2ZUNhdGVnb3J5ID0gdGhpcy5jYXRlZ29yaWVzLmZpbmQobiA9PiBuLmZpcnN0ID09PSB0cnVlKTtcbiAgICAgIH0gZWxzZSBpZiAodGFyZ2V0LnNjcm9sbEhlaWdodCAtIHRhcmdldC5zY3JvbGxUb3AgPT09IHRoaXMuY2xpZW50SGVpZ2h0KSB7XG4gICAgICAgIC8vIHNjcm9sbGVkIHRvIGJvdHRvbSBhY3RpdmF0ZSBsYXN0IGNhdGVnb3J5XG4gICAgICAgIGFjdGl2ZUNhdGVnb3J5ID0gdGhpcy5jYXRlZ29yaWVzW3RoaXMuY2F0ZWdvcmllcy5sZW5ndGggLSAxXTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIHNjcm9sbGluZ1xuICAgICAgICBmb3IgKGNvbnN0IGNhdGVnb3J5IG9mIHRoaXMuY2F0ZWdvcmllcykge1xuICAgICAgICAgIGNvbnN0IGNvbXBvbmVudCA9IHRoaXMuY2F0ZWdvcnlSZWZzLmZpbmQobiA9PiBuLmlkID09PSBjYXRlZ29yeS5pZCk7XG4gICAgICAgICAgY29uc3QgYWN0aXZlID0gY29tcG9uZW50LmhhbmRsZVNjcm9sbCh0YXJnZXQuc2Nyb2xsVG9wKTtcbiAgICAgICAgICBpZiAoYWN0aXZlKSB7XG4gICAgICAgICAgICBhY3RpdmVDYXRlZ29yeSA9IGNhdGVnb3J5O1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICB0aGlzLnNjcm9sbFRvcCA9IHRhcmdldC5zY3JvbGxUb3A7XG4gICAgfVxuICAgIGlmIChhY3RpdmVDYXRlZ29yeSkge1xuICAgICAgdGhpcy5zZWxlY3RlZCA9IGFjdGl2ZUNhdGVnb3J5Lm5hbWU7XG4gICAgfVxuICB9XG4gIGhhbmRsZVNlYXJjaCgkZW1vamlzOiBhbnlbXSB8IG51bGwpIHtcbiAgICB0aGlzLlNFQVJDSF9DQVRFR09SWS5lbW9qaXMgPSAkZW1vamlzO1xuICAgIGZvciAoY29uc3QgY29tcG9uZW50IG9mIHRoaXMuY2F0ZWdvcnlSZWZzLnRvQXJyYXkoKSkge1xuICAgICAgaWYgKGNvbXBvbmVudC5uYW1lID09PSAnU2VhcmNoJykge1xuICAgICAgICBjb21wb25lbnQuZW1vamlzID0gJGVtb2ppcztcbiAgICAgICAgY29tcG9uZW50LnVwZGF0ZURpc3BsYXkoJGVtb2ppcyA/ICdibG9jaycgOiAnbm9uZScpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29tcG9uZW50LnVwZGF0ZURpc3BsYXkoJGVtb2ppcyA/ICdub25lJyA6ICdibG9jaycpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuc2Nyb2xsUmVmLm5hdGl2ZUVsZW1lbnQuc2Nyb2xsVG9wID0gMDtcbiAgICB0aGlzLmhhbmRsZVNjcm9sbCgpO1xuICB9XG5cbiAgaGFuZGxlRW50ZXJLZXkoJGV2ZW50OiBFdmVudCwgZW1vamk/OiBFbW9qaURhdGEpIHtcbiAgICBpZiAoIWVtb2ppKSB7XG4gICAgICBpZiAodGhpcy5TRUFSQ0hfQ0FURUdPUlkuZW1vamlzICE9PSBudWxsICYmIHRoaXMuU0VBUkNIX0NBVEVHT1JZLmVtb2ppcy5sZW5ndGgpIHtcbiAgICAgICAgZW1vamkgPSB0aGlzLlNFQVJDSF9DQVRFR09SWS5lbW9qaXNbMF07XG4gICAgICAgIGlmIChlbW9qaSkge1xuICAgICAgICAgIHRoaXMuZW1vamlTZWxlY3QuZW1pdCh7ICRldmVudCwgZW1vamkgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLmhpZGVSZWNlbnQgJiYgIXRoaXMucmVjZW50KSB7XG4gICAgICB0aGlzLmZyZXF1ZW50bHkuYWRkKGVtb2ppKTtcbiAgICB9XG5cbiAgICBjb25zdCBjb21wb25lbnQgPSB0aGlzLmNhdGVnb3J5UmVmcy50b0FycmF5KClbMV07XG4gICAgaWYgKGNvbXBvbmVudCkge1xuICAgICAgY29tcG9uZW50LmdldEVtb2ppcygpO1xuICAgICAgY29tcG9uZW50LnJlZi5tYXJrRm9yQ2hlY2soKTtcbiAgICB9XG4gIH1cbiAgaGFuZGxlRW1vamlPdmVyKCRldmVudDogRW1vamlFdmVudCkge1xuICAgIGlmICghdGhpcy5zaG93UHJldmlldyB8fCAhdGhpcy5wcmV2aWV3UmVmKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgZW1vamlEYXRhID0gdGhpcy5DVVNUT01fQ0FURUdPUlkuZW1vamlzLmZpbmQoXG4gICAgICBjdXN0b21FbW9qaSA9PiBjdXN0b21FbW9qaS5pZCA9PT0gJGV2ZW50LmVtb2ppLmlkLFxuICAgICk7XG4gICAgaWYgKGVtb2ppRGF0YSkge1xuICAgICAgJGV2ZW50LmVtb2ppID0geyAuLi5lbW9qaURhdGEgfTtcbiAgICB9XG5cbiAgICB0aGlzLnByZXZpZXdFbW9qaSA9ICRldmVudC5lbW9qaTtcbiAgICBjbGVhclRpbWVvdXQodGhpcy5sZWF2ZVRpbWVvdXQpO1xuICB9XG4gIGhhbmRsZUVtb2ppTGVhdmUoKSB7XG4gICAgaWYgKCF0aGlzLnNob3dQcmV2aWV3IHx8ICF0aGlzLnByZXZpZXdSZWYpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLmxlYXZlVGltZW91dCA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgdGhpcy5wcmV2aWV3RW1vamkgPSBudWxsO1xuICAgICAgdGhpcy5wcmV2aWV3UmVmLnJlZi5tYXJrRm9yQ2hlY2soKTtcbiAgICB9LCAxNik7XG4gIH1cbiAgaGFuZGxlRW1vamlDbGljaygkZXZlbnQ6IEVtb2ppRXZlbnQpIHtcbiAgICB0aGlzLmVtb2ppQ2xpY2suZW1pdCgkZXZlbnQpO1xuICAgIHRoaXMuZW1vamlTZWxlY3QuZW1pdCgkZXZlbnQpO1xuICAgIHRoaXMuaGFuZGxlRW50ZXJLZXkoJGV2ZW50LiRldmVudCwgJGV2ZW50LmVtb2ppKTtcbiAgfVxuICBoYW5kbGVTa2luQ2hhbmdlKHNraW46IEVtb2ppWydza2luJ10pIHtcbiAgICB0aGlzLnNraW4gPSBza2luO1xuICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKGAke3RoaXMuTkFNRVNQQUNFfS5za2luYCwgU3RyaW5nKHNraW4pKTtcbiAgICB0aGlzLnNraW5DaGFuZ2UuZW1pdChza2luKTtcbiAgfVxuICBnZXRXaWR0aCgpOiBzdHJpbmcge1xuICAgIGlmICh0aGlzLnN0eWxlLndpZHRoKSB7XG4gICAgICByZXR1cm4gdGhpcy5zdHlsZS53aWR0aDtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMucGVyTGluZSAqICh0aGlzLmVtb2ppU2l6ZSArIDEyKSArIDEyICsgMiArIHRoaXMubWVhc3VyZVNjcm9sbGJhciArICdweCc7XG4gIH1cbn1cbiJdfQ==