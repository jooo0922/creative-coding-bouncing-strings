'use strict';

import {
  lineCircle
} from './utils.js'

const BOUNCE = 0.92; // 얘는 어디다 쓰려는 값일까?

export class BounceString {
  constructor(pos, color) {
    const middleX = ((pos.x2 - pos.x1) / 2) + pos.x1;
    // (pos.x2 - pos.x1) / 2는 계산해보면 정확히 빨간선의 절반 길이가 될 것이고
    // pos.x1은 해당 길이를 <브라우저 왼쪽 끝과 빨간선 왼쪽 끝점 사이의 간격만큼> 브라우저 왼쪽 끝에서 띄워주겠지.
    // 한마디로 빨간선의 정 가운데 위치한 점의 x좌표라고 봐도 됨. 
    const middleY = ((pos.y2 - pos.y1) / 2) + pos.y1;
    // (pos.y2 - pos.y1) / 2는 계산해보면 0이고, pos.y1는 빨간선의 양끝점 y좌표값과 같을테니,
    // 빨간선의 정 가운데 위치한 점의 y좌표라고 보면 되겠지.
    // 결과적으로 middleX, Y는 빨간선의 가운데점 좌표값이라고 보면 됨.

    this.points = [{
        x: pos.x1,
        y: pos.y1,
        ox: pos.x1,
        oy: pos.y1,
        vx: 0,
        vy: 0,
      },
      {
        x: middleX,
        y: middleY,
        ox: middleX,
        oy: middleY,
        vx: 0,
        vy: 0,
      },
      {
        x: pos.x2,
        y: pos.y2,
        ox: pos.x2,
        oy: pos.y2,
        vx: 0,
        vy: 0,
      },
    ];
    /**
     * 여기서 기억해야 할 부분
     * 
     * app.js에서 pos객체로 넘겨받은 값들을 this.points 배열안의 객체들에 할당해주고, 
     * middleX,Y에서 계산해준 결과값에 따르면,
     * 
     * 빨간선의 왼쪽 끝점 좌표값: (this.points[0].x, this.points[0].y)
     * 빨간선의 오른쪽 끝점 좌표값: (this.point[2].x, this.points[2].y)
     * 빨간선의 가운데 점 좌표값: (middleX, middleY)
     */

    this.detect = 10;

    this.color = color;
  }

  animate(ctx, moveX, moveY) {
    // app.js에서 pointer 이벤트를 받았을 때의 좌표값들을 가져와서 프레임마다 핑크색 pointer dot을 그려줌.
    ctx.beginPath();
    ctx.fillStyle = '#ff00ff'
    ctx.arc(moveX, moveY, 20, 0, Math.PI * 2, false);
    ctx.fill();

    // 여기서부터 bounce string을 그려줌
    ctx.beginPath();
    ctx.strokeStyle = this.color; // app.js에서 BounceString 인스턴스를 생성할 때 넘겨받은 컬러값으로 string 색깔 지정
    ctx.lineWidth = 4; // string의 두께 지정

    // lineCircle의 parameter에 빨간색의 양끝점의 좌표값, 현재 pointer event가 발생한 좌표값, 
    // detect값을 넣고 호출해서 return받은 값이 true면 if block을 수행하고 아니면 else block을 수행함.
    if (lineCircle(
        this.points[0].x,
        this.points[0].y,
        this.points[2].x,
        this.points[2].y,
        moveX,
        moveY,
        this.detect,
      )) {
      // (moveX, moveY) 지점과 해당 지점에서 수선을 내려 빨간선과 교차하는 지점(px, py)의 거리가
      // this.detect보다 가까우면 if block을 수행함.
      // 이거는 어떤 경우일까? 해당 거리가 300이 되기 전까지 = string을 잡아당길 때 수행하라는 것.
      this.detect = 300; // 다음 프레임의 lineCircle()에 들어가는 this.detect값을 300으로 올려놓고
      let tx = (this.points[1].ox + moveX) / 2; // 빨간선 가운데점의 초기 x좌표와 pointer event의 x좌표의 정가운데 x좌표값을 tx에 할당하고
      // 참고로 여기서 this.points[1].ox 는 this.points[1].vx, x와는 또 다름. 얘는 값이 초기의 middleX값 그대로 감.
      // 여기서 2를 나눠주기 때문에 this.points[1].x, y가 moveX 좌표보다 약간 물러선 상태로 따라가게 되는 것.
      let ty = moveY; // pointer event의 y좌표값을 ty에 할당하고
      this.points[1].vx = tx - this.points[1].x;
      this.points[1].vy = ty - this.points[1].y;
      // tx, ty와 매 프레임마다 변화하는 빨간색 가운데점 사이의 거리만큼 vx, vy에 할당.
      // console.log(`moveX: ${moveX}, tx: ${tx}, moveY: ${moveY}, ty: ${ty}`);
    } else {
      // (moveX, moveY) 지점과 해당 지점에서 수선을 내려 빨간선과 교차하는 지점(px, py)의 거리가
      // this.detect보다 멀거나 같으면 else block을 수행하라는 뜻.
      // 이거는 어떤 경우? 
      // 1. (moveX, moveY) 지점과 해당 지점에서 수선을 내려 빨간선과 교차하는 지점(px, py)의 거리가
      // pointermove에 의해 점점 늘어나다가 300보다 커진 경우라면 else로 올것이고
      // 2. 또는 pointerup이나 초기상태에서 moveX, Y가 -5000으로 들어가다보니 distance 유틸리티로 계산했을 때
      // 300이 넘을 수밖에 없는 값이 나오는 경우 else block으로 넘어올거임.
      this.detect = 10; // 다음 프레임에 들어갈 this.detect를 다시 10으로 초기화하고
      let tx = this.points[1].ox;
      let ty = this.points[1].oy; // tx, ty에 빨간선 가운데점의 초기 좌표값 middleX,Y를 각각 할당함.
      // this.points[1].x, y는 this.points[1].ox, oy와 달리 else block에 들어왔을때는 이미
      // 초기의 middleX,Y값과는 달라진 상태이기 때문에 this.points[1].vx, vy에는 각각
      // 마이너스값인 this.points[1].x, y값에 의해 매 프레임마다 점점 감소될 것임. 
      this.points[1].vx += tx - this.points[1].x;
      this.points[1].vx *= BOUNCE;
      this.points[1].vy += ty - this.points[1].y;
      this.points[1].vy *= BOUNCE;
      // BOUNCE는 this.points[1].vx, vy 값, 즉 변화량이 매번 프레임마다 점점 감소하도록 함.
      // 그래서 프레임이 지날수록 vx, vy값이 줄어들면서 this.points[1].x, y 값이 점점 초기의
      // middleX, Y값에 가까워질 수 있도록 함.
      // console.log(`vx: ${this.points[1].vx}, vy: ${this.points[1].vy}`);
    }

    // 빨간선 왼쪽 끝점과 오른쪽 끝점의 좌표값에는 변화를 주지 않고 항상 고정시킴.
    // 매 프레임마다 빨간선의 가운데 점 좌표값: (middleX, middleY)에만 변화를 줘서
    // 그걸 가지고 quadraticCurveTo로 곡선을 만드는 거 같음.
    // if, else block에서 프레임마다 변화를 준 만큼의 vx, vy값만큼 빨간색 가운데점의 좌표를 이동시킴.
    this.points[1].x += this.points[1].vx;
    this.points[1].y += this.points[1].vy;

    // prevX, Y값을 빨간선의 왼쪽 끝점의 x, y좌표값으로 할당함.
    let prevX = this.points[0].x;
    let prevY = this.points[0].y;

    // quadraticCurveTo의 start point를 빨간선 왼쪽 끝점의 x, y좌표값으로 정의한 것.
    ctx.moveTo(prevX, prevY);

    // let i = 1로 할당했고, this.points.length = 3이기 때문에 for loop는 총 2번 돌거임.
    for (let i = 1; i < this.points.length; i++) {
      // cx, cy에는 이전 좌표값(prevX,Y)과 현재 좌표값(this.points[i].x,y) 사이의 가운데 좌표값을 구해서 각각 할당함.
      // 첫번째 for loop의 cx, cy는 빨간선 왼쪽 끝점과 빨간선 가운데점의 정가운데 지점의 x, y좌표값임.
      // 두번째 for loop의 cx, cy는 빨간선 가운데점과 빨간선 오른쪽 끝점의 정가운데 지점의 x, y좌표값임.
      const cx = (prevX + this.points[i].x) / 2;
      const cy = (prevY + this.points[i].y) / 2;

      /**
       * CanvasRenderingContext2D.quadraticCurveTo(controlPointX, controlPointY, endPointX, endPointY)
       * 
       * 이 메소드는 엄밀하게 말하면 2개의 point의 좌표값을 파라미터로 전달해줘야 함.
       * 
       * 첫번째 좌표는 control point, 즉 곡선을 컨트롤할 수 있는 point의 좌표값이 필요하고,
       * 두번째 좌표는 end point, 즉 곡선의 끝점의 좌표값을 넣어줘야 함. 
       * 참고로 start point, 즉 곡선의 시작점의 좌표값은 quadraticCurveTo 이전의 moveTo()에서 정의할 수 있음.
       * 
       * bezierCurveTo() 와의 차이점은 위에서 설명한 control point가 bezierCurveTo() 에서는 2개 들어감
       * control point가 1개가 됬건 2개가 됬건 뭔 차이가 있을까?
       * control point가 1개인 quadratic curve는 곡선의 모양이 pointy(뾰족한) 느낌이 있음.
       * 반면, control point가 2개인 cubic bezier curve는 곡선의 모양이 좀 더 nicely rounded(더 부드럽게 처리된) 느낌이 있음.
       * 또 control point가 2개면 물결 모양 곡선처럼 좀 더 다양한 모양의 곡선을 만들 수 있음.
       * 결과적으로, control point의 개수에 따라 곡선의 curviness(곡률)을 더 세심하게 컨트롤할 수 있다는 뜻.
       * 
       * 여기서는 지금 for loop를 2번 돌면서 quadraticCurveTo를 만들고 있는데, 이 과정을 좀 정리해보자.
       * (bounce-string-quadratic-curve.jpg 참고. 직접 그린거임.)
       * 
       * 1. 첫번째 for loop
       * - for loop 들어가기 직전에 빨간선 왼쪽 끝점을 start point로 시작함.(moveTo())
       * - cx, cy를 빨간선 왼쪽 끝점과 빨간선 가운데점의 정가운데 지점 x, y좌표값으로 지정함.
       * - 빨간선 왼쪽 끝점의 좌표값을 quadraticCurve의 control point로 지정함.
       *   (참고로 첫번째 control point는 빨간선 왼쪽 끝점의 좌표값으로 할당되기 때문에 항상 고정되어 있음.)
       * - 빨간선 왼쪽 끝점과 빨간선 가운데점의 정가운데 지점을 end point로 지정함. 
       * - prevX, Y를 빨간선 가운데점의 x, y좌표값으로 override함.
       * 
       * 2. 두번째 for loop
       * - cx, cy를 빨간선 가운데점과 빨간선 오른쪽 끝점의 정가운데 지점의 x, y좌표값으로 지정함.
       * - 빨간선 가운데점의 좌표값을 control point로 지정함.
       * - 빨간선 가운데점과 빨간선 오른쪽 끝점의 정가운데 지점을 end point로 지정함.
       * - prevX, Y를 빨간선 오른쪽 끝점의 x, y좌표값으로 override함.
       * 
       * 결과적으로 cx, cy는 각각 이전값(prevX, prevY)과 현재값(this.points[i].x, this.points[i].y)의 중간 좌표값이 되는 것.
       * wave.js에서와 같이 이전좌표값과 중간좌표값만 quadraticCurveTo의 parameter로 전달해줘야 곡선이 그려질 수 있는 것.
       * 
       * 어떤 원리로 그려지는 걸까?
       * 빨간선 가운데점 (this.points[1].x, this.points[1].y)은 
       * 처음에는 middleX, Y값이 각각 할당되어 있기 때문에 말 그대로 빨간선의 정가운데에 위치함.
       * 그래서 모든 point들이 빨간선의 일직선상에 위치하게 되서 곡선이 그려지지는 않음.
       * 
       * 그런데 이 점의 좌표값은 위에서 작성된 if ~ else block에 의해 프레임마다 좌표값이 바뀌는 게 보이지?
       * 그럼 결국 2개의 end point(cx, cy)좌표값에도 변화가 생김. 
       * (왜냐면 얘내들도 빨간선 가운데 좌표값에 의해 계산되는 애들이니까.)
       * 
       * 변화한 빨간선 가운데 점 좌표값에 따라 두번째 control point도 따라서 이동할 거고, 
       * 첫번째 end point는 고정된 빨간선 왼쪽 끝점과 변화한 빨간선 가운데 점 사이의 좌표값으로 바뀜.
       * 두번째 end point도 고정된 빨간선 오른쪽 끝점과 변화한 빨간선 가운데 점 사이의 좌표값으로 바뀜.
       * 결국 두 번째 control point와 2개의 end point가 프레임마다 일직선 상에서 벗어나면서 곡선이 만들어짐. 
       * 
       * 따라서 이 곡선은 매 프레임마다 빨간선 가운데점 좌표값을(this.points[1].x, this.points[1].y)
       * 어디로 이동시키느냐에 따라 곡선이 만들어지고, 곡선의 모양이 달라지는 것임. 
       */
      ctx.quadraticCurveTo(prevX, prevY, cx, cy);

      // 이전 좌표값을 현재 좌표값으로 override 해줌.
      prevX = this.points[i].x;
      prevY = this.points[i].y;
    }

    // for loop를 다 돌고 나서 두번째 quadratic curve의 end point(빨간선 가운데점과 빨간선 오른쪽 끝점의 정가운데 지점)를
    // 빨간선 오른쪽 끝점까지 이어줌.
    ctx.lineTo(prevX, prevY);
    ctx.stroke(); // path의 선을 색칠함.
  }
}