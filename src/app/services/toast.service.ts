import { 
    signal,
    Injectable
 } from '@angular/core';

interface ToastElements {
    icon: string;
    message: string;
    color: string;
    duration: number ;
}

@Injectable({
    providedIn: 'root'
})
export class Toast {
    toast = signal<ToastElements | null>(null);
    
    success(message: string) {
        this.toast.set({
            icon: 'checkmark-circle',
            message,
            color: 'success',
            duration:3000
        });
    }
    alert(message: string) {
        this.toast.set({
            icon: 'alert',
            message,
            color: 'warning',
            duration: 3000
        });
    }
    danger(message: string) {
        this.toast.set({
            icon: 'close-circle',
            message,
            color: 'danger',
            duration: 3000
        });
    }

    dismiss() {
        this.toast.set(null);
    }
}
