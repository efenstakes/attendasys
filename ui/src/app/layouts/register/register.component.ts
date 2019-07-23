import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  email
  password
  name
  password_confirmation

  is_loading: boolean = false 
  error = ''

  constructor(private userService: UserService, public router: Router) { }

  ngOnInit() {
  }

  register() {
    this.userService.register({ 
                        email: this.email, password: this.password, 
                        password_confirmation: this.password_confirmation,
                        name: this.name 
                  })
        .subscribe((res)=> {
          console.log(res)

          if( res['saved'] ) {
            this.router.navigate([ 'dashboard' ])
            this.userService.set_session(res)
          } else {
            this.error = 'Check Your Details And Try Again'
          }


        })
  }// register() { .. }

  
}
