import * as tslib_1 from "tslib";
import { Component, ElementRef, EventEmitter, Input, Output, ViewChild, } from '@angular/core';
import { EmojiSearch } from './emoji-search.service';
let id = 0;
let SearchComponent = class SearchComponent {
    constructor(emojiSearch) {
        this.emojiSearch = emojiSearch;
        this.maxResults = 75;
        this.autoFocus = false;
        this.include = [];
        this.exclude = [];
        this.custom = [];
        this.searchResults = new EventEmitter();
        this.enterKey = new EventEmitter();
        this.isSearching = false;
        this.query = '';
        this.inputId = `emoji-mart-search-${++id}`;
    }
    ngOnInit() {
        this.icon = this.icons.search;
    }
    ngAfterViewInit() {
        if (this.autoFocus) {
            this.inputRef.nativeElement.focus();
        }
    }
    clear() {
        this.query = '';
        this.handleSearch('');
        this.inputRef.nativeElement.focus();
    }
    handleEnterKey($event) {
        if (!this.query) {
            return;
        }
        this.enterKey.emit($event);
        $event.preventDefault();
    }
    handleSearch(value) {
        if (value === '') {
            this.icon = this.icons.search;
            this.isSearching = false;
        }
        else {
            this.icon = this.icons.delete;
            this.isSearching = true;
        }
        const emojis = this.emojiSearch.search(this.query, this.emojisToShowFilter, this.maxResults, this.include, this.exclude, this.custom);
        this.searchResults.emit(emojis);
    }
    handleChange() {
        this.handleSearch(this.query);
    }
};
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Object)
], SearchComponent.prototype, "maxResults", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Object)
], SearchComponent.prototype, "autoFocus", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Object)
], SearchComponent.prototype, "i18n", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Array)
], SearchComponent.prototype, "include", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Array)
], SearchComponent.prototype, "exclude", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Array)
], SearchComponent.prototype, "custom", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Object)
], SearchComponent.prototype, "icons", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Function)
], SearchComponent.prototype, "emojisToShowFilter", void 0);
tslib_1.__decorate([
    Output(),
    tslib_1.__metadata("design:type", Object)
], SearchComponent.prototype, "searchResults", void 0);
tslib_1.__decorate([
    Output(),
    tslib_1.__metadata("design:type", Object)
], SearchComponent.prototype, "enterKey", void 0);
tslib_1.__decorate([
    ViewChild('inputRef'),
    tslib_1.__metadata("design:type", ElementRef)
], SearchComponent.prototype, "inputRef", void 0);
SearchComponent = tslib_1.__decorate([
    Component({
        selector: 'emoji-search',
        template: `
    <div class="emoji-mart-search">
      <input
        [id]="inputId"
        #inputRef
        type="search"
        (keyup.enter)="handleEnterKey($event)"
        [placeholder]="i18n.search"
        [autofocus]="autoFocus"
        [(ngModel)]="query"
        (ngModelChange)="handleChange()"
      />
      <!--
      Use a <label> in addition to the placeholder for accessibility, but place it off-screen
      http://www.maxability.co.in/2016/01/placeholder-attribute-and-why-it-is-not-accessible/
      -->
      <label class="emoji-mart-sr-only" [htmlFor]="inputId">
        {{ i18n.search }}
      </label>
      <button
        type="button"
        class="emoji-mart-search-icon"
        (click)="clear()"
        (keyup.enter)="clear()"
        [disabled]="!isSearching"
        [attr.aria-label]="i18n.clear"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          width="13"
          height="13"
          opacity="0.5"
        >
          <path [attr.d]="icon" />
        </svg>
      </button>
    </div>
  `,
        preserveWhitespaces: false
    }),
    tslib_1.__metadata("design:paramtypes", [EmojiSearch])
], SearchComponent);
export { SearchComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VhcmNoLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BjdHJsL25neC1lbW9qaS1tYXJ0LyIsInNvdXJjZXMiOlsic2VhcmNoLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsT0FBTyxFQUVMLFNBQVMsRUFDVCxVQUFVLEVBQ1YsWUFBWSxFQUNaLEtBQUssRUFFTCxNQUFNLEVBQ04sU0FBUyxHQUNWLE1BQU0sZUFBZSxDQUFDO0FBRXZCLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSx3QkFBd0IsQ0FBQztBQUVyRCxJQUFJLEVBQUUsR0FBRyxDQUFDLENBQUM7QUE2Q1gsSUFBYSxlQUFlLEdBQTVCLE1BQWEsZUFBZTtJQWlCMUIsWUFBb0IsV0FBd0I7UUFBeEIsZ0JBQVcsR0FBWCxXQUFXLENBQWE7UUFoQm5DLGVBQVUsR0FBRyxFQUFFLENBQUM7UUFDaEIsY0FBUyxHQUFHLEtBQUssQ0FBQztRQUVsQixZQUFPLEdBQWEsRUFBRSxDQUFDO1FBQ3ZCLFlBQU8sR0FBYSxFQUFFLENBQUM7UUFDdkIsV0FBTSxHQUFVLEVBQUUsQ0FBQztRQUdsQixrQkFBYSxHQUFHLElBQUksWUFBWSxFQUFTLENBQUM7UUFDMUMsYUFBUSxHQUFHLElBQUksWUFBWSxFQUFPLENBQUM7UUFFN0MsZ0JBQVcsR0FBRyxLQUFLLENBQUM7UUFFcEIsVUFBSyxHQUFHLEVBQUUsQ0FBQztRQUNYLFlBQU8sR0FBRyxxQkFBcUIsRUFBRSxFQUFFLEVBQUUsQ0FBQztJQUVTLENBQUM7SUFFaEQsUUFBUTtRQUNOLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUM7SUFDaEMsQ0FBQztJQUNELGVBQWU7UUFDYixJQUFJLElBQUksQ0FBQyxTQUFTLEVBQUU7WUFDbEIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsS0FBSyxFQUFFLENBQUM7U0FDckM7SUFDSCxDQUFDO0lBQ0QsS0FBSztRQUNILElBQUksQ0FBQyxLQUFLLEdBQUcsRUFBRSxDQUFDO1FBQ2hCLElBQUksQ0FBQyxZQUFZLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDdEIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsS0FBSyxFQUFFLENBQUM7SUFDdEMsQ0FBQztJQUNELGNBQWMsQ0FBQyxNQUFhO1FBQzFCLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFO1lBQ2YsT0FBTztTQUNSO1FBQ0QsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDM0IsTUFBTSxDQUFDLGNBQWMsRUFBRSxDQUFDO0lBQzFCLENBQUM7SUFDRCxZQUFZLENBQUMsS0FBYTtRQUN4QixJQUFJLEtBQUssS0FBSyxFQUFFLEVBQUU7WUFDaEIsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQztZQUM5QixJQUFJLENBQUMsV0FBVyxHQUFHLEtBQUssQ0FBQztTQUMxQjthQUFNO1lBQ0wsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQztZQUM5QixJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQztTQUN6QjtRQUNELE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUNwQyxJQUFJLENBQUMsS0FBSyxFQUNWLElBQUksQ0FBQyxrQkFBa0IsRUFDdkIsSUFBSSxDQUFDLFVBQVUsRUFDZixJQUFJLENBQUMsT0FBTyxFQUNaLElBQUksQ0FBQyxPQUFPLEVBQ1osSUFBSSxDQUFDLE1BQU0sQ0FDWixDQUFDO1FBQ0YsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDbEMsQ0FBQztJQUNELFlBQVk7UUFDVixJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUNoQyxDQUFDO0NBQ0YsQ0FBQTtBQTNEVTtJQUFSLEtBQUssRUFBRTs7bURBQWlCO0FBQ2hCO0lBQVIsS0FBSyxFQUFFOztrREFBbUI7QUFDbEI7SUFBUixLQUFLLEVBQUU7OzZDQUFXO0FBQ1Y7SUFBUixLQUFLLEVBQUU7O2dEQUF3QjtBQUN2QjtJQUFSLEtBQUssRUFBRTs7Z0RBQXdCO0FBQ3ZCO0lBQVIsS0FBSyxFQUFFOzsrQ0FBb0I7QUFDbkI7SUFBUixLQUFLLEVBQUU7OzhDQUFtQztBQUNsQztJQUFSLEtBQUssRUFBRTs7MkRBQTBDO0FBQ3hDO0lBQVQsTUFBTSxFQUFFOztzREFBMkM7QUFDMUM7SUFBVCxNQUFNLEVBQUU7O2lEQUFvQztBQUN0QjtJQUF0QixTQUFTLENBQUMsVUFBVSxDQUFDO3NDQUFvQixVQUFVO2lEQUFDO0FBWDFDLGVBQWU7SUEzQzNCLFNBQVMsQ0FBQztRQUNULFFBQVEsRUFBRSxjQUFjO1FBQ3hCLFFBQVEsRUFBRTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FzQ1Q7UUFDRCxtQkFBbUIsRUFBRSxLQUFLO0tBQzNCLENBQUM7NkNBa0JpQyxXQUFXO0dBakJqQyxlQUFlLENBNEQzQjtTQTVEWSxlQUFlIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgQWZ0ZXJWaWV3SW5pdCxcbiAgQ29tcG9uZW50LFxuICBFbGVtZW50UmVmLFxuICBFdmVudEVtaXR0ZXIsXG4gIElucHV0LFxuICBPbkluaXQsXG4gIE91dHB1dCxcbiAgVmlld0NoaWxkLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHsgRW1vamlTZWFyY2ggfSBmcm9tICcuL2Vtb2ppLXNlYXJjaC5zZXJ2aWNlJztcblxubGV0IGlkID0gMDtcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnZW1vamktc2VhcmNoJyxcbiAgdGVtcGxhdGU6IGBcbiAgICA8ZGl2IGNsYXNzPVwiZW1vamktbWFydC1zZWFyY2hcIj5cbiAgICAgIDxpbnB1dFxuICAgICAgICBbaWRdPVwiaW5wdXRJZFwiXG4gICAgICAgICNpbnB1dFJlZlxuICAgICAgICB0eXBlPVwic2VhcmNoXCJcbiAgICAgICAgKGtleXVwLmVudGVyKT1cImhhbmRsZUVudGVyS2V5KCRldmVudClcIlxuICAgICAgICBbcGxhY2Vob2xkZXJdPVwiaTE4bi5zZWFyY2hcIlxuICAgICAgICBbYXV0b2ZvY3VzXT1cImF1dG9Gb2N1c1wiXG4gICAgICAgIFsobmdNb2RlbCldPVwicXVlcnlcIlxuICAgICAgICAobmdNb2RlbENoYW5nZSk9XCJoYW5kbGVDaGFuZ2UoKVwiXG4gICAgICAvPlxuICAgICAgPCEtLVxuICAgICAgVXNlIGEgPGxhYmVsPiBpbiBhZGRpdGlvbiB0byB0aGUgcGxhY2Vob2xkZXIgZm9yIGFjY2Vzc2liaWxpdHksIGJ1dCBwbGFjZSBpdCBvZmYtc2NyZWVuXG4gICAgICBodHRwOi8vd3d3Lm1heGFiaWxpdHkuY28uaW4vMjAxNi8wMS9wbGFjZWhvbGRlci1hdHRyaWJ1dGUtYW5kLXdoeS1pdC1pcy1ub3QtYWNjZXNzaWJsZS9cbiAgICAgIC0tPlxuICAgICAgPGxhYmVsIGNsYXNzPVwiZW1vamktbWFydC1zci1vbmx5XCIgW2h0bWxGb3JdPVwiaW5wdXRJZFwiPlxuICAgICAgICB7eyBpMThuLnNlYXJjaCB9fVxuICAgICAgPC9sYWJlbD5cbiAgICAgIDxidXR0b25cbiAgICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICAgIGNsYXNzPVwiZW1vamktbWFydC1zZWFyY2gtaWNvblwiXG4gICAgICAgIChjbGljayk9XCJjbGVhcigpXCJcbiAgICAgICAgKGtleXVwLmVudGVyKT1cImNsZWFyKClcIlxuICAgICAgICBbZGlzYWJsZWRdPVwiIWlzU2VhcmNoaW5nXCJcbiAgICAgICAgW2F0dHIuYXJpYS1sYWJlbF09XCJpMThuLmNsZWFyXCJcbiAgICAgID5cbiAgICAgICAgPHN2Z1xuICAgICAgICAgIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIlxuICAgICAgICAgIHZpZXdCb3g9XCIwIDAgMjAgMjBcIlxuICAgICAgICAgIHdpZHRoPVwiMTNcIlxuICAgICAgICAgIGhlaWdodD1cIjEzXCJcbiAgICAgICAgICBvcGFjaXR5PVwiMC41XCJcbiAgICAgICAgPlxuICAgICAgICAgIDxwYXRoIFthdHRyLmRdPVwiaWNvblwiIC8+XG4gICAgICAgIDwvc3ZnPlxuICAgICAgPC9idXR0b24+XG4gICAgPC9kaXY+XG4gIGAsXG4gIHByZXNlcnZlV2hpdGVzcGFjZXM6IGZhbHNlLFxufSlcbmV4cG9ydCBjbGFzcyBTZWFyY2hDb21wb25lbnQgaW1wbGVtZW50cyBBZnRlclZpZXdJbml0LCBPbkluaXQge1xuICBASW5wdXQoKSBtYXhSZXN1bHRzID0gNzU7XG4gIEBJbnB1dCgpIGF1dG9Gb2N1cyA9IGZhbHNlO1xuICBASW5wdXQoKSBpMThuOiBhbnk7XG4gIEBJbnB1dCgpIGluY2x1ZGU6IHN0cmluZ1tdID0gW107XG4gIEBJbnB1dCgpIGV4Y2x1ZGU6IHN0cmluZ1tdID0gW107XG4gIEBJbnB1dCgpIGN1c3RvbTogYW55W10gPSBbXTtcbiAgQElucHV0KCkgaWNvbnM/OiB7IFtrZXk6IHN0cmluZ106IHN0cmluZyB9O1xuICBASW5wdXQoKSBlbW9qaXNUb1Nob3dGaWx0ZXI/OiAoeDogYW55KSA9PiBib29sZWFuO1xuICBAT3V0cHV0KCkgc2VhcmNoUmVzdWx0cyA9IG5ldyBFdmVudEVtaXR0ZXI8YW55W10+KCk7XG4gIEBPdXRwdXQoKSBlbnRlcktleSA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuICBAVmlld0NoaWxkKCdpbnB1dFJlZicpIHByaXZhdGUgaW5wdXRSZWYhOiBFbGVtZW50UmVmO1xuICBpc1NlYXJjaGluZyA9IGZhbHNlO1xuICBpY29uPzogc3RyaW5nO1xuICBxdWVyeSA9ICcnO1xuICBpbnB1dElkID0gYGVtb2ppLW1hcnQtc2VhcmNoLSR7KytpZH1gO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgZW1vamlTZWFyY2g6IEVtb2ppU2VhcmNoKSB7fVxuXG4gIG5nT25Jbml0KCkge1xuICAgIHRoaXMuaWNvbiA9IHRoaXMuaWNvbnMuc2VhcmNoO1xuICB9XG4gIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcbiAgICBpZiAodGhpcy5hdXRvRm9jdXMpIHtcbiAgICAgIHRoaXMuaW5wdXRSZWYubmF0aXZlRWxlbWVudC5mb2N1cygpO1xuICAgIH1cbiAgfVxuICBjbGVhcigpIHtcbiAgICB0aGlzLnF1ZXJ5ID0gJyc7XG4gICAgdGhpcy5oYW5kbGVTZWFyY2goJycpO1xuICAgIHRoaXMuaW5wdXRSZWYubmF0aXZlRWxlbWVudC5mb2N1cygpO1xuICB9XG4gIGhhbmRsZUVudGVyS2V5KCRldmVudDogRXZlbnQpIHtcbiAgICBpZiAoIXRoaXMucXVlcnkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy5lbnRlcktleS5lbWl0KCRldmVudCk7XG4gICAgJGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gIH1cbiAgaGFuZGxlU2VhcmNoKHZhbHVlOiBzdHJpbmcpIHtcbiAgICBpZiAodmFsdWUgPT09ICcnKSB7XG4gICAgICB0aGlzLmljb24gPSB0aGlzLmljb25zLnNlYXJjaDtcbiAgICAgIHRoaXMuaXNTZWFyY2hpbmcgPSBmYWxzZTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5pY29uID0gdGhpcy5pY29ucy5kZWxldGU7XG4gICAgICB0aGlzLmlzU2VhcmNoaW5nID0gdHJ1ZTtcbiAgICB9XG4gICAgY29uc3QgZW1vamlzID0gdGhpcy5lbW9qaVNlYXJjaC5zZWFyY2goXG4gICAgICB0aGlzLnF1ZXJ5LFxuICAgICAgdGhpcy5lbW9qaXNUb1Nob3dGaWx0ZXIsXG4gICAgICB0aGlzLm1heFJlc3VsdHMsXG4gICAgICB0aGlzLmluY2x1ZGUsXG4gICAgICB0aGlzLmV4Y2x1ZGUsXG4gICAgICB0aGlzLmN1c3RvbSxcbiAgICApO1xuICAgIHRoaXMuc2VhcmNoUmVzdWx0cy5lbWl0KGVtb2ppcyk7XG4gIH1cbiAgaGFuZGxlQ2hhbmdlKCkge1xuICAgIHRoaXMuaGFuZGxlU2VhcmNoKHRoaXMucXVlcnkpO1xuICB9XG59XG4iXX0=