import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { InputComponent } from './input/input.component';
import { TextareaComponent } from './textarea/textarea.component';
import { SelectComponent } from './select/select.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule
    ],
    declarations: [
        InputComponent,
        TextareaComponent,
        SelectComponent
    ],
    entryComponents: [
        InputComponent,
        TextareaComponent,
        SelectComponent
    ],
    exports: [
        InputComponent,
        TextareaComponent,
        SelectComponent
    ]
})
export class FormElementsModule { }


