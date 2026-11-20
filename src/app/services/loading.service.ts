import { Injectable, signal } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class Loading {
    private _isVisible = signal(false);

    isVisible = this._isVisible.asReadonly();

    show() {
        this._isVisible.set(true);
    }

    hide() {
        this._isVisible.set(false);
    }
}
