import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import { categories, EmojiService, } from '@ctrl/ngx-emoji-mart/ngx-emoji';
import { intersect } from './utils';
import * as i0 from "@angular/core";
import * as i1 from "@ctrl/ngx-emoji-mart/ngx-emoji";
var EmojiSearch = /** @class */ (function () {
    function EmojiSearch(emojiService) {
        var e_1, _a;
        var _this = this;
        this.emojiService = emojiService;
        this.originalPool = {};
        this.index = {};
        this.emojisList = {};
        this.emoticonsList = {};
        this.emojiSearch = {};
        var _loop_1 = function (emojiData) {
            var shortNames = emojiData.shortNames, emoticons = emojiData.emoticons;
            var id = shortNames[0];
            emoticons.forEach(function (emoticon) {
                if (_this.emoticonsList[emoticon]) {
                    return;
                }
                _this.emoticonsList[emoticon] = id;
            });
            this_1.emojisList[id] = this_1.emojiService.getSanitizedData(id);
            this_1.originalPool[id] = emojiData;
        };
        var this_1 = this;
        try {
            for (var _b = tslib_1.__values(this.emojiService.emojis), _c = _b.next(); !_c.done; _c = _b.next()) {
                var emojiData = _c.value;
                _loop_1(emojiData);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
    }
    EmojiSearch.prototype.addCustomToPool = function (custom, pool) {
        var _this = this;
        custom.forEach(function (emoji) {
            var emojiId = emoji.id || emoji.shortNames[0];
            if (emojiId && !pool[emojiId]) {
                pool[emojiId] = _this.emojiService.getData(emoji);
                _this.emojisList[emojiId] = _this.emojiService.getSanitizedData(emoji);
            }
        });
    };
    EmojiSearch.prototype.search = function (value, emojisToShowFilter, maxResults, include, exclude, custom) {
        var _this = this;
        if (maxResults === void 0) { maxResults = 75; }
        if (include === void 0) { include = []; }
        if (exclude === void 0) { exclude = []; }
        if (custom === void 0) { custom = []; }
        this.addCustomToPool(custom, this.originalPool);
        var results;
        var pool = this.originalPool;
        if (value.length) {
            if (value === '-' || value === '-1') {
                return [this.emojisList['-1']];
            }
            if (value === '+' || value === '+1') {
                return [this.emojisList['+1']];
            }
            var values = value.toLowerCase().split(/[\s|,|\-|_]+/);
            var allResults = [];
            if (values.length > 2) {
                values = [values[0], values[1]];
            }
            if (include.length || exclude.length) {
                pool = {};
                categories.forEach(function (category) {
                    var isIncluded = include && include.length
                        ? include.indexOf(category.id) > -1
                        : true;
                    var isExcluded = exclude && exclude.length
                        ? exclude.indexOf(category.id) > -1
                        : false;
                    if (!isIncluded || isExcluded) {
                        return;
                    }
                    category.emojis.forEach(function (emojiId) { return (pool[emojiId] = _this.emojiService.names[emojiId]); });
                });
                if (custom.length) {
                    var customIsIncluded = include && include.length ? include.indexOf('custom') > -1 : true;
                    var customIsExcluded = exclude && exclude.length ? exclude.indexOf('custom') > -1 : false;
                    if (customIsIncluded && !customIsExcluded) {
                        this.addCustomToPool(custom, pool);
                    }
                }
            }
            allResults = values
                .map(function (v) {
                var aPool = pool;
                var aIndex = _this.index;
                var length = 0;
                var _loop_2 = function (charIndex) {
                    var e_2, _a;
                    var char = v[charIndex];
                    length++;
                    if (!aIndex[char]) {
                        aIndex[char] = {};
                    }
                    aIndex = aIndex[char];
                    if (!aIndex.results) {
                        var scores_1 = {};
                        aIndex.results = [];
                        aIndex.pool = {};
                        try {
                            for (var _b = tslib_1.__values(Object.keys(aPool)), _c = _b.next(); !_c.done; _c = _b.next()) {
                                var id = _c.value;
                                var emoji = aPool[id];
                                if (!_this.emojiSearch[id]) {
                                    _this.emojiSearch[id] = _this.buildSearch(emoji.short_names, emoji.name, emoji.keywords, emoji.emoticons);
                                }
                                var query = _this.emojiSearch[id];
                                var sub = v.substr(0, length);
                                var subIndex = query.indexOf(sub);
                                if (subIndex !== -1) {
                                    var score = subIndex + 1;
                                    if (sub === id) {
                                        score = 0;
                                    }
                                    aIndex.results.push(_this.emojisList[id]);
                                    aIndex.pool[id] = emoji;
                                    scores_1[id] = score;
                                }
                            }
                        }
                        catch (e_2_1) { e_2 = { error: e_2_1 }; }
                        finally {
                            try {
                                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                            }
                            finally { if (e_2) throw e_2.error; }
                        }
                        aIndex.results.sort(function (a, b) {
                            var aScore = scores_1[a.id];
                            var bScore = scores_1[b.id];
                            return aScore - bScore;
                        });
                    }
                    aPool = aIndex.pool;
                };
                // tslint:disable-next-line: prefer-for-of
                for (var charIndex = 0; charIndex < v.length; charIndex++) {
                    _loop_2(charIndex);
                }
                return aIndex.results;
            })
                .filter(function (a) { return a; });
            if (allResults.length > 1) {
                results = intersect.apply(null, allResults);
            }
            else if (allResults.length) {
                results = allResults[0];
            }
            else {
                results = [];
            }
        }
        if (results) {
            if (emojisToShowFilter) {
                results = results.filter(function (result) {
                    return emojisToShowFilter(_this.emojiService.names[result.id]);
                });
            }
            if (results && results.length > maxResults) {
                results = results.slice(0, maxResults);
            }
        }
        return results || null;
    };
    EmojiSearch.prototype.buildSearch = function (shortNames, name, keywords, emoticons) {
        var search = [];
        var addToSearch = function (strings, split) {
            if (!strings) {
                return;
            }
            (Array.isArray(strings) ? strings : [strings]).forEach(function (str) {
                (split ? str.split(/[-|_|\s]+/) : [str]).forEach(function (s) {
                    s = s.toLowerCase();
                    if (!search.includes(s)) {
                        search.push(s);
                    }
                });
            });
        };
        addToSearch(shortNames, true);
        addToSearch(name, true);
        addToSearch(keywords, false);
        addToSearch(emoticons, false);
        return search.join(',');
    };
    EmojiSearch.ngInjectableDef = i0.defineInjectable({ factory: function EmojiSearch_Factory() { return new EmojiSearch(i0.inject(i1.EmojiService)); }, token: EmojiSearch, providedIn: "root" });
    EmojiSearch = tslib_1.__decorate([
        Injectable({ providedIn: 'root' }),
        tslib_1.__metadata("design:paramtypes", [EmojiService])
    ], EmojiSearch);
    return EmojiSearch;
}());
export { EmojiSearch };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW1vamktc2VhcmNoLnNlcnZpY2UuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AY3RybC9uZ3gtZW1vamktbWFydC8iLCJzb3VyY2VzIjpbImVtb2ppLXNlYXJjaC5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRTNDLE9BQU8sRUFDTCxVQUFVLEVBRVYsWUFBWSxHQUNiLE1BQU0sZ0NBQWdDLENBQUM7QUFDeEMsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLFNBQVMsQ0FBQzs7O0FBR3BDO0lBV0UscUJBQW9CLFlBQTBCOztRQUE5QyxpQkFnQkM7UUFoQm1CLGlCQUFZLEdBQVosWUFBWSxDQUFjO1FBVjlDLGlCQUFZLEdBQVEsRUFBRSxDQUFDO1FBQ3ZCLFVBQUssR0FJRCxFQUFFLENBQUM7UUFDUCxlQUFVLEdBQVEsRUFBRSxDQUFDO1FBQ3JCLGtCQUFhLEdBQThCLEVBQUUsQ0FBQztRQUM5QyxnQkFBVyxHQUE4QixFQUFFLENBQUM7Z0NBRy9CLFNBQVM7WUFDVixJQUFBLGlDQUFVLEVBQUUsK0JBQVMsQ0FBZTtZQUM1QyxJQUFNLEVBQUUsR0FBRyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFFekIsU0FBUyxDQUFDLE9BQU8sQ0FBQyxVQUFBLFFBQVE7Z0JBQ3hCLElBQUksS0FBSSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsRUFBRTtvQkFDaEMsT0FBTztpQkFDUjtnQkFFRCxLQUFJLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxHQUFHLEVBQUUsQ0FBQztZQUNwQyxDQUFDLENBQUMsQ0FBQztZQUVILE9BQUssVUFBVSxDQUFDLEVBQUUsQ0FBQyxHQUFHLE9BQUssWUFBWSxDQUFDLGdCQUFnQixDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQzdELE9BQUssWUFBWSxDQUFDLEVBQUUsQ0FBQyxHQUFHLFNBQVMsQ0FBQzs7OztZQWJwQyxLQUF3QixJQUFBLEtBQUEsaUJB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LENBQUM7UUFDTCxDQUFDLENBQUM7UUFFRixXQUFXLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQzlCLFdBQVcsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDeEIsV0FBVyxDQUFDLFFBQVEsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUM3QixXQUFXLENBQUMsU0FBUyxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBRTlCLE9BQU8sTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUMxQixDQUFDOztJQXhOVSxXQUFXO1FBRHZCLFVBQVUsQ0FBQyxFQUFFLFVBQVUsRUFBRSxNQUFNLEVBQUUsQ0FBQztpREFZQyxZQUFZO09BWG5DLFdBQVcsQ0F5TnZCO3NCQW5PRDtDQW1PQyxBQXpORCxJQXlOQztTQXpOWSxXQUFXIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQge1xuICBjYXRlZ29yaWVzLFxuICBFbW9qaURhdGEsXG4gIEVtb2ppU2VydmljZSxcbn0gZnJvbSAnQGN0cmwvbmd4LWVtb2ppLW1hcnQvbmd4LWVtb2ppJztcbmltcG9ydCB7IGludGVyc2VjdCB9IGZyb20gJy4vdXRpbHMnO1xuXG5ASW5qZWN0YWJsZSh7IHByb3ZpZGVkSW46ICdyb290JyB9KVxuZXhwb3J0IGNsYXNzIEVtb2ppU2VhcmNoIHtcbiAgb3JpZ2luYWxQb29sOiBhbnkgPSB7fTtcbiAgaW5kZXg6IHtcbiAgICByZXN1bHRzPzogRW1vamlEYXRhW107XG4gICAgcG9vbD86IHsgW2tleTogc3RyaW5nXTogRW1vamlEYXRhIH07XG4gICAgW2tleTogc3RyaW5nXTogYW55O1xuICB9ID0ge307XG4gIGVtb2ppc0xpc3Q6IGFueSA9IHt9O1xuICBlbW90aWNvbnNMaXN0OiB7IFtrZXk6IHN0cmluZ106IHN0cmluZyB9ID0ge307XG4gIGVtb2ppU2VhcmNoOiB7IFtrZXk6IHN0cmluZ106IHN0cmluZyB9ID0ge307XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBlbW9qaVNlcnZpY2U6IEVtb2ppU2VydmljZSkge1xuICAgIGZvciAoY29uc3QgZW1vamlEYXRhIG9mIHRoaXMuZW1vamlTZXJ2aWNlLmVtb2ppcykge1xuICAgICAgY29uc3QgeyBzaG9ydE5hbWVzLCBlbW90aWNvbnMgfSA9IGVtb2ppRGF0YTtcbiAgICAgIGNvbnN0IGlkID0gc2hvcnROYW1lc1swXTtcblxuICAgICAgZW1vdGljb25zLmZvckVhY2goZW1vdGljb24gPT4ge1xuICAgICAgICBpZiAodGhpcy5lbW90aWNvbnNMaXN0W2Vtb3RpY29uXSkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuZW1vdGljb25zTGlzdFtlbW90aWNvbl0gPSBpZDtcbiAgICAgIH0pO1xuXG4gICAgICB0aGlzLmVtb2ppc0xpc3RbaWRdID0gdGhpcy5lbW9qaVNlcnZpY2UuZ2V0U2FuaXRpemVkRGF0YShpZCk7XG4gICAgICB0aGlzLm9yaWdpbmFsUG9vbFtpZF0gPSBlbW9qaURhdGE7XG4gICAgfVxuICB9XG5cbiAgYWRkQ3VzdG9tVG9Qb29sKGN1c3RvbTogYW55LCBwb29sOiBhbnkpIHtcbiAgICBjdXN0b20uZm9yRWFjaCgoZW1vamk6IGFueSkgPT4ge1xuICAgICAgY29uc3QgZW1vamlJZCA9IGVtb2ppLmlkIHx8IGVtb2ppLnNob3J0TmFtZXNbMF07XG5cbiAgICAgIGlmIChlbW9qaUlkICYmICFwb29sW2Vtb2ppSWRdKSB7XG4gICAgICAgIHBvb2xbZW1vamlJZF0gPSB0aGlzLmVtb2ppU2VydmljZS5nZXREYXRhKGVtb2ppKTtcbiAgICAgICAgdGhpcy5lbW9qaXNMaXN0W2Vtb2ppSWRdID0gdGhpcy5lbW9qaVNlcnZpY2UuZ2V0U2FuaXRpemVkRGF0YShlbW9qaSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBzZWFyY2goXG4gICAgdmFsdWU6IHN0cmluZyxcbiAgICBlbW9qaXNUb1Nob3dGaWx0ZXI/OiAoeDogYW55KSA9PiBib29sZWFuLFxuICAgIG1heFJlc3VsdHMgPSA3NSxcbiAgICBpbmNsdWRlOiBhbnlbXSA9IFtdLFxuICAgIGV4Y2x1ZGU6IGFueVtdID0gW10sXG4gICAgY3VzdG9tOiBhbnlbXSA9IFtdLFxuICApOiBFbW9qaURhdGFbXSB8IG51bGwge1xuICAgIHRoaXMuYWRkQ3VzdG9tVG9Qb29sKGN1c3RvbSwgdGhpcy5vcmlnaW5hbFBvb2wpO1xuXG4gICAgbGV0IHJlc3VsdHM6IEVtb2ppRGF0YVtdIHwgdW5kZWZpbmVkO1xuICAgIGxldCBwb29sID0gdGhpcy5vcmlnaW5hbFBvb2w7XG5cbiAgICBpZiAodmFsdWUubGVuZ3RoKSB7XG4gICAgICBpZiAodmFsdWUgPT09ICctJyB8fCB2YWx1ZSA9PT0gJy0xJykge1xuICAgICAgICByZXR1cm4gW3RoaXMuZW1vamlzTGlzdFsnLTEnXV07XG4gICAgICB9XG4gICAgICBpZiAodmFsdWUgPT09ICcrJyB8fCB2YWx1ZSA9PT0gJysxJykge1xuICAgICAgICByZXR1cm4gW3RoaXMuZW1vamlzTGlzdFsnKzEnXV07XG4gICAgICB9XG5cbiAgICAgIGxldCB2YWx1ZXMgPSB2YWx1ZS50b0xvd2VyQ2FzZSgpLnNwbGl0KC9bXFxzfCx8XFwtfF9dKy8pO1xuICAgICAgbGV0IGFsbFJlc3VsdHMgPSBbXTtcblxuICAgICAgaWYgKHZhbHVlcy5sZW5ndGggPiAyKSB7XG4gICAgICAgIHZhbHVlcyA9IFt2YWx1ZXNbMF0sIHZhbHVlc1sxXV07XG4gICAgICB9XG5cbiAgICAgIGlmIChpbmNsdWRlLmxlbmd0aCB8fCBleGNsdWRlLmxlbmd0aCkge1xuICAgICAgICBwb29sID0ge307XG5cbiAgICAgICAgY2F0ZWdvcmllcy5mb3JFYWNoKGNhdGVnb3J5ID0+IHtcbiAgICAgICAgICBjb25zdCBpc0luY2x1ZGVkID1cbiAgICAgICAgICAgIGluY2x1ZGUgJiYgaW5jbHVkZS5sZW5ndGhcbiAgICAgICAgICAgICAgPyBpbmNsdWRlLmluZGV4T2YoY2F0ZWdvcnkuaWQpID4gLTFcbiAgICAgICAgICAgICAgOiB0cnVlO1xuICAgICAgICAgIGNvbnN0IGlzRXhjbHVkZWQgPVxuICAgICAgICAgICAgZXhjbHVkZSAmJiBleGNsdWRlLmxlbmd0aFxuICAgICAgICAgICAgICA/IGV4Y2x1ZGUuaW5kZXhPZihjYXRlZ29yeS5pZCkgPiAtMVxuICAgICAgICAgICAgICA6IGZhbHNlO1xuICAgICAgICAgIGlmICghaXNJbmNsdWRlZCB8fCBpc0V4Y2x1ZGVkKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgY2F0ZWdvcnkuZW1vamlzLmZvckVhY2goXG4gICAgICAgICAgICBlbW9qaUlkID0+IChwb29sW2Vtb2ppSWRdID0gdGhpcy5lbW9qaVNlcnZpY2UubmFtZXNbZW1vamlJZF0pLFxuICAgICAgICAgICk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmIChjdXN0b20ubGVuZ3RoKSB7XG4gICAgICAgICAgY29uc3QgY3VzdG9tSXNJbmNsdWRlZCA9XG4gICAgICAgICAgICBpbmNsdWRlICYmIGluY2x1ZGUubGVuZ3RoID8gaW5jbHVkZS5pbmRleE9mKCdjdXN0b20nKSA+IC0xIDogdHJ1ZTtcbiAgICAgICAgICBjb25zdCBjdXN0b21Jc0V4Y2x1ZGVkID1cbiAgICAgICAgICAgIGV4Y2x1ZGUgJiYgZXhjbHVkZS5sZW5ndGggPyBleGNsdWRlLmluZGV4T2YoJ2N1c3RvbScpID4gLTEgOiBmYWxzZTtcbiAgICAgICAgICBpZiAoY3VzdG9tSXNJbmNsdWRlZCAmJiAhY3VzdG9tSXNFeGNsdWRlZCkge1xuICAgICAgICAgICAgdGhpcy5hZGRDdXN0b21Ub1Bvb2woY3VzdG9tLCBwb29sKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgYWxsUmVzdWx0cyA9IHZhbHVlc1xuICAgICAgICAubWFwKHYgPT4ge1xuICAgICAgICAgIGxldCBhUG9vbCA9IHBvb2w7XG4gICAgICAgICAgbGV0IGFJbmRleCA9IHRoaXMuaW5kZXg7XG4gICAgICAgICAgbGV0IGxlbmd0aCA9IDA7XG5cbiAgICAgICAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6IHByZWZlci1mb3Itb2ZcbiAgICAgICAgICBmb3IgKGxldCBjaGFySW5kZXggPSAwOyBjaGFySW5kZXggPCB2Lmxlbmd0aDsgY2hhckluZGV4KyspIHtcbiAgICAgICAgICAgIGNvbnN0IGNoYXIgPSB2W2NoYXJJbmRleF07XG4gICAgICAgICAgICBsZW5ndGgrKztcbiAgICAgICAgICAgIGlmICghYUluZGV4W2NoYXJdKSB7XG4gICAgICAgICAgICAgIGFJbmRleFtjaGFyXSA9IHt9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYUluZGV4ID0gYUluZGV4W2NoYXJdO1xuXG4gICAgICAgICAgICBpZiAoIWFJbmRleC5yZXN1bHRzKSB7XG4gICAgICAgICAgICAgIGNvbnN0IHNjb3JlczogeyBba2V5OiBzdHJpbmddOiBudW1iZXIgfSA9IHt9O1xuXG4gICAgICAgICAgICAgIGFJbmRleC5yZXN1bHRzID0gW107XG4gICAgICAgICAgICAgIGFJbmRleC5wb29sID0ge307XG5cbiAgICAgICAgICAgICAgZm9yIChjb25zdCBpZCBvZiBPYmplY3Qua2V5cyhhUG9vbCkpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBlbW9qaSA9IGFQb29sW2lkXTtcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMuZW1vamlTZWFyY2hbaWRdKSB7XG4gICAgICAgICAgICAgICAgICB0aGlzLmVtb2ppU2VhcmNoW2lkXSA9IHRoaXMuYnVpbGRTZWFyY2goXG4gICAgICAgICAgICAgICAgICAgIGVtb2ppLnNob3J0X25hbWVzLFxuICAgICAgICAgICAgICAgICAgICBlbW9qaS5uYW1lLFxuICAgICAgICAgICAgICAgICAgICBlbW9qaS5rZXl3b3JkcyxcbiAgICAgICAgICAgICAgICAgICAgZW1vamkuZW1vdGljb25zLFxuICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY29uc3QgcXVlcnkgPSB0aGlzLmVtb2ppU2VhcmNoW2lkXTtcbiAgICAgICAgICAgICAgICBjb25zdCBzdWIgPSB2LnN1YnN0cigwLCBsZW5ndGgpO1xuICAgICAgICAgICAgICAgIGNvbnN0IHN1YkluZGV4ID0gcXVlcnkuaW5kZXhPZihzdWIpO1xuXG4gICAgICAgICAgICAgICAgaWYgKHN1YkluZGV4ICE9PSAtMSkge1xuICAgICAgICAgICAgICAgICAgbGV0IHNjb3JlID0gc3ViSW5kZXggKyAxO1xuICAgICAgICAgICAgICAgICAgaWYgKHN1YiA9PT0gaWQpIHtcbiAgICAgICAgICAgICAgICAgICAgc2NvcmUgPSAwO1xuICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICBhSW5kZXgucmVzdWx0cy5wdXNoKHRoaXMuZW1vamlzTGlzdFtpZF0pO1xuICAgICAgICAgICAgICAgICAgYUluZGV4LnBvb2xbaWRdID0gZW1vamk7XG5cbiAgICAgICAgICAgICAgICAgIHNjb3Jlc1tpZF0gPSBzY29yZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICBhSW5kZXgucmVzdWx0cy5zb3J0KChhLCBiKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgYVNjb3JlID0gc2NvcmVzW2EuaWRdO1xuICAgICAgICAgICAgICAgIGNvbnN0IGJTY29yZSA9IHNjb3Jlc1tiLmlkXTtcblxuICAgICAgICAgICAgICAgIHJldHVybiBhU2NvcmUgLSBiU2NvcmU7XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBhUG9vbCA9IGFJbmRleC5wb29sO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHJldHVybiBhSW5kZXgucmVzdWx0cztcbiAgICAgICAgfSlcbiAgICAgICAgLmZpbHRlcihhID0+IGEpO1xuXG4gICAgICBpZiAoYWxsUmVzdWx0cy5sZW5ndGggPiAxKSB7XG4gICAgICAgIHJlc3VsdHMgPSBpbnRlcnNlY3QuYXBwbHkobnVsbCwgYWxsUmVzdWx0cyBhcyBhbnkpO1xuICAgICAgfSBlbHNlIGlmIChhbGxSZXN1bHRzLmxlbmd0aCkge1xuICAgICAgICByZXN1bHRzID0gYWxsUmVzdWx0c1swXTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlc3VsdHMgPSBbXTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAocmVzdWx0cykge1xuICAgICAgaWYgKGVtb2ppc1RvU2hvd0ZpbHRlcikge1xuICAgICAgICByZXN1bHRzID0gcmVzdWx0cy5maWx0ZXIoKHJlc3VsdDogRW1vamlEYXRhKSA9PlxuICAgICAgICAgIGVtb2ppc1RvU2hvd0ZpbHRlcih0aGlzLmVtb2ppU2VydmljZS5uYW1lc1tyZXN1bHQuaWRdKSxcbiAgICAgICAgKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHJlc3VsdHMgJiYgcmVzdWx0cy5sZW5ndGggPiBtYXhSZXN1bHRzKSB7XG4gICAgICAgIHJlc3VsdHMgPSByZXN1bHRzLnNsaWNlKDAsIG1heFJlc3VsdHMpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0cyB8fCBudWxsO1xuICB9XG5cbiAgYnVpbGRTZWFyY2goXG4gICAgc2hvcnROYW1lczogc3RyaW5nW10sXG4gICAgbmFtZTogc3RyaW5nLFxuICAgIGtleXdvcmRzOiBzdHJpbmdbXSxcbiAgICBlbW90aWNvbnM6IHN0cmluZ1tdLFxuICApIHtcbiAgICBjb25zdCBzZWFyY2g6IHN0cmluZ1tdID0gW107XG5cbiAgICBjb25zdCBhZGRUb1NlYXJjaCA9IChzdHJpbmdzOiBzdHJpbmcgfCBzdHJpbmdbXSwgc3BsaXQ6IGJvb2xlYW4pID0+IHtcbiAgICAgIGlmICghc3RyaW5ncykge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIChBcnJheS5pc0FycmF5KHN0cmluZ3MpID8gc3RyaW5ncyA6IFtzdHJpbmdzXSkuZm9yRWFjaChzdHIgPT4ge1xuICAgICAgICAoc3BsaXQgPyBzdHIuc3BsaXQoL1stfF98XFxzXSsvKSA6IFtzdHJdKS5mb3JFYWNoKHMgPT4ge1xuICAgICAgICAgIHMgPSBzLnRvTG93ZXJDYXNlKCk7XG5cbiAgICAgICAgICBpZiAoIXNlYXJjaC5pbmNsdWRlcyhzKSkge1xuICAgICAgICAgICAgc2VhcmNoLnB1c2gocyk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH07XG5cbiAgICBhZGRUb1NlYXJjaChzaG9ydE5hbWVzLCB0cnVlKTtcbiAgICBhZGRUb1NlYXJjaChuYW1lLCB0cnVlKTtcbiAgICBhZGRUb1NlYXJjaChrZXl3b3JkcywgZmFsc2UpO1xuICAgIGFkZFRvU2VhcmNoKGVtb3RpY29ucywgZmFsc2UpO1xuXG4gICAgcmV0dXJuIHNlYXJjaC5qb2luKCcsJyk7XG4gIH1cbn1cbiJdfQ==