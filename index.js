let capture;

// webカメラのロードフラグ
let videoDataLoaded = false;

let handsfree;

const circleSize = 10;

let isActive = false;

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
    let canvas = createCanvas(capture.width * 1.25, capture.height * 1.25);
    canvas.parent("canvas");
  };

  // 映像を非表示化
  capture.hide();

  // handsfreeのhandモデルを準備
  handsfree = new Handsfree({
    showDebug: false,
    hands:  true,
    maxNumHands: 2,
  });

  // ジェスチャー登録
  // 水見式 左手
  handsfree.useGesture({
    "name": "leftHand",
    "algorithm": "fingerpose",
    "models": "hands",
    "confidence": 7.5,
    "description": [
      [
        "addCurl",
        "Thumb",
        "NoCurl",
        1
      ],
      [
        "addDirection",
        "Thumb",
        "DiagonalUpLeft",
        1
      ],
      [
        "addCurl",
        "Index",
        "NoCurl",
        1
      ],
      [
        "addDirection",
        "Index",
        "HorizontalLeft",
        1
      ],
      [
        "addDirection",
        "Index",
        "DiagonalUpLeft",
        0.034482758620689655
      ],
      [
        "addCurl",
        "Middle",
        "NoCurl",
        1
      ],
      [
        "addDirection",
        "Middle",
        "HorizontalLeft",
        1
      ],
      [
        "addCurl",
        "Ring",
        "NoCurl",
        1
      ],
      [
        "addDirection",
        "Ring",
        "HorizontalLeft",
        1
      ],
      [
        "addCurl",
        "Pinky",
        "NoCurl",
        1
      ],
      [
        "addDirection",
        "Pinky",
        "HorizontalLeft",
        1
      ]
    ],
    "enabled": true
  });

  // 水見式 右手
  handsfree.useGesture({
    "name": "rightHand",
    "algorithm": "fingerpose",
    "models": "hands",
    "confidence": 7.5,
    "description": [
      [
        "addCurl",
        "Thumb",
        "NoCurl",
        1
      ],
      [
        "addDirection",
        "Thumb",
        "DiagonalUpRight",
        1
      ],
      [
        "addCurl",
        "Index",
        "NoCurl",
        1
      ],
      [
        "addDirection",
        "Index",
        "HorizontalRight",
        1
      ],
      [
        "addCurl",
        "Middle",
        "NoCurl",
        1
      ],
      [
        "addDirection",
        "Middle",
        "HorizontalRight",
        1
      ],
      [
        "addCurl",
        "Ring",
        "NoCurl",
        1
      ],
      [
        "addDirection",
        "Ring",
        "HorizontalRight",
        1
      ],
      [
        "addCurl",
        "Pinky",
        "NoCurl",
        1
      ],
      [
        "addDirection",
        "Pinky",
        "HorizontalRight",
        1
      ]
    ],
    "enabled": true
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

  // コップ
  drawCup();

  // 葉っぱ
  drawLeaf();

  // 手の頂点を表示
  // drawHands();

  // 水見式のジェスチャーを認識させる
  const hands = handsfree.data?.hands;
  if (!hands?.multiHandLandmarks) return;
  if (
      isActive === false &&
      hands?.gesture[0]?.name == "leftHand" &&
      hands?.gesture[1]?.name == "rightHand" &&
      hands.multiHandLandmarks[0][21].x < 0.5 &&
      hands.multiHandLandmarks[0][21].y > 0.5 &&
      hands.multiHandLandmarks[1][21].x > 0.5 &&
      hands.multiHandLandmarks[1][21].y > 0.5
      ) {
    isActive = true;
    // console.log("水見式を開始");
    // 6系統からランダムに取得
    lot();
  }
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

// 水見式のコップ
function drawCup() {
  const center = width / 2;
  const top = 250;
  const bottom = 30;
  const topDiameter = 200;
  const bottomDiameter = 124;

  fill(255);
  quad(
    center - topDiameter / 2,
    height - top, center + topDiameter / 2,
    height - top, center + bottomDiameter / 2,
    height - bottom, center - bottomDiameter / 2,
    height - bottom
  );
  ellipse(center, height - top , topDiameter, 50);
  ellipse(center, height - bottom , bottomDiameter, 30);
}

// ワイングラス
function drawWineGlass() {
  arc(width / 2, height - 300, 225, 300, 0, PI, OPEN);
  ellipse(width / 2, height - 300, 225, 30);
  ellipse(width / 2, height - 25, 150, 25);
  rect(width / 2 - 5, height - 150, 10, 125);
}

// 葉っぱ
function drawLeaf() {
  const n = 4;
  const size = 100;
  const ox = width / 2 - 25;
  const oy = height / 2;
  let xmax;
  let ymax;
  const veins = 0.9; //葉脈の長さ
  const petiole = -0.25; //葉柄の長さ

  // noStroke();
  stroke(0);
  translate(ox, oy);
  beginShape();
  for (let t = 0; t < 360 / n; t++) {
    const bulge = 1.2; //葉の膨らみ
    A = (n / PI) * radians(t);

    md = floor(A) % 2;

    r = pow(-1, md) * (A - floor(A)) + md;

    R = r;

    x = size * R * cos(bulge * radians(t));
    y = size * R * sin(radians(t));

    if (t == 45) {
      xmax = x;
      ymax = y;
    }
    fill("#42C668",);
    vertex(x, y);
  }

  endShape(CLOSE);

  stroke(0); // 線の色
  strokeWeight(0.5); // 線の太さ
  line(0, 0, xmax * veins, ymax * veins);

  stroke(0); // 線の色
  strokeWeight(2); // 線の太さ
  line(0, 0, xmax * petiole, ymax * petiole);
}

// 6系統の中からランダムで取得
// TODO:確率設定したい
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
  // console.log(categories[rand]);
  document.getElementById("result").innerText = `あなたのオーラは ${categories[rand]} です`;
}
