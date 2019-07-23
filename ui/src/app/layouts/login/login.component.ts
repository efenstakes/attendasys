import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  email
  password

  is_loading: boolean = false 
  error = ''

  constructor(private userService: UserService, private router: Router) { }

  ngOnInit() {
  }

  login() {
    this.userService.log_in({ email: this.email, password: this.password})
        .subscribe((res)=> {
          console.log(res)

          console.log()
          console.log(res['token'])
          console.log(res['user']['user_type'])
          
          if( res['token'] && res['user']['user_type'] == 'REGULAR' ) {
            this.router.navigate([ 'dashboard' ])
            this.userService.set_session(res)
          } else if ( res['token'] && res['user']['user_type'] == 'ADMIN' ) {
            this.router.navigate([ 'admin-dashboard' ])
            this.userService.set_session(res)
          } else {
            this.error = 'Check Your Details And Try Again'
          }


        })
  }// login() { .. }

  

}
