import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoginPromptRoutingModule } from './login-prompt-routing.module';
import { LoginPromptComponent } from './login-prompt.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatCardModule} from '@angular/material/card';
import { MatFormFieldModule, MatInputModule } from '@angular/material';

@NgModule({
  declarations: [LoginPromptComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    LoginPromptRoutingModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule
  ]
})
export class LoginPromptModule { }
