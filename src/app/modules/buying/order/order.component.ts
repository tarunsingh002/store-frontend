import {Component, HostListener, OnInit} from '@angular/core';
import {User} from '../../../models/user.model';
import {ActivatedRoute} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';

import {order, OrderItem} from 'src/app/services/auth-services/user.service';
import {OrderDetailsComponent} from '../order-details/order-details.component';
import {Order} from 'src/app/models/order.model';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css'],
})
export class OrderComponent implements OnInit {
  user: User;
  orderTimeStamp = [];
  orderDeliveryTimeStamps = [];
  orderDeliveryStatus = [];
  smallPic = false;
  largePic = true;
  orders: order[];

  constructor(private aroute: ActivatedRoute, private dialogService: MatDialog) {}

  ngOnInit(): void {
    this.user = this.aroute.snapshot.data['res2'].user;
    this.orders = this.aroute.snapshot.data['res2'].res;

    this.orders.forEach((o) => {
      this.orderTimeStamp.push(new Date(o.timestamp).toDateString());
      this.orderDeliveryTimeStamps.push(new Date(o.timestamp + 2 * 86400 * 1000).toDateString());
      this.orderDeliveryStatus.push(
        new Date().getTime() >= o.timestamp + 2 * 86400 * 1000 ? true : false
      );
    });

    if (window.innerWidth < 550) {
      this.smallPic = true;
      this.largePic = false;
    } else {
      this.smallPic = false;
      this.largePic = true;
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    if (window.innerWidth < 550) {
      this.smallPic = true;
      this.largePic = false;
    } else {
      this.smallPic = false;
      this.largePic = true;
    }
  }

  sendOrderDetails(
    timestamp: string,
    deliveredTimestamp: string,
    orderDeliveryStatus: boolean,
    orderId: number,
    orderItem: OrderItem
  ) {
    this.dialogService.open(OrderDetailsComponent, {
      data: {
        timestamp: timestamp,
        deliveredTimestamp: deliveredTimestamp,
        orderDeliveryStatus: orderDeliveryStatus,
        orderId: orderId,
        orderItem: orderItem,
      },
    });
  }
}
