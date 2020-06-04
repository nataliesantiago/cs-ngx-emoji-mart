import * as tslib_1 from "tslib";
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, Output, ViewChild, } from '@angular/core';
import { EmojiService } from '@ctrl/ngx-emoji-mart/ngx-emoji';
import { EmojiFrequentlyService } from './emoji-frequently.service';
let CategoryComponent = class CategoryComponent {
    constructor(ref, emojiService, frequently) {
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
    ngOnInit() {
        this.emojis = this.getEmojis();
        if (!this.emojis) {
            this.containerStyles = { display: 'none' };
        }
        if (!this.hasStickyPosition) {
            this.labelStyles = { height: 28 };
            // this.labelSpanStyles = { position: 'absolute' };
        }
    }
    memoizeSize() {
        const parent = this.container.nativeElement.parentNode.parentNode;
        const { top, height, } = this.container.nativeElement.getBoundingClientRect();
        const parentTop = parent.getBoundingClientRect().top;
        const labelHeight = this.label.nativeElement.getBoundingClientRect().height;
        this.top = top - parentTop + parent.scrollTop;
        if (height === 0) {
            this.maxMargin = 0;
        }
        else {
            this.maxMargin = height - labelHeight;
        }
    }
    handleScroll(scrollTop) {
        let margin = scrollTop - this.top;
        margin = margin < this.minMargin ? this.minMargin : margin;
        margin = margin > this.maxMargin ? this.maxMargin : margin;
        if (margin === this.margin) {
            return false;
        }
        if (!this.hasStickyPosition) {
            this.label.nativeElement.style.top = `${margin}px`;
        }
        this.margin = margin;
        return true;
    }
    getEmojis() {
        if (this.name === 'Recent') {
            let frequentlyUsed = this.recent || this.frequently.get(this.perLine, this.totalFrequentLines);
            if (!frequentlyUsed || !frequentlyUsed.length) {
                frequentlyUsed = this.frequently.get(this.perLine, this.totalFrequentLines);
            }
            if (frequentlyUsed.length) {
                this.emojis = frequentlyUsed
                    .map(id => {
                    const emoji = this.custom.filter((e) => e.id === id)[0];
                    if (emoji) {
                        return emoji;
                    }
                    return id;
                })
                    .filter(id => !!this.emojiService.getData(id));
            }
            if ((!this.emojis || this.emojis.length === 0) && frequentlyUsed.length > 0) {
                return null;
            }
        }
        if (this.emojis) {
            this.emojis = this.emojis.slice(0);
        }
        return this.emojis;
    }
    updateDisplay(display) {
        this.containerStyles.display = display;
        this.getEmojis();
        this.ref.detectChanges();
    }
    trackById(index, item) {
        return item;
    }
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
        template: `
  <section #container class="emoji-mart-category"
    [attr.aria-label]="i18n.categories[id]"
    [class.emoji-mart-no-results]="emojis && !emojis.length"
    [ngStyle]="containerStyles">
    <div class="emoji-mart-category-label"
      [ngStyle]="labelStyles"
      [attr.data-name]="name">
      <!-- already labeled by the section aria-label -->
      <span #label [ngStyle]="labelSpanStyles" aria-hidden="true">
        {{ i18n.categories[id] }}
      </span>
    </div>

    <ng-template [ngIf]="emojis">
      <ngx-emoji
        *ngFor="let emoji of emojis; trackBy: trackById"
        [emoji]="emoji"
        [size]="emojiSize"
        [skin]="emojiSkin"
        [isNative]="emojiIsNative"
        [set]="emojiSet"
        [sheetSize]="emojiSheetSize"
        [forceSize]="emojiForceSize"
        [tooltip]="emojiTooltip"
        [backgroundImageFn]="emojiBackgroundImageFn"
        [hideObsolete]="hideObsolete"
        (emojiOver)="emojiOver.emit($event)"
        (emojiLeave)="emojiLeave.emit($event)"
        (emojiClick)="emojiClick.emit($event)"
      ></ngx-emoji>
    </ng-template>

    <div *ngIf="emojis && !emojis.length">
      <div>
        <ngx-emoji
          [emoji]="notFoundEmoji"
          size="38"
          [skin]="emojiSkin"
          [isNative]="emojiIsNative"
          [set]="emojiSet"
          [sheetSize]="emojiSheetSize"
          [forceSize]="emojiForceSize"
          [tooltip]="emojiTooltip"
          [backgroundImageFn]="emojiBackgroundImageFn"
        ></ngx-emoji>
      </div>

      <div class="emoji-mart-no-results-label">
        {{ i18n.notfound }}
      </div>
    </div>

  </section>
  `,
        changeDetection: ChangeDetectionStrategy.OnPush,
        preserveWhitespaces: false
    }),
    tslib_1.__metadata("design:paramtypes", [ChangeDetectorRef,
        EmojiService,
        EmojiFrequentlyService])
], CategoryComponent);
export { CategoryComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2F0ZWdvcnkuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vQGN0cmwvbmd4LWVtb2ppLW1hcnQvIiwic291cmNlcyI6WyJjYXRlZ29yeS5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFDTCx1QkFBdUIsRUFDdkIsaUJBQWlCLEVBQ2pCLFNBQVMsRUFDVCxVQUFVLEVBQ1YsWUFBWSxFQUNaLEtBQUssRUFFTCxNQUFNLEVBQ04sU0FBUyxHQUNWLE1BQU0sZUFBZSxDQUFDO0FBRXZCLE9BQU8sRUFBUyxZQUFZLEVBQUUsTUFBTSxnQ0FBZ0MsQ0FBQztBQUNyRSxPQUFPLEVBQUUsc0JBQXNCLEVBQUUsTUFBTSw0QkFBNEIsQ0FBQztBQThEcEUsSUFBYSxpQkFBaUIsR0FBOUIsTUFBYSxpQkFBaUI7SUFpQzVCLFlBQ1MsR0FBc0IsRUFDckIsWUFBMEIsRUFDMUIsVUFBa0M7UUFGbkMsUUFBRyxHQUFILEdBQUcsQ0FBbUI7UUFDckIsaUJBQVksR0FBWixZQUFZLENBQWM7UUFDMUIsZUFBVSxHQUFWLFVBQVUsQ0FBd0I7UUFsQ25DLHNCQUFpQixHQUFHLElBQUksQ0FBQztRQUN6QixTQUFJLEdBQUcsRUFBRSxDQUFDO1FBQ1YsWUFBTyxHQUFHLENBQUMsQ0FBQztRQUNaLHVCQUFrQixHQUFHLENBQUMsQ0FBQztRQUN2QixXQUFNLEdBQWEsRUFBRSxDQUFDO1FBQ3RCLFdBQU0sR0FBVSxFQUFFLENBQUM7UUFHbkIsaUJBQVksR0FBRyxJQUFJLENBQUM7UUFVbkIsY0FBUyxHQUF1QixJQUFJLFlBQVksRUFBRSxDQUFDO1FBQ25ELGVBQVUsR0FBd0IsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUNyRCxlQUFVLEdBQXdCLElBQUksWUFBWSxFQUFFLENBQUM7UUFHL0Qsb0JBQWUsR0FBUSxFQUFFLENBQUM7UUFDMUIsZ0JBQVcsR0FBUSxFQUFFLENBQUM7UUFDdEIsb0JBQWUsR0FBUSxFQUFFLENBQUM7UUFDMUIsV0FBTSxH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QXNCO0dBcENqQyxpQkFBaUIsQ0EySDdCO1NBM0hZLGlCQUFpQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBDaGFuZ2VEZXRlY3RvclJlZixcbiAgQ29tcG9uZW50LFxuICBFbGVtZW50UmVmLFxuICBFdmVudEVtaXR0ZXIsXG4gIElucHV0LFxuICBPbkluaXQsXG4gIE91dHB1dCxcbiAgVmlld0NoaWxkLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHsgRW1vamksIEVtb2ppU2VydmljZSB9IGZyb20gJ0BjdHJsL25neC1lbW9qaS1tYXJ0L25neC1lbW9qaSc7XG5pbXBvcnQgeyBFbW9qaUZyZXF1ZW50bHlTZXJ2aWNlIH0gZnJvbSAnLi9lbW9qaS1mcmVxdWVudGx5LnNlcnZpY2UnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdlbW9qaS1jYXRlZ29yeScsXG4gIHRlbXBsYXRlOiBgXG4gIDxzZWN0aW9uICNjb250YWluZXIgY2xhc3M9XCJlbW9qaS1tYXJ0LWNhdGVnb3J5XCJcbiAgICBbYXR0ci5hcmlhLWxhYmVsXT1cImkxOG4uY2F0ZWdvcmllc1tpZF1cIlxuICAgIFtjbGFzcy5lbW9qaS1tYXJ0LW5vLXJlc3VsdHNdPVwiZW1vamlzICYmICFlbW9qaXMubGVuZ3RoXCJcbiAgICBbbmdTdHlsZV09XCJjb250YWluZXJTdHlsZXNcIj5cbiAgICA8ZGl2IGNsYXNzPVwiZW1vamktbWFydC1jYXRlZ29yeS1sYWJlbFwiXG4gICAgICBbbmdTdHlsZV09XCJsYWJlbFN0eWxlc1wiXG4gICAgICBbYXR0ci5kYXRhLW5hbWVdPVwibmFtZVwiPlxuICAgICAgPCEtLSBhbHJlYWR5IGxhYmVsZWQgYnkgdGhlIHNlY3Rpb24gYXJpYS1sYWJlbCAtLT5cbiAgICAgIDxzcGFuICNsYWJlbCBbbmdTdHlsZV09XCJsYWJlbFNwYW5TdHlsZXNcIiBhcmlhLWhpZGRlbj1cInRydWVcIj5cbiAgICAgICAge3sgaTE4bi5jYXRlZ29yaWVzW2lkXSB9fVxuICAgICAgPC9zcGFuPlxuICAgIDwvZGl2PlxuXG4gICAgPG5nLXRlbXBsYXRlIFtuZ0lmXT1cImVtb2ppc1wiPlxuICAgICAgPG5neC1lbW9qaVxuICAgICAgICAqbmdGb3I9XCJsZXQgZW1vamkgb2YgZW1vamlzOyB0cmFja0J5OiB0cmFja0J5SWRcIlxuICAgICAgICBbZW1vamldPVwiZW1vamlcIlxuICAgICAgICBbc2l6ZV09XCJlbW9qaVNpemVcIlxuICAgICAgICBbc2tpbl09XCJlbW9qaVNraW5cIlxuICAgICAgICBbaXNOYXRpdmVdPVwiZW1vamlJc05hdGl2ZVwiXG4gICAgICAgIFtzZXRdPVwiZW1vamlTZXRcIlxuICAgICAgICBbc2hlZXRTaXplXT1cImVtb2ppU2hlZXRTaXplXCJcbiAgICAgICAgW2ZvcmNlU2l6ZV09XCJlbW9qaUZvcmNlU2l6ZVwiXG4gICAgICAgIFt0b29sdGlwXT1cImVtb2ppVG9vbHRpcFwiXG4gICAgICAgIFtiYWNrZ3JvdW5kSW1hZ2VGbl09XCJlbW9qaUJhY2tncm91bmRJbWFnZUZuXCJcbiAgICAgICAgW2hpZGVPYnNvbGV0ZV09XCJoaWRlT2Jzb2xldGVcIlxuICAgICAgICAoZW1vamlPdmVyKT1cImVtb2ppT3Zlci5lbWl0KCRldmVudClcIlxuICAgICAgICAoZW1vamlMZWF2ZSk9XCJlbW9qaUxlYXZlLmVtaXQoJGV2ZW50KVwiXG4gICAgICAgIChlbW9qaUNsaWNrKT1cImVtb2ppQ2xpY2suZW1pdCgkZXZlbnQpXCJcbiAgICAgID48L25neC1lbW9qaT5cbiAgICA8L25nLXRlbXBsYXRlPlxuXG4gICAgPGRpdiAqbmdJZj1cImVtb2ppcyAmJiAhZW1vamlzLmxlbmd0aFwiPlxuICAgICAgPGRpdj5cbiAgICAgICAgPG5neC1lbW9qaVxuICAgICAgICAgIFtlbW9qaV09XCJub3RGb3VuZEVtb2ppXCJcbiAgICAgICAgICBzaXplPVwiMzhcIlxuICAgICAgICAgIFtza2luXT1cImVtb2ppU2tpblwiXG4gICAgICAgICAgW2lzTmF0aXZlXT1cImVtb2ppSXNOYXRpdmVcIlxuICAgICAgICAgIFtzZXRdPVwiZW1vamlTZXRcIlxuICAgICAgICAgIFtzaGVldFNpemVdPVwiZW1vamlTaGVldFNpemVcIlxuICAgICAgICAgIFtmb3JjZVNpemVdPVwiZW1vamlGb3JjZVNpemVcIlxuICAgICAgICAgIFt0b29sdGlwXT1cImVtb2ppVG9vbHRpcFwiXG4gICAgICAgICAgW2JhY2tncm91bmRJbWFnZUZuXT1cImVtb2ppQmFja2dyb3VuZEltYWdlRm5cIlxuICAgICAgICA+PC9uZ3gtZW1vamk+XG4gICAgICA8L2Rpdj5cblxuICAgICAgPGRpdiBjbGFzcz1cImVtb2ppLW1hcnQtbm8tcmVzdWx0cy1sYWJlbFwiPlxuICAgICAgICB7eyBpMThuLm5vdGZvdW5kIH19XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cblxuICA8L3NlY3Rpb24+XG4gIGAsXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICBwcmVzZXJ2ZVdoaXRlc3BhY2VzOiBmYWxzZSxcbn0pXG5leHBvcnQgY2xhc3MgQ2F0ZWdvcnlDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xuICBASW5wdXQoKSBlbW9qaXM/OiBhbnlbXSB8IG51bGw7XG4gIEBJbnB1dCgpIGhhc1N0aWNreVBvc2l0aW9uID0gdHJ1ZTtcbiAgQElucHV0KCkgbmFtZSA9ICcnO1xuICBASW5wdXQoKSBwZXJMaW5lID0gOTtcbiAgQElucHV0KCkgdG90YWxGcmVxdWVudExpbmVzID0gNDtcbiAgQElucHV0KCkgcmVjZW50OiBzdHJpbmdbXSA9IFtdO1xuICBASW5wdXQoKSBjdXN0b206IGFueVtdID0gW107XG4gIEBJbnB1dCgpIGkxOG46IGFueTtcbiAgQElucHV0KCkgaWQ6IGFueTtcbiAgQElucHV0KCkgaGlkZU9ic29sZXRlID0gdHJ1ZTtcbiAgQElucHV0KCkgbm90Rm91bmRFbW9qaT86IHN0cmluZztcbiAgQElucHV0KCkgZW1vamlJc05hdGl2ZT86IEVtb2ppWydpc05hdGl2ZSddO1xuICBASW5wdXQoKSBlbW9qaVNraW4/OiBFbW9qaVsnc2tpbiddO1xuICBASW5wdXQoKSBlbW9qaVNpemU/OiBFbW9qaVsnc2l6ZSddO1xuICBASW5wdXQoKSBlbW9qaVNldD86IEVtb2ppWydzZXQnXTtcbiAgQElucHV0KCkgZW1vamlTaGVldFNpemU/OiBFbW9qaVsnc2hlZXRTaXplJ107XG4gIEBJbnB1dCgpIGVtb2ppRm9yY2VTaXplPzogRW1vamlbJ2ZvcmNlU2l6ZSddO1xuICBASW5wdXQoKSBlbW9qaVRvb2x0aXA/OiBFbW9qaVsndG9vbHRpcCddO1xuICBASW5wdXQoKSBlbW9qaUJhY2tncm91bmRJbWFnZUZuPzogRW1vamlbJ2JhY2tncm91bmRJbWFnZUZuJ107XG4gIEBPdXRwdXQoKSBlbW9qaU92ZXI6IEVtb2ppWydlbW9qaU92ZXInXSA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgQE91dHB1dCgpIGVtb2ppTGVhdmU6IEVtb2ppWydlbW9qaUxlYXZlJ10gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gIEBPdXRwdXQoKSBlbW9qaUNsaWNrOiBFbW9qaVsnZW1vamlDbGljayddID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICBAVmlld0NoaWxkKCdjb250YWluZXInKSBjb250YWluZXIhOiBFbGVtZW50UmVmO1xuICBAVmlld0NoaWxkKCdsYWJlbCcpIGxhYmVsITogRWxlbWVudFJlZjtcbiAgY29udGFpbmVyU3R5bGVzOiBhbnkgPSB7fTtcbiAgbGFiZWxTdHlsZXM6IGFueSA9IHt9O1xuICBsYWJlbFNwYW5TdHlsZXM6IGFueSA9IHt9O1xuICBtYXJnaW4gPSAwO1xuICBtaW5NYXJnaW4gPSAwO1xuICBtYXhNYXJnaW4gPSAwO1xuICB0b3AgPSAwO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHB1YmxpYyByZWY6IENoYW5nZURldGVjdG9yUmVmLFxuICAgIHByaXZhdGUgZW1vamlTZXJ2aWNlOiBFbW9qaVNlcnZpY2UsXG4gICAgcHJpdmF0ZSBmcmVxdWVudGx5OiBFbW9qaUZyZXF1ZW50bHlTZXJ2aWNlLFxuICApIHt9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgdGhpcy5lbW9qaXMgPSB0aGlzLmdldEVtb2ppcygpO1xuXG4gICAgaWYgKCF0aGlzLmVtb2ppcykge1xuICAgICAgdGhpcy5jb250YWluZXJTdHlsZXMgPSB7IGRpc3BsYXk6ICdub25lJyB9O1xuICAgIH1cblxuICAgIGlmICghdGhpcy5oYXNTdGlja3lQb3NpdGlvbikge1xuICAgICAgdGhpcy5sYWJlbFN0eWxlcyA9IHsgaGVpZ2h0OiAyOCB9O1xuICAgICAgLy8gdGhpcy5sYWJlbFNwYW5TdHlsZXMgPSB7IHBvc2l0aW9uOiAnYWJzb2x1dGUnIH07XG4gICAgfVxuICB9XG4gIG1lbW9pemVTaXplKCkge1xuICAgIGNvbnN0IHBhcmVudCA9IHRoaXMuY29udGFpbmVyLm5hdGl2ZUVsZW1lbnQucGFyZW50Tm9kZS5wYXJlbnROb2RlO1xuICAgIGNvbnN0IHtcbiAgICAgIHRvcCxcbiAgICAgIGhlaWdodCxcbiAgICB9ID0gdGhpcy5jb250YWluZXIubmF0aXZlRWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICBjb25zdCBwYXJlbnRUb3AgPSBwYXJlbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkudG9wO1xuICAgIGNvbnN0IGxhYmVsSGVpZ2h0ID0gdGhpcy5sYWJlbC5uYXRpdmVFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmhlaWdodDtcblxuICAgIHRoaXMudG9wID0gdG9wIC0gcGFyZW50VG9wICsgcGFyZW50LnNjcm9sbFRvcDtcblxuICAgIGlmIChoZWlnaHQgPT09IDApIHtcbiAgICAgIHRoaXMubWF4TWFyZ2luID0gMDtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5tYXhNYXJnaW4gPSBoZWlnaHQgLSBsYWJlbEhlaWdodDtcbiAgICB9XG4gIH1cbiAgaGFuZGxlU2Nyb2xsKHNjcm9sbFRvcDogbnVtYmVyKTogYm9vbGVhbiB7XG4gICAgbGV0IG1hcmdpbiA9IHNjcm9sbFRvcCAtIHRoaXMudG9wO1xuICAgIG1hcmdpbiA9IG1hcmdpbiA8IHRoaXMubWluTWFyZ2luID8gdGhpcy5taW5NYXJnaW4gOiBtYXJnaW47XG4gICAgbWFyZ2luID0gbWFyZ2luID4gdGhpcy5tYXhNYXJnaW4gPyB0aGlzLm1heE1hcmdpbiA6IG1hcmdpbjtcblxuICAgIGlmIChtYXJnaW4gPT09IHRoaXMubWFyZ2luKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLmhhc1N0aWNreVBvc2l0aW9uKSB7XG4gICAgICB0aGlzLmxhYmVsLm5hdGl2ZUVsZW1lbnQuc3R5bGUudG9wID0gYCR7bWFyZ2lufXB4YDtcbiAgICB9XG5cbiAgICB0aGlzLm1hcmdpbiA9IG1hcmdpbjtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIGdldEVtb2ppcygpIHtcbiAgICBpZiAodGhpcy5uYW1lID09PSAnUmVjZW50Jykge1xuICAgICAgbGV0IGZyZXF1ZW50bHlVc2VkID0gdGhpcy5yZWNlbnQgfHwgdGhpcy5mcmVxdWVudGx5LmdldCh0aGlzLnBlckxpbmUsIHRoaXMudG90YWxGcmVxdWVudExpbmVzKTtcbiAgICAgIGlmICghZnJlcXVlbnRseVVzZWQgfHwgIWZyZXF1ZW50bHlVc2VkLmxlbmd0aCkge1xuICAgICAgICBmcmVxdWVudGx5VXNlZCA9IHRoaXMuZnJlcXVlbnRseS5nZXQodGhpcy5wZXJMaW5lLCB0aGlzLnRvdGFsRnJlcXVlbnRMaW5lcyk7XG4gICAgICB9XG4gICAgICBpZiAoZnJlcXVlbnRseVVzZWQubGVuZ3RoKSB7XG4gICAgICAgIHRoaXMuZW1vamlzID0gZnJlcXVlbnRseVVzZWRcbiAgICAgICAgICAubWFwKGlkID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGVtb2ppID0gdGhpcy5jdXN0b20uZmlsdGVyKChlOiBhbnkpID0+IGUuaWQgPT09IGlkKVswXTtcbiAgICAgICAgICAgIGlmIChlbW9qaSkge1xuICAgICAgICAgICAgICByZXR1cm4gZW1vamk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBpZDtcbiAgICAgICAgICB9KVxuICAgICAgICAgIC5maWx0ZXIoaWQgPT4gISF0aGlzLmVtb2ppU2VydmljZS5nZXREYXRhKGlkKSk7XG4gICAgICB9XG5cbiAgICAgIGlmICgoIXRoaXMuZW1vamlzIHx8IHRoaXMuZW1vamlzLmxlbmd0aCA9PT0gMCkgJiYgZnJlcXVlbnRseVVzZWQubGVuZ3RoID4gMCkge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAodGhpcy5lbW9qaXMpIHtcbiAgICAgIHRoaXMuZW1vamlzID0gdGhpcy5lbW9qaXMuc2xpY2UoMCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuZW1vamlzO1xuICB9XG4gIHVwZGF0ZURpc3BsYXkoZGlzcGxheTogJ25vbmUnIHwgJ2Jsb2NrJykge1xuICAgIHRoaXMuY29udGFpbmVyU3R5bGVzLmRpc3BsYXkgPSBkaXNwbGF5O1xuICAgIHRoaXMuZ2V0RW1vamlzKCk7XG4gICAgdGhpcy5yZWYuZGV0ZWN0Q2hhbmdlcygpO1xuICB9XG4gIHRyYWNrQnlJZChpbmRleDogbnVtYmVyLCBpdGVtOiBhbnkpIHtcbiAgICByZXR1cm4gaXRlbTtcbiAgfVxufVxuIl19