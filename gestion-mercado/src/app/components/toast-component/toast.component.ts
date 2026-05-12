
import { Component, inject } from '@angular/core';
import { ToastService } from '../../services/toast.service';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [NgClass],
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.css'],
})
export class ToastComponent {
  toast = inject(ToastService);
}
