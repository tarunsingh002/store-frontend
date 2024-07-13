import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {OrderItem} from 'src/app/services/auth-services/user.service';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrl: './order-details.component.css',
})
export class OrderDetailsComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      timestamp: string;
      deliveredTimestamp: string;
      orderDeliveryStatus: boolean;
      orderId: number;
      orderItem: OrderItem;
    }
  ) {}
  address = '200, Fictional Street, Gurugram 123456';
  name = 'First user';
}
