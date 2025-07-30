import { Component } from '@angular/core';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  template: `
    <div class="spinner-container">
      <div class="spinner"></div>
    </div>
  `,
  styles: [`
    .spinner-container {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 1rem;
    }
    
    .spinner {
      width: 40px;
      height: 40px;
      border: 4px solid rgba(58, 109, 242, 0.2);
      border-radius: 50%;
      border-left-color: #3A6DF2;
      animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
      0% {
        transform: rotate(0deg);
      }
      100% {
        transform: rotate(360deg);
      }
    }
  `]
})
export class LoadingSpinnerComponent {}