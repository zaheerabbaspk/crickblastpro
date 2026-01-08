import { Component, input, output, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonIcon } from '@ionic/angular/standalone';

@Component({
    selector: 'app-input',
    standalone: true,
    imports: [FormsModule, IonIcon],
    template: `
    <div class="flex flex-col gap-2 w-full">
      @if (label()) {
        <label [for]="id()" class="text-sm font-medium text-brand-white/70 px-1">
          {{ label() }}
        </label>
      }
      <div 
        class="relative flex items-center bg-brand-accent border border-brand-white/10 rounded-2xl focus-within:border-brand-red transition-all duration-200"
        [class.h-14]="!isTextArea()"
        [class.min-h-[120px]]="isTextArea()"
      >
        @if (icon()) {
          <div class="pl-4 text-brand-white/40">
            <ion-icon [name]="icon()" class="text-xl"></ion-icon>
          </div>
        }
        
        @if (isTextArea()) {
          <textarea
            [id]="id()"
            [(ngModel)]="value"
            [placeholder]="placeholder()"
            class="flex-1 bg-transparent border-none outline-none px-4 py-3 text-brand-white placeholder:text-brand-white/20 resize-none h-full"
          ></textarea>
        } @else {
          <input
            [id]="id()"
            [type]="type()"
            [(ngModel)]="value"
            [placeholder]="placeholder()"
            class="flex-1 bg-transparent border-none outline-none px-4 text-brand-white placeholder:text-brand-white/20 h-full"
          />
        }
      </div>
    </div>
  `
})
export class InputComponent {
    id = input<string>('input-' + Math.random().toString(36).substring(2, 9));
    label = input<string>('');
    placeholder = input<string>('');
    type = input<string>('text');
    icon = input<string>('');
    isTextArea = input<boolean>(false);

    value = model<any>('');
}
