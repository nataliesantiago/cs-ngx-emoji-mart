import * as tslib_1 from "tslib";
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, Output, } from '@angular/core';
import { EmojiService } from '@ctrl/ngx-emoji-mart/ngx-emoji';
var PreviewComponent = /** @class */ (function () {
    function PreviewComponent(ref, emojiService) {
        this.ref = ref;
        this.emojiService = emojiService;
        this.skinChange = new EventEmitter();
        this.emojiData = {};
    }
    PreviewComponent.prototype.ngOnChanges = function () {
        if (!this.emoji) {
            return;
        }
        this.emojiData = this.emojiService.getData(this.emoji, this.emojiSkin, this.emojiSet);
        var knownEmoticons = [];
        var listedEmoticons = [];
        var emoitcons = this.emojiData.emoticons || [];
        emoitcons.forEach(function (emoticon) {
            if (knownEmoticons.indexOf(emoticon.toLowerCase()) >= 0) {
                return;
            }
            knownEmoticons.push(emoticon.toLowerCase());
            listedEmoticons.push(emoticon);
        });
        this.listedEmoticons = listedEmoticons;
    };
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", String)
    ], PreviewComponent.prototype, "title", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object)
    ], PreviewComponent.prototype, "emoji", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object)
    ], PreviewComponent.prototype, "idleEmoji", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object)
    ], PreviewComponent.prototype, "i18n", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object)
    ], PreviewComponent.prototype, "emojiIsNative", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object)
    ], PreviewComponent.prototype, "emojiSkin", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object)
    ], PreviewComponent.prototype, "emojiSize", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object)
    ], PreviewComponent.prototype, "emojiSet", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object)
    ], PreviewComponent.prototype, "emojiSheetSize", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object)
    ], PreviewComponent.prototype, "emojiBackgroundImageFn", void 0);
    tslib_1.__decorate([
        Output(),
        tslib_1.__metadata("design:type", Object)
    ], PreviewComponent.prototype, "skinChange", void 0);
    PreviewComponent = tslib_1.__decorate([
        Component({
            selector: 'emoji-preview',
            template: "\n  <div class=\"emoji-mart-preview\" *ngIf=\"emoji && emojiData\">\n    <div class=\"emoji-mart-preview-emoji\">\n      <ngx-emoji\n        [emoji]=\"emoji\"\n        [size]=\"38\"\n        [isNative]=\"emojiIsNative\"\n        [skin]=\"emojiSkin\"\n        [size]=\"emojiSize\"\n        [set]=\"emojiSet\"\n        [sheetSize]=\"emojiSheetSize\"\n        [backgroundImageFn]=\"emojiBackgroundImageFn\"\n      ></ngx-emoji>\n    </div>\n\n    <div class=\"emoji-mart-preview-data\">\n      <div class=\"emoji-mart-preview-name\">{{ emojiData.name }}</div>\n      <div class=\"emoji-mart-preview-shortnames\">\n        <span class=\"emoji-mart-preview-shortname\" *ngFor=\"let short_name of emojiData.shortNames\">\n          :{{ short_name }}:\n        </span>\n      </div>\n      <div class=\"emoji-mart-preview-emoticons\">\n        <span class=\"emoji-mart-preview-emoticon\" *ngFor=\"let emoticon of listedEmoticons\">\n          {{ emoticon }}\n        </span>\n      </div>\n    </div>\n  </div>\n\n  <div class=\"emoji-mart-preview\" *ngIf=\"!emoji\">\n    <div class=\"emoji-mart-preview-emoji\">\n      <ngx-emoji *ngIf=\"idleEmoji && idleEmoji.length\"\n        [isNative]=\"emojiIsNative\"\n        [skin]=\"emojiSkin\"\n        [set]=\"emojiSet\"\n        [emoji]=\"idleEmoji\"\n        [backgroundImageFn]=\"emojiBackgroundImageFn\"\n        [size]=\"38\"\n      ></ngx-emoji>\n    </div>\n\n    <div class=\"emoji-mart-preview-data\">\n      <span class=\"emoji-mart-title-label\">{{ title }}</span>\n    </div>\n\n    <div class=\"emoji-mart-preview-skins\">\n      <emoji-skins [skin]=\"emojiSkin\" (changeSkin)=\"skinChange.emit($event)\" [i18n]=\"i18n\">\n      </emoji-skins>\n    </div>\n  </div>\n  ",
            changeDetection: ChangeDetectionStrategy.OnPush,
            preserveWhitespaces: false
        }),
        tslib_1.__metadata("design:paramtypes", [ChangeDetectorRef,
            EmojiService])
    ], PreviewComponent);
    return PreviewComponent;
}());
export { PreviewComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJldmlldy5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AY3RybC9uZ3gtZW1vamktbWFydC8iLCJzb3VyY2VzIjpbInByZXZpZXcuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQ0wsdUJBQXVCLEVBQ3ZCLGlCQUFpQixFQUNqQixTQUFTLEVBQ1QsWUFBWSxFQUNaLEtBQUssRUFFTCxNQUFNLEdBQ1AsTUFBTSxlQUFlLENBQUM7QUFFdkIsT0FBTyxFQUFvQixZQUFZLEVBQUUsTUFBTSxnQ0FBZ0MsQ0FBQztBQTJEaEY7SUFlRSwwQkFDUyxHQUFzQixFQUNyQixZQUEwQjtRQUQzQixRQUFHLEdBQUgsR0FBRyxDQUFtQjtRQUNyQixpQkFBWSxHQUFaLFlBQVksQ0FBYztRQU4xQixlQUFVLEdBQUcsSUFBSSxZQUFZLEVBQVUsQ0FBQztRQUNsRCxjQUFTLEdBQXVCLEVBQUUsQ0FBQztJQU1oQyxDQUFDO0lBRUosc0NBQVcsR0FBWDtRQUNFLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFO1lBQ2YsT0FBTztTQUNSO1FBQ0QsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBYyxDQUFDO1FBQ25HLElBQU0sY0FBYyxHQUFhLEVBQUUsQ0FBQztRQUNwQyxJQUFNLGVBQWUsR0FBYSxFQUFFLENBQUM7UUFDckMsSUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxTQUFTLElBQUksRUFBRSxDQUFDO1FBQ2pELFNBQVMsQ0FBQyxPQUFPLENBQUMsVUFBQyxRQUFnQjtZQUNqQyxJQUFJLGNBQWMsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLFdBQVcsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFO2dCQUN2RCxPQUFPO2FBQ1I7WUFDRCxjQUFjLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDO1lBQzVDLGVBQWUsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDakMsQ0FBQyxDQUFDLENBQUM7UUFDSCxJQUFJLENBQUMsZUFBZSxHQUFHLGVBQWUsQ0FBQztJQUN6QyxDQUFDO0lBbkNRO1FBQVIsS0FBSyxFQUFFOzttREFBZ0I7SUFDZjtRQUFSLEtBQUssRUFBRTs7bURBQVk7SUFDWDtRQUFSLEtBQUssRUFBRTs7dURBQWdCO0lBQ2Y7UUFBUixLQUFLLEVBQUU7O2tEQUFXO0lBQ1Y7UUFBUixLQUFLLEVBQUU7OzJEQUFtQztJQUNsQztRQUFSLEtBQUssRUFBRTs7dURBQTJCO0lBQzFCO1FBQVIsS0FBSyxFQUFFOzt1REFBMkI7SUFDMUI7UUFBUixLQUFLLEVBQUU7O3NEQUF5QjtJQUN4QjtRQUFSLEtBQUssRUFBRTs7NERBQXFDO0lBQ3BDO1FBQVIsS0FBSyxFQUFFOztvRUFBcUQ7SUFDbkQ7UUFBVCxNQUFNLEVBQUU7O3dEQUF5QztJQVh2QyxnQkFBZ0I7UUF6RDVCLFNBQVMsQ0FBQztZQUNULFFBQVEsRUFBRSxlQUFlO1lBQ3pCLFFBQVEsRUFBRSw0ckRBbURUO1lBQ0QsZUFBZSxFQUFFLHVCQUF1QixDQUFDLE1BQU07WUFDL0MsbUJBQW1CLEVBQUUsS0FBSztTQUMzQixDQUFDO2lEQWlCYyxpQkFBaUI7WUFDUCxZQUFZO09BakJ6QixnQkFBZ0IsQ0FxQzVCO0lBQUQsdUJBQUM7Q0FBQSxBQXJDRCxJQXFDQztTQXJDWSxnQkFBZ0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gIENvbXBvbmVudCxcbiAgRXZlbnRFbWl0dGVyLFxuICBJbnB1dCxcbiAgT25DaGFuZ2VzLFxuICBPdXRwdXQsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQgeyBFbW9qaSwgRW1vamlEYXRhLCBFbW9qaVNlcnZpY2UgfSBmcm9tICdAY3RybC9uZ3gtZW1vamktbWFydC9uZ3gtZW1vamknO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdlbW9qaS1wcmV2aWV3JyxcbiAgdGVtcGxhdGU6IGBcbiAgPGRpdiBjbGFzcz1cImVtb2ppLW1hcnQtcHJldmlld1wiICpuZ0lmPVwiZW1vamkgJiYgZW1vamlEYXRhXCI+XG4gICAgPGRpdiBjbGFzcz1cImVtb2ppLW1hcnQtcHJldmlldy1lbW9qaVwiPlxuICAgICAgPG5neC1lbW9qaVxuICAgICAgICBbZW1vamldPVwiZW1vamlcIlxuICAgICAgICBbc2l6ZV09XCIzOFwiXG4gICAgICAgIFtpc05hdGl2ZV09XCJlbW9qaUlzTmF0aXZlXCJcbiAgICAgICAgW3NraW5dPVwiZW1vamlTa2luXCJcbiAgICAgICAgW3NpemVdPVwiZW1vamlTaXplXCJcbiAgICAgICAgW3NldF09XCJlbW9qaVNldFwiXG4gICAgICAgIFtzaGVldFNpemVdPVwiZW1vamlTaGVldFNpemVcIlxuICAgICAgICBbYmFja2dyb3VuZEltYWdlRm5dPVwiZW1vamlCYWNrZ3JvdW5kSW1hZ2VGblwiXG4gICAgICA+PC9uZ3gtZW1vamk+XG4gICAgPC9kaXY+XG5cbiAgICA8ZGl2IGNsYXNzPVwiZW1vamktbWFydC1wcmV2aWV3LWRhdGFcIj5cbiAgICAgIDxkaXYgY2xhc3M9XCJlbW9qaS1tYXJ0LXByZXZpZXctbmFtZVwiPnt7IGVtb2ppRGF0YS5uYW1lIH19PC9kaXY+XG4gICAgICA8ZGl2IGNsYXNzPVwiZW1vamktbWFydC1wcmV2aWV3LXNob3J0bmFtZXNcIj5cbiAgICAgICAgPHNwYW4gY2xhc3M9XCJlbW9qaS1tYXJ0LXByZXZpZXctc2hvcnRuYW1lXCIgKm5nRm9yPVwibGV0IHNob3J0X25hbWUgb2YgZW1vamlEYXRhLnNob3J0TmFtZXNcIj5cbiAgICAgICAgICA6e3sgc2hvcnRfbmFtZSB9fTpcbiAgICAgICAgPC9zcGFuPlxuICAgICAgPC9kaXY+XG4gICAgICA8ZGl2IGNsYXNzPVwiZW1vamktbWFydC1wcmV2aWV3LWVtb3RpY29uc1wiPlxuICAgICAgICA8c3BhbiBjbGFzcz1cImVtb2ppLW1hcnQtcHJldmlldy1lbW90aWNvblwiICpuZ0Zvcj1cImxldCBlbW90aWNvbiBvZiBsaXN0ZWRFbW90aWNvbnNcIj5cbiAgICAgICAgICB7eyBlbW90aWNvbiB9fVxuICAgICAgICA8L3NwYW4+XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgPC9kaXY+XG5cbiAgPGRpdiBjbGFzcz1cImVtb2ppLW1hcnQtcHJldmlld1wiICpuZ0lmPVwiIWVtb2ppXCI+XG4gICAgPGRpdiBjbGFzcz1cImVtb2ppLW1hcnQtcHJldmlldy1lbW9qaVwiPlxuICAgICAgPG5neC1lbW9qaSAqbmdJZj1cImlkbGVFbW9qaSAmJiBpZGxlRW1vamkubGVuZ3RoXCJcbiAgICAgICAgW2lzTmF0aXZlXT1cImVtb2ppSXNOYXRpdmVcIlxuICAgICAgICBbc2tpbl09XCJlbW9qaVNraW5cIlxuICAgICAgICBbc2V0XT1cImVtb2ppU2V0XCJcbiAgICAgICAgW2Vtb2ppXT1cImlkbGVFbW9qaVwiXG4gICAgICAgIFtiYWNrZ3JvdW5kSW1hZ2VGbl09XCJlbW9qaUJhY2tncm91bmRJbWFnZUZuXCJcbiAgICAgICAgW3NpemVdPVwiMzhcIlxuICAgICAgPjwvbmd4LWVtb2ppPlxuICAgIDwvZGl2PlxuXG4gICAgPGRpdiBjbGFzcz1cImVtb2ppLW1hcnQtcHJldmlldy1kYXRhXCI+XG4gICAgICA8c3BhbiBjbGFzcz1cImVtb2ppLW1hcnQtdGl0bGUtbGFiZWxcIj57eyB0aXRsZSB9fTwvc3Bhbj5cbiAgICA8L2Rpdj5cblxuICAgIDxkaXYgY2xhc3M9XCJlbW9qaS1tYXJ0LXByZXZpZXctc2tpbnNcIj5cbiAgICAgIDxlbW9qaS1za2lucyBbc2tpbl09XCJlbW9qaVNraW5cIiAoY2hhbmdlU2tpbik9XCJza2luQ2hhbmdlLmVtaXQoJGV2ZW50KVwiIFtpMThuXT1cImkxOG5cIj5cbiAgICAgIDwvZW1vamktc2tpbnM+XG4gICAgPC9kaXY+XG4gIDwvZGl2PlxuICBgLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgcHJlc2VydmVXaGl0ZXNwYWNlczogZmFsc2UsXG59KVxuZXhwb3J0IGNsYXNzIFByZXZpZXdDb21wb25lbnQgaW1wbGVtZW50cyBPbkNoYW5nZXMge1xuICBASW5wdXQoKSB0aXRsZT86IHN0cmluZztcbiAgQElucHV0KCkgZW1vamk6IGFueTtcbiAgQElucHV0KCkgaWRsZUVtb2ppOiBhbnk7XG4gIEBJbnB1dCgpIGkxOG46IGFueTtcbiAgQElucHV0KCkgZW1vamlJc05hdGl2ZT86IEVtb2ppWydpc05hdGl2ZSddO1xuICBASW5wdXQoKSBlbW9qaVNraW4/OiBFbW9qaVsnc2tpbiddO1xuICBASW5wdXQoKSBlbW9qaVNpemU/OiBFbW9qaVsnc2l6ZSddO1xuICBASW5wdXQoKSBlbW9qaVNldD86IEVtb2ppWydzZXQnXTtcbiAgQElucHV0KCkgZW1vamlTaGVldFNpemU/OiBFbW9qaVsnc2hlZXRTaXplJ107XG4gIEBJbnB1dCgpIGVtb2ppQmFja2dyb3VuZEltYWdlRm4/OiBFbW9qaVsnYmFja2dyb3VuZEltYWdlRm4nXTtcbiAgQE91dHB1dCgpIHNraW5DaGFuZ2UgPSBuZXcgRXZlbnRFbWl0dGVyPG51bWJlcj4oKTtcbiAgZW1vamlEYXRhOiBQYXJ0aWFsPEVtb2ppRGF0YT4gPSB7fTtcbiAgbGlzdGVkRW1vdGljb25zPzogc3RyaW5nW107XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHVibGljIHJlZjogQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gICAgcHJpdmF0ZSBlbW9qaVNlcnZpY2U6IEVtb2ppU2VydmljZSxcbiAgKSB7fVxuXG4gIG5nT25DaGFuZ2VzKCkge1xuICAgIGlmICghdGhpcy5lbW9qaSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLmVtb2ppRGF0YSA9IHRoaXMuZW1vamlTZXJ2aWNlLmdldERhdGEodGhpcy5lbW9qaSwgdGhpcy5lbW9qaVNraW4sIHRoaXMuZW1vamlTZXQpIGFzIEVtb2ppRGF0YTtcbiAgICBjb25zdCBrbm93bkVtb3RpY29uczogc3RyaW5nW10gPSBbXTtcbiAgICBjb25zdCBsaXN0ZWRFbW90aWNvbnM6IHN0cmluZ1tdID0gW107XG4gICAgY29uc3QgZW1vaXRjb25zID0gdGhpcy5lbW9qaURhdGEuZW1vdGljb25zIHx8IFtdO1xuICAgIGVtb2l0Y29ucy5mb3JFYWNoKChlbW90aWNvbjogc3RyaW5nKSA9PiB7XG4gICAgICBpZiAoa25vd25FbW90aWNvbnMuaW5kZXhPZihlbW90aWNvbi50b0xvd2VyQ2FzZSgpKSA+PSAwKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGtub3duRW1vdGljb25zLnB1c2goZW1vdGljb24udG9Mb3dlckNhc2UoKSk7XG4gICAgICBsaXN0ZWRFbW90aWNvbnMucHVzaChlbW90aWNvbik7XG4gICAgfSk7XG4gICAgdGhpcy5saXN0ZWRFbW90aWNvbnMgPSBsaXN0ZWRFbW90aWNvbnM7XG4gIH1cbn1cbiJdfQ==