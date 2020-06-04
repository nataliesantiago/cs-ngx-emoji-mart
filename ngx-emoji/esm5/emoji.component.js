import * as tslib_1 from "tslib";
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, } from '@angular/core';
import { DEFAULT_BACKGROUNDFN, EmojiService } from './emoji.service';
var EmojiComponent = /** @class */ (function () {
    function EmojiComponent(emojiService) {
        this.emojiService = emojiService;
        this.skin = 1;
        this.set = 'apple';
        this.sheetSize = 64;
        /** Renders the native unicode emoji */
        this.isNative = false;
        this.forceSize = false;
        this.tooltip = false;
        this.size = 24;
        this.emoji = '';
        this.hideObsolete = false;
        this.SHEET_COLUMNS = 52;
        this.emojiOver = new EventEmitter();
        this.emojiLeave = new EventEmitter();
        this.emojiClick = new EventEmitter();
        this.title = '';
        this.label = '';
        this.custom = false;
        this.isVisible = true;
        // TODO: replace 4.0.3 w/ dynamic get verison from emoji-datasource in package.json
        this.backgroundImageFn = DEFAULT_BACKGROUNDFN;
    }
    EmojiComponent.prototype.ngOnChanges = function () {
        if (!this.emoji) {
            return (this.isVisible = false);
        }
        var data = this.getData();
        if (!data) {
            return (this.isVisible = false);
        }
        // const children = this.children;
        this.unified = data.native || null;
        if (data.custom) {
            this.custom = data.custom;
        }
        if (!data.unified && !data.custom) {
            return (this.isVisible = false);
        }
        if (this.tooltip) {
            this.title = data.shortNames[0];
        }
        if (data.obsoletedBy && this.hideObsolete) {
            return (this.isVisible = false);
        }
        this.label = [data.native]
            .concat(data.shortNames)
            .filter(Boolean)
            .join(', ');
        if (this.isNative && data.unified && data.native) {
            // hide older emoji before the split into gendered emoji
            this.style = { fontSize: this.size + "px" };
            if (this.forceSize) {
                this.style.display = 'inline-block';
                this.style.width = this.size + "px";
                this.style.height = this.size + "px";
                this.style['word-break'] = 'keep-all';
            }
        }
        else if (data.custom) {
            this.style = {
                width: this.size + "px",
                height: this.size + "px",
                display: 'inline-block',
            };
            if (data.spriteUrl && this.sheetRows && this.sheetColumns) {
                this.style = tslib_1.__assign({}, this.style, { backgroundImage: "url(" + data.spriteUrl + ")", backgroundSize: 100 * this.sheetColumns + "% " + 100 *
                        this.sheetRows + "%", backgroundPosition: this.emojiService.getSpritePosition(data.sheet, this.sheetColumns) });
            }
            else {
                this.style = tslib_1.__assign({}, this.style, { backgroundImage: "url(" + data.imageUrl + ")", backgroundSize: 'contain' });
            }
        }
        else {
            if (data.hidden.length && data.hidden.includes(this.set)) {
                if (this.fallback) {
                    this.style = { fontSize: this.size + "px" };
                    this.unified = this.fallback(data, this);
                }
                else {
                    return (this.isVisible = false);
                }
            }
            else {
                this.style = this.emojiService.emojiSpriteStyles(data.sheet, this.set, this.size, this.sheetSize, this.backgroundImageFn, this.SHEET_COLUMNS);
            }
        }
        return (this.isVisible = true);
    };
    EmojiComponent.prototype.getData = function () {
        return this.emojiService.getData(this.emoji, this.skin, this.set);
    };
    EmojiComponent.prototype.getSanitizedData = function () {
        return this.emojiService.getSanitizedData(this.emoji, this.skin, this.set);
    };
    EmojiComponent.prototype.handleClick = function ($event) {
        var emoji = this.getSanitizedData();
        this.emojiClick.emit({ emoji: emoji, $event: $event });
    };
    EmojiComponent.prototype.handleOver = function ($event) {
        var emoji = this.getSanitizedData();
        this.emojiOver.emit({ emoji: emoji, $event: $event });
    };
    EmojiComponent.prototype.handleLeave = function ($event) {
        var emoji = this.getSanitizedData();
        this.emojiLeave.emit({ emoji: emoji, $event: $event });
    };
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object)
    ], EmojiComponent.prototype, "skin", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object)
    ], EmojiComponent.prototype, "set", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object)
    ], EmojiComponent.prototype, "sheetSize", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object)
    ], EmojiComponent.prototype, "isNative", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object)
    ], EmojiComponent.prototype, "forceSize", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object)
    ], EmojiComponent.prototype, "tooltip", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object)
    ], EmojiComponent.prototype, "size", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object)
    ], EmojiComponent.prototype, "emoji", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object)
    ], EmojiComponent.prototype, "fallback", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object)
    ], EmojiComponent.prototype, "hideObsolete", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object)
    ], EmojiComponent.prototype, "SHEET_COLUMNS", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Number)
    ], EmojiComponent.prototype, "sheetRows", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Number)
    ], EmojiComponent.prototype, "sheetColumns", void 0);
    tslib_1.__decorate([
        Output(),
        tslib_1.__metadata("design:type", Object)
    ], EmojiComponent.prototype, "emojiOver", void 0);
    tslib_1.__decorate([
        Output(),
        tslib_1.__metadata("design:type", Object)
    ], EmojiComponent.prototype, "emojiLeave", void 0);
    tslib_1.__decorate([
        Output(),
        tslib_1.__metadata("design:type", Object)
    ], EmojiComponent.prototype, "emojiClick", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object)
    ], EmojiComponent.prototype, "backgroundImageFn", void 0);
    EmojiComponent = tslib_1.__decorate([
        Component({
            selector: 'ngx-emoji',
            template: "\n  <button *ngIf=\"isVisible\"\n    type=\"button\"\n    (click)=\"handleClick($event)\"\n    (mouseenter)=\"handleOver($event)\"\n    (mouseleave)=\"handleLeave($event)\"\n    [title]=\"title\"\n    [attr.aria-label]=\"label\"\n    class=\"emoji-mart-emoji\"\n    [class.emoji-mart-emoji-native]=\"isNative\"\n    [class.emoji-mart-emoji-custom]=\"custom\">\n    <span [ngStyle]=\"style\">\n      <ng-template [ngIf]=\"isNative\">{{ unified }}</ng-template>\n      <ng-content></ng-content>\n    </span>\n  </button>\n  ",
            changeDetection: ChangeDetectionStrategy.OnPush,
            preserveWhitespaces: false
        }),
        tslib_1.__metadata("design:paramtypes", [EmojiService])
    ], EmojiComponent);
    return EmojiComponent;
}());
export { EmojiComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW1vamkuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vQGN0cmwvbmd4LWVtb2ppLW1hcnQvbmd4LWVtb2ppLyIsInNvdXJjZXMiOlsiZW1vamkuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQ0wsdUJBQXVCLEVBQ3ZCLFNBQVMsRUFDVCxZQUFZLEVBQ1osS0FBSyxFQUVMLE1BQU0sR0FDUCxNQUFNLGVBQWUsQ0FBQztBQUd2QixPQUFPLEVBQUUsb0JBQW9CLEVBQUUsWUFBWSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFxRHJFO0lBMkJFLHdCQUFvQixZQUEwQjtRQUExQixpQkFBWSxHQUFaLFlBQVksQ0FBYztRQTFCckMsU0FBSSxHQUFrQixDQUFDLENBQUM7UUFDeEIsUUFBRyxHQUFpQixPQUFPLENBQUM7UUFDNUIsY0FBUyxHQUF1QixFQUFFLENBQUM7UUFDNUMsdUNBQXVDO1FBQzlCLGFBQVEsR0FBc0IsS0FBSyxDQUFDO1FBQ3BDLGNBQVMsR0FBdUIsS0FBSyxDQUFDO1FBQ3RDLFlBQU8sR0FBcUIsS0FBSyxDQUFDO1FBQ2xDLFNBQUksR0FBa0IsRUFBRSxDQUFDO1FBQ3pCLFVBQUssR0FBbUIsRUFBRSxDQUFDO1FBRTNCLGlCQUFZLEdBQUcsS0FBSyxDQUFDO1FBQ3JCLGtCQUFhLEdBQUcsRUFBRSxDQUFDO1FBR2xCLGNBQVMsR0FBdUIsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUNuRCxlQUFVLEdBQXdCLElBQUksWUFBWSxFQUFFLENBQUM7UUFDckQsZUFBVSxHQUF3QixJQUFJLFlBQVksRUFBRSxDQUFDO1FBRS9ELFVBQUssR0FBRyxFQUFFLENBQUM7UUFDWCxVQUFLLEdBQUcsRUFBRSxDQUFDO1FBRVgsV0FBTSxHQUFHLEtBQUssQ0FBQztRQUNmLGNBQVMsR0FBRyxJQUFJLENBQUM7UUFDakIsbUZBQW1GO1FBQzFFLHNCQUFpQixHQUErQixvQkFBb0IsQ0FBQztJQUU3QixDQUFDO0lBRWxELG9D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LEtBQUssRUFBRTs7cURBQW9CO0lBQ25CO1FBQVIsS0FBSyxFQUFFOzt3REFBdUI7SUFDckI7UUFBVCxNQUFNLEVBQUU7O3FEQUFvRDtJQUNuRDtRQUFULE1BQU0sRUFBRTs7c0RBQXNEO0lBQ3JEO1FBQVQsTUFBTSxFQUFFOztzREFBc0Q7SUFRdEQ7UUFBUixLQUFLLEVBQUU7OzZEQUFzRTtJQXpCbkUsY0FBYztRQXRCMUIsU0FBUyxDQUFDO1lBQ1QsUUFBUSxFQUFFLFdBQVc7WUFDckIsUUFBUSxFQUFFLDRnQkFnQlQ7WUFDRCxlQUFlLEVBQUUsdUJBQXVCLENBQUMsTUFBTTtZQUMvQyxtQkFBbUIsRUFBRSxLQUFLO1NBQzNCLENBQUM7aURBNEJrQyxZQUFZO09BM0JuQyxjQUFjLENBb0kxQjtJQUFELHFCQUFDO0NBQUEsQUFwSUQsSUFvSUM7U0FwSVksY0FBYyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBDb21wb25lbnQsXG4gIEV2ZW50RW1pdHRlcixcbiAgSW5wdXQsXG4gIE9uQ2hhbmdlcyxcbiAgT3V0cHV0LFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHsgRW1vamlEYXRhIH0gZnJvbSAnLi9kYXRhL2RhdGEuaW50ZXJmYWNlcyc7XG5pbXBvcnQgeyBERUZBVUxUX0JBQ0tHUk9VTkRGTiwgRW1vamlTZXJ2aWNlIH0gZnJvbSAnLi9lbW9qaS5zZXJ2aWNlJztcblxuZXhwb3J0IGludGVyZmFjZSBFbW9qaSB7XG4gIC8qKiBSZW5kZXJzIHRoZSBuYXRpdmUgdW5pY29kZSBlbW9qaSAqL1xuICBpc05hdGl2ZTogYm9vbGVhbjtcbiAgZm9yY2VTaXplOiBib29sZWFuO1xuICB0b29sdGlwOiBib29sZWFuO1xuICBza2luOiAxIHwgMiB8IDMgfCA0IHwgNSB8IDY7XG4gIHNoZWV0U2l6ZTogMTYgfCAyMCB8IDMyIHwgNjQ7XG4gIHNldDpcbiAgICB8ICdhcHBsZSdcbiAgICB8ICdnb29nbGUnXG4gICAgfCAndHdpdHRlcidcbiAgICB8ICdlbW9qaW9uZSdcbiAgICB8ICdtZXNzZW5nZXInXG4gICAgfCAnZmFjZWJvb2snXG4gICAgfCAnJztcbiAgc2l6ZTogbnVtYmVyO1xuICBlbW9qaTogc3RyaW5nIHwgRW1vamlEYXRhO1xuICBiYWNrZ3JvdW5kSW1hZ2VGbjogKHNldDogc3RyaW5nLCBzaGVldFNpemU6IG51bWJlcikgPT4gc3RyaW5nO1xuICBmYWxsYmFjaz86IChkYXRhOiBhbnksIHByb3BzOiBhbnkpID0+IHN0cmluZztcbiAgZW1vamlPdmVyOiBFdmVudEVtaXR0ZXI8RW1vamlFdmVudD47XG4gIGVtb2ppTGVhdmU6IEV2ZW50RW1pdHRlcjxFbW9qaUV2ZW50PjtcbiAgZW1vamlDbGljazogRXZlbnRFbWl0dGVyPEVtb2ppRXZlbnQ+O1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIEVtb2ppRXZlbnQge1xuICBlbW9qaTogRW1vamlEYXRhO1xuICAkZXZlbnQ6IEV2ZW50O1xufVxuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICduZ3gtZW1vamknLFxuICB0ZW1wbGF0ZTogYFxuICA8YnV0dG9uICpuZ0lmPVwiaXNWaXNpYmxlXCJcbiAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAoY2xpY2spPVwiaGFuZGxlQ2xpY2soJGV2ZW50KVwiXG4gICAgKG1vdXNlZW50ZXIpPVwiaGFuZGxlT3ZlcigkZXZlbnQpXCJcbiAgICAobW91c2VsZWF2ZSk9XCJoYW5kbGVMZWF2ZSgkZXZlbnQpXCJcbiAgICBbdGl0bGVdPVwidGl0bGVcIlxuICAgIFthdHRyLmFyaWEtbGFiZWxdPVwibGFiZWxcIlxuICAgIGNsYXNzPVwiZW1vamktbWFydC1lbW9qaVwiXG4gICAgW2NsYXNzLmVtb2ppLW1hcnQtZW1vamktbmF0aXZlXT1cImlzTmF0aXZlXCJcbiAgICBbY2xhc3MuZW1vamktbWFydC1lbW9qaS1jdXN0b21dPVwiY3VzdG9tXCI+XG4gICAgPHNwYW4gW25nU3R5bGVdPVwic3R5bGVcIj5cbiAgICAgIDxuZy10ZW1wbGF0ZSBbbmdJZl09XCJpc05hdGl2ZVwiPnt7IHVuaWZpZWQgfX08L25nLXRlbXBsYXRlPlxuICAgICAgPG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50PlxuICAgIDwvc3Bhbj5cbiAgPC9idXR0b24+XG4gIGAsXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICBwcmVzZXJ2ZVdoaXRlc3BhY2VzOiBmYWxzZSxcbn0pXG5leHBvcnQgY2xhc3MgRW1vamlDb21wb25lbnQgaW1wbGVtZW50cyBPbkNoYW5nZXMsIEVtb2ppIHtcbiAgQElucHV0KCkgc2tpbjogRW1vamlbJ3NraW4nXSA9IDE7XG4gIEBJbnB1dCgpIHNldDogRW1vamlbJ3NldCddID0gJ2FwcGxlJztcbiAgQElucHV0KCkgc2hlZXRTaXplOiBFbW9qaVsnc2hlZXRTaXplJ10gPSA2NDtcbiAgLyoqIFJlbmRlcnMgdGhlIG5hdGl2ZSB1bmljb2RlIGVtb2ppICovXG4gIEBJbnB1dCgpIGlzTmF0aXZlOiBFbW9qaVsnaXNOYXRpdmUnXSA9IGZhbHNlO1xuICBASW5wdXQoKSBmb3JjZVNpemU6IEVtb2ppWydmb3JjZVNpemUnXSA9IGZhbHNlO1xuICBASW5wdXQoKSB0b29sdGlwOiBFbW9qaVsndG9vbHRpcCddID0gZmFsc2U7XG4gIEBJbnB1dCgpIHNpemU6IEVtb2ppWydzaXplJ10gPSAyNDtcbiAgQElucHV0KCkgZW1vamk6IEVtb2ppWydlbW9qaSddID0gJyc7XG4gIEBJbnB1dCgpIGZhbGxiYWNrPzogRW1vamlbJ2ZhbGxiYWNrJ107XG4gIEBJbnB1dCgpIGhpZGVPYnNvbGV0ZSA9IGZhbHNlO1xuICBASW5wdXQoKSBTSEVFVF9DT0xVTU5TID0gNTI7XG4gIEBJbnB1dCgpIHNoZWV0Um93cz86IG51bWJlcjtcbiAgQElucHV0KCkgc2hlZXRDb2x1bW5zPzogbnVtYmVyO1xuICBAT3V0cHV0KCkgZW1vamlPdmVyOiBFbW9qaVsnZW1vamlPdmVyJ10gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gIEBPdXRwdXQoKSBlbW9qaUxlYXZlOiBFbW9qaVsnZW1vamlMZWF2ZSddID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICBAT3V0cHV0KCkgZW1vamlDbGljazogRW1vamlbJ2Vtb2ppQ2xpY2snXSA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgc3R5bGU6IGFueTtcbiAgdGl0bGUgPSAnJztcbiAgbGFiZWwgPSAnJztcbiAgdW5pZmllZD86IHN0cmluZyB8IG51bGw7XG4gIGN1c3RvbSA9IGZhbHNlO1xuICBpc1Zpc2libGUgPSB0cnVlO1xuICAvLyBUT0RPOiByZXBsYWNlIDQuMC4zIHcvIGR5bmFtaWMgZ2V0IHZlcmlzb24gZnJvbSBlbW9qaS1kYXRhc291cmNlIGluIHBhY2thZ2UuanNvblxuICBASW5wdXQoKSBiYWNrZ3JvdW5kSW1hZ2VGbjogRW1vamlbJ2JhY2tncm91bmRJbWFnZUZuJ10gPSBERUZBVUxUX0JBQ0tHUk9VTkRGTjtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGVtb2ppU2VydmljZTogRW1vamlTZXJ2aWNlKSB7fVxuXG4gIG5nT25DaGFuZ2VzKCkge1xuICAgIGlmICghdGhpcy5lbW9qaSkge1xuICAgICAgcmV0dXJuICh0aGlzLmlzVmlzaWJsZSA9IGZhbHNlKTtcbiAgICB9XG4gICAgY29uc3QgZGF0YSA9IHRoaXMuZ2V0RGF0YSgpO1xuICAgIGlmICghZGF0YSkge1xuICAgICAgcmV0dXJuICh0aGlzLmlzVmlzaWJsZSA9IGZhbHNlKTtcbiAgICB9XG4gICAgLy8gY29uc3QgY2hpbGRyZW4gPSB0aGlzLmNoaWxkcmVuO1xuICAgIHRoaXMudW5pZmllZCA9IGRhdGEubmF0aXZlIHx8IG51bGw7XG4gICAgaWYgKGRhdGEuY3VzdG9tKSB7XG4gICAgICB0aGlzLmN1c3RvbSA9IGRhdGEuY3VzdG9tO1xuICAgIH1cbiAgICBpZiAoIWRhdGEudW5pZmllZCAmJiAhZGF0YS5jdXN0b20pIHtcbiAgICAgIHJldHVybiAodGhpcy5pc1Zpc2libGUgPSBmYWxzZSk7XG4gICAgfVxuICAgIGlmICh0aGlzLnRvb2x0aXApIHtcbiAgICAgIHRoaXMudGl0bGUgPSBkYXRhLnNob3J0TmFtZXNbMF07XG4gICAgfVxuICAgIGlmIChkYXRhLm9ic29sZXRlZEJ5ICYmIHRoaXMuaGlkZU9ic29sZXRlKSB7XG4gICAgICByZXR1cm4gKHRoaXMuaXNWaXNpYmxlID0gZmFsc2UpO1xuICAgIH1cblxuICAgIHRoaXMubGFiZWwgPSBbZGF0YS5uYXRpdmVdXG4gICAgICAuY29uY2F0KGRhdGEuc2hvcnROYW1lcylcbiAgICAgIC5maWx0ZXIoQm9vbGVhbilcbiAgICAgIC5qb2luKCcsICcpO1xuXG4gICAgaWYgKHRoaXMuaXNOYXRpdmUgJiYgZGF0YS51bmlmaWVkICYmIGRhdGEubmF0aXZlKSB7XG4gICAgICAvLyBoaWRlIG9sZGVyIGVtb2ppIGJlZm9yZSB0aGUgc3BsaXQgaW50byBnZW5kZXJlZCBlbW9qaVxuICAgICAgdGhpcy5zdHlsZSA9IHsgZm9udFNpemU6IGAke3RoaXMuc2l6ZX1weGAgfTtcblxuICAgICAgaWYgKHRoaXMuZm9yY2VTaXplKSB7XG4gICAgICAgIHRoaXMuc3R5bGUuZGlzcGxheSA9ICdpbmxpbmUtYmxvY2snO1xuICAgICAgICB0aGlzLnN0eWxlLndpZHRoID0gYCR7dGhpcy5zaXplfXB4YDtcbiAgICAgICAgdGhpcy5zdHlsZS5oZWlnaHQgPSBgJHt0aGlzLnNpemV9cHhgO1xuICAgICAgICB0aGlzLnN0eWxlWyd3b3JkLWJyZWFrJ10gPSAna2VlcC1hbGwnO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoZGF0YS5jdXN0b20pIHtcbiAgICAgIHRoaXMuc3R5bGUgPSB7XG4gICAgICAgIHdpZHRoOiBgJHt0aGlzLnNpemV9cHhgLFxuICAgICAgICBoZWlnaHQ6IGAke3RoaXMuc2l6ZX1weGAsXG4gICAgICAgIGRpc3BsYXk6ICdpbmxpbmUtYmxvY2snLFxuICAgICAgfTtcbiAgICAgIGlmIChkYXRhLnNwcml0ZVVybCAmJiB0aGlzLnNoZWV0Um93cyAmJiB0aGlzLnNoZWV0Q29sdW1ucykge1xuICAgICAgICB0aGlzLnN0eWxlID0ge1xuICAgICAgICAgIC4uLnRoaXMuc3R5bGUsXG4gICAgICAgICAgYmFja2dyb3VuZEltYWdlOiBgdXJsKCR7ZGF0YS5zcHJpdGVVcmx9KWAsXG4gICAgICAgICAgYmFja2dyb3VuZFNpemU6IGAkezEwMCAqIHRoaXMuc2hlZXRDb2x1bW5zfSUgJHsxMDAgKlxuICAgICAgICAgICAgdGhpcy5zaGVldFJvd3N9JWAsXG4gICAgICAgICAgYmFja2dyb3VuZFBvc2l0aW9uOiB0aGlzLmVtb2ppU2VydmljZS5nZXRTcHJpdGVQb3NpdGlvbihkYXRhLnNoZWV0LCB0aGlzLnNoZWV0Q29sdW1ucyksXG4gICAgICAgIH07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnN0eWxlID0ge1xuICAgICAgICAgIC4uLnRoaXMuc3R5bGUsXG4gICAgICAgICAgYmFja2dyb3VuZEltYWdlOiBgdXJsKCR7ZGF0YS5pbWFnZVVybH0pYCxcbiAgICAgICAgICBiYWNrZ3JvdW5kU2l6ZTogJ2NvbnRhaW4nLFxuICAgICAgICB9O1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoZGF0YS5oaWRkZW4ubGVuZ3RoICYmIGRhdGEuaGlkZGVuLmluY2x1ZGVzKHRoaXMuc2V0KSkge1xuICAgICAgICBpZiAodGhpcy5mYWxsYmFjaykge1xuICAgICAgICAgIHRoaXMuc3R5bGUgPSB7IGZvbnRTaXplOiBgJHt0aGlzLnNpemV9cHhgIH07XG4gICAgICAgICAgdGhpcy51bmlmaWVkID0gdGhpcy5mYWxsYmFjayhkYXRhLCB0aGlzKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gKHRoaXMuaXNWaXNpYmxlID0gZmFsc2UpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnN0eWxlID0gdGhpcy5lbW9qaVNlcnZpY2UuZW1vamlTcHJpdGVTdHlsZXMoXG4gICAgICAgICAgZGF0YS5zaGVldCxcbiAgICAgICAgICB0aGlzLnNldCxcbiAgICAgICAgICB0aGlzLnNpemUsXG4gICAgICAgICAgdGhpcy5zaGVldFNpemUsXG4gICAgICAgICAgdGhpcy5iYWNrZ3JvdW5kSW1hZ2VGbixcbiAgICAgICAgICB0aGlzLlNIRUVUX0NPTFVNTlMsXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiAodGhpcy5pc1Zpc2libGUgPSB0cnVlKTtcbiAgfVxuXG4gIGdldERhdGEoKSB7XG4gICAgcmV0dXJuIHRoaXMuZW1vamlTZXJ2aWNlLmdldERhdGEodGhpcy5lbW9qaSwgdGhpcy5za2luLCB0aGlzLnNldCk7XG4gIH1cblxuICBnZXRTYW5pdGl6ZWREYXRhKCk6IEVtb2ppRGF0YSB7XG4gICAgcmV0dXJuIHRoaXMuZW1vamlTZXJ2aWNlLmdldFNhbml0aXplZERhdGEodGhpcy5lbW9qaSwgdGhpcy5za2luLCB0aGlzLnNldCkgYXMgRW1vamlEYXRhO1xuICB9XG5cbiAgaGFuZGxlQ2xpY2soJGV2ZW50OiBFdmVudCkge1xuICAgIGNvbnN0IGVtb2ppID0gdGhpcy5nZXRTYW5pdGl6ZWREYXRhKCk7XG4gICAgdGhpcy5lbW9qaUNsaWNrLmVtaXQoeyBlbW9qaSwgJGV2ZW50IH0pO1xuICB9XG5cbiAgaGFuZGxlT3ZlcigkZXZlbnQ6IEV2ZW50KSB7XG4gICAgY29uc3QgZW1vamkgPSB0aGlzLmdldFNhbml0aXplZERhdGEoKTtcbiAgICB0aGlzLmVtb2ppT3Zlci5lbWl0KHsgZW1vamksICRldmVudCB9KTtcbiAgfVxuXG4gIGhhbmRsZUxlYXZlKCRldmVudDogRXZlbnQpIHtcbiAgICBjb25zdCBlbW9qaSA9IHRoaXMuZ2V0U2FuaXRpemVkRGF0YSgpO1xuICAgIHRoaXMuZW1vamlMZWF2ZS5lbWl0KHsgZW1vamksICRldmVudCB9KTtcbiAgfVxufVxuIl19