import * as tslib_1 from "tslib";
import { Component, ElementRef, EventEmitter, Input, Output, ViewChild, } from '@angular/core';
import { EmojiSearch } from './emoji-search.service';
var id = 0;
var SearchComponent = /** @class */ (function () {
    function SearchComponent(emojiSearch) {
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
        this.inputId = "emoji-mart-search-" + ++id;
    }
    SearchComponent.prototype.ngOnInit = function () {
        this.icon = this.icons.search;
    };
    SearchComponent.prototype.ngAfterViewInit = function () {
        if (this.autoFocus) {
            this.inputRef.nativeElement.focus();
        }
    };
    SearchComponent.prototype.clear = function () {
        this.query = '';
        this.handleSearch('');
        this.inputRef.nativeElement.focus();
    };
    SearchComponent.prototype.handleEnterKey = function ($event) {
        if (!this.query) {
            return;
        }
        this.enterKey.emit($event);
        $event.preventDefault();
    };
    SearchComponent.prototype.handleSearch = function (value) {
        if (value === '') {
            this.icon = this.icons.search;
            this.isSearching = false;
        }
        else {
            this.icon = this.icons.delete;
            this.isSearching = true;
        }
        var emojis = this.emojiSearch.search(this.query, this.emojisToShowFilter, this.maxResults, this.include, this.exclude, this.custom);
        this.searchResults.emit(emojis);
    };
    SearchComponent.prototype.handleChange = function () {
        this.handleSearch(this.query);
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
            template: "\n    <div class=\"emoji-mart-search\">\n      <input\n        [id]=\"inputId\"\n        #inputRef\n        type=\"search\"\n        (keyup.enter)=\"handleEnterKey($event)\"\n        [placeholder]=\"i18n.search\"\n        [autofocus]=\"autoFocus\"\n        [(ngModel)]=\"query\"\n        (ngModelChange)=\"handleChange()\"\n      />\n      <!--\n      Use a <label> in addition to the placeholder for accessibility, but place it off-screen\n      http://www.maxability.co.in/2016/01/placeholder-attribute-and-why-it-is-not-accessible/\n      -->\n      <label class=\"emoji-mart-sr-only\" [htmlFor]=\"inputId\">\n        {{ i18n.search }}\n      </label>\n      <button\n        type=\"button\"\n        class=\"emoji-mart-search-icon\"\n        (click)=\"clear()\"\n        (keyup.enter)=\"clear()\"\n        [disabled]=\"!isSearching\"\n        [attr.aria-label]=\"i18n.clear\"\n      >\n        <svg\n          xmlns=\"http://www.w3.org/2000/svg\"\n          viewBox=\"0 0 20 20\"\n          width=\"13\"\n          height=\"13\"\n          opacity=\"0.5\"\n        >\n          <path [attr.d]=\"icon\" />\n        </svg>\n      </button>\n    </div>\n  ",
            preserveWhitespaces: false
        }),
        tslib_1.__metadata("design:paramtypes", [EmojiSearch])
    ], SearchComponent);
    return SearchComponent;
}());
export { SearchComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VhcmNoLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BjdHJsL25neC1lbW9qaS1tYXJ0LyIsInNvdXJjZXMiOlsic2VhcmNoLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsT0FBTyxFQUVMLFNBQVMsRUFDVCxVQUFVLEVBQ1YsWUFBWSxFQUNaLEtBQUssRUFFTCxNQUFNLEVBQ04sU0FBUyxHQUNWLE1BQU0sZUFBZSxDQUFDO0FBRXZCLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSx3QkFBd0IsQ0FBQztBQUVyRCxJQUFJLEVBQUUsR0FBRyxDQUFDLENBQUM7QUE2Q1g7SUFpQkUseUJBQW9CLFdBQXdCO1FBQXhCLGdCQUFXLEdBQVgsV0FBVyxDQUFhO1FBaEJuQyxlQUFVLEdBQUcsRUFBRSxDQUFDO1FBQ2hCLGNBQVMsR0FBRyxLQUFLLENBQUM7UUFFbEIsWUFBTyxHQUFhLEVBQUUsQ0FBQztRQUN2QixZQUFPLEdBQWEsRUFBRSxDQUFDO1FBQ3ZCLFdBQU0sR0FBVSxFQUFFLENBQUM7UUFHbEIsa0JBQWEsR0FBRyxJQUFJLFlBQVksRUFBUyxDQUFDO1FBQzFDLGFBQVEsR0FBRyxJQUFJLFlBQVksRUFBTyxDQUFDO1FBRTdDLGdCQUFXLEdBQUcsS0FBSyxDQUFDO1FBRXBCLFVBQUssR0FBRyxFQUFFLENBQUM7UUFDWCxZQUFPLEdBQUcsdUJBQXFCLEVBQUUsRUFBSSxDQUFDO0lBRVMsQ0FBQztJQUVoRCxrQ0FBUSxHQUFSO1FBQ0UsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQztJQUNoQyxDQUFDO0lBQ0QseUNBQWUsR0FBZjtRQUNFLElBQUksSUFBSSxDQUFDLFNBQVMsRUFBRTtZQUNsQixJQUFJLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxLQUFLLEVBQUUsQ0FBQztTQUNyQztJQUNILENBQUM7SUFDRCwrQkFBSyxHQUFMO1FBQ0UsSUFBSSxDQUFDLEtBQUssR0FBRyxFQUFFLENBQUM7UUFDaEIsSUFBSSxDQUFDLFlBQVksQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUN0QixJQUFJLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxLQUFLLEVBQUUsQ0FBQztJQUN0QyxDQUFDO0lBQ0Qsd0NBQWMsR0FBZCxVQUFlLE1BQWE7UUFDMUIsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUU7WUFDZixPQUFPO1NBQ1I7UUFDRCxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUMzQixNQUFNLENBQUMsY0FBYyxFQUFFLENBQUM7SUFDMUIsQ0FBQztJQUNELHNDQUFZLEdBQVosVUFBYSxLQUFhO1FBQ3hCLElBQUksS0FBSyxLQUFLLEVBQUUsRUFBRTtZQUNoQixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDO1lBQzlCLElBQUksQ0FBQyxXQUFXLEdBQUcsS0FBSyxDQUFDO1NBQzFCO2FBQU07WUFDTCxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDO1lBQzlCLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDO1NBQ3pCO1FBQ0QsSUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQ3BDLElBQUksQ0FBQyxLQUFLLEVBQ1YsSUFBSSxDQUFDLGtCQUFrQixFQUN2QixJQUFJLENBQUMsVUFBVSxFQUNmLElBQUksQ0FBQyxPQUFPLEVBQ1osSUFBSSxDQUFDLE9BQU8sRUFDWixJQUFJLENBQUMsTUFBTSxDQUNaLENBQUM7UUFDRixJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUNsQyxDQUFDO0lBQ0Qsc0NBQVksR0FBWjtRQUNFLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ2hDLENBQUM7SUExRFE7UUFBUixLQUFLLEVBQUU7O3VEQUFpQjtJQUNoQjtRQUFSLEtBQUssRUFBRTs7c0RBQW1CO0lBQ2xCO1FBQVIsS0FBSyxFQUFFOztpREFBVztJQUNWO1FBQVIsS0FBSyxFQUFFOztvREFBd0I7SUFDdkI7UUFBUixLQUFLLEVBQUU7O29EQUF3QjtJQUN2QjtRQUFSLEtBQUssRUFBRTs7bURBQW9CO0lBQ25CO1FBQVIsS0FBSyxFQUFFOztrREFBbUM7SUFDbEM7UUFBUixLQUFLLEVBQUU7OytEQUEwQztJQUN4QztRQUFULE1BQU0sRUFBRTs7MERBQTJDO0lBQzFDO1FBQVQsTUFBTSxFQUFFOztxREFBb0M7SUFDdEI7UUFBdEIsU0FBUyxDQUFDLFVBQVUsQ0FBQzswQ0FBb0IsVUFBVTtxREFBQztJQVgxQyxlQUFlO1FBM0MzQixTQUFTLENBQUM7WUFDVCxRQUFRLEVBQUUsY0FBYztZQUN4QixRQUFRLEVBQUUsdW9DQXNDVDtZQUNELG1CQUFtQixFQUFFLEtBQUs7U0FDM0IsQ0FBQztpREFrQmlDLFdBQVc7T0FqQmpDLGVBQWUsQ0E0RDNCO0lBQUQsc0JBQUM7Q0FBQSxBQTVERCxJQTREQztTQTVEWSxlQUFlIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgQWZ0ZXJWaWV3SW5pdCxcbiAgQ29tcG9uZW50LFxuICBFbGVtZW50UmVmLFxuICBFdmVudEVtaXR0ZXIsXG4gIElucHV0LFxuICBPbkluaXQsXG4gIE91dHB1dCxcbiAgVmlld0NoaWxkLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHsgRW1vamlTZWFyY2ggfSBmcm9tICcuL2Vtb2ppLXNlYXJjaC5zZXJ2aWNlJztcblxubGV0IGlkID0gMDtcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnZW1vamktc2VhcmNoJyxcbiAgdGVtcGxhdGU6IGBcbiAgICA8ZGl2IGNsYXNzPVwiZW1vamktbWFydC1zZWFyY2hcIj5cbiAgICAgIDxpbnB1dFxuICAgICAgICBbaWRdPVwiaW5wdXRJZFwiXG4gICAgICAgICNpbnB1dFJlZlxuICAgICAgICB0eXBlPVwic2VhcmNoXCJcbiAgICAgICAgKGtleXVwLmVudGVyKT1cImhhbmRsZUVudGVyS2V5KCRldmVudClcIlxuICAgICAgICBbcGxhY2Vob2xkZXJdPVwiaTE4bi5zZWFyY2hcIlxuICAgICAgICBbYXV0b2ZvY3VzXT1cImF1dG9Gb2N1c1wiXG4gICAgICAgIFsobmdNb2RlbCldPVwicXVlcnlcIlxuICAgICAgICAobmdNb2RlbENoYW5nZSk9XCJoYW5kbGVDaGFuZ2UoKVwiXG4gICAgICAvPlxuICAgICAgPCEtLVxuICAgICAgVXNlIGEgPGxhYmVsPiBpbiBhZGRpdGlvbiB0byB0aGUgcGxhY2Vob2xkZXIgZm9yIGFjY2Vzc2liaWxpdHksIGJ1dCBwbGFjZSBpdCBvZmYtc2NyZWVuXG4gICAgICBodHRwOi8vd3d3Lm1heGFiaWxpdHkuY28uaW4vMjAxNi8wMS9wbGFjZWhvbGRlci1hdHRyaWJ1dGUtYW5kLXdoeS1pdC1pcy1ub3QtYWNjZXNzaWJsZS9cbiAgICAgIC0tPlxuICAgICAgPGxhYmVsIGNsYXNzPVwiZW1vamktbWFydC1zci1vbmx5XCIgW2h0bWxGb3JdPVwiaW5wdXRJZFwiPlxuICAgICAgICB7eyBpMThuLnNlYXJjaCB9fVxuICAgICAgPC9sYWJlbD5cbiAgICAgIDxidXR0b25cbiAgICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICAgIGNsYXNzPVwiZW1vamktbWFydC1zZWFyY2gtaWNvblwiXG4gICAgICAgIChjbGljayk9XCJjbGVhcigpXCJcbiAgICAgICAgKGtleXVwLmVudGVyKT1cImNsZWFyKClcIlxuICAgICAgICBbZGlzYWJsZWRdPVwiIWlzU2VhcmNoaW5nXCJcbiAgICAgICAgW2F0dHIuYXJpYS1sYWJlbF09XCJpMThuLmNsZWFyXCJcbiAgICAgID5cbiAgICAgICAgPHN2Z1xuICAgICAgICAgIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIlxuICAgICAgICAgIHZpZXdCb3g9XCIwIDAgMjAgMjBcIlxuICAgICAgICAgIHdpZHRoPVwiMTNcIlxuICAgICAgICAgIGhlaWdodD1cIjEzXCJcbiAgICAgICAgICBvcGFjaXR5PVwiMC41XCJcbiAgICAgICAgPlxuICAgICAgICAgIDxwYXRoIFthdHRyLmRdPVwiaWNvblwiIC8+XG4gICAgICAgIDwvc3ZnPlxuICAgICAgPC9idXR0b24+XG4gICAgPC9kaXY+XG4gIGAsXG4gIHByZXNlcnZlV2hpdGVzcGFjZXM6IGZhbHNlLFxufSlcbmV4cG9ydCBjbGFzcyBTZWFyY2hDb21wb25lbnQgaW1wbGVtZW50cyBBZnRlclZpZXdJbml0LCBPbkluaXQge1xuICBASW5wdXQoKSBtYXhSZXN1bHRzID0gNzU7XG4gIEBJbnB1dCgpIGF1dG9Gb2N1cyA9IGZhbHNlO1xuICBASW5wdXQoKSBpMThuOiBhbnk7XG4gIEBJbnB1dCgpIGluY2x1ZGU6IHN0cmluZ1tdID0gW107XG4gIEBJbnB1dCgpIGV4Y2x1ZGU6IHN0cmluZ1tdID0gW107XG4gIEBJbnB1dCgpIGN1c3RvbTogYW55W10gPSBbXTtcbiAgQElucHV0KCkgaWNvbnM/OiB7IFtrZXk6IHN0cmluZ106IHN0cmluZyB9O1xuICBASW5wdXQoKSBlbW9qaXNUb1Nob3dGaWx0ZXI/OiAoeDogYW55KSA9PiBib29sZWFuO1xuICBAT3V0cHV0KCkgc2VhcmNoUmVzdWx0cyA9IG5ldyBFdmVudEVtaXR0ZXI8YW55W10+KCk7XG4gIEBPdXRwdXQoKSBlbnRlcktleSA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuICBAVmlld0NoaWxkKCdpbnB1dFJlZicpIHByaXZhdGUgaW5wdXRSZWYhOiBFbGVtZW50UmVmO1xuICBpc1NlYXJjaGluZyA9IGZhbHNlO1xuICBpY29uPzogc3RyaW5nO1xuICBxdWVyeSA9ICcnO1xuICBpbnB1dElkID0gYGVtb2ppLW1hcnQtc2VhcmNoLSR7KytpZH1gO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgZW1vamlTZWFyY2g6IEVtb2ppU2VhcmNoKSB7fVxuXG4gIG5nT25Jbml0KCkge1xuICAgIHRoaXMuaWNvbiA9IHRoaXMuaWNvbnMuc2VhcmNoO1xuICB9XG4gIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcbiAgICBpZiAodGhpcy5hdXRvRm9jdXMpIHtcbiAgICAgIHRoaXMuaW5wdXRSZWYubmF0aXZlRWxlbWVudC5mb2N1cygpO1xuICAgIH1cbiAgfVxuICBjbGVhcigpIHtcbiAgICB0aGlzLnF1ZXJ5ID0gJyc7XG4gICAgdGhpcy5oYW5kbGVTZWFyY2goJycpO1xuICAgIHRoaXMuaW5wdXRSZWYubmF0aXZlRWxlbWVudC5mb2N1cygpO1xuICB9XG4gIGhhbmRsZUVudGVyS2V5KCRldmVudDogRXZlbnQpIHtcbiAgICBpZiAoIXRoaXMucXVlcnkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy5lbnRlcktleS5lbWl0KCRldmVudCk7XG4gICAgJGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gIH1cbiAgaGFuZGxlU2VhcmNoKHZhbHVlOiBzdHJpbmcpIHtcbiAgICBpZiAodmFsdWUgPT09ICcnKSB7XG4gICAgICB0aGlzLmljb24gPSB0aGlzLmljb25zLnNlYXJjaDtcbiAgICAgIHRoaXMuaXNTZWFyY2hpbmcgPSBmYWxzZTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5pY29uID0gdGhpcy5pY29ucy5kZWxldGU7XG4gICAgICB0aGlzLmlzU2VhcmNoaW5nID0gdHJ1ZTtcbiAgICB9XG4gICAgY29uc3QgZW1vamlzID0gdGhpcy5lbW9qaVNlYXJjaC5zZWFyY2goXG4gICAgICB0aGlzLnF1ZXJ5LFxuICAgICAgdGhpcy5lbW9qaXNUb1Nob3dGaWx0ZXIsXG4gICAgICB0aGlzLm1heFJlc3VsdHMsXG4gICAgICB0aGlzLmluY2x1ZGUsXG4gICAgICB0aGlzLmV4Y2x1ZGUsXG4gICAgICB0aGlzLmN1c3RvbSxcbiAgICApO1xuICAgIHRoaXMuc2VhcmNoUmVzdWx0cy5lbWl0KGVtb2ppcyk7XG4gIH1cbiAgaGFuZGxlQ2hhbmdlKCkge1xuICAgIHRoaXMuaGFuZGxlU2VhcmNoKHRoaXMucXVlcnkpO1xuICB9XG59XG4iXX0=