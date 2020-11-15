import { Component, ChangeDetectorRef, Inject } from '@angular/core';
import { CmsComponentConfig, ADMIN_WIDGETS } from '@angular-cms/core';

import { BaseLayoutComponent } from '../shared/base-layout.component';
import { WidgetService } from '../services/widget.service';

@Component({
    template: `<cms-layout [rightTabs]="rightTabs" [leftTabs]="leftTabs"></cms-layout>`
})
export class AdminComponent extends BaseLayoutComponent {

    constructor(
        @Inject(ADMIN_WIDGETS) private adminWidgets: CmsComponentConfig[],
        _changeDetectionRef: ChangeDetectorRef,
        widgetService: WidgetService) {
        super(_changeDetectionRef, widgetService);
        this.cmsWidgets = this.getCmsWidgets();
    }

    protected getCmsWidgets(): CmsComponentConfig[] {
        return this.adminWidgets.sort(function (a, b) {
            if (!a.order) a.order = 0;
            if (!b.order) b.order = 0;
            return a.order - b.order
        });
    }
}
