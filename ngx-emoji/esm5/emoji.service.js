import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import { emojis } from './data/emojis';
import * as i0 from "@angular/core";
var COLONS_REGEX = /^(?:\:([^\:]+)\:)(?:\:skin-tone-(\d)\:)?$/;
var SKINS = ['1F3FA', '1F3FB', '1F3FC', '1F3FD', '1F3FE', '1F3FF'];
export var DEFAULT_BACKGROUNDFN = function (set, sheetSize) { return "https://unpkg.com/emoji-datasource-" + set + "@4.0.4/img/" + set + "/sheets-256/" + sheetSize + ".png"; };
var EmojiService = /** @class */ (function () {
    function EmojiService() {
        this.uncompressed = false;
        this.names = {};
        this.emojis = [];
        if (!this.uncompressed) {
            this.uncompress(emojis);
            this.uncompressed = true;
        }
    }
    EmojiService.prototype.uncompress = function (list) {
        var _this = this;
        this.emojis = list.map(function (emoji) {
            var e_1, _a;
            var data = tslib_1.__assign({}, emoji);
            if (!data.shortNames) {
                data.shortNames = [];
            }
            data.shortNames.unshift(data.shortName);
            data.id = data.shortName;
            data.native = _this.unifiedToNative(data.unified);
            if (!data.skinVariations) {
                data.skinVariations = [];
            }
            if (!data.keywords) {
                data.keywords = [];
            }
            if (!data.emoticons) {
                data.emoticons = [];
            }
            if (!data.hidden) {
                data.hidden = [];
            }
            if (!data.text) {
                data.text = '';
            }
            if (data.obsoletes) {
                // get keywords from emoji that it obsoletes since that is shared
                var f = list.find(function (x) { return x.unified === data.obsoletes; });
                if (f) {
                    if (f.keywords) {
                        data.keywords = tslib_1.__spread(data.keywords, f.keywords, [f.shortName]);
                    }
                    else {
                        data.keywords = tslib_1.__spread(data.keywords, [f.shortName]);
                    }
                }
            }
            _this.names[data.unified] = data;
            try {
                for (var _b = tslib_1.__values(data.shortNames), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var n = _c.value;
                    _this.names[n] = data;
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_1) throw e_1.error; }
            }
            return data;
        });
    };
    EmojiService.prototype.getData = function (emoji, skin, set) {
        var emojiData;
        if (typeof emoji === 'string') {
            var matches = emoji.match(COLONS_REGEX);
            if (matches) {
                emoji = matches[1];
                if (matches[2]) {
                    skin = parseInt(matches[2], 10);
                }
            }
            if (this.names.hasOwnProperty(emoji)) {
                emojiData = this.names[emoji];
            }
            else {
                return null;
            }
        }
        else if (emoji.id) {
            emojiData = this.names[emoji.id];
        }
        else if (emoji.unified) {
            emojiData = this.names[emoji.unified.toUpperCase()];
        }
        if (!emojiData) {
            emojiData = emoji;
            emojiData.custom = true;
        }
        var hasSkinVariations = emojiData.skinVariations && emojiData.skinVariations.length;
        if (hasSkinVariations && skin && skin > 1 && set) {
            emojiData = tslib_1.__assign({}, emojiData);
            var skinKey_1 = SKINS[skin - 1];
            var variationData = emojiData.skinVariations.find(function (n) {
                return n.unified.includes(skinKey_1);
            });
            if (!variationData.hidden || !variationData.hidden.includes(set)) {
                emojiData.skinTone = skin;
                emojiData = tslib_1.__assign({}, emojiData, variationData);
            }
            emojiData.native = this.unifiedToNative(emojiData.unified);
        }
        emojiData.set = set || '';
        return emojiData;
    };
    EmojiService.prototype.unifiedToNative = function (unified) {
        var codePoints = unified.split('-').map(function (u) { return parseInt("0x" + u, 16); });
        return String.fromCodePoint.apply(String, tslib_1.__spread(codePoints));
    };
    EmojiService.prototype.emojiSpriteStyles = function (sheet, set, size, sheetSize, backgroundImageFn, sheetColumns) {
        if (set === void 0) { set = 'apple'; }
        if (size === void 0) { size = 24; }
        if (sheetSize === void 0) { sheetSize = 64; }
        if (backgroundImageFn === void 0) { backgroundImageFn = DEFAULT_BACKGROUNDFN; }
        if (sheetColumns === void 0) { sheetColumns = 52; }
        return {
            width: size + "px",
            height: size + "px",
            display: 'inline-block',
            'background-image': "url(" + backgroundImageFn(set, sheetSize) + ")",
            'background-size': 100 * sheetColumns + "%",
            'background-position': this.getSpritePosition(sheet, sheetColumns),
        };
    };
    EmojiService.prototype.getSpritePosition = function (sheet, sheetColumns) {
        var _a = tslib_1.__read(sheet, 2), sheetX = _a[0], sheetY = _a[1];
        var multiply = 100 / (sheetColumns - 1);
        return multiply * sheetX + "% " + multiply * sheetY + "%";
    };
    EmojiService.prototype.sanitize = function (emoji) {
        if (emoji === null) {
            return null;
        }
        var id = emoji.id || emoji.shortNames[0];
        var colons = ":" + id + ":";
        if (emoji.skinTone) {
            colons += ":skin-tone-" + emoji.skinTone + ":";
        }
        emoji.colons = colons;
        return tslib_1.__assign({}, emoji);
    };
    EmojiService.prototype.getSanitizedData = function (emoji, skin, set) {
        return this.sanitize(this.getData(emoji, skin, set));
    };
    EmojiService.ngInjectableDef = i0.defineInjectable({ factory: function EmojiService_Factory() { return new EmojiService(); }, token: EmojiService, providedIn: "root" });
    EmojiService = tslib_1.__decorate([
        Injectable({ providedIn: 'root' }),
        tslib_1.__metadata("design:paramtypes", [])
    ], EmojiService);
    return EmojiService;
}());
export { EmojiService };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW1vamkuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BjdHJsL25neC1lbW9qaS1tYXJ0L25neC1lbW9qaS8iLCJzb3VyY2VzIjpbImVtb2ppLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFPM0MsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLGVBQWUsQ0FBQzs7QUFHdkMsSUFBTSxZQUFZLEdBQUcsMkNBQTJDLENBQUM7QUFDakUsSUFBTSxLQUFLLEdBQUcsQ0FBQyxPQUFPLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBRSxPQUFPLEVBQUUsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0FBQ3JFLE1BQU0sQ0FBQyxJQUFNLG9CQUFvQixHQUFHLFVBQ2xDLEdBQVcsRUFDWCxTQUFpQixJQUNkLE9BQUEsd0NBQXNDLEdBQUcsbUJBQWMsR0FBRyxvQkFBZSxTQUFTLFNBQU0sRUFBeEYsQ0FBd0YsQ0FBQztBQUc5RjtJQUtFO1FBSkEsaUJBQVksR0FBRyxLQUFLLENBQUM7UUFDckIsVUFBSyxHQUFpQyxFQUFFLENBQUM7UUFDekMsV0FBTSxHQUFnQixFQUFFLENBQUM7UUFHdkIsSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLEVBQUU7WUFDdEIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUN4QixJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQztTQUMxQjtJQUNILENBQUM7SUFFRCxpQ0FBVSxHQUFWLFVBQVcsSUFBMkI7UUFBdEMsaUJBZ0RDO1FBL0NDLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxVQUFBLEtBQUs7O1lBQzFCLElBQU0sSUFBSSx3QkFBYSxLQUFLLENBQUUsQ0FBQztZQUMvQixJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRTtnQkFDcEIsSUFBSSxDQUFDLFVBQVUsR0FBRyxFQUFFLENBQUM7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QUssUUFBUSxHQUFHLE1BQU0sTUFBRyxDQUFDO0lBQ3ZELENBQUM7SUFFRCwrQkFBUSxHQUFSLFVBQVMsS0FBdUI7UUFDOUIsSUFBSSxLQUFLLEtBQUssSUFBSSxFQUFFO1lBQ2xCLE9BQU8sSUFBSSxDQUFDO1NBQ2I7UUFDRCxJQUFNLEVBQUUsR0FBRyxLQUFLLENBQUMsRUFBRSxJQUFJLEtBQUssQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDM0MsSUFBSSxNQUFNLEdBQUcsTUFBSSxFQUFFLE1BQUcsQ0FBQztRQUN2QixJQUFJLEtBQUssQ0FBQyxRQUFRLEVBQUU7WUFDbEIsTUFBTSxJQUFJLGdCQUFjLEtBQUssQ0FBQyxRQUFRLE1BQUcsQ0FBQztTQUMzQztRQUNELEtBQUssQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO1FBQ3RCLDRCQUFZLEtBQUssRUFBRztJQUN0QixDQUFDO0lBRUQsdUNBQWdCLEdBQWhCLFVBQ0UsS0FBeUIsRUFDekIsSUFBb0IsRUFDcEIsR0FBa0I7UUFFbEIsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDO0lBQ3ZELENBQUM7O0lBbktVLFlBQVk7UUFEeEIsVUFBVSxDQUFDLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRSxDQUFDOztPQUN0QixZQUFZLENBb0t4Qjt1QkF0TEQ7Q0FzTEMsQUFwS0QsSUFvS0M7U0FwS1ksWUFBWSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHtcbiAgQ29tcHJlc3NlZEVtb2ppRGF0YSxcbiAgRW1vamlEYXRhLFxuICBFbW9qaVZhcmlhdGlvbixcbn0gZnJvbSAnLi9kYXRhL2RhdGEuaW50ZXJmYWNlcyc7XG5pbXBvcnQgeyBlbW9qaXMgfSBmcm9tICcuL2RhdGEvZW1vamlzJztcbmltcG9ydCB7IEVtb2ppIH0gZnJvbSAnLi9lbW9qaS5jb21wb25lbnQnO1xuXG5jb25zdCBDT0xPTlNfUkVHRVggPSAvXig/OlxcOihbXlxcOl0rKVxcOikoPzpcXDpza2luLXRvbmUtKFxcZClcXDopPyQvO1xuY29uc3QgU0tJTlMgPSBbJzFGM0ZBJywgJzFGM0ZCJywgJzFGM0ZDJywgJzFGM0ZEJywgJzFGM0ZFJywgJzFGM0ZGJ107XG5leHBvcnQgY29uc3QgREVGQVVMVF9CQUNLR1JPVU5ERk4gPSAoXG4gIHNldDogc3RyaW5nLFxuICBzaGVldFNpemU6IG51bWJlcixcbikgPT4gYGh0dHBzOi8vdW5wa2cuY29tL2Vtb2ppLWRhdGFzb3VyY2UtJHtzZXR9QDQuMC40L2ltZy8ke3NldH0vc2hlZXRzLTI1Ni8ke3NoZWV0U2l6ZX0ucG5nYDtcblxuQEluamVjdGFibGUoeyBwcm92aWRlZEluOiAncm9vdCcgfSlcbmV4cG9ydCBjbGFzcyBFbW9qaVNlcnZpY2Uge1xuICB1bmNvbXByZXNzZWQgPSBmYWxzZTtcbiAgbmFtZXM6IHsgW2tleTogc3RyaW5nXTogRW1vamlEYXRhIH0gPSB7fTtcbiAgZW1vamlzOiBFbW9qaURhdGFbXSA9IFtdO1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIGlmICghdGhpcy51bmNvbXByZXNzZWQpIHtcbiAgICAgIHRoaXMudW5jb21wcmVzcyhlbW9qaXMpO1xuICAgICAgdGhpcy51bmNvbXByZXNzZWQgPSB0cnVlO1xuICAgIH1cbiAgfVxuXG4gIHVuY29tcHJlc3MobGlzdDogQ29tcHJlc3NlZEVtb2ppRGF0YVtdKSB7XG4gICAgdGhpcy5lbW9qaXMgPSBsaXN0Lm1hcChlbW9qaSA9PiB7XG4gICAgICBjb25zdCBkYXRhOiBhbnkgPSB7IC4uLmVtb2ppIH07XG4gICAgICBpZiAoIWRhdGEuc2hvcnROYW1lcykge1xuICAgICAgICBkYXRhLnNob3J0TmFtZXMgPSBbXTtcbiAgICAgIH1cbiAgICAgIGRhdGEuc2hvcnROYW1lcy51bnNoaWZ0KGRhdGEuc2hvcnROYW1lKTtcbiAgICAgIGRhdGEuaWQgPSBkYXRhLnNob3J0TmFtZTtcbiAgICAgIGRhdGEubmF0aXZlID0gdGhpcy51bmlmaWVkVG9OYXRpdmUoZGF0YS51bmlmaWVkKTtcblxuICAgICAgaWYgKCFkYXRhLnNraW5WYXJpYXRpb25zKSB7XG4gICAgICAgIGRhdGEuc2tpblZhcmlhdGlvbnMgPSBbXTtcbiAgICAgIH1cblxuICAgICAgaWYgKCFkYXRhLmtleXdvcmRzKSB7XG4gICAgICAgIGRhdGEua2V5d29yZHMgPSBbXTtcbiAgICAgIH1cblxuICAgICAgaWYgKCFkYXRhLmVtb3RpY29ucykge1xuICAgICAgICBkYXRhLmVtb3RpY29ucyA9IFtdO1xuICAgICAgfVxuXG4gICAgICBpZiAoIWRhdGEuaGlkZGVuKSB7XG4gICAgICAgIGRhdGEuaGlkZGVuID0gW107XG4gICAgICB9XG5cbiAgICAgIGlmICghZGF0YS50ZXh0KSB7XG4gICAgICAgIGRhdGEudGV4dCA9ICcnO1xuICAgICAgfVxuXG4gICAgICBpZiAoZGF0YS5vYnNvbGV0ZXMpIHtcbiAgICAgICAgLy8gZ2V0IGtleXdvcmRzIGZyb20gZW1vamkgdGhhdCBpdCBvYnNvbGV0ZXMgc2luY2UgdGhhdCBpcyBzaGFyZWRcbiAgICAgICAgY29uc3QgZiA9IGxpc3QuZmluZCh4ID0+IHgudW5pZmllZCA9PT0gZGF0YS5vYnNvbGV0ZXMpO1xuICAgICAgICBpZiAoZikge1xuICAgICAgICAgIGlmIChmLmtleXdvcmRzKSB7XG4gICAgICAgICAgICBkYXRhLmtleXdvcmRzID0gWy4uLmRhdGEua2V5d29yZHMsIC4uLmYua2V5d29yZHMsIGYuc2hvcnROYW1lXTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZGF0YS5rZXl3b3JkcyA9IFsuLi5kYXRhLmtleXdvcmRzLCBmLnNob3J0TmFtZV07XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHRoaXMubmFtZXNbZGF0YS51bmlmaWVkXSA9IGRhdGE7XG4gICAgICBmb3IgKGNvbnN0IG4gb2YgZGF0YS5zaG9ydE5hbWVzKSB7XG4gICAgICAgIHRoaXMubmFtZXNbbl0gPSBkYXRhO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGRhdGE7XG4gICAgfSk7XG4gIH1cblxuICBnZXREYXRhKFxuICAgIGVtb2ppOiBFbW9qaURhdGEgfCBzdHJpbmcsXG4gICAgc2tpbj86IEVtb2ppWydza2luJ10sXG4gICAgc2V0PzogRW1vamlbJ3NldCddLFxuICApOiBFbW9qaURhdGEgfCBudWxsIHtcbiAgICBsZXQgZW1vamlEYXRhOiBhbnk7XG5cbiAgICBpZiAodHlwZW9mIGVtb2ppID09PSAnc3RyaW5nJykge1xuICAgICAgY29uc3QgbWF0Y2hlcyA9IGVtb2ppLm1hdGNoKENPTE9OU19SRUdFWCk7XG5cbiAgICAgIGlmIChtYXRjaGVzKSB7XG4gICAgICAgIGVtb2ppID0gbWF0Y2hlc1sxXTtcblxuICAgICAgICBpZiAobWF0Y2hlc1syXSkge1xuICAgICAgICAgIHNraW4gPSBwYXJzZUludChtYXRjaGVzWzJdLCAxMCkgYXMgRW1vamlbJ3NraW4nXTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKHRoaXMubmFtZXMuaGFzT3duUHJvcGVydHkoZW1vamkpKSB7XG4gICAgICAgIGVtb2ppRGF0YSA9IHRoaXMubmFtZXNbZW1vamldO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChlbW9qaS5pZCkge1xuICAgICAgZW1vamlEYXRhID0gdGhpcy5uYW1lc1tlbW9qaS5pZF07XG4gICAgfSBlbHNlIGlmIChlbW9qaS51bmlmaWVkKSB7XG4gICAgICBlbW9qaURhdGEgPSB0aGlzLm5hbWVzW2Vtb2ppLnVuaWZpZWQudG9VcHBlckNhc2UoKV07XG4gICAgfVxuXG4gICAgaWYgKCFlbW9qaURhdGEpIHtcbiAgICAgIGVtb2ppRGF0YSA9IGVtb2ppO1xuICAgICAgZW1vamlEYXRhLmN1c3RvbSA9IHRydWU7XG4gICAgfVxuXG4gICAgY29uc3QgaGFzU2tpblZhcmlhdGlvbnMgPSBlbW9qaURhdGEuc2tpblZhcmlhdGlvbnMgJiYgZW1vamlEYXRhLnNraW5WYXJpYXRpb25zLmxlbmd0aDtcbiAgICBpZiAoaGFzU2tpblZhcmlhdGlvbnMgJiYgc2tpbiAmJiBza2luID4gMSAmJiBzZXQpIHtcbiAgICAgIGVtb2ppRGF0YSA9IHsgLi4uZW1vamlEYXRhIH07XG5cbiAgICAgIGNvbnN0IHNraW5LZXkgPSBTS0lOU1tza2luIC0gMV07XG4gICAgICBjb25zdCB2YXJpYXRpb25EYXRhID0gZW1vamlEYXRhLnNraW5WYXJpYXRpb25zLmZpbmQoKG46IEVtb2ppVmFyaWF0aW9uKSA9PlxuICAgICAgICBuLnVuaWZpZWQuaW5jbHVkZXMoc2tpbktleSksXG4gICAgICApO1xuXG4gICAgICBpZiAoIXZhcmlhdGlvbkRhdGEuaGlkZGVuIHx8ICF2YXJpYXRpb25EYXRhLmhpZGRlbi5pbmNsdWRlcyhzZXQpKSB7XG4gICAgICAgIGVtb2ppRGF0YS5za2luVG9uZSA9IHNraW47XG4gICAgICAgIGVtb2ppRGF0YSA9IHsgLi4uZW1vamlEYXRhLCAuLi52YXJpYXRpb25EYXRhIH07XG4gICAgICB9XG4gICAgICBlbW9qaURhdGEubmF0aXZlID0gdGhpcy51bmlmaWVkVG9OYXRpdmUoZW1vamlEYXRhLnVuaWZpZWQpO1xuICAgIH1cblxuICAgIGVtb2ppRGF0YS5zZXQgPSBzZXQgfHwgJyc7XG4gICAgcmV0dXJuIGVtb2ppRGF0YSBhcyBFbW9qaURhdGE7XG4gIH1cblxuICB1bmlmaWVkVG9OYXRpdmUodW5pZmllZDogc3RyaW5nKSB7XG4gICAgY29uc3QgY29kZVBvaW50cyA9IHVuaWZpZWQuc3BsaXQoJy0nKS5tYXAodSA9PiBwYXJzZUludChgMHgke3V9YCwgMTYpKTtcbiAgICByZXR1cm4gU3RyaW5nLmZyb21Db2RlUG9pbnQoLi4uY29kZVBvaW50cyk7XG4gIH1cblxuICBlbW9qaVNwcml0ZVN0eWxlcyhcbiAgICBzaGVldDogRW1vamlEYXRhWydzaGVldCddLFxuICAgIHNldDogRW1vamlbJ3NldCddID0gJ2FwcGxlJyxcbiAgICBzaXplOiBFbW9qaVsnc2l6ZSddID0gMjQsXG4gICAgc2hlZXRTaXplOiBFbW9qaVsnc2hlZXRTaXplJ10gPSA2NCxcbiAgICBiYWNrZ3JvdW5kSW1hZ2VGbjogRW1vamlbJ2JhY2tncm91bmRJbWFnZUZuJ10gPSBERUZBVUxUX0JBQ0tHUk9VTkRGTixcbiAgICBzaGVldENvbHVtbnMgPSA1MixcbiAgICApIHtcbiAgICByZXR1cm4ge1xuICAgICAgd2lkdGg6IGAke3NpemV9cHhgLFxuICAgICAgaGVpZ2h0OiBgJHtzaXplfXB4YCxcbiAgICAgIGRpc3BsYXk6ICdpbmxpbmUtYmxvY2snLFxuICAgICAgJ2JhY2tncm91bmQtaW1hZ2UnOiBgdXJsKCR7YmFja2dyb3VuZEltYWdlRm4oc2V0LCBzaGVldFNpemUpfSlgLFxuICAgICAgJ2JhY2tncm91bmQtc2l6ZSc6IGAkezEwMCAqIHNoZWV0Q29sdW1uc30lYCxcbiAgICAgICdiYWNrZ3JvdW5kLXBvc2l0aW9uJzogdGhpcy5nZXRTcHJpdGVQb3NpdGlvbihzaGVldCwgc2hlZXRDb2x1bW5zKSxcbiAgICB9O1xuICB9XG5cbiAgZ2V0U3ByaXRlUG9zaXRpb24oc2hlZXQ6IEVtb2ppRGF0YVsnc2hlZXQnXSwgc2hlZXRDb2x1bW5zOiBudW1iZXIpIHtcbiAgICBjb25zdCBbc2hlZXRYLCBzaGVldFldID0gc2hlZXQ7XG4gICAgY29uc3QgbXVsdGlwbHkgPSAxMDAgLyAoc2hlZXRDb2x1bW5zIC0gMSk7XG4gICAgcmV0dXJuIGAke211bHRpcGx5ICogc2hlZXRYfSUgJHttdWx0aXBseSAqIHNoZWV0WX0lYDtcbiAgfVxuXG4gIHNhbml0aXplKGVtb2ppOiBFbW9qaURhdGEgfCBudWxsKTogRW1vamlEYXRhIHwgbnVsbCB7XG4gICAgaWYgKGVtb2ppID09PSBudWxsKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgY29uc3QgaWQgPSBlbW9qaS5pZCB8fCBlbW9qaS5zaG9ydE5hbWVzWzBdO1xuICAgIGxldCBjb2xvbnMgPSBgOiR7aWR9OmA7XG4gICAgaWYgKGVtb2ppLnNraW5Ub25lKSB7XG4gICAgICBjb2xvbnMgKz0gYDpza2luLXRvbmUtJHtlbW9qaS5za2luVG9uZX06YDtcbiAgICB9XG4gICAgZW1vamkuY29sb25zID0gY29sb25zO1xuICAgIHJldHVybiB7IC4uLmVtb2ppIH07XG4gIH1cblxuICBnZXRTYW5pdGl6ZWREYXRhKFxuICAgIGVtb2ppOiBzdHJpbmcgfCBFbW9qaURhdGEsXG4gICAgc2tpbj86IEVtb2ppWydza2luJ10sXG4gICAgc2V0PzogRW1vamlbJ3NldCddLFxuICApIHtcbiAgICByZXR1cm4gdGhpcy5zYW5pdGl6ZSh0aGlzLmdldERhdGEoZW1vamksIHNraW4sIHNldCkpO1xuICB9XG59XG4iXX0=