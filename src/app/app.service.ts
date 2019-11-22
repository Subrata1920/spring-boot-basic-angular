import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Constants } from './Constants';
import { Router } from '@angular/router';
import { Cookie } from 'ng2-cookies';

@Injectable()
export class AppService {

  authenticated = false;
  logoutSuccess:boolean = false;
  validationMsg:string;

  constructor(private http: HttpClient, private router: Router) { }

  authenticate(credentials, callback) {

    const headers = new HttpHeaders(credentials ? {
        authorization : 'Basic ' + btoa(credentials.username + ':' + credentials.password),
        "X-Requested-With": 'XMLHttpRequest',
    } : {});

    this.http.get(Constants.HOME_URL + 'user', {headers: headers}).subscribe(response => {
        if (response['username']) {
            this.authenticated = true;
            Cookie.set("credentials", JSON.stringify(credentials))
        } else {
            this.authenticated = false;
        }
        this.saveToken(response);
        return callback && callback();
    },
    error => {
        if(error.status == 401){
            this.validationMsg = error.statusText;
            this.authenticated = false;
            //console.log("Your session has expired. Please login again...");
            return callback && callback();
        }
    });
  }

  checkLoggedIn() : boolean{
    if (!Cookie.check('access_token')){
        return false
    }else{
      return true
    }
  }

  logout() {
      this.deleteCookies();
      this.http.post(Constants.HOME_URL + 'logout',{}).subscribe(response =>{
          this.deleteCookies()
          this.router.navigate(['/']);
          this.logoutSuccess = true;
          setTimeout(()=>{
              this.logoutSuccess = false;
          },2000)           
      }, eror => {
          this.deleteCookies()
      })
  }

  deleteCookies(){
    Cookie.delete('access_token');
    Cookie.delete('credentials');
    Cookie.deleteAll();
  }


  saveToken(token){
      var expireDate = new Date().getTime();
      let date = new Date(expireDate);
  
      Cookie.set("access_token", JSON.stringify(token), 4/24);
      this.router.navigate(['/']);
  }
  getToken(): any{
      return Cookie.get("access_token");
  }

  getCredentials() {
      if(Cookie.get('credentials')){
      const credential = JSON.parse(Cookie.get('credentials'));
      return credential;
      } else {
          return {};
      }
  }
}
