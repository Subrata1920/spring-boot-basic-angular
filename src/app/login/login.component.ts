import { Component, OnInit } from '@angular/core';
import { AppService } from '../app.service';
import { Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
declare var $: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  credentials: any = {
    username: '',
    password: ''
  }
  app: AppService;

  constructor(private appService:AppService, private router: Router,private frmbuilder:FormBuilder) {
    this.app = appService;
   }

  ngOnInit() {
  }
  
  login(){
    this.app.authenticate(this.credentials, () => {
      if(this.app.authenticated == true){
        this.router.navigateByUrl('/');
      }
      else{
        $(".error-message").fadeIn("slow");
        setTimeout(function(){
          $(".error-message").fadeOut("slow");
        }, 5000)
      }
    });
    return false;
  }
}
