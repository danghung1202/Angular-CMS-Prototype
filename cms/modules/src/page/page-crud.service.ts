import { ContentTypeService, ngEditMode, ngId, Page, PageService, PAGE_TYPE, ContentType } from '@angular-cms/core';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { ContentCrudService, ContentInfo } from '../content/content-crud.service';
import { SubjectService } from '../shared/services/subject.service';

@Injectable()
export class PageCrudService extends ContentCrudService {
    constructor(
        private contentTypeService: ContentTypeService,
        private pageService: PageService,
        private subjectService: SubjectService) {
        super(PAGE_TYPE);
    }

    getContent(contentId: string, versionId: string, language: string, host: string): Observable<ContentInfo> {
        return this.pageService.getContent(contentId, versionId, language, host)
            .pipe(
                // fire page selected event to inform to page tree locate to right node
                tap(contentData => this.subjectService.firePageSelected(contentData)),
                map(contentData => ({
                    contentTypeProperties: this.contentTypeService.getPageTypeProperties(contentData.contentType),
                    previewUrl: this.getPublishedUrlOfContent(contentData),
                    contentData
                }))
            );
    }

    createContent(content: Page): Observable<Page> {
        return this.pageService.createContent(content).pipe(
            tap(createdPage => this.subjectService.firePageCreated(createdPage))
        );
    }

    editContent(content: Page): Observable<Page> {
        return this.pageService.editContent(content);
    }

    publishContent(contentId: string, versionId: string): Observable<Page> {
        return this.pageService.publishContent(contentId, versionId);
    }

    getAllContentTypes(): ContentType[] {
        return this.contentTypeService.getAllPageTypes();
    }

    private getPublishedUrlOfContent(contentData: Page): string {
        return `http://localhost:4200${contentData.linkUrl}?${ngEditMode}=True&${ngId}=${contentData._id}`;
    }
}