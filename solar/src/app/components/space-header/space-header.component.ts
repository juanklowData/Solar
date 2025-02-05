import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-space-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-header">
      <div class="stars"></div>
      <div class="twinkling"></div>
      <div class="solar-system">
        <div class="sun"></div>
        <div class="orbit mercury-orbit">
          <div class="planet mercury"></div>
        </div>
        <div class="orbit venus-orbit">
          <div class="planet venus"></div>
        </div>
        <div class="orbit earth-orbit">
          <div class="planet earth"></div>
        </div>
        <div class="orbit mars-orbit">
          <div class="planet mars"></div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .space-header {
      position: relative;
      height: 100vh;
      width: 100%;
      overflow: hidden;
      background: linear-gradient(45deg, #0a0a2e 0%, #1a1a4a 100%);
    }

    .stars {
      position: absolute;
      width: 100%;
      height: 100%;
      background: url('/assets/images/stars.png') repeat;
      animation: rotate 200s linear infinite;
    }

    .twinkling {
      position: absolute;
      width: 100%;
      height: 100%;
      background: url('/assets/images/twinkling.png') repeat;
      animation: twinkle 4s linear infinite;
    }

    .solar-system {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 800px;
      height: 800px;
    }

    .sun {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 100px;
      height: 100px;
      background: radial-gradient(circle at center, #ffd700, #ff4500);
      border-radius: 50%;
      box-shadow: 0 0 50px #ff4500;
      animation: pulse 2s ease-in-out infinite;
    }

    .orbit {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 50%;
    }

    .planet {
      position: absolute;
      border-radius: 50%;
      transform-origin: 50% 50%;
    }

    .mercury-orbit {
      width: 200px;
      height: 200px;
      animation: rotate 8s linear infinite;
    }

    .venus-orbit {
      width: 300px;
      height: 300px;
      animation: rotate 12s linear infinite;
    }

    .earth-orbit {
      width: 400px;
      height: 400px;
      animation: rotate 16s linear infinite;
    }

    .mars-orbit {
      width: 500px;
      height: 500px;
      animation: rotate 20s linear infinite;
    }

    .mercury {
      width: 20px;
      height: 20px;
      background: #b5b5b5;
      left: 90px;
      top: -10px;
    }

    .venus {
      width: 25px;
      height: 25px;
      background: #e8b062;
      left: 137.5px;
      top: -12.5px;
    }

    .earth {
      width: 30px;
      height: 30px;
      background: #4b9fe1;
      left: 185px;
      top: -15px;
    }

    .mars {
      width: 22px;
      height: 22px;
      background: #c1440e;
      left: 239px;
      top: -11px;
    }

    @keyframes pulse {
      0%, 100% { transform: translate(-50%, -50%) scale(1); }
      50% { transform: translate(-50%, -50%) scale(1.1); }
    }
  `]
})
export class SpaceHeaderComponent {}