import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppService } from 'src/app/app.service';
import { Cookie } from 'ng2-cookies';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  router:Router;
  app: any;

  constructor(private routers:Router, private appService: AppService) { 
    this.router = routers;
    this.app = appService;
  }

  ngOnInit() {
    if(Cookie.check('access_token')){
      var token = JSON.parse(Cookie.get('access_token'));
      this.app.userName = token.username;
    }
    else{
      this.app.userName = "";
    }
  }

  logout(){
    this.appService.logout();
    this.app.userName = "";
  }

}
