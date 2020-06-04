import * as tslib_1 from "tslib";
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, Output, } from '@angular/core';
import { EmojiService } from '@ctrl/ngx-emoji-mart/ngx-emoji';
let PreviewComponent = class PreviewComponent {
    constructor(ref, emojiService) {
        this.ref = ref;
        this.emojiService = emojiService;
        this.skinChange = new EventEmitter();
        this.emojiData = {};
    }
    ngOnChanges() {
        if (!this.emoji) {
            return;
        }
        this.emojiData = this.emojiService.getData(this.emoji, this.emojiSkin, this.emojiSet);
        const knownEmoticons = [];
        const listedEmoticons = [];
        const emoitcons = this.emojiData.emoticons || [];
        emoitcons.forEach((emoticon) => {
            if (knownEmoticons.indexOf(emoticon.toLowerCase()) >= 0) {
                return;
            }
            knownEmoticons.push(emoticon.toLowerCase());
            listedEmoticons.push(emoticon);
        });
        this.listedEmoticons = listedEmoticons;
    }
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
        template: `
  <div class="emoji-mart-preview" *ngIf="emoji && emojiData">
    <div class="emoji-mart-preview-emoji">
      <ngx-emoji
        [emoji]="emoji"
        [size]="38"
        [isNative]="emojiIsNative"
        [skin]="emojiSkin"
        [size]="emojiSize"
        [set]="emojiSet"
        [sheetSize]="emojiSheetSize"
        [backgroundImageFn]="emojiBackgroundImageFn"
      ></ngx-emoji>
    </div>

    <div class="emoji-mart-preview-data">
      <div class="emoji-mart-preview-name">{{ emojiData.name }}</div>
      <div class="emoji-mart-preview-shortnames">
        <span class="emoji-mart-preview-shortname" *ngFor="let short_name of emojiData.shortNames">
          :{{ short_name }}:
        </span>
      </div>
      <div class="emoji-mart-preview-emoticons">
        <span class="emoji-mart-preview-emoticon" *ngFor="let emoticon of listedEmoticons">
          {{ emoticon }}
        </span>
      </div>
    </div>
  </div>

  <div class="emoji-mart-preview" *ngIf="!emoji">
    <div class="emoji-mart-preview-emoji">
      <ngx-emoji *ngIf="idleEmoji && idleEmoji.length"
        [isNative]="emojiIsNative"
        [skin]="emojiSkin"
        [set]="emojiSet"
        [emoji]="idleEmoji"
        [backgroundImageFn]="emojiBackgroundImageFn"
        [size]="38"
      ></ngx-emoji>
    </div>

    <div class="emoji-mart-preview-data">
      <span class="emoji-mart-title-label">{{ title }}</span>
    </div>

    <div class="emoji-mart-preview-skins">
      <emoji-skins [skin]="emojiSkin" (changeSkin)="skinChange.emit($event)" [i18n]="i18n">
      </emoji-skins>
    </div>
  </div>
  `,
        changeDetection: ChangeDetectionStrategy.OnPush,
        preserveWhitespaces: false
    }),
    tslib_1.__metadata("design:paramtypes", [ChangeDetectorRef,
        EmojiService])
], PreviewComponent);
export { PreviewComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJldmlldy5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AY3RybC9uZ3gtZW1vamktbWFydC8iLCJzb3VyY2VzIjpbInByZXZpZXcuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQ0wsdUJBQXVCLEVBQ3ZCLGlCQUFpQixFQUNqQixTQUFTLEVBQ1QsWUFBWSxFQUNaLEtBQUssRUFFTCxNQUFNLEdBQ1AsTUFBTSxlQUFlLENBQUM7QUFFdkIsT0FBTyxFQUFvQixZQUFZLEVBQUUsTUFBTSxnQ0FBZ0MsQ0FBQztBQTJEaEYsSUFBYSxnQkFBZ0IsR0FBN0IsTUFBYSxnQkFBZ0I7SUFlM0IsWUFDUyxHQUFzQixFQUNyQixZQUEwQjtRQUQzQixRQUFHLEdBQUgsR0FBRyxDQUFtQjtRQUNyQixpQkFBWSxHQUFaLFlBQVksQ0FBYztRQU4xQixlQUFVLEdBQUcsSUFBSSxZQUFZLEVBQVUsQ0FBQztRQUNsRCxjQUFTLEdBQXVCLEVBQUUsQ0FBQztJQU1oQyxDQUFDO0lBRUosV0FBVztRQUNULElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFO1lBQ2YsT0FBTztTQUNSO1FBQ0QsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBYyxDQUFDO1FBQ25HLE1BQU0sY0FBYyxHQUFhLEVBQUUsQ0FBQztRQUNwQyxNQUFNLGVBQWUsR0FBYSxFQUFFLENBQUM7UUFDckMsTUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxTQUFTLElBQUksRUFBRSxDQUFDO1FBQ2pELFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxRQUFnQixFQUFFLEVBQUU7WUFDckMsSUFBSSxjQUFjLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRTtnQkFDdkQsT0FBTzthQUNSO1lBQ0QsY0FBYyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQztZQUM1QyxlQUFlLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ2pDLENBQUMsQ0FBQyxDQUFDO1FBQ0gsSUFBSSxDQUFDLGVBQWUsR0FBRyxlQUFlLENBQUM7SUFDekMsQ0FBQztDQUNGLENBQUE7QUFwQ1U7SUFBUixLQUFLLEVBQUU7OytDQUFnQjtBQUNmO0lBQVIsS0FBSyxFQUFFOzsrQ0FBWTtBQUNYO0lBQVIsS0FBSyxFQUFFOzttREFBZ0I7QUFDZjtJQUFSLEtBQUssRUFBRTs7OENBQVc7QUFDVjtJQUFSLEtBQUssRUFBRTs7dURBQW1DO0FBQ2xDO0lBQVIsS0FBSyxFQUFFOzttREFBMkI7QUFDMUI7SUFBUixLQUFLLEVBQUU7O21EQUEyQjtBQUMxQjtJQUFSLEtBQUssRUFBRTs7a0RBQXlCO0FBQ3hCO0lBQVIsS0FBSyxFQUFFOzt3REFBcUM7QUFDcEM7SUFBUixLQUFLLEVBQUU7O2dFQUFxRDtBQUNuRDtJQUFULE1BQU0sRUFBRTs7b0RBQXlDO0FBWHZDLGdCQUFnQjtJQXpENUIsU0FBUyxDQUFDO1FBQ1QsUUFBUSxFQUFFLGVBQWU7UUFDekIsUUFBUSxFQUFFOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FtRFQ7UUFDRCxlQUFlLEVBQUUsdUJBQXVCLENBQUMsTUFBTTtRQUMvQyxtQkFBbUIsRUFBRSxLQUFLO0tBQzNCLENBQUM7NkNBaUJjLGlCQUFpQjtRQUNQLFlBQVk7R0FqQnpCLGdCQUFnQixDQXFDNUI7U0FyQ1ksZ0JBQWdCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gIENoYW5nZURldGVjdG9yUmVmLFxuICBDb21wb25lbnQsXG4gIEV2ZW50RW1pdHRlcixcbiAgSW5wdXQsXG4gIE9uQ2hhbmdlcyxcbiAgT3V0cHV0LFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHsgRW1vamksIEVtb2ppRGF0YSwgRW1vamlTZXJ2aWNlIH0gZnJvbSAnQGN0cmwvbmd4LWVtb2ppLW1hcnQvbmd4LWVtb2ppJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnZW1vamktcHJldmlldycsXG4gIHRlbXBsYXRlOiBgXG4gIDxkaXYgY2xhc3M9XCJlbW9qaS1tYXJ0LXByZXZpZXdcIiAqbmdJZj1cImVtb2ppICYmIGVtb2ppRGF0YVwiPlxuICAgIDxkaXYgY2xhc3M9XCJlbW9qaS1tYXJ0LXByZXZpZXctZW1vamlcIj5cbiAgICAgIDxuZ3gtZW1vamlcbiAgICAgICAgW2Vtb2ppXT1cImVtb2ppXCJcbiAgICAgICAgW3NpemVdPVwiMzhcIlxuICAgICAgICBbaXNOYXRpdmVdPVwiZW1vamlJc05hdGl2ZVwiXG4gICAgICAgIFtza2luXT1cImVtb2ppU2tpblwiXG4gICAgICAgIFtzaXplXT1cImVtb2ppU2l6ZVwiXG4gICAgICAgIFtzZXRdPVwiZW1vamlTZXRcIlxuICAgICAgICBbc2hlZXRTaXplXT1cImVtb2ppU2hlZXRTaXplXCJcbiAgICAgICAgW2JhY2tncm91bmRJbWFnZUZuXT1cImVtb2ppQmFja2dyb3VuZEltYWdlRm5cIlxuICAgICAgPjwvbmd4LWVtb2ppPlxuICAgIDwvZGl2PlxuXG4gICAgPGRpdiBjbGFzcz1cImVtb2ppLW1hcnQtcHJldmlldy1kYXRhXCI+XG4gICAgICA8ZGl2IGNsYXNzPVwiZW1vamktbWFydC1wcmV2aWV3LW5hbWVcIj57eyBlbW9qaURhdGEubmFtZSB9fTwvZGl2PlxuICAgICAgPGRpdiBjbGFzcz1cImVtb2ppLW1hcnQtcHJldmlldy1zaG9ydG5hbWVzXCI+XG4gICAgICAgIDxzcGFuIGNsYXNzPVwiZW1vamktbWFydC1wcmV2aWV3LXNob3J0bmFtZVwiICpuZ0Zvcj1cImxldCBzaG9ydF9uYW1lIG9mIGVtb2ppRGF0YS5zaG9ydE5hbWVzXCI+XG4gICAgICAgICAgOnt7IHNob3J0X25hbWUgfX06XG4gICAgICAgIDwvc3Bhbj5cbiAgICAgIDwvZGl2PlxuICAgICAgPGRpdiBjbGFzcz1cImVtb2ppLW1hcnQtcHJldmlldy1lbW90aWNvbnNcIj5cbiAgICAgICAgPHNwYW4gY2xhc3M9XCJlbW9qaS1tYXJ0LXByZXZpZXctZW1vdGljb25cIiAqbmdGb3I9XCJsZXQgZW1vdGljb24gb2YgbGlzdGVkRW1vdGljb25zXCI+XG4gICAgICAgICAge3sgZW1vdGljb24gfX1cbiAgICAgICAgPC9zcGFuPlxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gIDwvZGl2PlxuXG4gIDxkaXYgY2xhc3M9XCJlbW9qaS1tYXJ0LXByZXZpZXdcIiAqbmdJZj1cIiFlbW9qaVwiPlxuICAgIDxkaXYgY2xhc3M9XCJlbW9qaS1tYXJ0LXByZXZpZXctZW1vamlcIj5cbiAgICAgIDxuZ3gtZW1vamkgKm5nSWY9XCJpZGxlRW1vamkgJiYgaWRsZUVtb2ppLmxlbmd0aFwiXG4gICAgICAgIFtpc05hdGl2ZV09XCJlbW9qaUlzTmF0aXZlXCJcbiAgICAgICAgW3NraW5dPVwiZW1vamlTa2luXCJcbiAgICAgICAgW3NldF09XCJlbW9qaVNldFwiXG4gICAgICAgIFtlbW9qaV09XCJpZGxlRW1vamlcIlxuICAgICAgICBbYmFja2dyb3VuZEltYWdlRm5dPVwiZW1vamlCYWNrZ3JvdW5kSW1hZ2VGblwiXG4gICAgICAgIFtzaXplXT1cIjM4XCJcbiAgICAgID48L25neC1lbW9qaT5cbiAgICA8L2Rpdj5cblxuICAgIDxkaXYgY2xhc3M9XCJlbW9qaS1tYXJ0LXByZXZpZXctZGF0YVwiPlxuICAgICAgPHNwYW4gY2xhc3M9XCJlbW9qaS1tYXJ0LXRpdGxlLWxhYmVsXCI+e3sgdGl0bGUgfX08L3NwYW4+XG4gICAgPC9kaXY+XG5cbiAgICA8ZGl2IGNsYXNzPVwiZW1vamktbWFydC1wcmV2aWV3LXNraW5zXCI+XG4gICAgICA8ZW1vamktc2tpbnMgW3NraW5dPVwiZW1vamlTa2luXCIgKGNoYW5nZVNraW4pPVwic2tpbkNoYW5nZS5lbWl0KCRldmVudClcIiBbaTE4bl09XCJpMThuXCI+XG4gICAgICA8L2Vtb2ppLXNraW5zPlxuICAgIDwvZGl2PlxuICA8L2Rpdj5cbiAgYCxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG4gIHByZXNlcnZlV2hpdGVzcGFjZXM6IGZhbHNlLFxufSlcbmV4cG9ydCBjbGFzcyBQcmV2aWV3Q29tcG9uZW50IGltcGxlbWVudHMgT25DaGFuZ2VzIHtcbiAgQElucHV0KCkgdGl0bGU/OiBzdHJpbmc7XG4gIEBJbnB1dCgpIGVtb2ppOiBhbnk7XG4gIEBJbnB1dCgpIGlkbGVFbW9qaTogYW55O1xuICBASW5wdXQoKSBpMThuOiBhbnk7XG4gIEBJbnB1dCgpIGVtb2ppSXNOYXRpdmU/OiBFbW9qaVsnaXNOYXRpdmUnXTtcbiAgQElucHV0KCkgZW1vamlTa2luPzogRW1vamlbJ3NraW4nXTtcbiAgQElucHV0KCkgZW1vamlTaXplPzogRW1vamlbJ3NpemUnXTtcbiAgQElucHV0KCkgZW1vamlTZXQ/OiBFbW9qaVsnc2V0J107XG4gIEBJbnB1dCgpIGVtb2ppU2hlZXRTaXplPzogRW1vamlbJ3NoZWV0U2l6ZSddO1xuICBASW5wdXQoKSBlbW9qaUJhY2tncm91bmRJbWFnZUZuPzogRW1vamlbJ2JhY2tncm91bmRJbWFnZUZuJ107XG4gIEBPdXRwdXQoKSBza2luQ2hhbmdlID0gbmV3IEV2ZW50RW1pdHRlcjxudW1iZXI+KCk7XG4gIGVtb2ppRGF0YTogUGFydGlhbDxFbW9qaURhdGE+ID0ge307XG4gIGxpc3RlZEVtb3RpY29ucz86IHN0cmluZ1tdO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHB1YmxpYyByZWY6IENoYW5nZURldGVjdG9yUmVmLFxuICAgIHByaXZhdGUgZW1vamlTZXJ2aWNlOiBFbW9qaVNlcnZpY2UsXG4gICkge31cblxuICBuZ09uQ2hhbmdlcygpIHtcbiAgICBpZiAoIXRoaXMuZW1vamkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy5lbW9qaURhdGEgPSB0aGlzLmVtb2ppU2VydmljZS5nZXREYXRhKHRoaXMuZW1vamksIHRoaXMuZW1vamlTa2luLCB0aGlzLmVtb2ppU2V0KSBhcyBFbW9qaURhdGE7XG4gICAgY29uc3Qga25vd25FbW90aWNvbnM6IHN0cmluZ1tdID0gW107XG4gICAgY29uc3QgbGlzdGVkRW1vdGljb25zOiBzdHJpbmdbXSA9IFtdO1xuICAgIGNvbnN0IGVtb2l0Y29ucyA9IHRoaXMuZW1vamlEYXRhLmVtb3RpY29ucyB8fCBbXTtcbiAgICBlbW9pdGNvbnMuZm9yRWFjaCgoZW1vdGljb246IHN0cmluZykgPT4ge1xuICAgICAgaWYgKGtub3duRW1vdGljb25zLmluZGV4T2YoZW1vdGljb24udG9Mb3dlckNhc2UoKSkgPj0gMCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBrbm93bkVtb3RpY29ucy5wdXNoKGVtb3RpY29uLnRvTG93ZXJDYXNlKCkpO1xuICAgICAgbGlzdGVkRW1vdGljb25zLnB1c2goZW1vdGljb24pO1xuICAgIH0pO1xuICAgIHRoaXMubGlzdGVkRW1vdGljb25zID0gbGlzdGVkRW1vdGljb25zO1xuICB9XG59XG4iXX0=