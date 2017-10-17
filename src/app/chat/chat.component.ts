import { Component, OnInit, AfterViewChecked, ElementRef, ViewChild } from '@angular/core';
import { ChatService } from '../chat.service';
import { FbModelService } from '../fb-model.service';
import * as io from "socket.io-client";
import { AuthService } from "angular2-social-login";
import {Router} from "@angular/router";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, AfterViewChecked {

  @ViewChild('scrollMe') private myScrollContainer: ElementRef;

  chats: any;
  joinned: boolean = false;
  newUser = { nickname: '', room: 'Agicent' };
  msgData = { room: '', nickname: '', message: '' };
  socket = io('http://localhost:4000');
   public user;
   sub :any;

  authentication:boolean=true;
   
  constructor(private chatService: ChatService,private Auth:AuthService,private router:Router,public fb_model:FbModelService) {}

  ngOnInit() {
    var user = JSON.parse(localStorage.getItem("user"));
    if(user!==null) {
      this.getChatByRoom(user.room);
      this.msgData = { room: user.room, nickname: user.nickname, message: '' }
      this.joinned = true;
      this.scrollToBottom();
    }
    this.socket.on('new-message', function (data) {
      if(data.message.room === JSON.parse(localStorage.getItem("user")).room) {
        this.chats.push(data.message);
        this.msgData = { room: user.room, nickname: user.nickname, message: '' }
        this.scrollToBottom();
      }
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

  joinRoom() {
    this.authentication=true;
    var date = new Date();
    localStorage.setItem("user", JSON.stringify(this.newUser));
    this.getChatByRoom(this.newUser.room);
    this.msgData = { room: this.newUser.room, nickname: this.newUser.nickname, message: '' };
    this.joinned = true;
    this.socket.emit('save-message', { room: this.newUser.room, nickname: this.newUser.nickname, message: 'Join this room', updated_at: date });
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
    this.socket.emit('save-message', { room: this.newUser.room, nickname: this.user.name, message: 'Join this room', updated_at: date });
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
    var date = new Date();
    var user = JSON.parse(localStorage.getItem("user"));
    this.socket.emit('save-message', { room: user.room, nickname: user.nickname, message: 'Left this room', updated_at: date });
    localStorage.removeItem("user");
    this.joinned = false;
   
  }

  fblogin(provider){
    this.sub = this.Auth.login(provider).subscribe(
      (data) => {
        console.log(data);
        this.user=data;
        console.log(this.user);
        this.fb_model.model=this.user;
      this.router.navigate(['fb-login']);
     return this.user;}
   )
}

 /* fblogin1(){
     console.log('fb;login');
     this.router.navigate(['fb-login']);
  }*/

}