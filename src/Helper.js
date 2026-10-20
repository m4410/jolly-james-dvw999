


//バックアップ　Helper.js




const randomChoice = (array) => {
    const index = Math.floor(Math.random() * array.length);
    return array[index];
};
  
const randomSample = (array, k) => {
    const shuffled = [...array].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, k);
};
  
const randomChoices = (array, k) => {
    const result = [];
    for (let i = 0; i < k; i++) {
      const index = Math.floor(Math.random() * array.length);
      result.push(array[index]);
    }
    return result;
};
  
function weightedChoice(array, weights) {
    const total = weights.reduce((a, b) => a + b, 0);
    const rand = Math.random() * total;
    let acc = 0;
    for (let i = 0; i < array.length; i++) {
      acc += weights[i];
      if (rand < acc) return array[i];
    }
}
  
function weightedChoices(array, weights, k) {
    const results = [];
    for (let i = 0; i < k; i++) {
      results.push(weightedChoice(array, weights));
    }
    return results;
}
  
const arryShuffle = (array) => { //単純な配列のシャッフル(元の配列非破壊。新しい配列返す)
    const clone = [...array];
    for (let i = clone.length - 1; i > 0; i--) {
      // 0 から i の範囲でランダムなインデックスを選ぶ
      const j = Math.floor(Math.random() * (i + 1));
      // 要素を入れ替える（分割代入を使用）
      [clone[i], clone[j]] = [clone[j], clone[i]];
    }
    return clone;
};
  
//配列の中身をシャッフルする関数
const shuffle = arr => [...arr].sort(() => Math.random() -0.5);

//配列のある値以降をシャッフルする関数
function partShuffle(wholeArr,pivot){
    const head = wholeArr.slice(0, pivot);
    const tail = wholeArr.slice(pivot);  
    const result = [...head, ...shuffle(tail)];
    return result; 
}







 //referenceは{A:[{...},{...}], A':[{...},{...}]...}のようなオブジェクトを想定
 function aDash(reference, lastAlpha, dashMaxObj) {
    console.log("\n");
    console.log("↓↓↓↓↓↓↓↓↓【aDash関数】↓↓↓↓↓↓↓↓↓"); 
    //referenceから変更対象(素のアルファベットの中身)を取り出す
    let original;
    for (const key in reference) {
      if (!key.includes("'")) {
        original = structuredClone(reference[key]);
        break;
      }
    } 
    //デバグ用
    const originalForDebug = [];
    for (const i of original) {
      if (i.type === "subs") {
        originalForDebug.push(i.alpha);
      } else {
        originalForDebug.push("r");
      }
    }
    console.log("original要約=", JSON.stringify(originalForDebug)); 
    //インデックスリストを用意しておく
    const originalIndex = Array.from({ length: original.length }, (_, i) => i); //referenceのlengthを用意しておく

    const referenceLength = original[0].length; 
    //console.log('referenceLength=',referenceLength); 
    //既要素の定義
    const exElem = [];
    for (const key in reference) {
      for (const item of reference[key]) {
        if (item.type === "subs" && !exElem.includes(item.alpha)) {
          exElem.push(item.alpha);
        }
      }
    }
    console.log("exElem初期値=", JSON.stringify(exElem)); //既要素の初期値を残しておく。[A,A]→[新,既]→新=B→既=B→[B,B]など防ぐため

    const exElemInit = [...exElem]; 
    //変更数の上限を定義(√n*2の切り捨て) //abcd→bdacのような純粋なシャッフル(既既既既による偶然)の可能性を確保するためのさじ加減。要素5つ以上からは必ず固定要素が生じる
    const changeAmountMax = Math.trunc(Math.sqrt(original.length) * 2); //変更数のためのweights
    const changeAmountWeights = [];
    let x = 1;
    for (let i = 0; i < changeAmountMax; i++) {
      changeAmountWeights.push(x);
      x *= 4 / 5;
    } //変更数決定
    let changeAmount = weightedChoice(
      Array.from({ length: changeAmountMax }, (_, i) => i + 1),
      changeAmountWeights
    );
    const changeAmountCopy = changeAmount; //休符化処理の後で元の変更数を参照したいため
    console.log("changeAmountMax=", changeAmountMax);
    console.log("changeAmountWeights=", JSON.stringify(changeAmountWeights));
    console.log("changeAmount=", changeAmount); //変更対象を選ぶ。originalのインデックスから選択 //自由、後半から、後ろ詰め、要素対応、の4の方法のどれかで選ぶ //後半が最も望ましい気もするが原型次第でもあるのてweightsはなし
    const wayToChoose = randomChoice([0, 1, 2, 3]);
    let targetIndex = [];
    if (wayToChoose === 0) {
      //自由なら
      console.log("wayToChoose=", "自由");
      targetIndex = randomSample(originalIndex, changeAmount);
    } else if (wayToChoose === 1) {
      //後半なら
      console.log("wayToChoose=", "後半");
      if (changeAmount > original.length / 2) {
        targetIndex = originalIndex.slice(-changeAmount);
      } else {
        const targetRange = originalIndex.slice(
          Math.trunc(original.length / 2 + 0.5)
        );
        targetIndex = randomSample(targetRange, changeAmount);
      }
    } else if (wayToChoose === 2) {
      //後詰なら
      console.log("wayToChoose=", "後詰");
      targetIndex = originalIndex.slice(-changeAmount);
    } else {
      //要素対応なら
      console.log("wayToChoose=", "要素対応"); //要素がひとつしかないなら？→おそらく同処理でもいける //要素対応で選んだとして必ずAAA→BBBとなるわけ //ではない。AAA→BCDもありえる。ここでは要 //素対応位置のインデックスを取り出すだけ。そのインデックス群に対し後の導入要素決定手順が要素対応なら再度インデックスからアルファベットを取り出す //{要素:個数,要素:個数...}のオブジェクトを作る。休符も含め(キーは'r'としておく)
      const eachAmount = {};
      for (const i of original) {
        //実部なら
        if (i.type === "subs") {
          if (!i.alpha in eachAmount) {
            eachAmount[i.alpha] = 1;
          } else {
            eachAmount[i.alpha]++;
          }
        } //休符なら(実部でないなら休符しかない)
        else {
          if (!"r" in eachAmount) {
            eachAmount.r = 1;
          } else {
            eachAmount.r++;
          }
        }
      } //変更数以下の要素をリストアップして選ぶ→そのインデックスを取得、の繰り返し //変更数以下の要素がなければ、いずれかの要素からいくつかインデックスを取得(要素関係なく自由選択するパターンもありえるが、それは選択方法<自由>に任せる)
      let n = changeAmount;
      while (true) {
        //個数が変更数以下の要素をリストアップ
        const belowElems = [];
        for (const i in eachAmount) {
          if (eachAmount[i] <= n) {
            belowElems.push(i);
          }
        } //belowElemsがあるなら1つ選びoriginalのそのインデックスを拾う //拾った個数分nから引き、eachAmountからその要素を削除する
        if (belowElems.length > 0) {
          const selected = randomChoice(belowElems); //選ばれたのが休符なら
          if (selected === "r") {
            for (let j = 0; j < original.length; j++) {
              if (original[j].type === "rest") {
                targetIndex.push(j);
              }
            }
          } else {
            //選ばれたのが実部なら
            for (let j = 0; j < original.length; j++) {
              if (original[j].alpha === selected) {
                targetIndex.push(j);
              }
            }
          }
          n -= eachAmount[selected];
          delete eachAmount[selected];
          if (n === 0) {
            break;
          }
        } else {
          //n以下の要素がなければ
          const option = Object.keys(eachAmount);
          const selected = randomChoice(option);
          const indexOption = []; //選ばれたのが休符なら
          if (selected === "r") {
            for (let j = 0; j < original.length; j++) {
              if (original[j].type === "rest") {
                indexOption.push(j);
              }
            }
          } else {
            //選ばれたのがアルファベットなら
            for (let j = 0; j < original.length; j++) {
              if (original[j].alpha === selected) {
                indexOption.push(j);
              }
            }
          }
          const selectedIndex = randomSample(indexOption, n);
          targetIndex.push(...selectedIndex);
          break;
        }
      }
    } //昇順のソートをかけておく
    targetIndex.sort((a, b) => a - b);
    const targetIndexCopy = [...targetIndex]; //後で元の状態を参照するためのコピー
    console.log("targetIndex=", JSON.stringify(targetIndex)); //対象に対して導入要素を決めるための方法を決める(①自由②要素対応の2通り)
    const wayToInsertOption = ["自由", "要素対応"];
    const wayToInsert = randomChoice(wayToInsertOption);
    console.log("wayToInsert=", wayToInsert); 
    //その導入方法で導入していく
    if (wayToInsert === "自由") {
      //導入要素数を決める
      let insertElemAmount = randomChoice(
        Array.from({ length: changeAmount }, (_, i) => i + 1)
      );
      console.log("insertElemAmount=", insertElemAmount); //対象に実部があり導入要素数>1なら1/3で'休'あり
      let targetHaveSubs = false;
      for (const i of targetIndex) {
        if (original[i].type === "subs") {
          targetHaveSubs = true;
        }
      }
      const restFlag =
        targetHaveSubs === true &&
        insertElemAmount > 1 &&
        randomChoice([0, 1, 2]) === 0
          ? true
          : false;
      console.log("targetHaveSubs=", targetHaveSubs);
      console.log("restFlag=", restFlag); 
      //restFlag=trueなら対象の実部それぞれに1/3で休符化を実行 //ひとつも休符化されなかったならそれはそれでok
      if (restFlag === true) {
        for (const i of targetIndex) {
          if (original[i].type === "subs" && randomChoice([0, 1, 2]) === 0) {
            console.log("original[", i, "]を休符化しました"); 
            //'cut'があるなら先に情報を抜き出しておく
            let cutFlag = false;
            let cutNum;
            if (Object.keys(original[i]).includes("cut")) {
              cutFlag = true;
              cutNum = original[i].cut;
            }
            original[i] = { type: "rest", location:original[i].location, increment: original[i].increment, alpha:null, tenkai:false};
            if ((cutFlag = true)) {
              original[i].cut = cutNum;
            }
            targetIndex.splice(targetIndex.indexOf(i), 1);
            changeAmount--;
            if (changeAmount - (insertElemAmount - 1) < 2) {
              break;
            }
          }
        }
        insertElemAmount--; //'休'の分の導入要素数をここで減らしておく
      } 
      //残りの導入要素に対して変更数を振り分ける
      const amountForEachInsert = []; //まずは[1,1,1...]を作る
      for (let i = 0; i < insertElemAmount; i++) {
        amountForEachInsert.push(1);
      } //[1,1,1...]にさらに残った変更数を振り分ける。残りが0なら何も起きない
      for (let i = 0; i < changeAmount - insertElemAmount; i++) {
        const index = randomChoice(
          Array.from({ length: amountForEachInsert.length }, (_, i) => i)
        );
        amountForEachInsert[index]++;
      }
      console.log("amountForEachInsert=", JSON.stringify(amountForEachInsert)); //各導入要素の型を先に決める //(変更数=original.lengthの場合必ず既を含めたいため、後で個別に出力すると判別が冗長になる) //新ダッシュがないのは、既での重複回避としてダッシュ付加する中に新ダッシュの可能性も含めたため
      let typeList = [];
      const typeOption = ["新", "既"]; //先に対象外のoriginal要素に実部があるか調べておく(ないと全て新になった時原型要素がなくなる) //originalすべて対象ならfalseのまま
      let nonTargetHaveSubs = false;
      for (let i = 0; i < original.length; i++) {
        if (targetIndexCopy.includes(i)) {
        } else {
          if (original[i].type === "subs") {
            nonTargetHaveSubs = true;
            break;
          }
        }
      }
      if (nonTargetHaveSubs === true) {
        for (let i = 0; i < insertElemAmount; i++) {
          typeList.push(randomChoice(typeOption));
        }
      } //対象外に実部がない場合
      else {
        while (true) {
          for (let i = 0; i < insertElemAmount; i++) {
            typeList.push(randomChoice(typeOption));
          }
          if (typeList.includes("既")) {
            while (true) {
              const n = randomChoice(
                Array.from({ length: typeList.length }, (_, i) => i)
              );
              if (typeList[n] === "既") {
                typeList[n] = "初期既";
              }
              break;
            }
            break;
          } else {
            typeList = [];
          }
        }
      }
      console.log("nonTargetHaveSubs=", nonTargetHaveSubs);
      console.log("typeList=", JSON.stringify(typeList)); 
      //導入要素ごとにオリジナルを書き換えていく
      for (let i = 0; i < insertElemAmount; i++) {
        console.log("【導入要素", i + 1, "】"); 
        //まずは対象のインデックスの1番手前と、残りからsampleしたものを取り出す
        const target = [];
        target.push(targetIndex[0]);
        targetIndex.splice(0, 1);
        if (amountForEachInsert[i] - 1 > 0) {
          const sampled = randomSample(targetIndex, amountForEachInsert[i] - 1);
          target.push(...sampled);
          for (const j of targetIndex) {
            //取得したインデックスの削除
            if (sampled.includes(j)) {
              targetIndex.splice(targetIndex.indexOf(j), 1);
            }
          }
        }
        console.log("target=", JSON.stringify(target)); 
        
        //型が新なら
        const alphabet = [
          "default",
          "A",
          "B",
          "C",
          "D",
          "E",
          "F",
          "G",
          "H",
          "I",
          "J",
          "K",
          "L",
          "M",
          "N",
          "O",
          "P",
          "Q",
          "R",
          "S",
          "T",
          "U",
          "V",
          "W",
          "X",
          "Y",
          "Z",
        ];
        if (typeList[i] === "新") {
          console.log("導入型=", "新");
          const lastAlphaIndex = alphabet.indexOf(lastAlpha[0]);
          const newAlpha = alphabet[lastAlphaIndex + 1];
          lastAlpha[0] = alphabet[lastAlphaIndex + 1];
          for (const j of target) {
            if (Object.keys(original[j] || {}).includes("cut")) {
              const cutNum = original[j].cut;
              original[j] = {
                type: "subs",
                location: original[j].location,
                increment: original[j].increment,
                alpha: newAlpha,
                cut: cutNum,
              };
            } else {
              original[j] = {
                type: "subs",
                location: original[j].location,
                increment: original[j].increment,
                alpha: newAlpha,
                tenkai: false
              };
            }
          }
          exElem.push(newAlpha);
          console.log("newAlpha=", newAlpha);
        } //型が既なら
        else if (typeList[i] === "既") {
          console.log("導入型=", "既");
          let selectedAlpha = randomChoice(exElem);
          console.log("selectedAlpha=", selectedAlpha);
          for (const j of target) {
            //先に'cut'があるなら情報を抜き出しておく
            let cutFlag = false;
            let cutNum;
            if (Object.keys(original[j] || {}).includes("cut")) {
              cutFlag = true;
              cutNum = original[j].cut;
            } //対象が休符なら
            if (original[j].type === "rest") {
              original[j] = {
                type: "subs",
                location: original[j].location,
                increment: original[j]. increment,
                alpha: selectedAlpha,
                tenkai: false
              };
            } //対象が実部、アルファベット重複なしの場合
            else if (
              original[j].type === "subs" &&
              original[j].alpha !== selectedAlpha
            ) {
              original[j] = {
                type: "subs",
                location: original[j].location,
                increment: original[j].increment,
                alpha: selectedAlpha,
                tenkai: false
              };
            } //対象が実部、アルファベット重複の場合
            else if (
              original[j].type === "subs" &&
              original[j].alpha === selectedAlpha
            ) {
              const dashNum = selectedAlpha.split("'").length - 1; //導入要素が素のアルファの場合
              if (dashNum === 0) {
                console.log("インデックス", j, "はダッシュ付加しました");
                selectedAlpha = selectedAlpha + "'";
                original[j] = {
                  type: "subs",
                  location: original[j].location,
                  increment: original[j].increment,
                  alpha: selectedAlpha,
                  tenkai: false
                };
                if (dashNum === dashMaxObj[selectedAlpha[0]]) {
                  dashMaxObj[selectedAlpha[0]]++;
                  exElem.push(selectedAlpha);
                }
              } //導入要素に1つ以上のダッシュがある場合
              else {
                if (randomChoice([0, 1] === 0)) {
                  console.log("インデックス", j, "はダッシュ付加しました");
                  selectedAlpha = selectedAlpha + "'";
                  if (dashNum === dashMaxObj[selectedAlpha[0]]) {
                    dashMaxObj[selectedAlpha[0]]++;
                    exElem.push(selectedAlpha);
                  }
                } else {
                  console.log("インデックス", j, "はダッシュ1つ除去しました");
                  selectedAlpha = selectedAlpha.replace("'", "");
                }
                original[j] = {
                  type: "subs",
                  location: original[j].location,
                  increment: original[j]. increment,
                  alpha: selectedAlpha,
                  tenkai: false
                };
              }
            }
            if (cutFlag === true) {
              original[j].cut = cutNum;
            }
          }
        } 
        //初期既なら 
        //初期既でも対象と重複ならダッシュをつけるなどするので、原型と全く同じになることはない
        else {
          console.log("導入型=", "初期既");
          let selectedAlpha = randomChoice(exElemInit);
          console.log("selectedAlpha=", selectedAlpha);
          for (const j of target) {
            //先に'cut'があるなら情報を抜き出しておく
            let cutFlag = false;
            let cutNum;
            if (Object.keys(original[j] || {}).includes("cut")) {
              cutFlag = true;
              cutNum = original[j].cut;
            } //対象が休符なら
            if (original[j].type === "rest") {
              original[j] = {
                type: "subs",
                location: original[j].location,
                increment: original[j]. increment,
                alpha: selectedAlpha,
                tenkai: false
              };
            } //対象が実部、アルファベット重複なしの場合
            else if (
              original[j].type === "subs" &&
              original[j].alpha !== selectedAlpha
            ) {
              original[j] = {
                type: "subs",
                location: original[j].location,
                increment: original[j].increment,
                alpha: selectedAlpha,
                tenkai: false
              };
            } //対象が実部、アルファベット重複の場合
            else if (
              original[j].type === "subs" &&
              original[j].alpha === selectedAlpha
            ) {
              const dashNum = selectedAlpha.split("'").length - 1; //導入要素が素のアルファの場合
              if (dashNum === 0) {
                console.log("インデックス", j, "はダッシュ付加しました");
                selectedAlpha = selectedAlpha + "'";
                original[j] = {
                  type: "subs",
                  location: original[j].location,
                  increment: original[j]. increment,
                  alpha: selectedAlpha,
                  tenkai: false
                };
                if (dashNum === dashMaxObj[selectedAlpha[0]]) {
                  dashMaxObj[selectedAlpha[0]]++;
                  exElem.push(selectedAlpha);
                }
              } //導入要素に1つ以上のダッシュがある場合
              else {
                if (randomChoice([0, 1] === 0)) {
                  console.log("インデックス", j, "はダッシュ付加しました");
                  selectedAlpha = selectedAlpha + "'";
                  if (dashNum === dashMaxObj[selectedAlpha[0]]) {
                    dashMaxObj[selectedAlpha[0]]++;
                    exElem.push(selectedAlpha);
                  }
                } else {
                  console.log("インデックス", j, "はダッシュ1つ除去しました");
                  selectedAlpha = selectedAlpha.replace("'", "");
                }
                original[j] = {
                  type: "subs",
                  location: original[j].location,
                  increment: original[j].increment,
                  alpha: selectedAlpha,
                  tenkai: false
                };
              }
            }
            if (cutFlag === true) {
              original[j].cut = cutNum;
            }
          }
        }
      }
    } //if wayToInsert=自由 end
    else {
      //wayToInsert=要素対応なら
      //休符化も要素対応でいい→元々休符除いて単一要素なら不可
      //とりあえず対象を{要素:個数}のオブジェクトにできると取り回しが効く？
      //もし休符処理が終わったとすれば、手前の1つを変更→後ろに同じ要素があればそれも同じに、の連続でいい

      //とりあえず対象を{要素:個数}のオブジェクトで表す
      const targetObj = {};
      for (const i of targetIndex) {
        if (original[i].type === "subs") {
          if (original[i].alpha in targetObj) {
            targetObj[original[i].alpha]++;
          } else {
            //targetObjにない場合
            targetObj[original[i].alpha] = 1;
          }
        } else {
          //休符なら
          if ("r" in targetObj) {
            targetObj.r ++;
          } else {
            //targetObjにない場合
            targetObj.r = 1;
          }
        }
      }
      console.log("targetObj=", JSON.stringify(targetObj)); //休符化ありなしを決める
      let targetObjHaveSubs = false;
      let acc = 0;
      for (const i of Object.keys(targetObj)) {
        if (i !== "r") {
          targetObjHaveSubs = true;
        }
        acc++;
      }
      const restFlag =
        targetObjHaveSubs === true && acc > 1 && randomChoice([0, 1, 2]) === 0
          ? true
          : false;
      console.log("restFlag=", restFlag); //restFlag=trueならいずれかの要素を休符化する //まずは変える実部を決める
      if (restFlag === true) {
        const subsList = [];
        for (const i of Object.keys(targetObj)) {
          if (i !== "r") {
            subsList.push(i);
          }
        }
        const restTarget = randomChoice(subsList);
        console.log("restTarget=", JSON.stringify(restTarget)); //実際に休符化していく
        for (const i of targetIndex) {
          //'cut'があるなら先に情報を抜き出しておく
          let cutFlag = false;
          let cutNum;
          if (Object.keys(original[i]).includes("cut")) {
            cutFlag = true;
            cutNum = original[i].cut;
          }
          if (original[i].alpha === restTarget) {
            original[i] = { type: "rest", location: original[i].location, increment: original[i].increment};
            if (cutFlag === true) {
              original[i].cut = cutNum;
            } //休にした対象インデックスを消す
            targetIndex.splice(targetIndex.indexOf(i), 1);
          }
        } //休符化した要素をtargetObjから消す
        delete targetObj[restTarget];
      } //休符処理end //導入要素分の型を先に決める //(変更数=original.lengthの場合必ず既を含めたいため、後で個別に出力すると判別が冗長になる) //新ダッシュがないのは、既での重複回避としてダッシュ付加する中に新ダッシュの可能性も含めたため
      let typeList = [];
      const typeOption = ["新", "既"]; //先に対象外のoriginal要素に実部があるか調べておく(ないと全て新になった時原型要素がなくなる) //originalすべて対象ならfalseのまま
      let nonTargetHaveSubs = false;
      for (let i = 0; i < original.length; i++) {
        if (targetIndexCopy.includes(i)) {
        } else {
          if (original[i].type === "subs") {
            nonTargetHaveSubs = true;
            break;
          }
        }
      }
      if (nonTargetHaveSubs === true) {
        for (let i = 0; i < Object.keys(targetObj).length; i++) {
          typeList.push(randomChoice(typeOption));
        }
      } //対象外に実部がない場合
      else {
        while (true) {
          for (let i = 0; i < Object.keys(targetObj).length; i++) {
            typeList.push(randomChoice(typeOption));
          }
          if (typeList.includes("既")) {
            break;
          } else {
            typeList = [];
          }
        }
      }
      console.log("typeList=", JSON.stringify(typeList)); 
      //後は手前から変更→残りの中の同じ要素をそれに、の繰り返し
      const alphabet = [
        "default",
        "A",
        "B",
        "C",
        "D",
        "E",
        "F",
        "G",
        "H",
        "I",
        "J",
        "K",
        "L",
        "M",
        "N",
        "O",
        "P",
        "Q",
        "R",
        "S",
        "T",
        "U",
        "V",
        "W",
        "X",
        "Y",
        "Z",
      ];
      for (let i = 0; i < Object.keys(targetObj).length; i++) {
        console.log("【要素対応処理", i + 1, "回目】");
        if (typeList[i] === "新") {
          console.log("導入型=", "新");
          const lastAlphaIndex = alphabet.indexOf(lastAlpha[0]);
          const newAlpha = alphabet[lastAlphaIndex + 1];
          lastAlpha[0] = alphabet[lastAlphaIndex + 1];
          console.log("newAlpha=", newAlpha); //先頭がrestなら
          if (original[targetIndex[0]].type === "rest") {
            //先に'cut'があるなら情報を抜き出しておく
            let cutFlag = false;
            let cutNum;
            if (Object.keys(original[targetIndex[0]] || {}).includes("cut")) {
              cutFlag = true;
              cutNum = original[targetIndex[0]].cut;
            }
            original[targetIndex[0]] = {
              type: "subs",
              location: original[targetIndex[0]].location,
              increment: original[targetIndex[0]].increment,
              alpha: newAlpha,
              tenkai: false
            };
            if (cutFlag === true) {
              original[targetIndex[0]].cut = cutNum;
            }
            targetIndex.splice(0, 1);
            for (const j of targetIndex) {
              if (original[j].type === "rest") {
                let cutFlag = false;
                let cutNum;
                if (Object.keys(original[j] || {}).includes("cut")) {
                  cutFlag = true;
                  cutNum = original[j].cut;
                }
                original[j] = {
                  type: "subs",
                  location: original[j].location,
                  increment: original[j].increment,
                  alpha: newAlpha,
                  tenkai: false
                };
                if (cutFlag === true) {
                  original[j].cut = cutNum;
                }
                targetIndex.splice(targetIndex.indexOf(j), 1);
              }
            }
          } else {
            //先頭が実部なら
            const headAlpha = original[targetIndex[0]].alpha;
            original[targetIndex[0]].alpha = newAlpha;
            targetIndex.splice(0, 1);
            for (const j of targetIndex) {
              if (original[j].alpha === headAlpha) {
                original[j].alpha = newAlpha;
                targetIndex.splice(targetIndex.indexOf(j), 1);
              }
            }
          }
        } //typeList=既なら
        else {
          console.log("導入型=", "既");
          let insertAlpha = randomChoice(exElem); //先頭がrestの時

          if (original[targetIndex[0]].type === "rest") {
            //先に'cut'があるなら情報を抜き出しておく
            let cutFlag = false;
            let cutNum;
            if (Object.keys(original[targetIndex[0]] || {}).includes("cut")) {
              cutFlag = true;
              cutNum = original[targetIndex[0]].cut;
            }
            original[targetIndex[0]] = {
              type: "subs",
              location: original[targetIndex[0]].location,
              increment: original[targetIndex[0]].increment,
              alpha: insertAlpha,
              tenkai: false
            };
            if (cutFlag === true) {
              original[targetIndex[0]].cut = cutNum;
            }
            targetIndex.splice(0, 1);
            for (const j of targetIndex) {
              if (original[j].type === "rest") {
                let cutFlag = false;
                let cutNum;
                if (Object.keys(original[j] || {}).includes("cut")) {
                  cutFlag = true;
                  cutNum = original[j].cut;
                }
                original[j] = {
                  type: "subs",
                  location: original[j].location,
                  increment: original[j].increment,
                  alpha: insertAlpha,
                  tenkai: false
                };
                if (cutFlag === true) {
                  original[j].cut = cutNum;
                }
                targetIndex.splice(targetIndex.indexOf(j), 1);
              }
            }
          } else {
            //先頭が実部の時
            const headAlpha = original[targetIndex[0]].alpha; //アルファベット重複の場合のinsertAlpha調整
            if (insertAlpha === headAlpha) {
              const dashNum = insertAlpha.split("'").length - 1; //dashNum=0の場合
              if (dashNum === 0) {
                insertAlpha = insertAlpha + "'";
                if (dashNum === dashMaxObj[insertAlpha[0]]) {
                  dashMaxObj[insertAlpha[0]]++;
                  exElem.push(insertAlpha);
                }
              } //dashNum > 1の場合
              else {
                if (randomChoice([0, 1] === 0)) {
                  insertAlpha = insertAlpha + "'";
                  if (dashNum === dashMaxObj[insertAlpha[0]]) {
                    dashMaxObj[insertAlpha[0]]++;
                    exElem.push(insertAlpha);
                  }
                } else {
                  insertAlpha.replace("'", "");
                }
              }
            }
            original[targetIndex[0]].alpha = insertAlpha;
            targetIndex.splice(0, 1);
            for (const j of targetIndex) {
              if (original[j].alpha === headAlpha) {
                original[j].alpha = insertAlpha;
                targetIndex.splice(targetIndex.indexOf(j), 1);
              }
            }
          }
          console.log("insertAlpha=", insertAlpha);
        } //typeList = 既 end
      } //要素ごとのfor end
    } //wayToInsert=要素対応 end
    const resultForDebug = [];
    for (const i of original) {
      if (i.type === "subs") {
        resultForDebug.push(i.alpha);
      } else {
        resultForDebug.push("r");
      }
    }
    console.log("result要約=", JSON.stringify(resultForDebug));
    console.log("↑↑↑↑↑↑↑↑↑【aDash関数】↑↑↑↑↑↑↑↑↑");
    console.log("\n");
    return original;
 }

  //アルファベットのみからなるkeishikiListを渡しダッシュをつけて返す
  //既にダッシュがついたアルファベットを渡すことは想定していない
  function dash(keishikiList, dashMaxObj) {
    //console.log("↓↓↓↓↓↓↓↓↓↓【dash関数】↓↓↓↓↓↓↓↓↓↓");
    //各アルファベットの数をオブジェクトに
    const count = {};
    for (const i of keishikiList) {
      count[i] = (count[i] || 0) + 1;
    }
    //console.log("count=", JSON.stringify(count));
    const preResult = {};
    //複数あるもののみ処理していく
    for (const key in count) {
      //console.log("対象アルファベット=", key, "______________________");
      if (count[key] < 2) {
        //1つしかない要素はパス
        //console.log(key, "は1つによりパス");
      } else {
        //いくつ変更するか決める
        const changeAmountMax = count[key] - 1;
        const changeAmountWeights = [];
        const changeAmountReduce =
          changeAmountMax - 1 > 0 ? 0.5 / (changeAmountMax - 1) : 0;
        let value = 1;
        for (let i = 0; i < changeAmountMax; i++) {
          changeAmountWeights.push(value);
          value -= changeAmountReduce;
        }
        const changeAmount = weightedChoice(
          Array.from({ length: changeAmountMax }, (_, i) => i + 1),
          changeAmountWeights
        );
        //console.log("changeAmountMax=", changeAmountMax);
        //console.log('changeAmountReduce=',changeAmountReduce);
        //console.log('changeAmountWeights=',JSON.stringify(changeAmountWeights));
        //console.log("changeAmount=", changeAmount);

        //ダッシュの最大数を決める
        let dashAmountMax = Math.floor(Math.sqrt(count[key]) + 0.5);
        if (dashAmountMax > changeAmount) {
          dashAmountMax = changeAmount;
        }
        const dashAmountWeights = [];
        const dashAmountReduce =
          dashAmountMax - 1 > 0 ? 0.5 / (dashAmountMax - 1) : 0;
        value = 1;
        for (let i = 0; i < dashAmountMax; i++) {
          dashAmountWeights.push(value);
          value -= dashAmountReduce;
        }
        const dashAmount = weightedChoice(
          Array.from({ length: dashAmountMax }, (_, i) => i + 1),
          dashAmountWeights
        );
        dashMaxObj[key] = dashAmount;
        //console.log("dashAmountMax=", dashAmountMax);
        //console.log('dashAmountReduce=',dashAmountReduce);
        //console.log('dashAmountWeights=',JSON.stringify(dashAmountWeights));
        //console.log("dashAmount=", dashAmount);

        //各ダッシュに変更数を分配する
        //平均と順次の2種類用意。順次は1/2で大きい順にソートする(少ないダッシュほど多いパターンの確率を多少上げる)
        const howDistribute = randomChoice(["平均", "順次"]);
        //console.log("分配法=", howDistribute);
        const distributed = [];
        if (howDistribute === "平均") {
          const simpleDivide = changeAmount / dashAmount;
          if (Number.isInteger(simpleDivide)) {
            //割り切れるなら
            for (let i = 0; i < dashAmount; i++) {
              distributed.push(simpleDivide);
            }
          } else {
            //割り切れないなら、余りを分配
            for (let i = 0; i < dashAmount; i++) {
              distributed.push(Math.floor(simpleDivide));
            }
            const remainder = changeAmount % dashAmount;
            const used = [];
            for (let i = 0; i < remainder; i++) {
              const selectedIndex = randomChoice(
                Array.from({ length: dashAmount }, (_, i) => i)
              );
              if (!used.includes(selectedIndex)) {
                distributed[selectedIndex] += 1;
                used.push(selectedIndex);
              } else {
                i--;
              }
            }
          }
        } else {
          //順次なら
          let remain = changeAmount;
          for (let i = 0; i < dashAmount; i++) {
            //最後のダッシュは残りをプラス。または最初からダッシュ1つのみの場合に
            if (i === dashAmount - 1) {
              distributed.push(remain);
            } else {
              const selected = randomChoice(
                Array.from(
                  { length: remain - (dashAmount - (i + 1)) },
                  (_, i) => i + 1
                )
              );
              distributed.push(selected);
              remain -= selected;
            }
          }
          //1/2で大きい順に並び替え
          if (randomChoice([0, 1]) === 0) {
            distributed.sort((a, b) => b - a);
          }
        }
        //console.log('distributed=',JSON.stringify(distributed));
        //ソートするしない
        if (randomChoice([0, 1]) === 0) {
          //console.log("ソートなし");
          //A:[000111223]などpreResultに作る
          preResult[key] = Array(count[key] - changeAmount).fill(0);
          for (let i = 0; i < distributed.length; i++) {
            preResult[key].push(...Array(distributed[i]).fill(i + 1));
          }
        } else {
          //console.log("ソートあり");
          //A:[0121203]などpreResultに作る
          preResult[key] = Array(count[key] - changeAmount).fill(0);
          for (let i = 0; i < distributed.length; i++) {
            preResult[key].push(...Array(distributed[i]).fill(i + 1));
            const firstIndex = preResult[key].indexOf(i);
            const shuffled = partShuffle(preResult[key], firstIndex + 1);
            preResult[key] = shuffled;
          }
        }
        //console.log('preResult=',JSON.stringify(preResult));

        //keishikiListの該当アルファべットを直接変更していく
        let forPreResultIndex = 0;
        for (let i = 0; i < keishikiList.length; i++) {
          if (keishikiList[i] === key) {
            keishikiList[i] =
              keishikiList[i] + "'".repeat(preResult[key][forPreResultIndex]);
            forPreResultIndex++;
          }
        }
      }
    }
    //console.log("dash関数result=", JSON.stringify(keishikiList));
    //console.log('dashMaxObj=',JSON.stringify(dashMaxObj));
    //console.log("↑↑↑↑↑↑↑↑↑↑【dash関数】↑↑↑↑↑↑↑↑↑↑");
    //console.log("\n");
  }


  function simpleKeishiki(subsCount, lastAlpha) {
    //console.log("\n");
    //console.log("↓↓↓↓↓↓↓↓↓↓【keishiki関数】↓↓↓↓↓↓↓↓↓↓");
    const alphabet = [
      "default",
      "A",
      "B",
      "C",
      "D",
      "E",
      "F",
      "G",
      "H",
      "I",
      "J",
      "K",
      "L",
      "M",
      "N",
      "O",
      "P",
      "Q",
      "R",
      "S",
      "T",
      "U",
      "V",
      "W",
      "X",
      "Y",
      "Z",
    ];
    const keishikiList = [];
    const exAlpha = [];
    let lastAlphaIndex = alphabet.indexOf(lastAlpha[0]);
    const typeOption = ["単一", "単一+", "順次"]; //平均を消してある。戻すなら加える
    const typeWeights = [1, 1, 1];
    let keishikiType;
    if (subsCount === 1) {
      keishikiType = "実部1つ用";
    } else if (subsCount === 2) {
      keishikiType = "実部2つ用";
    } else {
      keishikiType = weightedChoice(typeOption, typeWeights);
    }

    //console.log("keishikiType=", keishikiType);
    if (keishikiType === "実部1つ用") {
      keishikiList.push(alphabet[lastAlphaIndex + 1]);
      lastAlpha[0] = alphabet[lastAlphaIndex + 1];
      lastAlphaIndex++;
    } else if (keishikiType === "実部2つ用") {
      if (randomChoice([1,2,3]) !== 1) {
        const result = [
          alphabet[lastAlphaIndex + 1],
          alphabet[lastAlphaIndex + 1],
        ];
        keishikiList.push(...result);
        lastAlpha[0] = alphabet[lastAlphaIndex + 1];
        lastAlphaIndex++;
      } else {
        const result = [
          alphabet[lastAlphaIndex + 1],
          alphabet[lastAlphaIndex + 2],
        ];
        keishikiList.push(...result);
        lastAlpha[0] = alphabet[lastAlphaIndex + 2];
        lastAlphaIndex += 2;
      }
    } else if (keishikiType === "単一") {
      keishikiList.push(...Array(subsCount).fill(alphabet[lastAlphaIndex + 1]));
      lastAlpha[0] = alphabet[lastAlphaIndex + 1];
      lastAlphaIndex++;
    } else if (keishikiType === "単一+") {
      //単一+の後ろの最大個数は√N小数切捨
      const latterMaxAmount = Math.floor(Math.sqrt(subsCount));
      const latterAmount = randomChoice(
        Array.from({ length: latterMaxAmount }, (_, i) => i + 1)
      );
      //console.log("末尾変化の部分数最大=", latterMaxAmount);
      //console.log("選択された部分数=,JSON.stringify(latterAmount)");
      const formerArray = Array.from(
        { length: subsCount - latterAmount },
        (_, i) => alphabet[lastAlphaIndex + 1]
      );
      exAlpha.push(alphabet[lastAlphaIndex + 1]);
      lastAlpha[0] = alphabet[lastAlphaIndex + 1];
      lastAlphaIndex++;
      const latterArray = [];
      latterArray.push(alphabet[lastAlphaIndex + 1]);
      exAlpha.push(alphabet[lastAlphaIndex + 1]);
      lastAlpha[0] = alphabet[lastAlphaIndex + 1];
      lastAlphaIndex++;
      for (let i = 0; i < latterAmount - 1; i++) {
        if (randomChoice([0, 1, 2]) === 0) {
          //既出から選ぶなら(新要素の方が重め)
          const selected = randomChoice(exAlpha);
          latterArray.push(selected);
        } else {
          latterArray.push(alphabet[lastAlphaIndex + 1]);
          exAlpha.push(alphabet[lastAlphaIndex + 1]);
          lastAlpha[0] = alphabet[lastAlphaIndex + 1];
          lastAlphaIndex++;
        }
      }
      keishikiList.push(...formerArray, ...latterArray);
    } /*else if (keishikiType === "平均") {
      //要素数を決める。最大値は√N四捨五入+1。要素数1は避ける
      const elemMaxAmount = Math.floor(Math.sqrt(subsCount) + 0.5) + 1;
      const elemAmount = randomChoice(
        Array.from({ length: elemMaxAmount - 1 }, (_, i) => i + 2)
      );
      //console.log("最大要素数=", elemMaxAmount);
      //console.log("要素数=", JSON.stringify(elemAmount));
      //各要素の数を決める(分配する)
      const amountOfEachAlpha = Array(elemAmount).fill(0);
      const simpleDivide = subsCount / elemAmount;
      if (Number.isInteger(simpleDivide)) {
        //割り切れるなら
        for (let i = 0; i < amountOfEachAlpha.length; i++) {
          amountOfEachAlpha[i] += simpleDivide;
        }
      } else {
        //割り切れないなら、余りを分配
        for (let i = 0; i < amountOfEachAlpha.length; i++) {
          amountOfEachAlpha[i] += Math.floor(simpleDivide);
        }
        const remainder = subsCount % elemAmount;
        const used = [];
        for (let i = 0; i < remainder; i++) {
          const selectedIndex = randomChoice(
            Array.from({ length: amountOfEachAlpha.length }, (_, i) => i)
          );
          if (!used.includes(selectedIndex)) {
            amountOfEachAlpha[selectedIndex] += 1;
            used.push(selectedIndex);
          } else {
            i--;
          }
        }
      }
      //console.log("各アルファベットへの分配数=",JSON.stringify(amountOfEachAlpha);
      //使うアルファベットを用意
      const alphabets = [];
      for (let i = 0; i < elemAmount; i++) {
        alphabets.push(alphabet[lastAlphaIndex + 1]);
        lastAlpha[0] = alphabet[lastAlphaIndex + 1];
        lastAlphaIndex++;
      }
      //console.log("使用アルファベット=");

      //アルファベットを数値としてオブジェクトに
      const eachAlphaObj = {};
      for (let i = 0; i < elemAmount; i++) {
        eachAlphaObj[alphabets[i]] = Array(amountOfEachAlpha[i]).fill(i);
      }
      //console.log('eachAlphaObj=',JSON.stringify(eachAlphaObj));

      //数値状態のresult
      const preResult = [];
      //シャッフルしない場合は000111222などのまま
      if (randomChoice([0, 1, 2, 3, 4]) === 0) {
        //console.log("シャッフルなし");
        for (let i = 0; i < elemAmount; i++) {
          preResult.push(...eachAlphaObj[alphabets[i]]);
        }
      } else {
        //シャッフルする場合
        //console.log("シャッフルあり");
        preResult.push(...eachAlphaObj[alphabets[0]]);
        for (let i = 1; i < elemAmount; i++) {
          const firstIndex = preResult.indexOf(i - 1);
          //console.log('firstIndex=',firstIndex);
          for (let j = 0; j < eachAlphaObj[alphabets[i]].length; j++) {
            const preResultIndex = Array.from(
              { length: preResult.length + 1 },
              (_, i) => i
            ); //末尾のインデックス取得のためlength+1
            const indexOption = preResultIndex.slice(firstIndex + 1);
            preResult.splice(
              randomChoice(indexOption),
              0,
              eachAlphaObj[alphabets[i]][j]
            );
          }
        }
      }
      //console.log('preResult=',JSON.stringify(preResult));

      //数字をアルファベットに変換しそのままkeishijiListへ
      for (let i = 0; i < preResult.length; i++) {
        keishikiList.push(alphabets[preResult[i]]);
      }
    }*/ else {
      //順次なら
      //要素数を決める。最大値は√N切り捨て+1。要素数1は避ける
      const elemMaxAmount = Math.floor(Math.sqrt(subsCount)) + 1;
      const elemAmount = randomChoice(
        Array.from({ length: elemMaxAmount - 1 }, (_, i) => i + 2)
      );
      //console.log("最大要素数=", elemMaxAmount);
      //console.log("要素数=", JSON.stringify(elemAmount));
      //各要素の数を決める
      const amountOfEachAlpha = Array(elemAmount).fill(0);
      let remain = subsCount;
      for (let i = 0; i < elemAmount - 1; i++) {
        //console.log(`【ループ${i+1}回目】`);
        //console.log('remain=',remain);
        //最大数の重みを1、最小値(1)を0.5、間は均等に減るゆるめの重みをつける
        //weightsが減る区間の幅は√最大数(切捨)
        const max = remain - (elemAmount - (i + 1));
        const weightsWidth = Math.floor(Math.sqrt(max) + 0.5);
        const sections = Math.floor(max / weightsWidth + 0.999);
        const reduceAmount = sections > 1 ? 0.9 / (sections - 1) : 0; //植木算のため-2でなく-1
        //console.log('max=',max);
        //console.log('weightsWidth=',weightsWidth);
        //console.log('sections=',sections);
        //console.log('reduceAmount=',reduceAmount);
        const weights = [];
        let acc = 0;
        let tempoValue = 1;
        for (let j = 0; j < max; j++) {
          if (acc < weightsWidth) {
            weights.push(tempoValue);
            acc++;
          } else {
            acc = 0;
            tempoValue -= reduceAmount;
            weights.push(tempoValue);
            acc++;
          }
        }
        //console.log('weights=',JSON.stringify(weights));
        const selectedAmount = weightedChoice(
          Array.from({ length: max }, (_, i) => i + 1),
          weights
        );
        amountOfEachAlpha[i] += selectedAmount;
        remain -= selectedAmount;
        //console.log('selectedAmount=',JSON.stringify(selectedAmount));
      }
      amountOfEachAlpha[amountOfEachAlpha.length - 1] += remain;
      //console.log('最後の残り=',remain);
      //console.log("各アルファベットの数=", JSON.stringify(amountOfEachAlpha));

      //使うアルファベットを用意
      const alphabets = [];
      for (let i = 0; i < elemAmount; i++) {
        alphabets.push(alphabet[lastAlphaIndex + 1]);
        lastAlpha[0] = alphabet[lastAlphaIndex + 1];
        lastAlphaIndex++;
      }
      //console.log("使用アルファベット=", JSON.stringify(alphabets));

      //アルファベットを数値としてオブジェクトに
      const eachAlphaObj = {};
      for (let i = 0; i < elemAmount; i++) {
        eachAlphaObj[alphabets[i]] = Array(amountOfEachAlpha[i]).fill(i);
      }
      //console.log('eachAlphaObj=',JSON.stringify(eachAlphaObj));
      //数値状態のresult
      const preResult = [];
      //シャッフルしない場合は000111222などのまま
      if (randomChoice([0, 1, 2, 3]) === 0) {
        //console.log("シャッフルなし");
        for (let i = 0; i < elemAmount; i++) {
          preResult.push(...eachAlphaObj[alphabets[i]]);
        }
      } else {
        //シャッフルする場合
        //console.log("シャッフルあり");
        preResult.push(...eachAlphaObj[alphabets[0]]);
        for (let i = 1; i < elemAmount; i++) {
          const firstIndex = preResult.indexOf(i - 1);
          //console.log('firstIndex=',firstIndex);
          for (let j = 0; j < eachAlphaObj[alphabets[i]].length; j++) {
            const preResultIndex = Array.from(
              { length: preResult.length + 1 },
              (_, i) => i
            ); //末尾のインデックスも取得するためlength+1になる
            const indexOption = preResultIndex.slice(firstIndex + 1);
            preResult.splice(
              randomChoice(indexOption),
              0,
              eachAlphaObj[alphabets[i]][j]
            );
          }
        }
      }
      //console.log('preResult=',JSON.stringify(preResult));

      //数字をアルファベットに変換しそのままkeishijiListへ
      for (let i = 0; i < preResult.length; i++) {
        keishikiList.push(alphabets[preResult[i]]);
      }
    }
    //console.log("keishikiList=", JSON.stringify(keishikiList));
    //console.log("↑↑↑↑↑↑↑↑↑↑【keishiki関数】↑↑↑↑↑↑↑↑↑↑");
    //console.log("\n");
    return keishikiList;
    //setKeishiki(keishikiList);
  }



  


  

 












export {
    randomChoice, randomSample, randomChoices, weightedChoice, weightedChoices, 
    arryShuffle, shuffle, partShuffle,
    aDash, dash, simpleKeishiki,
};
  
  


