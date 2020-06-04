import * as tslib_1 from "tslib";
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, Output, QueryList, ViewChild, ViewChildren, } from '@angular/core';
import { categories, } from '@ctrl/ngx-emoji-mart/ngx-emoji';
import { EmojiFrequentlyService } from './emoji-frequently.service';
import { PreviewComponent } from './preview.component';
import { SearchComponent } from './search.component';
import * as icons from './svgs';
import { measureScrollbar } from './utils';
var I18N = {
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
var PickerComponent = /** @class */ (function () {
    function PickerComponent(ref, frequently) {
        var _this = this;
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
        this.backgroundImageFn = function (set, sheetSize) {
            return "https://unpkg.com/emoji-datasource-" + _this.set + "@4.0.4/img/" + _this.set + "/sheets-256/" + _this.sheetSize + ".png";
        };
    }
    PickerComponent.prototype.ngOnInit = function () {
        var _this = this;
        var e_1, _a;
        // measure scroll
        this.measureScrollbar = measureScrollbar();
        this.i18n = tslib_1.__assign({}, I18N, this.i18n);
        this.i18n.categories = tslib_1.__assign({}, I18N.categories, this.i18n.categories);
        this.skin =
            JSON.parse(localStorage.getItem(this.NAMESPACE + ".skin") || 'null') ||
                this.skin;
        var allCategories = tslib_1.__spread(categories);
        if (this.custom.length > 0) {
            this.CUSTOM_CATEGORY.emojis = this.custom.map(function (emoji) {
                return tslib_1.__assign({}, emoji, { 
                    // `<Category />` expects emoji to have an `id`.
                    id: emoji.shortNames[0], custom: true });
            });
            allCategories.push(this.CUSTOM_CATEGORY);
        }
        if (this.include !== undefined) {
            allCategories.sort(function (a, b) {
                if (_this.include.indexOf(a.id) > _this.include.indexOf(b.id)) {
                    return 1;
                }
                return -1;
            });
        }
        try {
            for (var allCategories_1 = tslib_1.__values(allCategories), allCategories_1_1 = allCategories_1.next(); !allCategories_1_1.done; allCategories_1_1 = allCategories_1.next()) {
                var category = allCategories_1_1.value;
                var isIncluded = this.include && this.include.length
                    ? this.include.indexOf(category.id) > -1
                    : true;
                var isExcluded = this.exclude && this.exclude.length
                    ? this.exclude.indexOf(category.id) > -1
                    : false;
                if (!isIncluded || isExcluded) {
                    continue;
                }
                if (this.emojisToShowFilter) {
                    var newEmojis = [];
                    var emojis = category.emojis;
                    // tslint:disable-next-line: prefer-for-of
                    for (var emojiIndex = 0; emojiIndex < emojis.length; emojiIndex++) {
                        var emoji = emojis[emojiIndex];
                        if (this.emojisToShowFilter(emoji)) {
                            newEmojis.push(emoji);
                        }
                    }
                    if (newEmojis.length) {
                        var newCategory = {
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
                this.categoriesIcons = tslib_1.__assign({}, icons.categories, this.categoriesIcons);
                this.searchIcons = tslib_1.__assign({}, icons.search, this.searchIcons);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (allCategories_1_1 && !allCategories_1_1.done && (_a = allCategories_1.return)) _a.call(allCategories_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        var includeRecent = this.include && this.include.length
            ? this.include.indexOf(this.RECENT_CATEGORY.id) > -1
            : true;
        var excludeRecent = this.exclude && this.exclude.length
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
        this.selected = this.categories.filter(function (category) { return category.first; })[0].name;
        var categoriesToLoadFirst = 3;
        this.setActiveCategories(this.activeCategories = this.categories.slice(0, categoriesToLoadFirst));
        // Trim last active category
        var lastActiveCategoryEmojis = this.categories[categoriesToLoadFirst - 1].emojis.slice();
        this.categories[categoriesToLoadFirst - 1].emojis = lastActiveCategoryEmojis.slice(0, 60);
        this.ref.markForCheck();
        setTimeout(function () {
            // Restore last category
            _this.categories[categoriesToLoadFirst - 1].emojis = lastActiveCategoryEmojis;
            _this.setActiveCategories(_this.categories);
            _this.ref.markForCheck();
            setTimeout(function () { return _this.updateCategoriesSize(); });
        });
    };
    PickerComponent.prototype.setActiveCategories = function (categoriesToMakeActive) {
        var _this = this;
        if (this.showSingleCategory) {
            this.activeCategories = categoriesToMakeActive.filter(function (x) { return x.name === _this.selected; });
        }
        else {
            this.activeCategories = categoriesToMakeActive;
        }
    };
    PickerComponent.prototype.updateCategoriesSize = function () {
        this.categoryRefs.forEach(function (component) { return component.memoizeSize(); });
        if (this.scrollRef) {
            var target = this.scrollRef.nativeElement;
            this.scrollHeight = target.scrollHeight;
            this.clientHeight = target.clientHeight;
        }
    };
    PickerComponent.prototype.handleAnchorClick = function ($event) {
        this.updateCategoriesSize();
        this.selected = $event.category.name;
        this.setActiveCategories(this.categories);
        if (this.SEARCH_CATEGORY.emojis) {
            this.handleSearch(null);
            this.searchRef.clear();
            this.handleAnchorClick($event);
            return;
        }
        var component = this.categoryRefs.find(function (n) { return n.id === $event.category.id; });
        if (component) {
            var top_1 = component.top;
            if ($event.category.first) {
                top_1 = 0;
            }
            else {
                top_1 += 1;
            }
            this.scrollRef.nativeElement.scrollTop = top_1;
        }
        this.selected = $event.category.name;
        this.nextScroll = $event.category.name;
    };
    PickerComponent.prototype.categoryTrack = function (index, item) {
        return item.id;
    };
    PickerComponent.prototype.handleScroll = function () {
        var e_2, _a;
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
        var activeCategory = null;
        if (this.SEARCH_CATEGORY.emojis) {
            activeCategory = this.SEARCH_CATEGORY;
        }
        else {
            var target = this.scrollRef.nativeElement;
            // check scroll is not at bottom
            if (target.scrollTop === 0) {
                // hit the TOP
                activeCategory = this.categories.find(function (n) { return n.first === true; });
            }
            else if (target.scrollHeight - target.scrollTop === this.clientHeight) {
                // scrolled to bottom activate last category
                activeCategory = this.categories[this.categories.length - 1];
            }
            else {
                var _loop_1 = function (category) {
                    var component = this_1.categoryRefs.find(function (n) { return n.id === category.id; });
                    var active = component.handleScroll(target.scrollTop);
                    if (active) {
                        activeCategory = category;
                    }
                };
                var this_1 = this;
                try {
                    // scrolling
                    for (var _b = tslib_1.__values(this.categories), _c = _b.next(); !_c.done; _c = _b.next()) {
                        var category = _c.value;
                        _loop_1(category);
                    }
                }
                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                finally {
                    try {
                        if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                    }
                    finally { if (e_2) throw e_2.error; }
                }
            }
            this.scrollTop = target.scrollTop;
        }
        if (activeCategory) {
            this.selected = activeCategory.name;
        }
    };
    PickerComponent.prototype.handleSearch = function ($emojis) {
        var e_3, _a;
        this.SEARCH_CATEGORY.emojis = $emojis;
        try {
            for (var _b = tslib_1.__values(this.categoryRefs.toArray()), _c = _b.next(); !_c.done; _c = _b.next()) {
                var component = _c.value;
                if (component.name === 'Search') {
                    component.emojis = $emojis;
                    component.updateDisplay($emojis ? 'block' : 'none');
                }
                else {
                    component.updateDisplay($emojis ? 'none' : 'block');
                }
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_3) throw e_3.error; }
        }
        this.scrollRef.nativeElement.scrollTop = 0;
        this.handleScroll();
    };
    PickerComponent.prototype.handleEnterKey = function ($event, emoji) {
        if (!emoji) {
            if (this.SEARCH_CATEGORY.emojis !== null && this.SEARCH_CATEGORY.emojis.length) {
                emoji = this.SEARCH_CATEGORY.emojis[0];
                if (emoji) {
                    this.emojiSelect.emit({ $event: $event, emoji: emoji });
                }
                else {
                    return;
                }
            }
        }
        if (!this.hideRecent && !this.recent) {
            this.frequently.add(emoji);
        }
        var component = this.categoryRefs.toArray()[1];
        if (component) {
            component.getEmojis();
            component.ref.markForCheck();
        }
    };
    PickerComponent.prototype.handleEmojiOver = function ($event) {
        if (!this.showPreview || !this.previewRef) {
            return;
        }
        var emojiData = this.CUSTOM_CATEGORY.emojis.find(function (customEmoji) { return customEmoji.id === $event.emoji.id; });
        if (emojiData) {
            $event.emoji = tslib_1.__assign({}, emojiData);
        }
        this.previewEmoji = $event.emoji;
        clearTimeout(this.leaveTimeout);
    };
    PickerComponent.prototype.handleEmojiLeave = function () {
        var _this = this;
        if (!this.showPreview || !this.previewRef) {
            return;
        }
        this.leaveTimeout = setTimeout(function () {
            _this.previewEmoji = null;
            _this.previewRef.ref.markForCheck();
        }, 16);
    };
    PickerComponent.prototype.handleEmojiClick = function ($event) {
        this.emojiClick.emit($event);
        this.emojiSelect.emit($event);
        this.handleEnterKey($event.$event, $event.emoji);
    };
    PickerComponent.prototype.handleSkinChange = function (skin) {
        this.skin = skin;
        localStorage.setItem(this.NAMESPACE + ".skin", String(skin));
        this.skinChange.emit(skin);
    };
    PickerComponent.prototype.getWidth = function () {
        if (this.style.width) {
            return this.style.width;
        }
        return this.perLine * (this.emojiSize + 12) + 12 + 2 + this.measureScrollbar + 'px';
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
    return PickerComponent;
}());
export { PickerComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGlja2VyLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BjdHJsL25neC1lbW9qaS1tYXJ0LyIsInNvdXJjZXMiOlsicGlja2VyLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsT0FBTyxFQUNMLHVCQUF1QixFQUN2QixpQkFBaUIsRUFDakIsU0FBUyxFQUNULFVBQVUsRUFDVixZQUFZLEVBQ1osS0FBSyxFQUVMLE1BQU0sRUFDTixTQUFTLEVBQ1QsU0FBUyxFQUNULFlBQVksR0FDYixNQUFNLGVBQWUsQ0FBQztBQUV2QixPQUFPLEVBQ0wsVUFBVSxHQUtYLE1BQU0sZ0NBQWdDLENBQUM7QUFFeEMsT0FBTyxFQUFFLHNCQUFzQixFQUFFLE1BQU0sNEJBQTRCLENBQUM7QUFDcEUsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0scUJBQXFCLENBQUM7QUFDdkQsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLG9CQUFvQixDQUFDO0FBQ3JELE9BQU8sS0FBSyxLQUFLLE1BQU0sUUFBUSxDQUFDO0FBQ2hDLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLFNBQVMsQ0FBQztBQUkzQyxJQUFNLElBQUksR0FBUTtJQUNoQixNQUFNLEVBQUUsUUFBUTtJQUNoQixTQUFTLEVBQUUsZUFBZTtJQUMxQixRQUFRLEVBQUUsZ0JBQWdCO0lBQzFCLEtBQUssRUFBRSxPQUFPO0lBQ2QsVUFBVSxFQUFFO1FBQ1YsTUFBTSxFQUFFLGdCQUFnQjtRQUN4QixNQUFNLEVBQUUsaUJBQWlCO1FBQ3pCLE1BQU0sRUFBRSxrQkFBa0I7UUFDMUIsTUFBTSxFQUFFLGtCQUFrQjtRQUMxQixLQUFLLEVBQUUsY0FBYztRQUNyQixRQUFRLEVBQUUsVUFBVTtRQUNwQixNQUFNLEVBQUUsaUJBQWlCO1FBQ3pCLE9BQU8sRUFBRSxTQUFTO1FBQ2xCLE9BQU8sRUFBRSxTQUFTO1FBQ2xCLEtBQUssRUFBRSxPQUFPO1FBQ2QsTUFBTSxFQUFFLFFBQVE7S0FDakI7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UUFBdkIsU0FBUyxDQUFDLFdBQVcsQ0FBQzswQ0FBcUIsZUFBZTtzREFBQztJQUMvQjtRQUE1QixZQUFZLENBQUMsYUFBYSxDQUFDOzBDQUF3QixTQUFTO3lEQUFvQjtJQThCakY7UUFEQyxLQUFLLEVBQUU7OzhEQU82QjtJQXpFMUIsZUFBZTtRQU4zQixTQUFTLENBQUM7WUFDVCxRQUFRLEVBQUUsWUFBWTtZQUN0QixnNUVBQXNDO1lBQ3RDLGVBQWUsRUFBRSx1QkFBdUIsQ0FBQyxNQUFNO1lBQy9DLG1CQUFtQixFQUFFLEtBQUs7U0FDM0IsQ0FBQztpREE2RWUsaUJBQWlCO1lBQ1Ysc0JBQXNCO09BN0VqQyxlQUFlLENBcVczQjtJQUFELHNCQUFDO0NBQUEsQUFyV0QsSUFxV0M7U0FyV1ksZUFBZSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBDaGFuZ2VEZXRlY3RvclJlZixcbiAgQ29tcG9uZW50LFxuICBFbGVtZW50UmVmLFxuICBFdmVudEVtaXR0ZXIsXG4gIElucHV0LFxuICBPbkluaXQsXG4gIE91dHB1dCxcbiAgUXVlcnlMaXN0LFxuICBWaWV3Q2hpbGQsXG4gIFZpZXdDaGlsZHJlbixcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7XG4gIGNhdGVnb3JpZXMsXG4gIEVtb2ppLFxuICBFbW9qaUNhdGVnb3J5LFxuICBFbW9qaURhdGEsXG4gIEVtb2ppRXZlbnQsXG59IGZyb20gJ0BjdHJsL25neC1lbW9qaS1tYXJ0L25neC1lbW9qaSc7XG5pbXBvcnQgeyBDYXRlZ29yeUNvbXBvbmVudCB9IGZyb20gJy4vY2F0ZWdvcnkuY29tcG9uZW50JztcbmltcG9ydCB7IEVtb2ppRnJlcXVlbnRseVNlcnZpY2UgfSBmcm9tICcuL2Vtb2ppLWZyZXF1ZW50bHkuc2VydmljZSc7XG5pbXBvcnQgeyBQcmV2aWV3Q29tcG9uZW50IH0gZnJvbSAnLi9wcmV2aWV3LmNvbXBvbmVudCc7XG5pbXBvcnQgeyBTZWFyY2hDb21wb25lbnQgfSBmcm9tICcuL3NlYXJjaC5jb21wb25lbnQnO1xuaW1wb3J0ICogYXMgaWNvbnMgZnJvbSAnLi9zdmdzJztcbmltcG9ydCB7IG1lYXN1cmVTY3JvbGxiYXIgfSBmcm9tICcuL3V0aWxzJztcblxuXG5cbmNvbnN0IEkxOE46IGFueSA9IHtcbiAgc2VhcmNoOiAnU2VhcmNoJyxcbiAgZW1vamlsaXN0OiAnTGlzdCBvZiBlbW9qaScsXG4gIG5vdGZvdW5kOiAnTm8gRW1vamkgRm91bmQnLFxuICBjbGVhcjogJ0NsZWFyJyxcbiAgY2F0ZWdvcmllczoge1xuICAgIHNlYXJjaDogJ1NlYXJjaCBSZXN1bHRzJyxcbiAgICByZWNlbnQ6ICdGcmVxdWVudGx5IFVzZWQnLFxuICAgIHBlb3BsZTogJ1NtaWxleXMgJiBQZW9wbGUnLFxuICAgIG5hdHVyZTogJ0FuaW1hbHMgJiBOYXR1cmUnLFxuICAgIGZvb2RzOiAnRm9vZCAmIERyaW5rJyxcbiAgICBhY3Rpdml0eTogJ0FjdGl2aXR5JyxcbiAgICBwbGFjZXM6ICdUcmF2ZWwgJiBQbGFjZXMnLFxuICAgIG9iamVjdHM6ICdPYmplY3RzJyxcbiAgICBzeW1ib2xzOiAnU3ltYm9scycsXG4gICAgZmxhZ3M6ICdGbGFncycsXG4gICAgY3VzdG9tOiAnQ3VzdG9tJyxcbiAgfSxcbiAgc2tpbnRvbmVzOiB7XG4gICAgMTogJ0RlZmF1bHQgU2tpbiBUb25lJyxcbiAgICAyOiAnTGlnaHQgU2tpbiBUb25lJyxcbiAgICAzOiAnTWVkaXVtLUxpZ2h0IFNraW4gVG9uZScsXG4gICAgNDogJ01lZGl1bSBTa2luIFRvbmUnLFxuICAgIDU6ICdNZWRpdW0tRGFyayBTa2luIFRvbmUnLFxuICAgIDY6ICdEYXJrIFNraW4gVG9uZScsXG4gIH0sXG59O1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdlbW9qaS1tYXJ0JyxcbiAgdGVtcGxhdGVVcmw6ICcuL3BpY2tlci5jb21wb25lbnQuaHRtbCcsXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICBwcmVzZXJ2ZVdoaXRlc3BhY2VzOiBmYWxzZSxcbn0pXG5leHBvcnQgY2xhc3MgUGlja2VyQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcbiAgQElucHV0KCkgcGVyTGluZSA9IDk7XG4gIEBJbnB1dCgpIHRvdGFsRnJlcXVlbnRMaW5lcyA9IDQ7XG4gIEBJbnB1dCgpIGkxOG46IGFueSA9IHt9O1xuICBASW5wdXQoKSBzdHlsZTogYW55ID0ge307XG4gIEBJbnB1dCgpIHRpdGxlID0gJ0Vtb2ppIE1hcnTihKInO1xuICBASW5wdXQoKSBlbW9qaSA9ICdkZXBhcnRtZW50X3N0b3JlJztcbiAgQElucHV0KCkgY29sb3IgPSAnI2FlNjVjNSc7XG4gIEBJbnB1dCgpIGhpZGVPYnNvbGV0ZSA9IHRydWU7XG4gIC8qKiBhbGwgY2F0ZWdvcmllcyBzaG93biAqL1xuICBASW5wdXQoKSBjYXRlZ29yaWVzOiBFbW9qaUNhdGVnb3J5W10gPSBbXTtcbiAgLyoqIHVzZWQgdG8gdGVtcG9yYXJpbHkgZHJhdyBjYXRlZ29yaWVzICovXG4gIEBJbnB1dCgpIGFjdGl2ZUNhdGVnb3JpZXM6IEVtb2ppQ2F0ZWdvcnlbXSA9IFtdO1xuICBASW5wdXQoKSBzZXQ6IEVtb2ppWydzZXQnXSA9ICdhcHBsZSc7XG4gIEBJbnB1dCgpIHNraW46IEVtb2ppWydza2luJ10gPSAxO1xuICAvKiogUmVuZGVycyB0aGUgbmF0aXZlIHVuaWNvZGUgZW1vamkgKi9cbiAgQElucHV0KCkgaXNOYXRpdmU6IEVtb2ppWydpc05hdGl2ZSddID0gZmFsc2U7XG4gIEBJbnB1dCgpIGVtb2ppU2l6ZTogRW1vamlbJ3NpemUnXSA9IDI0O1xuICBASW5wdXQoKSBzaGVldFNpemU6IEVtb2ppWydzaGVldFNpemUnXSA9IDY0O1xuICBASW5wdXQoKSBlbW9qaXNUb1Nob3dGaWx0ZXI/OiAoeDogc3RyaW5nKSA9PiBib29sZWFuO1xuICBASW5wdXQoKSBzaG93UHJldmlldyA9IHRydWU7XG4gIEBJbnB1dCgpIGVtb2ppVG9vbHRpcCA9IGZhbHNlO1xuICBASW5wdXQoKSBhdXRvRm9jdXMgPSBmYWxzZTtcbiAgQElucHV0KCkgY3VzdG9tOiBhbnlbXSA9IFtdO1xuICBASW5wdXQoKSBoaWRlUmVjZW50ID0gdHJ1ZTtcbiAgQElucHV0KCkgaW5jbHVkZT86IHN0cmluZ1tdO1xuICBASW5wdXQoKSBleGNsdWRlPzogc3RyaW5nW107XG4gIEBJbnB1dCgpIG5vdEZvdW5kRW1vamkgPSAnc2xldXRoX29yX3NweSc7XG4gIEBJbnB1dCgpIGNhdGVnb3JpZXNJY29ucyA9IGljb25zLmNhdGVnb3JpZXM7XG4gIEBJbnB1dCgpIHNlYXJjaEljb25zID0gaWNvbnMuc2VhcmNoO1xuICBASW5wdXQoKSBzaG93U2luZ2xlQ2F0ZWdvcnkgPSBmYWxzZTtcbiAgQE91dHB1dCgpIGVtb2ppQ2xpY2sgPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcbiAgQE91dHB1dCgpIGVtb2ppU2VsZWN0ID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XG4gIEBPdXRwdXQoKSBza2luQ2hhbmdlID0gbmV3IEV2ZW50RW1pdHRlcjxFbW9qaVsnc2tpbiddPigpO1xuICBAVmlld0NoaWxkKCdzY3JvbGxSZWYnKSBwcml2YXRlIHNjcm9sbFJlZiE6IEVsZW1lbnRSZWY7XG4gIEBWaWV3Q2hpbGQoJ3ByZXZpZXdSZWYnKSBwcml2YXRlIHByZXZpZXdSZWYhOiBQcmV2aWV3Q29tcG9uZW50O1xuICBAVmlld0NoaWxkKCdzZWFyY2hSZWYnKSBwcml2YXRlIHNlYXJjaFJlZiE6IFNlYXJjaENvbXBvbmVudDtcbiAgQFZpZXdDaGlsZHJlbignY2F0ZWdvcnlSZWYnKSBwcml2YXRlIGNhdGVnb3J5UmVmcyE6IFF1ZXJ5TGlzdDxDYXRlZ29yeUNvbXBvbmVudD47XG4gIHNjcm9sbEhlaWdodCA9IDA7XG4gIGNsaWVudEhlaWdodCA9IDA7XG4gIHNlbGVjdGVkPzogc3RyaW5nO1xuICBuZXh0U2Nyb2xsPzogc3RyaW5nO1xuICBzY3JvbGxUb3A/OiBudW1iZXI7XG4gIGZpcnN0UmVuZGVyID0gdHJ1ZTtcbiAgcmVjZW50Pzogc3RyaW5nW107XG4gIHByZXZpZXdFbW9qaTogYW55O1xuICBsZWF2ZVRpbWVvdXQ6IGFueTtcbiAgTkFNRVNQQUNFID0gJ2Vtb2ppLW1hcnQnO1xuICBtZWFzdXJlU2Nyb2xsYmFyID0gMDtcbiAgUkVDRU5UX0NBVEVHT1JZOiBFbW9qaUNhdGVnb3J5ID0ge1xuICAgIGlkOiAncmVjZW50JyxcbiAgICBuYW1lOiAnUmVjZW50JyxcbiAgICBlbW9qaXM6IG51bGwsXG4gIH07XG4gIFNFQVJDSF9DQVRFR09SWTogRW1vamlDYXRlZ29yeSA9IHtcbiAgICBpZDogJ3NlYXJjaCcsXG4gICAgbmFtZTogJ1NlYXJjaCcsXG4gICAgZW1vamlzOiBudWxsLFxuICAgIGFuY2hvcjogZmFsc2UsXG4gIH07XG4gIENVU1RPTV9DQVRFR09SWTogRW1vamlDYXRlZ29yeSA9IHtcbiAgICBpZDogJ2N1c3RvbScsXG4gICAgbmFtZTogJ0N1c3RvbScsXG4gICAgZW1vamlzOiBbXSxcbiAgfTtcblxuICBASW5wdXQoKVxuICBiYWNrZ3JvdW5kSW1hZ2VGbjogRW1vamlbJ2JhY2tncm91bmRJbWFnZUZuJ10gPSAoXG4gICAgc2V0OiBzdHJpbmcsXG4gICAgc2hlZXRTaXplOiBudW1iZXIsXG4gICkgPT5cbiAgICBgaHR0cHM6Ly91bnBrZy5jb20vZW1vamktZGF0YXNvdXJjZS0ke3RoaXMuc2V0fUA0LjAuNC9pbWcvJHtcbiAgICAgIHRoaXMuc2V0XG4gICAgfS9zaGVldHMtMjU2LyR7dGhpcy5zaGVldFNpemV9LnBuZ2BcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIHJlZjogQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gICAgcHJpdmF0ZSBmcmVxdWVudGx5OiBFbW9qaUZyZXF1ZW50bHlTZXJ2aWNlLFxuICApIHt9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgLy8gbWVhc3VyZSBzY3JvbGxcbiAgICB0aGlzLm1lYXN1cmVTY3JvbGxiYXIgPSBtZWFzdXJlU2Nyb2xsYmFyKCk7XG5cbiAgICB0aGlzLmkxOG4gPSB7IC4uLkkxOE4sIC4uLnRoaXMuaTE4biB9O1xuICAgIHRoaXMuaTE4bi5jYXRlZ29yaWVzID0geyAuLi5JMThOLmNhdGVnb3JpZXMsIC4uLnRoaXMuaTE4bi5jYXRlZ29yaWVzIH07XG4gICAgdGhpcy5za2luID1cbiAgICAgIEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oYCR7dGhpcy5OQU1FU1BBQ0V9LnNraW5gKSB8fCAnbnVsbCcpIHx8XG4gICAgICB0aGlzLnNraW47XG5cbiAgICBjb25zdCBhbGxDYXRlZ29yaWVzID0gWy4uLmNhdGVnb3JpZXNdO1xuXG4gICAgaWYgKHRoaXMuY3VzdG9tLmxlbmd0aCA+IDApIHtcbiAgICAgIHRoaXMuQ1VTVE9NX0NBVEVHT1JZLmVtb2ppcyA9IHRoaXMuY3VzdG9tLm1hcChlbW9qaSA9PiB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgLi4uZW1vamksXG4gICAgICAgICAgLy8gYDxDYXRlZ29yeSAvPmAgZXhwZWN0cyBlbW9qaSB0byBoYXZlIGFuIGBpZGAuXG4gICAgICAgICAgaWQ6IGVtb2ppLnNob3J0TmFtZXNbMF0sXG4gICAgICAgICAgY3VzdG9tOiB0cnVlLFxuICAgICAgICB9O1xuICAgICAgfSk7XG5cbiAgICAgIGFsbENhdGVnb3JpZXMucHVzaCh0aGlzLkNVU1RPTV9DQVRFR09SWSk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuaW5jbHVkZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBhbGxDYXRlZ29yaWVzLnNvcnQoKGEsIGIpID0+IHtcbiAgICAgICAgaWYgKHRoaXMuaW5jbHVkZS5pbmRleE9mKGEuaWQpID4gdGhpcy5pbmNsdWRlLmluZGV4T2YoYi5pZCkpIHtcbiAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gLTE7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBmb3IgKGNvbnN0IGNhdGVnb3J5IG9mIGFsbENhdGVnb3JpZXMpIHtcbiAgICAgIGNvbnN0IGlzSW5jbHVkZWQgPVxuICAgICAgICB0aGlzLmluY2x1ZGUgJiYgdGhpcy5pbmNsdWRlLmxlbmd0aFxuICAgICAgICAgID8gdGhpcy5pbmNsdWRlLmluZGV4T2YoY2F0ZWdvcnkuaWQpID4gLTFcbiAgICAgICAgICA6IHRydWU7XG4gICAgICBjb25zdCBpc0V4Y2x1ZGVkID1cbiAgICAgICAgdGhpcy5leGNsdWRlICYmIHRoaXMuZXhjbHVkZS5sZW5ndGhcbiAgICAgICAgICA/IHRoaXMuZXhjbHVkZS5pbmRleE9mKGNhdGVnb3J5LmlkKSA+IC0xXG4gICAgICAgICAgOiBmYWxzZTtcbiAgICAgIGlmICghaXNJbmNsdWRlZCB8fCBpc0V4Y2x1ZGVkKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5lbW9qaXNUb1Nob3dGaWx0ZXIpIHtcbiAgICAgICAgY29uc3QgbmV3RW1vamlzID0gW107XG5cbiAgICAgICAgY29uc3QgeyBlbW9qaXMgfSA9IGNhdGVnb3J5O1xuICAgICAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6IHByZWZlci1mb3Itb2ZcbiAgICAgICAgZm9yIChsZXQgZW1vamlJbmRleCA9IDA7IGVtb2ppSW5kZXggPCBlbW9qaXMubGVuZ3RoOyBlbW9qaUluZGV4KyspIHtcbiAgICAgICAgICBjb25zdCBlbW9qaSA9IGVtb2ppc1tlbW9qaUluZGV4XTtcbiAgICAgICAgICBpZiAodGhpcy5lbW9qaXNUb1Nob3dGaWx0ZXIoZW1vamkpKSB7XG4gICAgICAgICAgICBuZXdFbW9qaXMucHVzaChlbW9qaSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG5ld0Vtb2ppcy5sZW5ndGgpIHtcbiAgICAgICAgICBjb25zdCBuZXdDYXRlZ29yeSA9IHtcbiAgICAgICAgICAgIGVtb2ppczogbmV3RW1vamlzLFxuICAgICAgICAgICAgbmFtZTogY2F0ZWdvcnkubmFtZSxcbiAgICAgICAgICAgIGlkOiBjYXRlZ29yeS5pZCxcbiAgICAgICAgICB9O1xuXG4gICAgICAgICAgdGhpcy5jYXRlZ29yaWVzLnB1c2gobmV3Q2F0ZWdvcnkpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmNhdGVnb3JpZXMucHVzaChjYXRlZ29yeSk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuY2F0ZWdvcmllc0ljb25zID0geyAuLi5pY29ucy5jYXRlZ29yaWVzLCAuLi50aGlzLmNhdGVnb3JpZXNJY29ucyB9O1xuICAgICAgdGhpcy5zZWFyY2hJY29ucyA9IHsgLi4uaWNvbnMuc2VhcmNoLCAuLi50aGlzLnNlYXJjaEljb25zIH07XG4gICAgfVxuXG4gICAgY29uc3QgaW5jbHVkZVJlY2VudCA9XG4gICAgICB0aGlzLmluY2x1ZGUgJiYgdGhpcy5pbmNsdWRlLmxlbmd0aFxuICAgICAgICA/IHRoaXMuaW5jbHVkZS5pbmRleE9mKHRoaXMuUkVDRU5UX0NBVEVHT1JZLmlkKSA+IC0xXG4gICAgICAgIDogdHJ1ZTtcbiAgICBjb25zdCBleGNsdWRlUmVjZW50ID1cbiAgICAgIHRoaXMuZXhjbHVkZSAmJiB0aGlzLmV4Y2x1ZGUubGVuZ3RoXG4gICAgICAgID8gdGhpcy5leGNsdWRlLmluZGV4T2YodGhpcy5SRUNFTlRfQ0FURUdPUlkuaWQpID4gLTFcbiAgICAgICAgOiBmYWxzZTtcbiAgICBpZiAoaW5jbHVkZVJlY2VudCAmJiAhZXhjbHVkZVJlY2VudCkge1xuICAgICAgdGhpcy5oaWRlUmVjZW50ID0gZmFsc2U7XG4gICAgICB0aGlzLmNhdGVnb3JpZXMudW5zaGlmdCh0aGlzLlJFQ0VOVF9DQVRFR09SWSk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuY2F0ZWdvcmllc1swXSkge1xuICAgICAgdGhpcy5jYXRlZ29yaWVzWzBdLmZpcnN0ID0gdHJ1ZTtcbiAgICB9XG5cbiAgICB0aGlzLmNhdGVnb3JpZXMudW5zaGlmdCh0aGlzLlNFQVJDSF9DQVRFR09SWSk7XG4gICAgdGhpcy5zZWxlY3RlZCA9IHRoaXMuY2F0ZWdvcmllcy5maWx0ZXIoY2F0ZWdvcnkgPT4gY2F0ZWdvcnkuZmlyc3QpWzBdLm5hbWU7XG5cbiAgICBjb25zdCBjYXRlZ29yaWVzVG9Mb2FkRmlyc3QgPSAzO1xuICAgIHRoaXMuc2V0QWN0aXZlQ2F0ZWdvcmllcyh0aGlzLmFjdGl2ZUNhdGVnb3JpZXMgPSB0aGlzLmNhdGVnb3JpZXMuc2xpY2UoMCwgY2F0ZWdvcmllc1RvTG9hZEZpcnN0KSk7XG4gICAgLy8gVHJpbSBsYXN0IGFjdGl2ZSBjYXRlZ29yeVxuICAgIGNvbnN0IGxhc3RBY3RpdmVDYXRlZ29yeUVtb2ppcyA9IHRoaXMuY2F0ZWdvcmllc1tjYXRlZ29yaWVzVG9Mb2FkRmlyc3QgLSAxXS5lbW9qaXMuc2xpY2UoKTtcbiAgICB0aGlzLmNhdGVnb3JpZXNbY2F0ZWdvcmllc1RvTG9hZEZpcnN0IC0gMV0uZW1vamlzID0gbGFzdEFjdGl2ZUNhdGVnb3J5RW1vamlzLnNsaWNlKDAsIDYwKTtcblxuICAgIHRoaXMucmVmLm1hcmtGb3JDaGVjaygpO1xuXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAvLyBSZXN0b3JlIGxhc3QgY2F0ZWdvcnlcbiAgICAgIHRoaXMuY2F0ZWdvcmllc1tjYXRlZ29yaWVzVG9Mb2FkRmlyc3QgLSAxXS5lbW9qaXMgPSBsYXN0QWN0aXZlQ2F0ZWdvcnlFbW9qaXM7XG4gICAgICB0aGlzLnNldEFjdGl2ZUNhdGVnb3JpZXModGhpcy5jYXRlZ29yaWVzKTtcbiAgICAgIHRoaXMucmVmLm1hcmtGb3JDaGVjaygpO1xuICAgICAgc2V0VGltZW91dCgoKSA9PiB0aGlzLnVwZGF0ZUNhdGVnb3JpZXNTaXplKCkpO1xuICAgIH0pO1xuICB9XG4gIHNldEFjdGl2ZUNhdGVnb3JpZXMoY2F0ZWdvcmllc1RvTWFrZUFjdGl2ZTogQXJyYXk8RW1vamlDYXRlZ29yeT4pIHtcbiAgICBpZiAodGhpcy5zaG93U2luZ2xlQ2F0ZWdvcnkpIHtcbiAgICAgIHRoaXMuYWN0aXZlQ2F0ZWdvcmllcyA9IGNhdGVnb3JpZXNUb01ha2VBY3RpdmUuZmlsdGVyKHggPT4geC5uYW1lID09PSB0aGlzLnNlbGVjdGVkKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5hY3RpdmVDYXRlZ29yaWVzID0gY2F0ZWdvcmllc1RvTWFrZUFjdGl2ZTtcbiAgICB9XG4gIH1cbiAgdXBkYXRlQ2F0ZWdvcmllc1NpemUoKSB7XG4gICAgdGhpcy5jYXRlZ29yeVJlZnMuZm9yRWFjaChjb21wb25lbnQgPT4gY29tcG9uZW50Lm1lbW9pemVTaXplKCkpO1xuXG4gICAgaWYgKHRoaXMuc2Nyb2xsUmVmKSB7XG4gICAgICBjb25zdCB0YXJnZXQgPSB0aGlzLnNjcm9sbFJlZi5uYXRpdmVFbGVtZW50O1xuICAgICAgdGhpcy5zY3JvbGxIZWlnaHQgPSB0YXJnZXQuc2Nyb2xsSGVpZ2h0O1xuICAgICAgdGhpcy5jbGllbnRIZWlnaHQgPSB0YXJnZXQuY2xpZW50SGVpZ2h0O1xuICAgIH1cbiAgfVxuICBoYW5kbGVBbmNob3JDbGljaygkZXZlbnQ6IHsgY2F0ZWdvcnk6IEVtb2ppQ2F0ZWdvcnk7IGluZGV4OiBudW1iZXIgfSkge1xuICAgIHRoaXMudXBkYXRlQ2F0ZWdvcmllc1NpemUoKTtcbiAgICB0aGlzLnNlbGVjdGVkID0gJGV2ZW50LmNhdGVnb3J5Lm5hbWU7XG4gICAgdGhpcy5zZXRBY3RpdmVDYXRlZ29yaWVzKHRoaXMuY2F0ZWdvcmllcyk7XG5cbiAgICBpZiAodGhpcy5TRUFSQ0hfQ0FURUdPUlkuZW1vamlzKSB7XG4gICAgICB0aGlzLmhhbmRsZVNlYXJjaChudWxsKTtcbiAgICAgIHRoaXMuc2VhcmNoUmVmLmNsZWFyKCk7XG4gICAgICB0aGlzLmhhbmRsZUFuY2hvckNsaWNrKCRldmVudCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgY29tcG9uZW50ID0gdGhpcy5jYXRlZ29yeVJlZnMuZmluZChuID0+IG4uaWQgPT09ICRldmVudC5jYXRlZ29yeS5pZCk7XG4gICAgaWYgKGNvbXBvbmVudCkge1xuICAgICAgbGV0IHsgdG9wIH0gPSBjb21wb25lbnQ7XG5cbiAgICAgIGlmICgkZXZlbnQuY2F0ZWdvcnkuZmlyc3QpIHtcbiAgICAgICAgdG9wID0gMDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRvcCArPSAxO1xuICAgICAgfVxuICAgICAgdGhpcy5zY3JvbGxSZWYubmF0aXZlRWxlbWVudC5zY3JvbGxUb3AgPSB0b3A7XG4gICAgfVxuICAgIHRoaXMuc2VsZWN0ZWQgPSAkZXZlbnQuY2F0ZWdvcnkubmFtZTtcbiAgICB0aGlzLm5leHRTY3JvbGwgPSAkZXZlbnQuY2F0ZWdvcnkubmFtZTtcbiAgfVxuICBjYXRlZ29yeVRyYWNrKGluZGV4OiBudW1iZXIsIGl0ZW06IGFueSkge1xuICAgIHJldHVybiBpdGVtLmlkO1xuICB9XG4gIGhhbmRsZVNjcm9sbCgpIHtcbiAgICBpZiAodGhpcy5uZXh0U2Nyb2xsKSB7XG4gICAgICB0aGlzLnNlbGVjdGVkID0gdGhpcy5uZXh0U2Nyb2xsO1xuICAgICAgdGhpcy5uZXh0U2Nyb2xsID0gdW5kZWZpbmVkO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoIXRoaXMuc2Nyb2xsUmVmKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmICh0aGlzLnNob3dTaW5nbGVDYXRlZ29yeSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGxldCBhY3RpdmVDYXRlZ29yeSA9IG51bGw7XG4gICAgaWYgKHRoaXMuU0VBUkNIX0NBVEVHT1JZLmVtb2ppcykge1xuICAgICAgYWN0aXZlQ2F0ZWdvcnkgPSB0aGlzLlNFQVJDSF9DQVRFR09SWTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgdGFyZ2V0ID0gdGhpcy5zY3JvbGxSZWYubmF0aXZlRWxlbWVudDtcbiAgICAgIC8vIGNoZWNrIHNjcm9sbCBpcyBub3QgYXQgYm90dG9tXG4gICAgICBpZiAodGFyZ2V0LnNjcm9sbFRvcCA9PT0gMCkge1xuICAgICAgICAvLyBoaXQgdGhlIFRPUFxuICAgICAgICBhY3RpdmVDYXRlZ29yeSA9IHRoaXMuY2F0ZWdvcmllcy5maW5kKG4gPT4gbi5maXJzdCA9PT0gdHJ1ZSk7XG4gICAgICB9IGVsc2UgaWYgKHRhcmdldC5zY3JvbGxIZWlnaHQgLSB0YXJnZXQuc2Nyb2xsVG9wID09PSB0aGlzLmNsaWVudEhlaWdodCkge1xuICAgICAgICAvLyBzY3JvbGxlZCB0byBib3R0b20gYWN0aXZhdGUgbGFzdCBjYXRlZ29yeVxuICAgICAgICBhY3RpdmVDYXRlZ29yeSA9IHRoaXMuY2F0ZWdvcmllc1t0aGlzLmNhdGVnb3JpZXMubGVuZ3RoIC0gMV07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBzY3JvbGxpbmdcbiAgICAgICAgZm9yIChjb25zdCBjYXRlZ29yeSBvZiB0aGlzLmNhdGVnb3JpZXMpIHtcbiAgICAgICAgICBjb25zdCBjb21wb25lbnQgPSB0aGlzLmNhdGVnb3J5UmVmcy5maW5kKG4gPT4gbi5pZCA9PT0gY2F0ZWdvcnkuaWQpO1xuICAgICAgICAgIGNvbnN0IGFjdGl2ZSA9IGNvbXBvbmVudC5oYW5kbGVTY3JvbGwodGFyZ2V0LnNjcm9sbFRvcCk7XG4gICAgICAgICAgaWYgKGFjdGl2ZSkge1xuICAgICAgICAgICAgYWN0aXZlQ2F0ZWdvcnkgPSBjYXRlZ29yeTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgdGhpcy5zY3JvbGxUb3AgPSB0YXJnZXQuc2Nyb2xsVG9wO1xuICAgIH1cbiAgICBpZiAoYWN0aXZlQ2F0ZWdvcnkpIHtcbiAgICAgIHRoaXMuc2VsZWN0ZWQgPSBhY3RpdmVDYXRlZ29yeS5uYW1lO1xuICAgIH1cbiAgfVxuICBoYW5kbGVTZWFyY2goJGVtb2ppczogYW55W10gfCBudWxsKSB7XG4gICAgdGhpcy5TRUFSQ0hfQ0FURUdPUlkuZW1vamlzID0gJGVtb2ppcztcbiAgICBmb3IgKGNvbnN0IGNvbXBvbmVudCBvZiB0aGlzLmNhdGVnb3J5UmVmcy50b0FycmF5KCkpIHtcbiAgICAgIGlmIChjb21wb25lbnQubmFtZSA9PT0gJ1NlYXJjaCcpIHtcbiAgICAgICAgY29tcG9uZW50LmVtb2ppcyA9ICRlbW9qaXM7XG4gICAgICAgIGNvbXBvbmVudC51cGRhdGVEaXNwbGF5KCRlbW9qaXMgPyAnYmxvY2snIDogJ25vbmUnKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbXBvbmVudC51cGRhdGVEaXNwbGF5KCRlbW9qaXMgPyAnbm9uZScgOiAnYmxvY2snKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLnNjcm9sbFJlZi5uYXRpdmVFbGVtZW50LnNjcm9sbFRvcCA9IDA7XG4gICAgdGhpcy5oYW5kbGVTY3JvbGwoKTtcbiAgfVxuXG4gIGhhbmRsZUVudGVyS2V5KCRldmVudDogRXZlbnQsIGVtb2ppPzogRW1vamlEYXRhKSB7XG4gICAgaWYgKCFlbW9qaSkge1xuICAgICAgaWYgKHRoaXMuU0VBUkNIX0NBVEVHT1JZLmVtb2ppcyAhPT0gbnVsbCAmJiB0aGlzLlNFQVJDSF9DQVRFR09SWS5lbW9qaXMubGVuZ3RoKSB7XG4gICAgICAgIGVtb2ppID0gdGhpcy5TRUFSQ0hfQ0FURUdPUlkuZW1vamlzWzBdO1xuICAgICAgICBpZiAoZW1vamkpIHtcbiAgICAgICAgICB0aGlzLmVtb2ppU2VsZWN0LmVtaXQoeyAkZXZlbnQsIGVtb2ppIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmICghdGhpcy5oaWRlUmVjZW50ICYmICF0aGlzLnJlY2VudCkge1xuICAgICAgdGhpcy5mcmVxdWVudGx5LmFkZChlbW9qaSk7XG4gICAgfVxuXG4gICAgY29uc3QgY29tcG9uZW50ID0gdGhpcy5jYXRlZ29yeVJlZnMudG9BcnJheSgpWzFdO1xuICAgIGlmIChjb21wb25lbnQpIHtcbiAgICAgIGNvbXBvbmVudC5nZXRFbW9qaXMoKTtcbiAgICAgIGNvbXBvbmVudC5yZWYubWFya0ZvckNoZWNrKCk7XG4gICAgfVxuICB9XG4gIGhhbmRsZUVtb2ppT3ZlcigkZXZlbnQ6IEVtb2ppRXZlbnQpIHtcbiAgICBpZiAoIXRoaXMuc2hvd1ByZXZpZXcgfHwgIXRoaXMucHJldmlld1JlZikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IGVtb2ppRGF0YSA9IHRoaXMuQ1VTVE9NX0NBVEVHT1JZLmVtb2ppcy5maW5kKFxuICAgICAgY3VzdG9tRW1vamkgPT4gY3VzdG9tRW1vamkuaWQgPT09ICRldmVudC5lbW9qaS5pZCxcbiAgICApO1xuICAgIGlmIChlbW9qaURhdGEpIHtcbiAgICAgICRldmVudC5lbW9qaSA9IHsgLi4uZW1vamlEYXRhIH07XG4gICAgfVxuXG4gICAgdGhpcy5wcmV2aWV3RW1vamkgPSAkZXZlbnQuZW1vamk7XG4gICAgY2xlYXJUaW1lb3V0KHRoaXMubGVhdmVUaW1lb3V0KTtcbiAgfVxuICBoYW5kbGVFbW9qaUxlYXZlKCkge1xuICAgIGlmICghdGhpcy5zaG93UHJldmlldyB8fCAhdGhpcy5wcmV2aWV3UmVmKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5sZWF2ZVRpbWVvdXQgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIHRoaXMucHJldmlld0Vtb2ppID0gbnVsbDtcbiAgICAgIHRoaXMucHJldmlld1JlZi5yZWYubWFya0ZvckNoZWNrKCk7XG4gICAgfSwgMTYpO1xuICB9XG4gIGhhbmRsZUVtb2ppQ2xpY2soJGV2ZW50OiBFbW9qaUV2ZW50KSB7XG4gICAgdGhpcy5lbW9qaUNsaWNrLmVtaXQoJGV2ZW50KTtcbiAgICB0aGlzLmVtb2ppU2VsZWN0LmVtaXQoJGV2ZW50KTtcbiAgICB0aGlzLmhhbmRsZUVudGVyS2V5KCRldmVudC4kZXZlbnQsICRldmVudC5lbW9qaSk7XG4gIH1cbiAgaGFuZGxlU2tpbkNoYW5nZShza2luOiBFbW9qaVsnc2tpbiddKSB7XG4gICAgdGhpcy5za2luID0gc2tpbjtcbiAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShgJHt0aGlzLk5BTUVTUEFDRX0uc2tpbmAsIFN0cmluZyhza2luKSk7XG4gICAgdGhpcy5za2luQ2hhbmdlLmVtaXQoc2tpbik7XG4gIH1cbiAgZ2V0V2lkdGgoKTogc3RyaW5nIHtcbiAgICBpZiAodGhpcy5zdHlsZS53aWR0aCkge1xuICAgICAgcmV0dXJuIHRoaXMuc3R5bGUud2lkdGg7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLnBlckxpbmUgKiAodGhpcy5lbW9qaVNpemUgKyAxMikgKyAxMiArIDIgKyB0aGlzLm1lYXN1cmVTY3JvbGxiYXIgKyAncHgnO1xuICB9XG59XG4iXX0=