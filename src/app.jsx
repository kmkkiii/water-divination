import "./app.css";
import Sketch from "react-p5";
import { useState } from "preact/hooks";

export const App = () => {
  let capture;

  // webカメラのロードフラグ
  let videoDataLoaded = false;

  let complete = false;

  // 各指のカラーパレット
  const thumb = "#f15bb5",
    indexFinger = "#fee440",
    middleFinger = "#00f5d4",
    ringFinger = "#00bbf9",
    pinky = "#9b5de5";

  let array = new Array(360);

  const setup = async (p5, canvasParentRef) => {
    // webカメラの映像を準備
    capture = p5.createCapture(p5.VIDEO);

    // 映像をロードできたらキャンバスの大きさを設定
    capture.elt.onloadeddata = () => {
      videoDataLoaded = true;
      p5.createCanvas(capture.width, capture.height).parent(canvasParentRef);
    };

    // 映像を非表示化
    capture.hide();

    for (let i = 0; i < array.length; i++) {
      array[i] = p5.floor(p5.randomGaussian(0, 15));
    }

    // ジェスチャー登録
    // 水見式 左手
    handsfree.useGesture({
      name: "leftHand",
      algorithm: "fingerpose",
      models: "hands",
      confidence: "7.5",
      description: [
        ["addCurl", "Thumb", "NoCurl", 1],
        ["addDirection", "Thumb", "DiagonalUpLeft", 1],
        ["addCurl", "Index", "NoCurl", 1],
        ["addDirection", "Index", "HorizontalLeft", 1],
        ["addCurl", "Middle", "NoCurl", 1],
        ["addDirection", "Middle", "HorizontalLeft", 1],
        ["addCurl", "Ring", "NoCurl", 1],
        ["addDirection", "Ring", "HorizontalLeft", 1],
        ["addCurl", "Pinky", "NoCurl", 1],
        ["addDirection", "Pinky", "HorizontalLeft", 1],
      ],
      enabled: true,
    });

    // 水見式 右手
    handsfree.useGesture({
      name: "rightHand",
      algorithm: "fingerpose",
      models: "hands",
      confidence: 7.5,
      description: [
        ["addCurl", "Thumb", "NoCurl", 1],
        ["addDirection", "Thumb", "DiagonalUpRight", 1],
        ["addCurl", "Index", "NoCurl", 1],
        ["addDirection", "Index", "HorizontalRight", 1],
        ["addCurl", "Middle", "NoCurl", 1],
        ["addDirection", "Middle", "HorizontalRight", 1],
        ["addCurl", "Ring", "NoCurl", 1],
        ["addDirection", "Ring", "HorizontalRight", 1],
        ["addCurl", "Pinky", "NoCurl", 1],
        ["addDirection", "Pinky", "HorizontalRight", 1],
      ],
    });

    console.log(handsfree);
  };

  const draw = (p5) => {
    const width = p5.width;
    const height = p5.height;
    // 映像を左右反転させて表示
    p5.push();
    p5.translate(width, 0);
    p5.scale(-1, 1);
    if (capture.loadedmetadata) {
      p5.image(capture, 0, 0, width, height);
    }
    p5.pop();

    // コップ
    drawCup(p5, width, height);
    // 手の頂点を表示
    drawHands(p5);
    // 葉っぱ
    drawLeaf(p5, width, height);

    // 水見式のジェスチャーを認識させる
    const hands = handsfree.data?.hands;
    if (!hands?.multiHandLandmarks || !hands?.gesture) return;
    if (
      complete === false &&
      hands.gesture[0]?.name == "leftHand" &&
      hands.gesture[1]?.name == "rightHand" &&
      hands.multiHandLandmarks[0][21].x < 0.5 &&
      // hands.multiHandLandmarks[0][21].y > 0.5 &&
      hands.multiHandLandmarks[1][21].x > 0.5
      // hands.multiHandLandmarks[1][21].y > 0.5
    ) {
      complete = true;

      // 6系統からランダムに取得
      lot();

      // 系統ごとのエフェクト描画
      switch (resultCategory) {
        case "きょうかけい":
          enhancerEffect(p5);
          break;
        case "へんかけい":
          break;
        case "ほうしゅつけい":
          break;
        case "ぐげんかけい":
          break;
        case "そうさけい":
          break;
        case "とくしつけい":
          break;
      }
    }
  };

  // landmarkにcircleを描画
  const drawHands = (p5) => {
    const hands = handsfree.data?.hands;
    const circleSize = 12;

    // 手が検出されなければreturn
    if (!hands?.multiHandLandmarks) return;
    p5.push();
    p5.noStroke();
    // 手の数だけlandmarkの地点にcircleを描写
    hands.multiHandLandmarks.forEach((hand, handIndex) => {
      hand.forEach((landmark, landmarkIndex) => {
        // 指先だけ色を変更
        switch (landmarkIndex) {
          case 4:
            p5.fill(thumb);
            break;
          case 8:
            p5.fill(indexFinger);
            break;
          case 12:
            p5.fill(middleFinger);
            break;
          case 16:
            p5.fill(ringFinger);
            break;
          case 20:
            p5.fill(pinky);
            break;
          default:
            p5.fill(255);
        }

        p5.circle(
          p5.width - landmark.x * p5.width,
          landmark.y * p5.height,
          circleSize
        );
      });
    });
    p5.pop();
  };

  let f = 1;
  let n = 1;

  // 水見式のコップ
  const drawCup = (p5, width, height) => {
    const center = width / 2;
    const top = 250;
    const bottom = 30;
    const topDiameter = 200;
    const bottomDiameter = 124;

    p5.fill(255);
    p5.quad(
      center - topDiameter / 2,
      height - top,
      center + topDiameter / 2,
      height - top,
      center + bottomDiameter / 2,
      height - bottom,
      center - bottomDiameter / 2,
      height - bottom
    );
    // p5.ellipse(center, height - top, topDiameter, 50);

    p5.ellipse(center, height - bottom, bottomDiameter, 30);

    p5.push();
    p5.noStroke();
    p5.fill("#D0F7FF");
    p5.ellipse(center, height - bottom - 2, bottomDiameter, 28);
    p5.quad(
      center - topDiameter / 2,
      height - top,
      center + topDiameter / 2,
      height - top,
      center + bottomDiameter / 2,
      height - bottom - 2,
      center - bottomDiameter / 2,
      height - bottom - 2
    );
    p5.stroke(0);
    p5.strokeWeight(0.75);
    p5.ellipse(center, height - top, topDiameter, 50);

    f += 1;
    n += 1;
    p5.noFill();
    p5.stroke("#ffffff");
    for (n = f % 200; n < topDiameter; n += 200) {
      p5.ellipse(center, height - top, n, 30);
    }
    p5.pop();
  };

  // ワイングラス
  const drawWineGlass = (p5, width, height) => {
    p5.arc(width / 2, height - 300, 225, 300, 0, p5.PI, p5.OPEN);
    p5.ellipse(width / 2, height - 300, 225, 30);
    p5.ellipse(width / 2, height - 25, 150, 25);
    p5.rect(width / 2 - 5, height - 150, 10, 125);
  };

  // 葉っぱ
  const drawLeaf = (p5, width, height) => {
    const n = 4;
    const size = 100;
    const ox = width / 2 - 25;
    const oy = height / 2 - 50;
    let xmax;
    let ymax;
    const veins = 0.9; //葉脈の長さ
    const petiole = -0.25; //葉柄の長さ

    p5.stroke(0);
    p5.translate(ox, oy);
    p5.beginShape();
    for (let t = 0; t < 360 / n; t++) {
      const bulge = 1.2; //葉の膨らみ
      const A = (n / p5.PI) * p5.radians(t);

      const md = p5.floor(A) % 2;

      const r = p5.pow(-1, md) * (A - p5.floor(A)) + md;

      const R = r;

      const x = size * R * p5.cos(bulge * p5.radians(t));
      const y = size * R * p5.sin(p5.radians(t));

      if (t == 45) {
        xmax = x;
        ymax = y;
      }
      p5.fill("#42C668");
      p5.vertex(x, y);
    }

    p5.endShape(p5.CLOSE);

    p5.stroke(0); // 線の色
    p5.strokeWeight(0.5); // 線の太さ
    p5.line(0, 0, xmax * veins, ymax * veins);

    p5.stroke(0); // 線の色
    p5.strokeWeight(2); // 線の太さ
    p5.line(0, 0, xmax * petiole, ymax * petiole);
  };

  /**
   * 6系統のエフェクト
   */
  // 強化系
  const enhancerEffect = (p5) => {
    p5.push();
    p5.translate(p5.width / 2 - 25, p5.height / 2 - 50);

    for (let i = 0; i < array.length; i++) {
      p5.rotate(p5.TWO_PI / array.length);
      p5.stroke("#FF9900");
      let dist = p5.abs(array[i]) * p5.random(0, 5);
      p5.line(0, 0, dist, 0);
    }

    p5.pop();
  };

  // 6系統の中からランダムで取得
  let resultCategory = "";
  const lot = () => {
    const categories = [
      "きょうかけい", // Enhancer
      // "ほうしゅつけい", // Transmuter
      // "そうさけい", // Conjurer
      // "ぐげんかけい", // Manipulator
      // "へんかけい", // Emitter
    ];

    const rand = Math.floor(Math.random() * 100);

    // 特質系が出る確率は10%
    if (rand < 10) {
      resultCategory = "とくしつけい"; // Specialist
    } else {
      const index = Math.floor(Math.random() * categories.length);
      resultCategory = categories[index];
    }

    document.getElementById(
      "result"
    ).innerText = `あなたのオーラは ${resultCategory} です`;
    document.getElementById("retry").innerText = "もういちど";
  };

  const [mediaIsActive, setMediaIsActive] = useState(false);

  const startWaterDivination = async () => {
    const constrains = { audio: false, video: true };

    await navigator.mediaDevices
      .getUserMedia(constrains)
      .then(async (stream) => {
        console.log(stream);
        setMediaIsActive(stream.active);
      })
      .catch((err) => {
        console.log(err);
      });

    handsfree.start();
  };

  const retry = () => {
    complete = false;
    document.getElementById("result").innerText = "";
    document.getElementById("retry").innerText = "はんていちゅう";
  };

  return (
    <>
      {/* <h1 class="title">Web水見式</h1> */}
      <h1 class="title hunter-font">うぇぶみずみしき</h1>
      <div>
        <p class="hunter-font">
          {/* 水をたっぷりと入れて葉っぱを浮かべたコップに手をかざして「練」を数秒間行ってください。 */}
          みずをたっぷりといれてはっぱをうかべたコップにてをかざして「れん」をすうびょうかんおこなってください。
        </p>
        {/* <p>変化に応じて自分のオーラがどの系統に属するかがわかります。</p> */}
        <p class="hunter-font">
          へんかにおうじてじぶんのオーラがどのけいとうにぞくするかがわかります。
        </p>
        <p>
          <button
            className="handsfree-show-when-stopped handsfree-hide-when-loading hunter-font"
            onClick={startWaterDivination}
          >
            {/* 水見式を始める */}
            はじめる
          </button>
          <button className="handsfree-show-when-loading hunter-font">
            じゅんびちゅう
          </button>
          <button
            className="handsfree-show-when-started hutner-font"
            id="retry"
            onClick={retry}
          >
            はんていちゅう
          </button>
        </p>
        <p class="hunter-font" id="result"></p>
        {mediaIsActive ? <Sketch setup={setup} draw={draw} /> : null}
      </div>
    </>
  );
};
