'use strict';

import {
  BounceString
} from './bouncestring.js';

import {
  Ball
} from './ball.js';

class App {
  constructor() {
    this.canvas = document.createElement('canvas');
    document.body.appendChild(this.canvas);
    this.ctx = this.canvas.getContext('2d');

    this.pixelRatio = window.devicePixelRatio > 1 ? 2 : 1;

    this.strings = []; // 생성한 string들을 담아놓으려고 만든 빈 배열같음.
    this.moveX = -5000;
    this.moveY = -5000; // 초기에 생성되는 pointing dot(핑크색)의 좌표값. 화면 바깥에 존재하겠지?
    this.isDown = false; // pointer가 눌러진 상태인지 구별해주는 boolean값 할당.

    window.addEventListener('resize', this.resize.bind(this), false);
    this.resize();

    // 브라우저가 로드되자마자 생성자에서 Ball 인스턴스를 생성해 줌. 
    this.ball = new Ball(this.stageWidth, this.stageHeight, 70, 6);

    // pointer 누르기, 움직이기, 떼기의 3단계로 click event를 분할해서 document에 이벤트를 걸어놓음.
    document.addEventListener('pointerdown', this.onDown.bind(this), false);
    document.addEventListener('pointermove', this.onMove.bind(this), false);
    document.addEventListener('pointerup', this.onUp.bind(this), false);

    window.requestAnimationFrame(this.animate.bind(this));
  }

  resize() {
    this.stageWidth = document.body.clientWidth;
    this.stageHeight = document.body.clientHeight;

    this.canvas.width = this.stageWidth * this.pixelRatio;
    this.canvas.height = this.stageHeight * this.pixelRatio;
    this.ctx.scale(this.pixelRatio, this.pixelRatio);

    // 이제 for loop를 돌려서 BounceString의 인스턴스를 여러 개 생성할거임.
    const xGap = 20; // string 왼쪽 끝점과 브라우저 왼쪽 모서리의 간격 (x방향의 gap이라는 거지) 
    const yGap = 20; // string과 string 사이의 간격 (y방향의 gap이라는 거)
    const x1 = xGap; // 각 빨간선의 왼쪽 끝점의 x좌표로 전달할 거
    const x2 = this.stageWidth - xGap; // 각 빨간선의 오른쪽 끝점의 x좌표로 전달할 거
    const total = Math.floor((this.stageHeight - yGap) / yGap);
    // 마지막 string과 브라우저의 맨밑 모서리와도 간격을 주려고 stageHeight - yGap 한거고,
    // stageHeight - yGap 만큼의 브라우저 height을 yGap과 나눠서 정수값만 받으면 결국 string 개수로 나오겠지?

    this.strings = []; // for loop로 반복 생성한 string을 담아놓을 곳.

    for (let i = 0; i < total; i++) {
      this.strings[i] = new BounceString({
          x1: x1, // 빨간선 왼쪽 끝점의 x좌표 (모든 string이 동일하겠지?)
          y1: i * yGap + yGap, // 빨간선 왼쪽 끝점의 y좌표인데
          // 이거는 원리를 간단하게 생각해 보자. i = 0 일때는 첫번째 string이겠지?
          // 그러면 0 * yGap + yGap은 첫번째 string이 yGap만큼 떨어진 곳에 위치해있으니까 맞지?
          x2: x2, // 빨간선 오른쪽 끝점의 x좌표 (모든 string이 동일하겠지?)
          y2: i * yGap + yGap // 빨간선 오른쪽 끝점의 y좌표. y1과 원리는 동일함.
        }, // 이 객체 안에 담긴 x1, y1, x2, y2를 BounceStirng의 생성자로 넘겨줘서 빨간선의 양끝점 좌표와 가운데점 좌표를 지정해주려는 것.
        '#ff5038' // 이 color값을 BounceStirng의 생성자로 넘겨줘서 string의 색깔로 넣어주기 위한 것.
      )
    }
    /*
    string 1개만 테스트로 만들 때 작성한 코드. comment처리 해놓음.
    this.strings = [
      new BounceString({
          x1: 50,
          y1: this.stageHeight / 2,
          x2: this.stageWidth - 50,
          y2: this.stageHeight / 2
        }, // 이 객체 안에 담긴 x1, y1, x2, y2를 BounceStirng의 생성자로 넘겨줘서 빨간선의 양끝점 좌표와 가운데점 좌표를 지정해주려는 것.
        '#ff5038' // 이 color값을 BounceStirng의 생성자로 넘겨줘서 string의 색깔로 넣어주기 위한 것.
      )
    ];
    */
  }

  animate() {
    window.requestAnimationFrame(this.animate.bind(this)); // 내부에서 반복 호출해주고

    this.ctx.clearRect(0, 0, this.stageWidth, this.stageHeight); // 프레임 시작할 때마다 한번씩 지워주고

    // this.strings.length는 항상 1개일 텐데 왜 if 조건문과 for 조건문을 저렇게 작성했을까?
    // 지금 보니까 bouncing string을 하나만 만들어서 테스트로 보여줄려고 
    // this.strings에서 BounceString을 하나만 생성해준 것 같음.
    if (this.strings.length > 0) {
      for (let i = 0; i < this.strings.length; i++) {
        // 어쨋든 pointer가 클릭 및 움직이는 좌표값에 따라 pointer dot을 canvas에 렌더해주겠지. 
        // this.strings[i].animate(this.ctx, this.moveX, this.moveY);

        // 또는 Ball의 x, y좌표값 움직임에 따라 string이 당겨지도록 할려면 이렇게 this.strings.animate를 호출하면 됨.
        this.strings[i].animate(this.ctx, this.ball.x, this.ball.y);
      }
    }

    this.ball.animate(this.ctx, this.stageWidth, this.stageHeight);
  }

  // 3단계로 나눠진 pointer event의 콜백함수를 통해 this.strings.animate에서 그려줄 pointer dot의 x, y좌표값을
  // pointer가 클릭되거나, 움직인 지점의 좌표값으로 override 해줌.
  onDown(e) {
    this.isDown = true; // pointer가 눌러진 상태일 때에만 isDown에 true 할당.
    this.moveX = e.clientX;
    this.moveY = e.clientY; // this.moveX, Y 값을 pointer를 클릭한 지점의 x, y 좌표값으로 할당.
  }

  onMove(e) {
    if (this.isDown) {
      // pointer가 눌러진 상태로 pointer를 움직였을 때에만 this.moveX, Y값에 pointer가 움직인 지점의 x, y좌표값을 할당
      // 여기서는 this.moveX, Y값이 계속 변하겠지? pointer가 계속 움직일 테니까.
      this.moveX = e.clientX;
      this.moveY = e.clientY;
    }
  }

  onUp(e) {
    this.isDown = false; // pointer를 뗐을 때는 isDown값을 다시 false로 초기화

    this.moveX = -5000;
    this.moveY = -5000; // pointer를 떼면 this.moveX, Y값을 다시 처음으로 초기화함.
  }
}

window.onload = () => {
  new App();
}