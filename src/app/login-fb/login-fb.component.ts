import { Component, OnInit, AfterViewChecked, ElementRef, ViewChild,Input } from '@angular/core';
import * as io from "socket.io-client";
import { AuthService } from "angular2-social-login";
import {Router} from "@angular/router";
import { ChatService } from '../chat.service';
import { ChatComponent } from '../chat/chat.component';
import { FbModelService } from '../fb-model.service';

@Component({
  selector: 'app-login-fb',
  templateUrl: './login-fb.component.html',
  styleUrls: ['./login-fb.component.css']
})
export class LoginFbComponent implements OnInit, AfterViewChecked {

 @ViewChild('scrollMe') private myScrollContainer: ElementRef;
  @Input() childMessage:any;

  chats: any;
  joinned: boolean = true;
  newUser = { nickname: '', room: 'Agicent' };
  msgData = { room: '', nickname: '', message: '' };
  socket = io('http://localhost:4000');
   public user;
   sub :any;

   fb_info:any;

  authentication:boolean=true;
  constructor(private chatService: ChatService,private Auth:AuthService,private router:Router,public fb_model:FbModelService) { }
  ngOnInit() {
    this.fb_info=this.fb_model.model;
    console.log(this.fb_info);

     var date = new Date();
    localStorage.setItem("user", JSON.stringify(this.newUser));
    this.getChatByRoom(this.newUser.room);
    this.msgData = { room: this.newUser.room, nickname: this.fb_info.name, message: '' };
    this.joinned = true;
    this.socket.emit('save-message', { room: this.newUser.room, nickname: this.fb_info.name, message: 'Join this room', updated_at: date });
     console.log('joinroom2');

    var user = JSON.parse(localStorage.getItem("user"));
    if(user!==null) {
      this.getChatByRoom(user.room);
      this.msgData = { room: user.room, nickname: user.nickname, message: '' }
      this.joinned = true;
      this.scrollToBottom();
    }
    this.socket.on('new-message', function (data) {
    
        this.chats.push(data.message);
        this.msgData = { room: user.room, nickname: user.nickname, message: '' }
        this.scrollToBottom();
      
    }.bind(this));
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }
  
 
scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch(err) { }
  }
  getChatByRoom(room) {
    this.chatService.getChatByRoom(room).then((res) => {
      this.chats = res;
    }, (err) => {
      console.log(err);
    });
  }

  joinRoom2(provider) {
    
     this.authentication=false;
  /* var x = document.getElementById("mySelect");
    var option = document.createElement("option");
    option.text =this.newUser.room;
    x.add('option');
    console.log(option.text);*/
    this.sub = this.Auth.login(provider).subscribe(
      (data) => {
        console.log(data);
        this.user=data;}
    )
    var date = new Date();
    localStorage.setItem("user", JSON.stringify(this.newUser));
    this.getChatByRoom(this.newUser.room);
    this.msgData = { room: this.newUser.room, nickname: this.newUser.nickname, message: '' };
    this.joinned = true;
    this.socket.emit('save-message', { room: this.newUser.room, nickname: this.fb_info.name, message: 'Join this room', updated_at: date });
     console.log('joinroom2');
  }

  sendMessage() {
    this.chatService.saveChat(this.msgData).then((result) => {
      this.socket.emit('save-message', result);
         

    }, (err) => {
      console.log(err);
    });
     document.clear();
  }

  logout() {
    //console.log(this.chatcomponent.user)
    var date = new Date();
    var user = JSON.parse(localStorage.getItem("user"));
    this.socket.emit('save-message', { room: user.room, nickname: user.name, message: 'Left this room', updated_at: date });
    localStorage.removeItem("user");
    this.joinned = false;
    this.Auth.logout().subscribe (
      (data)=>{console.log(data);
               this.user=null;
              }
                                 )
            this.router.navigate(['chats']);
  }
            fblogin(provider){
    this.sub = this.Auth.login(provider).subscribe(
      (data) => {
        console.log(data);
        this.user=data;
      this.router.navigate(['fb-login']);
     return this.user;}
   )
}

  
}
