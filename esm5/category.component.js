import * as tslib_1 from "tslib";
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, Output, ViewChild, } from '@angular/core';
import { EmojiService } from '@ctrl/ngx-emoji-mart/ngx-emoji';
import { EmojiFrequentlyService } from './emoji-frequently.service';
var CategoryComponent = /** @class */ (function () {
    function CategoryComponent(ref, emojiService, frequently) {
        this.ref = ref;
        this.emojiService = emojiService;
        this.frequently = frequently;
        this.hasStickyPosition = true;
        this.name = '';
        this.perLine = 9;
        this.totalFrequentLines = 4;
        this.recent = [];
        this.custom = [];
        this.hideObsolete = true;
        this.emojiOver = new EventEmitter();
        this.emojiLeave = new EventEmitter();
        this.emojiClick = new EventEmitter();
        this.containerStyles = {};
        this.labelStyles = {};
        this.labelSpanStyles = {};
        this.margin = 0;
        this.minMargin = 0;
        this.maxMargin = 0;
        this.top = 0;
    }
    CategoryComponent.prototype.ngOnInit = function () {
        this.emojis = this.getEmojis();
        if (!this.emojis) {
            this.containerStyles = { display: 'none' };
        }
        if (!this.hasStickyPosition) {
            this.labelStyles = { height: 28 };
            // this.labelSpanStyles = { position: 'absolute' };
        }
    };
    CategoryComponent.prototype.memoizeSize = function () {
        var parent = this.container.nativeElement.parentNode.parentNode;
        var _a = this.container.nativeElement.getBoundingClientRect(), top = _a.top, height = _a.height;
        var parentTop = parent.getBoundingClientRect().top;
        var labelHeight = this.label.nativeElement.getBoundingClientRect().height;
        this.top = top - parentTop + parent.scrollTop;
        if (height === 0) {
            this.maxMargin = 0;
        }
        else {
            this.maxMargin = height - labelHeight;
        }
    };
    CategoryComponent.prototype.handleScroll = function (scrollTop) {
        var margin = scrollTop - this.top;
        margin = margin < this.minMargin ? this.minMargin : margin;
        margin = margin > this.maxMargin ? this.maxMargin : margin;
        if (margin === this.margin) {
            return false;
        }
        if (!this.hasStickyPosition) {
            this.label.nativeElement.style.top = margin + "px";
        }
        this.margin = margin;
        return true;
    };
    CategoryComponent.prototype.getEmojis = function () {
        var _this = this;
        if (this.name === 'Recent') {
            var frequentlyUsed = this.recent || this.frequently.get(this.perLine, this.totalFrequentLines);
            if (!frequentlyUsed || !frequentlyUsed.length) {
                frequentlyUsed = this.frequently.get(this.perLine, this.totalFrequentLines);
            }
            if (frequentlyUsed.length) {
                this.emojis = frequentlyUsed
                    .map(function (id) {
                    var emoji = _this.custom.filter(function (e) { return e.id === id; })[0];
                    if (emoji) {
                        return emoji;
                    }
                    return id;
                })
                    .filter(function (id) { return !!_this.emojiService.getData(id); });
            }
            if ((!this.emojis || this.emojis.length === 0) && frequentlyUsed.length > 0) {
                return null;
            }
        }
        if (this.emojis) {
            this.emojis = this.emojis.slice(0);
        }
        return this.emojis;
    };
    CategoryComponent.prototype.updateDisplay = function (display) {
        this.containerStyles.display = display;
        this.getEmojis();
        this.ref.detectChanges();
    };
    CategoryComponent.prototype.trackById = function (index, item) {
        return item;
    };
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Array)
    ], CategoryComponent.prototype, "emojis", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object)
    ], CategoryComponent.prototype, "hasStickyPosition", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object)
    ], CategoryComponent.prototype, "name", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object)
    ], CategoryComponent.prototype, "perLine", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object)
    ], CategoryComponent.prototype, "totalFrequentLines", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Array)
    ], CategoryComponent.prototype, "recent", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Array)
    ], CategoryComponent.prototype, "custom", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object)
    ], CategoryComponent.prototype, "i18n", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object)
    ], CategoryComponent.prototype, "id", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object)
    ], CategoryComponent.prototype, "hideObsolete", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", String)
    ], CategoryComponent.prototype, "notFoundEmoji", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object)
    ], CategoryComponent.prototype, "emojiIsNative", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object)
    ], CategoryComponent.prototype, "emojiSkin", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object)
    ], CategoryComponent.prototype, "emojiSize", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object)
    ], CategoryComponent.prototype, "emojiSet", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object)
    ], CategoryComponent.prototype, "emojiSheetSize", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object)
    ], CategoryComponent.prototype, "emojiForceSize", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object)
    ], CategoryComponent.prototype, "emojiTooltip", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object)
    ], CategoryComponent.prototype, "emojiBackgroundImageFn", void 0);
    tslib_1.__decorate([
        Output(),
        tslib_1.__metadata("design:type", Object)
    ], CategoryComponent.prototype, "emojiOver", void 0);
    tslib_1.__decorate([
        Output(),
        tslib_1.__metadata("design:type", Object)
    ], CategoryComponent.prototype, "emojiLeave", void 0);
    tslib_1.__decorate([
        Output(),
        tslib_1.__metadata("design:type", Object)
    ], CategoryComponent.prototype, "emojiClick", void 0);
    tslib_1.__decorate([
        ViewChild('container'),
        tslib_1.__metadata("design:type", ElementRef)
    ], CategoryComponent.prototype, "container", void 0);
    tslib_1.__decorate([
        ViewChild('label'),
        tslib_1.__metadata("design:type", ElementRef)
    ], CategoryComponent.prototype, "label", void 0);
    CategoryComponent = tslib_1.__decorate([
        Component({
            selector: 'emoji-category',
            template: "\n  <section #container class=\"emoji-mart-category\"\n    [attr.aria-label]=\"i18n.categories[id]\"\n    [class.emoji-mart-no-results]=\"emojis && !emojis.length\"\n    [ngStyle]=\"containerStyles\">\n    <div class=\"emoji-mart-category-label\"\n      [ngStyle]=\"labelStyles\"\n      [attr.data-name]=\"name\">\n      <!-- already labeled by the section aria-label -->\n      <span #label [ngStyle]=\"labelSpanStyles\" aria-hidden=\"true\">\n        {{ i18n.categories[id] }}\n      </span>\n    </div>\n\n    <ng-template [ngIf]=\"emojis\">\n      <ngx-emoji\n        *ngFor=\"let emoji of emojis; trackBy: trackById\"\n        [emoji]=\"emoji\"\n        [size]=\"emojiSize\"\n        [skin]=\"emojiSkin\"\n        [isNative]=\"emojiIsNative\"\n        [set]=\"emojiSet\"\n        [sheetSize]=\"emojiSheetSize\"\n        [forceSize]=\"emojiForceSize\"\n        [tooltip]=\"emojiTooltip\"\n        [backgroundImageFn]=\"emojiBackgroundImageFn\"\n        [hideObsolete]=\"hideObsolete\"\n        (emojiOver)=\"emojiOver.emit($event)\"\n        (emojiLeave)=\"emojiLeave.emit($event)\"\n        (emojiClick)=\"emojiClick.emit($event)\"\n      ></ngx-emoji>\n    </ng-template>\n\n    <div *ngIf=\"emojis && !emojis.length\">\n      <div>\n        <ngx-emoji\n          [emoji]=\"notFoundEmoji\"\n          size=\"38\"\n          [skin]=\"emojiSkin\"\n          [isNative]=\"emojiIsNative\"\n          [set]=\"emojiSet\"\n          [sheetSize]=\"emojiSheetSize\"\n          [forceSize]=\"emojiForceSize\"\n          [tooltip]=\"emojiTooltip\"\n          [backgroundImageFn]=\"emojiBackgroundImageFn\"\n        ></ngx-emoji>\n      </div>\n\n      <div class=\"emoji-mart-no-results-label\">\n        {{ i18n.notfound }}\n      </div>\n    </div>\n\n  </section>\n  ",
            changeDetection: ChangeDetectionStrategy.OnPush,
            preserveWhitespaces: false
        }),
        tslib_1.__metadata("design:paramtypes", [ChangeDetectorRef,
            EmojiService,
            EmojiFrequentlyService])
    ], CategoryComponent);
    return CategoryComponent;
}());
export { CategoryComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2F0ZWdvcnkuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vQGN0cmwvbmd4LWVtb2ppLW1hcnQvIiwic291cmNlcyI6WyJjYXRlZ29yeS5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFDTCx1QkFBdUIsRUFDdkIsaUJBQWlCLEVBQ2pCLFNBQVMsRUFDVCxVQUFVLEVBQ1YsWUFBWSxFQUNaLEtBQUssRUFFTCxNQUFNLEVBQ04sU0FBUyxHQUNWLE1BQU0sZUFBZSxDQUFDO0FBRXZCLE9BQU8sRUFBUyxZQUFZLEVBQUUsTUFBTSxnQ0FBZ0MsQ0FBQztBQUNyRSxPQUFPLEVBQUUsc0JBQXNCLEVBQUUsTUFBTSw0QkFBNEIsQ0FBQztBQThEcEU7SUFpQ0UsMkJBQ1MsR0FBc0IsRUFDckIsWUFBMEIsRUFDMUIsVUFBa0M7UUFGbkMsUUFBRyxHQUFILEdBQUcsQ0FBbUI7UUFDckIsaUJBQVksR0FBWixZQUFZLENBQWM7UUFDMUIsZUFBVSxHQUFWLFVBQVUsQ0FBd0I7UUFsQ25DLHNCQUFpQixHQUFHLElBQUksQ0FBQztRQUN6QixTQUFJLEdBQUcsRUFBRSxDQUFDO1FBQ1YsWUFBTyxHQUFHLENBQUMsQ0FBQztRQUNaLHVCQUFrQixHQUFHLENBQUMsQ0FBQztRQUN2QixXQUFNLEdBQWEsRUFBRSxDQUFDO1FBQ3RCLFdBQU0sR0FBVSxFQUFFLENBQUM7UUFHbkIsaUJBQVksR0FBRyxJQUFJLENBQUM7UUFVbkIsY0FBUyxHQUF1QixJQUFJLFlBQVksRUFBRSxDQUFDO1FBQ25ELGVBQVUsR0FBd0IsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUNyRCxlQUFVLEdBQXdCLElBQUksWUFBWSxFQUFFLENBQUM7UUFHL0Qsb0JBQWUsR0FBUSxFQUFFLENBQUM7UUFDMUIsZ0JBQVcsR0FBUSxFQUFFLENBQUM7UUFDdEIsb0JBQWUsR0FBUSxFQUFFLENBQUM7UUFDMUIsV0FBTSxHQUFHLENBQUMsQ0FBQztRQUNYLGNBQVMsR0FBRyxD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bnRlbnQiOlsiaW1wb3J0IHtcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gIENoYW5nZURldGVjdG9yUmVmLFxuICBDb21wb25lbnQsXG4gIEVsZW1lbnRSZWYsXG4gIEV2ZW50RW1pdHRlcixcbiAgSW5wdXQsXG4gIE9uSW5pdCxcbiAgT3V0cHV0LFxuICBWaWV3Q2hpbGQsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQgeyBFbW9qaSwgRW1vamlTZXJ2aWNlIH0gZnJvbSAnQGN0cmwvbmd4LWVtb2ppLW1hcnQvbmd4LWVtb2ppJztcbmltcG9ydCB7IEVtb2ppRnJlcXVlbnRseVNlcnZpY2UgfSBmcm9tICcuL2Vtb2ppLWZyZXF1ZW50bHkuc2VydmljZSc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2Vtb2ppLWNhdGVnb3J5JyxcbiAgdGVtcGxhdGU6IGBcbiAgPHNlY3Rpb24gI2NvbnRhaW5lciBjbGFzcz1cImVtb2ppLW1hcnQtY2F0ZWdvcnlcIlxuICAgIFthdHRyLmFyaWEtbGFiZWxdPVwiaTE4bi5jYXRlZ29yaWVzW2lkXVwiXG4gICAgW2NsYXNzLmVtb2ppLW1hcnQtbm8tcmVzdWx0c109XCJlbW9qaXMgJiYgIWVtb2ppcy5sZW5ndGhcIlxuICAgIFtuZ1N0eWxlXT1cImNvbnRhaW5lclN0eWxlc1wiPlxuICAgIDxkaXYgY2xhc3M9XCJlbW9qaS1tYXJ0LWNhdGVnb3J5LWxhYmVsXCJcbiAgICAgIFtuZ1N0eWxlXT1cImxhYmVsU3R5bGVzXCJcbiAgICAgIFthdHRyLmRhdGEtbmFtZV09XCJuYW1lXCI+XG4gICAgICA8IS0tIGFscmVhZHkgbGFiZWxlZCBieSB0aGUgc2VjdGlvbiBhcmlhLWxhYmVsIC0tPlxuICAgICAgPHNwYW4gI2xhYmVsIFtuZ1N0eWxlXT1cImxhYmVsU3BhblN0eWxlc1wiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPlxuICAgICAgICB7eyBpMThuLmNhdGVnb3JpZXNbaWRdIH19XG4gICAgICA8L3NwYW4+XG4gICAgPC9kaXY+XG5cbiAgICA8bmctdGVtcGxhdGUgW25nSWZdPVwiZW1vamlzXCI+XG4gICAgICA8bmd4LWVtb2ppXG4gICAgICAgICpuZ0Zvcj1cImxldCBlbW9qaSBvZiBlbW9qaXM7IHRyYWNrQnk6IHRyYWNrQnlJZFwiXG4gICAgICAgIFtlbW9qaV09XCJlbW9qaVwiXG4gICAgICAgIFtzaXplXT1cImVtb2ppU2l6ZVwiXG4gICAgICAgIFtza2luXT1cImVtb2ppU2tpblwiXG4gICAgICAgIFtpc05hdGl2ZV09XCJlbW9qaUlzTmF0aXZlXCJcbiAgICAgICAgW3NldF09XCJlbW9qaVNldFwiXG4gICAgICAgIFtzaGVldFNpemVdPVwiZW1vamlTaGVldFNpemVcIlxuICAgICAgICBbZm9yY2VTaXplXT1cImVtb2ppRm9yY2VTaXplXCJcbiAgICAgICAgW3Rvb2x0aXBdPVwiZW1vamlUb29sdGlwXCJcbiAgICAgICAgW2JhY2tncm91bmRJbWFnZUZuXT1cImVtb2ppQmFja2dyb3VuZEltYWdlRm5cIlxuICAgICAgICBbaGlkZU9ic29sZXRlXT1cImhpZGVPYnNvbGV0ZVwiXG4gICAgICAgIChlbW9qaU92ZXIpPVwiZW1vamlPdmVyLmVtaXQoJGV2ZW50KVwiXG4gICAgICAgIChlbW9qaUxlYXZlKT1cImVtb2ppTGVhdmUuZW1pdCgkZXZlbnQpXCJcbiAgICAgICAgKGVtb2ppQ2xpY2spPVwiZW1vamlDbGljay5lbWl0KCRldmVudClcIlxuICAgICAgPjwvbmd4LWVtb2ppPlxuICAgIDwvbmctdGVtcGxhdGU+XG5cbiAgICA8ZGl2ICpuZ0lmPVwiZW1vamlzICYmICFlbW9qaXMubGVuZ3RoXCI+XG4gICAgICA8ZGl2PlxuICAgICAgICA8bmd4LWVtb2ppXG4gICAgICAgICAgW2Vtb2ppXT1cIm5vdEZvdW5kRW1vamlcIlxuICAgICAgICAgIHNpemU9XCIzOFwiXG4gICAgICAgICAgW3NraW5dPVwiZW1vamlTa2luXCJcbiAgICAgICAgICBbaXNOYXRpdmVdPVwiZW1vamlJc05hdGl2ZVwiXG4gICAgICAgICAgW3NldF09XCJlbW9qaVNldFwiXG4gICAgICAgICAgW3NoZWV0U2l6ZV09XCJlbW9qaVNoZWV0U2l6ZVwiXG4gICAgICAgICAgW2ZvcmNlU2l6ZV09XCJlbW9qaUZvcmNlU2l6ZVwiXG4gICAgICAgICAgW3Rvb2x0aXBdPVwiZW1vamlUb29sdGlwXCJcbiAgICAgICAgICBbYmFja2dyb3VuZEltYWdlRm5dPVwiZW1vamlCYWNrZ3JvdW5kSW1hZ2VGblwiXG4gICAgICAgID48L25neC1lbW9qaT5cbiAgICAgIDwvZGl2PlxuXG4gICAgICA8ZGl2IGNsYXNzPVwiZW1vamktbWFydC1uby1yZXN1bHRzLWxhYmVsXCI+XG4gICAgICAgIHt7IGkxOG4ubm90Zm91bmQgfX1cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuXG4gIDwvc2VjdGlvbj5cbiAgYCxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG4gIHByZXNlcnZlV2hpdGVzcGFjZXM6IGZhbHNlLFxufSlcbmV4cG9ydCBjbGFzcyBDYXRlZ29yeUNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XG4gIEBJbnB1dCgpIGVtb2ppcz86IGFueVtdIHwgbnVsbDtcbiAgQElucHV0KCkgaGFzU3RpY2t5UG9zaXRpb24gPSB0cnVlO1xuICBASW5wdXQoKSBuYW1lID0gJyc7XG4gIEBJbnB1dCgpIHBlckxpbmUgPSA5O1xuICBASW5wdXQoKSB0b3RhbEZyZXF1ZW50TGluZXMgPSA0O1xuICBASW5wdXQoKSByZWNlbnQ6IHN0cmluZ1tdID0gW107XG4gIEBJbnB1dCgpIGN1c3RvbTogYW55W10gPSBbXTtcbiAgQElucHV0KCkgaTE4bjogYW55O1xuICBASW5wdXQoKSBpZDogYW55O1xuICBASW5wdXQoKSBoaWRlT2Jzb2xldGUgPSB0cnVlO1xuICBASW5wdXQoKSBub3RGb3VuZEVtb2ppPzogc3RyaW5nO1xuICBASW5wdXQoKSBlbW9qaUlzTmF0aXZlPzogRW1vamlbJ2lzTmF0aXZlJ107XG4gIEBJbnB1dCgpIGVtb2ppU2tpbj86IEVtb2ppWydza2luJ107XG4gIEBJbnB1dCgpIGVtb2ppU2l6ZT86IEVtb2ppWydzaXplJ107XG4gIEBJbnB1dCgpIGVtb2ppU2V0PzogRW1vamlbJ3NldCddO1xuICBASW5wdXQoKSBlbW9qaVNoZWV0U2l6ZT86IEVtb2ppWydzaGVldFNpemUnXTtcbiAgQElucHV0KCkgZW1vamlGb3JjZVNpemU/OiBFbW9qaVsnZm9yY2VTaXplJ107XG4gIEBJbnB1dCgpIGVtb2ppVG9vbHRpcD86IEVtb2ppWyd0b29sdGlwJ107XG4gIEBJbnB1dCgpIGVtb2ppQmFja2dyb3VuZEltYWdlRm4/OiBFbW9qaVsnYmFja2dyb3VuZEltYWdlRm4nXTtcbiAgQE91dHB1dCgpIGVtb2ppT3ZlcjogRW1vamlbJ2Vtb2ppT3ZlciddID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICBAT3V0cHV0KCkgZW1vamlMZWF2ZTogRW1vamlbJ2Vtb2ppTGVhdmUnXSA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgQE91dHB1dCgpIGVtb2ppQ2xpY2s6IEVtb2ppWydlbW9qaUNsaWNrJ10gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gIEBWaWV3Q2hpbGQoJ2NvbnRhaW5lcicpIGNvbnRhaW5lciE6IEVsZW1lbnRSZWY7XG4gIEBWaWV3Q2hpbGQoJ2xhYmVsJykgbGFiZWwhOiBFbGVtZW50UmVmO1xuICBjb250YWluZXJTdHlsZXM6IGFueSA9IHt9O1xuICBsYWJlbFN0eWxlczogYW55ID0ge307XG4gIGxhYmVsU3BhblN0eWxlczogYW55ID0ge307XG4gIG1hcmdpbiA9IDA7XG4gIG1pbk1hcmdpbiA9IDA7XG4gIG1heE1hcmdpbiA9IDA7XG4gIHRvcCA9IDA7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHVibGljIHJlZjogQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gICAgcHJpdmF0ZSBlbW9qaVNlcnZpY2U6IEVtb2ppU2VydmljZSxcbiAgICBwcml2YXRlIGZyZXF1ZW50bHk6IEVtb2ppRnJlcXVlbnRseVNlcnZpY2UsXG4gICkge31cblxuICBuZ09uSW5pdCgpIHtcbiAgICB0aGlzLmVtb2ppcyA9IHRoaXMuZ2V0RW1vamlzKCk7XG5cbiAgICBpZiAoIXRoaXMuZW1vamlzKSB7XG4gICAgICB0aGlzLmNvbnRhaW5lclN0eWxlcyA9IHsgZGlzcGxheTogJ25vbmUnIH07XG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLmhhc1N0aWNreVBvc2l0aW9uKSB7XG4gICAgICB0aGlzLmxhYmVsU3R5bGVzID0geyBoZWlnaHQ6IDI4IH07XG4gICAgICAvLyB0aGlzLmxhYmVsU3BhblN0eWxlcyA9IHsgcG9zaXRpb246ICdhYnNvbHV0ZScgfTtcbiAgICB9XG4gIH1cbiAgbWVtb2l6ZVNpemUoKSB7XG4gICAgY29uc3QgcGFyZW50ID0gdGhpcy5jb250YWluZXIubmF0aXZlRWxlbWVudC5wYXJlbnROb2RlLnBhcmVudE5vZGU7XG4gICAgY29uc3Qge1xuICAgICAgdG9wLFxuICAgICAgaGVpZ2h0LFxuICAgIH0gPSB0aGlzLmNvbnRhaW5lci5uYXRpdmVFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIGNvbnN0IHBhcmVudFRvcCA9IHBhcmVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS50b3A7XG4gICAgY29uc3QgbGFiZWxIZWlnaHQgPSB0aGlzLmxhYmVsLm5hdGl2ZUVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkuaGVpZ2h0O1xuXG4gICAgdGhpcy50b3AgPSB0b3AgLSBwYXJlbnRUb3AgKyBwYXJlbnQuc2Nyb2xsVG9wO1xuXG4gICAgaWYgKGhlaWdodCA9PT0gMCkge1xuICAgICAgdGhpcy5tYXhNYXJnaW4gPSAwO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLm1heE1hcmdpbiA9IGhlaWdodCAtIGxhYmVsSGVpZ2h0O1xuICAgIH1cbiAgfVxuICBoYW5kbGVTY3JvbGwoc2Nyb2xsVG9wOiBudW1iZXIpOiBib29sZWFuIHtcbiAgICBsZXQgbWFyZ2luID0gc2Nyb2xsVG9wIC0gdGhpcy50b3A7XG4gICAgbWFyZ2luID0gbWFyZ2luIDwgdGhpcy5taW5NYXJnaW4gPyB0aGlzLm1pbk1hcmdpbiA6IG1hcmdpbjtcbiAgICBtYXJnaW4gPSBtYXJnaW4gPiB0aGlzLm1heE1hcmdpbiA/IHRoaXMubWF4TWFyZ2luIDogbWFyZ2luO1xuXG4gICAgaWYgKG1hcmdpbiA9PT0gdGhpcy5tYXJnaW4pIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBpZiAoIXRoaXMuaGFzU3RpY2t5UG9zaXRpb24pIHtcbiAgICAgIHRoaXMubGFiZWwubmF0aXZlRWxlbWVudC5zdHlsZS50b3AgPSBgJHttYXJnaW59cHhgO1xuICAgIH1cblxuICAgIHRoaXMubWFyZ2luID0gbWFyZ2luO1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgZ2V0RW1vamlzKCkge1xuICAgIGlmICh0aGlzLm5hbWUgPT09ICdSZWNlbnQnKSB7XG4gICAgICBsZXQgZnJlcXVlbnRseVVzZWQgPSB0aGlzLnJlY2VudCB8fCB0aGlzLmZyZXF1ZW50bHkuZ2V0KHRoaXMucGVyTGluZSwgdGhpcy50b3RhbEZyZXF1ZW50TGluZXMpO1xuICAgICAgaWYgKCFmcmVxdWVudGx5VXNlZCB8fCAhZnJlcXVlbnRseVVzZWQubGVuZ3RoKSB7XG4gICAgICAgIGZyZXF1ZW50bHlVc2VkID0gdGhpcy5mcmVxdWVudGx5LmdldCh0aGlzLnBlckxpbmUsIHRoaXMudG90YWxGcmVxdWVudExpbmVzKTtcbiAgICAgIH1cbiAgICAgIGlmIChmcmVxdWVudGx5VXNlZC5sZW5ndGgpIHtcbiAgICAgICAgdGhpcy5lbW9qaXMgPSBmcmVxdWVudGx5VXNlZFxuICAgICAgICAgIC5tYXAoaWQgPT4ge1xuICAgICAgICAgICAgY29uc3QgZW1vamkgPSB0aGlzLmN1c3RvbS5maWx0ZXIoKGU6IGFueSkgPT4gZS5pZCA9PT0gaWQpWzBdO1xuICAgICAgICAgICAgaWYgKGVtb2ppKSB7XG4gICAgICAgICAgICAgIHJldHVybiBlbW9qaTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIGlkO1xuICAgICAgICAgIH0pXG4gICAgICAgICAgLmZpbHRlcihpZCA9PiAhIXRoaXMuZW1vamlTZXJ2aWNlLmdldERhdGEoaWQpKTtcbiAgICAgIH1cblxuICAgICAgaWYgKCghdGhpcy5lbW9qaXMgfHwgdGhpcy5lbW9qaXMubGVuZ3RoID09PSAwKSAmJiBmcmVxdWVudGx5VXNlZC5sZW5ndGggPiAwKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmICh0aGlzLmVtb2ppcykge1xuICAgICAgdGhpcy5lbW9qaXMgPSB0aGlzLmVtb2ppcy5zbGljZSgwKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5lbW9qaXM7XG4gIH1cbiAgdXBkYXRlRGlzcGxheShkaXNwbGF5OiAnbm9uZScgfCAnYmxvY2snKSB7XG4gICAgdGhpcy5jb250YWluZXJTdHlsZXMuZGlzcGxheSA9IGRpc3BsYXk7XG4gICAgdGhpcy5nZXRFbW9qaXMoKTtcbiAgICB0aGlzLnJlZi5kZXRlY3RDaGFuZ2VzKCk7XG4gIH1cbiAgdHJhY2tCeUlkKGluZGV4OiBudW1iZXIsIGl0ZW06IGFueSkge1xuICAgIHJldHVybiBpdGVtO1xuICB9XG59XG4iXX0=