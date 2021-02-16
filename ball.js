'use strict';

const PI2 = Math.PI * 2; // 360도의 라디안 값. 원 만들겠군.

// bouncing-ball 만들었을 때와 동일함.
export class Ball {
  constructor(stageWidth, stageHeight, radius, speed) {
    this.radius = radius; // Ball의 반지름
    this.vx = speed;
    this.vy = speed; // this.vx, vy는 Ball의 x, y 좌표값의 변화량
    this.x = stageWidth / 2;
    this.y = stageHeight / 2; // 처음에 Ball을 생성해서 캔버스에 그릴때는 브라우저의 가운데에 그리겠다는 뜻.
  }

  animate(ctx, stageWidth, stageHeight) {
    this.x += this.vx;
    this.y += this.vy; // 매 프레임마다 this.vx, vy만큼 ball의 x, y 좌표값을 이동시켜주라는 뜻.

    const minX = this.radius;
    const maxX = stageWidth - this.radius;
    // Ball의 x좌표값의 최대, 최소값. 즉, Ball이 브라우저 양옆에 딱 닿는 순간 this.vx *= -1 로 방향 바꿔주려는 거
    const minY = this.radius;
    const maxY = stageHeight - this.radius;
    // Ball의 y좌표값의 최대, 최소값. 즉, Ball이 브라우저 위아래에 딱 닿는 순간 this.vy * -1 로 방향 바꿔주려는 거

    // x좌표값이 minX보다 작아지려 하거나, maxX보다 커지려 하는 순간 this.vx의 방향을 바꿔주는 거
    if (this.x <= minX || this.x >= maxX) {
      this.vx *= -1;
    }
    // y좌표값도 마찬가지 
    if (this.y <= minY || this.y >= maxY) {
      this.vy *= -1;
    }

    ctx.fillStyle = '#ffdd1c';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, PI2); // false는 생략해도 됨. 기본값이 false(시계 방향)라서...
    ctx.fill();
  }
}