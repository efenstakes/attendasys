import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'
import { RoomService } from '../../services/room.service'

@Component({
  selector: 'app-add-room',
  templateUrl: './add-room.component.html',
  styleUrls: ['./add-room.component.scss']
})
export class AddRoomComponent implements OnInit {

  name
  building
  city
  type = 'OPEN'

  error: String = ''
  success_message: String = ''

  constructor(private router: Router, private roomService: RoomService) { }

  ngOnInit() {
  }

  goBack() {
    this.router.navigate([ 'admin-dashboard' ])
  }



  add() {

    navigator.geolocation.getCurrentPosition((loc)=> {
      console.log(loc);
      
      let lat = loc['coords']['latitude']
      let lng = loc['coords']['longitude']

      // console.log(this.type)
      // return

      this.roomService.add({ 
        name: this.name, building: this.building, city: this.city, type: this.type, lat, lng 
        })
        .subscribe((res)=> {
          console.log(res)

          if( res['saved'] ) {
            this.success_message = 'Room Added'
          } else {
            this.error = 'Check Your Details And Try Again'
          }


        })


    })

  }// add() { .. }

  

}
