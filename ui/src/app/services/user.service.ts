import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable, of } from 'rxjs'
import { catchError } from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class UserService {
  base_url: string = 'http://localhost:4444/api'

  constructor(private http: HttpClient) { }


  // register a customer
  // name, passcode, email, user_type 
  register(customer) {
    let post_data = {
      password: customer.password,
      password_confirmation: customer.password_confirmation,
      email: customer.email,
      username: customer.name
    }
    console.log({
      password: customer.password,
      password_confirmation: customer.password_confirmation,
      email: customer.email,
      username: customer.name
    })
    return this.http.post(`${this.base_url}/user`, post_data)
  }


  // log a customer in
  log_in(customer) {
    let post_data = {
      email: customer.email,
      password: customer.password
    }
    return this.http.post(`${this.base_url}/user/login`, post_data)
      .pipe(
        catchError((error) => {
          console.log('Error--', error)
          return of({})
        })
      )
  }

  // log a customer out
  log_out() {
    let token: string = localStorage.getItem('auth_token') ? localStorage.getItem('auth_token') : ''
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': token
      })
    }
    localStorage.removeItem('access_token')
    return this.http.post(`${this.base_url}/user/logout`, {}, httpOptions)
  }


  // get a customer details
  details(id) {
    let token: string = localStorage.getItem('auth_token') ? localStorage.getItem('auth_token') : ''
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': token
      })
    }
    return this.http.get(`${this.base_url}/user/${id}`, httpOptions)
  }

  //get current user
  get_current_user() {
    JSON.parse(localStorage.getItem('current_user'))
  }

  //set session
  set_session(customer) {
    localStorage.setItem('access_token', customer['token'])
    localStorage.setItem('current_user', JSON.stringify(customer.user))
  }



  // get all user orders
  orders(id) {
    let token: string = localStorage.getItem('auth_token') ? localStorage.getItem('auth_token') : ''
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': token
      })
    }
    return this.http.get(`${this.base_url}/order/user/${id}`, httpOptions)
  }

  get_token() {
    return localStorage.getItem('access_token')
  }

  getcurrent() {
    
    return JSON.parse(localStorage.getItem('current_user'))
  }

  // update a user details
  update(customer): Observable<any> {
    let token: string = localStorage.getItem('auth_token') ? localStorage.getItem('auth_token') : ''
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': token
      })
    }
    let put_data = {
      email: customer.email,
      phone: customer.phone,
      full_name: customer.full_name,
      password: customer.password,
      password_confirmation: customer.password_confirmation

    }
    return this.http.put(`${this.base_url}/user/${customer.id}`, put_data, httpOptions)
  }




}
