let capture;
// webカメラのロードフラグ
let videoDataLoaded = false;

let handsfree;

const circleSize = 16;

// 各指のカラーパレット
const thumb = "#f15bb5",
      indexFinger = "#fee440",
      middleFinger = "#00f5d4",
      ringFinger = "#00bbf9",
      pinky = "#9b5de5";

function setup() {
  // webカメラの映像を準備
  capture = createCapture(VIDEO);

  // 映像をロードできたらキャンバスの大きさを設定
  capture.elt.onloadeddata = function () {
    videoDataLoaded = true;
    let canvas = createCanvas(capture.width * 1.5, capture.height * 1.5);
    canvas.parent("canvas");
  };

  // 映像を非表示化
  capture.hide();

  // handsfreeのhandモデルを準備
  handsfree = new Handsfree({
    showDebug: false,
    hands:  true,
    maxNumHands: 2,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5,
  });

  // handsfreeを開始
  handsfree.start();
}

function draw() {
  // 映像を左右反転させて表示
  push();
  translate(width, 0);
  scale(-1, 1);
  image(capture, 0, 0, width, height);
  pop();

  // // 水見式のコップを画面中央下部に配置
  const center = width / 2;
  const top = 250;
  const bottom = 30;
  const topDiameter = 200;
  const bottomDiameter = 124;

  quad(
    center - topDiameter / 2,
    height - top, center + topDiameter / 2,
    height - top, center + bottomDiameter / 2,
    height - bottom, center - bottomDiameter / 2,
    height - bottom
  );
  ellipse(center, height - top , topDiameter, 50);
  ellipse(center, height - bottom , bottomDiameter, 30);

  // ワイングラス
  // arc(width / 2, height - 300, 225, 300, 0, PI, OPEN);
  // ellipse(width / 2, height - 300, 225, 30);
  // ellipse(width / 2, height - 25, 150, 25);
  // rect(width / 2 - 5, height - 150, 10, 125);

  // 手の頂点を表示
  drawHands();

  // 水見式のジェスチャーを認識させる(3秒間くらい？)

  // 6系統からランダムに取得
  // lot();
}

// landmarkにcircleを描画
function drawHands() {
  const hands = handsfree.data?.hands;

  // 手が検出されなければreturn
  if (!hands?.multiHandLandmarks) return;

  // 手の数だけlandmarkの地点にcircleを描写
  hands.multiHandLandmarks.forEach((hand, handIndex) => {
    hand.forEach((landmark, landmarkIndex) => {
      // 指先だけ色を変更
      switch (landmarkIndex) {
        case 4:
          fill(thumb);
          break;
        case 8:
          fill(indexFinger);
          break;
        case 12:
          fill(middleFinger);
          break;
        case 16:
          fill(ringFinger);
          break;
        case 20:
          fill(pinky);
          break;
        default:
          fill(255);
      }

      circle(width - landmark.x * width, landmark.y * height, circleSize);
    });
  });
}

// 6系統の中からランダムで取得
function lot() {
  const categories = [
    "強化系", // Enhancer
    "放出系", // Transmuter
    "操作系", // Conjurer
    "具現化系", // Manipulator
    "変化系", // Emitter
    "特質系", // Specialist
  ];

  const rand = Math.floor(Math.random() * categories.length);
  console.log(categories[rand]);
}
