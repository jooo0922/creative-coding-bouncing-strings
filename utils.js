'use strict';

// 얘는 딱 봐도 직각삼각형 빗변 길이 공식을 이용해 두 좌표간의 거리값을 구하는 함수인 게 감이 오지?
// 아마 x, y는 직각삼각형 상에서 각각 높이, 밑변에 해당할 것이고,
// (x1, y1)과 (x2, y2) 두 좌표 사이의 거리값이 직각삼각형의 빗변 길이에 해당하겠지?
export function distance(x1, y1, x2, y2) {
  // 물론 distance 함수는 꼭 직각삼각형의 빗변에 해당하지 않더라도
  // 두 지점의 좌표값을 할당해보면 그 사이의 거리값이 구해지는 걸 알 수 있다. 
  // 직각삼각형 빗변 길이 공식의 원리를 응용했다고 해서 꼭 빗변의 길이만 구한다고 생각하지는 말 것!
  const x = x2 - x1;
  const y = y2 - y1;
  return Math.sqrt(x * x + y * y);
}

// BounceString의 animate 메소드에서 이 함수를 호출할 때
// x1, y1에는 빨간선의 왼쪽 끝점 좌표값 
// x2, y2에는 빨간선의 오른쪽 끝점 좌표값
// cx, cy에는 현재 pointer event가 발생한 좌표값(마우스 클릭 or 마우스가 이동한 부분의 좌표값.)
// r에는 BounceString의 생성자에서 지정된 this.detect(= 10)값을 전달함.
export function lineCircle(x1, y1, x2, y2, cx, cy, r) {
  // distance로 빨간선의 양끝점 좌표값 사이의 거리를 구함 = 결국 빨간선이 길이랑 똑같겠지?
  // 그래서 할당하는 const의 이름을 lineLength로 지은 것. 
  const lineLength = distance(x1, y1, x2, y2);

  /**
   * Math.pow([대상 숫자], [거듭제곱 횟수]);
   * 특정 숫자의 거듭제곱 값을 계산해서 return해주는 함수. 거듭제곱 횟수 자리에는 음수, 소수 등도 올 수 있음. 
   * Math.sqrt랑 정반대의 기능을 함. (pow = power(거듭제곱)의 줄임말)
   * 참고로 제곱은 거듭제곱을 '2번만' 하는 것을 의미하고, 거듭제곱은 '2번을 포함해 여러 번' 하는 것을 의미함.
   */
  /**
   * 벡터의 내적을 이용해서 정사영 벡터를 구하고, 그 값으로 px, py좌표값을 얻는 과정임.
   * vector-study-01,02.jpg 노트필기 캡쳐 이미지 및 한빛아카데미 미적분학 책 참고하면서 복습할 것.
   * 
   * 우선 (((cx - x1) * (x2 - x1)) + ((cy - y1) * (y2 - y1)))는
   * 빨간선 벡터와 빨간선의 왼쪽 끝점에서 현재 pointer event가 발생한 좌표값까지의 벡터를 내적한 것.
   * 이거를 빨간선 벡터 길이의 제곱(Math.pow(lineLength, 2))으로 나누면
   * 정사영 벡터를 구할 때 필요한, 빨간선 벡터에 곱하는 상수값이 나옴.
   * const point는 상수값. 
   */
  const point = (((cx - x1) * (x2 - x1)) + ((cy - y1) * (y2 - y1))) / Math.pow(lineLength, 2);

  /**
   * 상수값을 빨간선 벡터로 곱하면 결국 정사영 벡터의 성분값들이 나오는데,
   * 2차원 벡터에서 '성분 = 벡터의 x, y방향 길이'를 뜻하므로,
   * 이 성분값들을 각각 x1, y1과 더하면, 
   * px, py에는 cx, cy에서 수선으로 내렸을 때 빨간선과 교차하는 지점의 x, y좌표값이 들어가게 되는 것.
   */
  const px = x1 + (point * (x2 - x1));
  const py = y1 + (point * (y2 - y1));
  // console.log(px, py, y1);

  // 그래서 포인터 이벤트가 발생한 지점과 수선으로 내렸을 때 빨간선과 교차되는 지점의 거리가
  // 주어진 r값(= this.detect)보다 작다면 true를, 같거나 크다면 false를 return하라는 뜻.
  // 또는 pointerup하거나 기본상태일 때 cx, cy값은 -5000일텐데 이 값을 distance에 넣고
  // 계산해보면 r값(10 or 300)보다 커질 수밖에 없음. 그러니까 이런 경우에도 false를 return하겠지 
  if (distance(px, py, cx, cy) < r) {
    return true;
  } else {
    return false;
  }
}
// 어쨋든 lineCircle 함수는, 현재 프레임에서 string과 pointer event간의 관계를 알려주고 있는 함수임.
// 줄을 당기고 있는건지, 당기다가 this.detect값보다 멀리 당겨버린 건지, pointup 한건지, 초기상태인지 등...