import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable, of } from 'rxjs'
import { catchError } from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class RoomService {

  base_url: string = 'http://localhost:4444/api'

  constructor(private http: HttpClient) { }

  add(room) {
    let post_data = {
      name: room.name,
      building: room.building,
      city: room.city,
      lat: room.lat,
      lng: room.lng,
      type: room.type
    }
    console.log(post_data, 'post_data')
    return this.http.post(`${this.base_url}/room`, post_data)
  }


  delete(id) {
    return this.http.delete(`${this.base_url}/room/${id}`, {})
  }


  all() {
    return this.http.get(`${this.base_url}/room`, {})
  }

  details(id) {
    return this.http.get(`${this.base_url}/room/${id}`, {})
  }
  book(booking) {
    // set data here
    // user_id, room_id, from_time, to_time
    return this.http.get(`${this.base_url}/room/${booking.room_id}/book`, {})
  }



}
