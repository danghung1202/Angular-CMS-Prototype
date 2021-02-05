import { Injectable, OnDestroy } from '@angular/core';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { debounceTime, distinct, filter, switchMap, takeUntil } from 'rxjs/operators';
import { Page } from './content/models/page.model';
import { PageService } from './content/page.service';

@Injectable({
    providedIn: 'root'
})
export class LinkService implements OnDestroy {

    private pageUrlsSubject: ReplaySubject<Page[]> = new ReplaySubject();
    private pageUrls$: Observable<Page[]> = this.pageUrlsSubject.asObservable();

    private pageIdSubject: Subject<string> = new Subject();
    private destroy$: Subject<any> = new Subject();
    private pageIds: string[] = [];
    private fetchedPageIds: string[] = [];

    constructor(private pageService: PageService) {
        this.pageIdSubject.pipe(
            distinct(),
            filter(pageId => !this.fetchedPageIds.includes(pageId)),
            debounceTime(1000),
            switchMap(() => this.pageService.getPageUrls(this.pageIds.filter(pageId => !this.fetchedPageIds.includes(pageId)))),
            takeUntil(this.destroy$)
        ).subscribe((pages: Page[]) => {
            this.fetchedPageIds = this.fetchedPageIds.concat(pages.map(x => x._id));
            this.pageUrlsSubject.next(pages);
        });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    /**
     * Push the page Id into array to prepare fetch the page urls
     */
    pushToFetchPageUrl(pageId: string): Observable<Page[]> {
        if (!this.pageIds.includes(pageId)) {
            this.pageIds.push(pageId);
            this.pageIdSubject.next(pageId);
        }
        return this.pageUrls$;
    }
}
