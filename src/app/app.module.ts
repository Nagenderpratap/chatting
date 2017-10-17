import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {ChatService} from './chat.service';
import {FbModelService} from './fb-model.service';
import { AppComponent } from './app.component';
import { ChatComponent } from './chat/chat.component';


import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { Angular2SocialLoginModule } from "angular2-social-login";
import { LoginFbComponent } from './login-fb/login-fb.component';

const ROUTES = [
  { path: '', redirectTo: 'chats', pathMatch: 'full' },
  { path: 'chats', component: ChatComponent },
  {path:'fb-login',component:LoginFbComponent}
];

let providers = {

    "facebook": {
      "clientId": "117354082353494",
      "apiVersion": "v2.10"
    }
};

@NgModule({
  declarations: [
    AppComponent,
    ChatComponent,
    LoginFbComponent
  ],
  imports: [
    BrowserModule,FormsModule,
    HttpModule,Angular2SocialLoginModule,
    RouterModule.forRoot(ROUTES)
  ],
  providers: [ChatService,FbModelService,  {provide: LocationStrategy, useClass: HashLocationStrategy}],
  bootstrap: [AppComponent]
})
export class AppModule { }
Angular2SocialLoginModule.loadProvidersScripts(providers);
