







//バックアップ Main.js

import { Link } from "react-router-dom";

import {
  randomChoice, randomSample, randomChoices, weightedChoice, weightedChoices, 
  arryShuffle, shuffle, partShuffle,
  simpleKeishiki, aDash, dash,
} from "./Helper";

const hyoushiOptions = ["3/4", "4/4", "6/8", "9/8"];
const hyoushiWeights = [2, 2, 2, 2];
 
  
const minimumOptions = {
  "3/4": [4, 6],
  "4/4": [4, 6],
  "6/8": [2, 3],
  "9/8": [3],
};
const minimumWeights = {
  //やはり重みはフラットで。また重みありにしたくなるかもしれないので残しておく
  "3/4": [2, 2],
  "4/4": [2, 2],
  "6/8": [2, 2],
  "9/8": [2],
};

const minimumLimitOption = {
  '4/4,4':['16分','8分'],
  '4/4,6':['6連','3連','半拍'],
  '3/4,4':['16分','8分'],
  '3/4,6':['6連','3連','半拍'],
  '6/8,2':['16分'],
  '6/8,3':['16分3連'],
  '9/8,3':['16分3連'],
};

const minimumLimitLevelPreset = {
  '4/4,4':{'option':[['16分'],['16分','8分']], 'w':[4,1]},
  '4/4,6':{'option':[['6連'],['6連','3連'],['6連','半拍'],['6連','3連','半拍']],'w':[4,2,2,1]},
  '3/4,4':{'option':[['16分'],['16分','8分']], 'w':[4,1]},
  '3/4,6':{'option':[['6連'],['6連','3連'],['6連','半拍'],['6連','3連','半拍']],'w':[4,2,2,1]},
  '6/8,2':{'option':[['16分']], 'w':[1]},
  '6/8,3':{'option':[['16分3連']],'w':[1]},
  '9/8,3':{'option':[['16分3連']],'w':[1]},
};

const minimumLimitTranslation = {
  '4/4,4':{
    '16分':['1','2(-1)','2(1)','3','3(-2)','3(-1)','3(1)','3(2)'], 
    '8分':['2','6','6(-4)','6(-2)','6(2)','6(4)']
  },

  '4/4,6':{
    '6連':['1','2(-1)','2(1)','3(-2)','3(-1)','3(1)','3(2)'],
    '3連':['2','4','4(-2)','4(2)','6(-4)','6(-4)','6(-2)','6(2)','6(4)','8','8(-6)','8(-4)','8(-2)','8(2)','8(4)','8(6)',],
    '半拍':['3','6(-3)','6(3)','9','9(-6)','9(-3)','9(3)','9(6)',]
  },

  '3/4,4':{
    '16分':['1','2(-1)','2(1)','3','3(-2)','3(-1)','3(1)','3(2)'], 
    '8分':['2','6','6(-4)','6(-2)','6(2)','6(4)']
  },

  '3/4,6':{
    '6連':['1','2(-1)','2(1)','3(-2)','3(-1)','3(1)','3(2)'],
    '3連':['2','4','4(-2)','4(2)','6(-4)','6(-4)','6(-2)','6(2)','6(4)','8','8(-6)','8(-4)','8(-2)','8(2)','8(4)','8(6)',],
    '半拍':['3','6(-3)','6(3)','9','9(-6)','9(-3)','9(3)','9(6)',]
  },

  '6/8,2':{'16分':['1','2(-1)','2(1)','3','3(-2)','3(-1)','3(1)','3(2)']},

  '6/8,3':{'16分3連':['1','2','2(-1)','2(1)','3(-2)','3(-1)','3(1)','3(2)']},

  '9/8,3':{'16分3連':['1','2','2(-1)','2(1)','3(-2)','3(-1)','3(1)','3(2)']},
};  



const slideValueOption = {
  "3/4,4": ['1','2'],
  "3/4,6": ['1','2','3'],
  "4/4,4": ['1','2'],
  "4/4,6": ['1','2','3'],
  "6/8,2": ['1','2'],
  "6/8,3": ['1','2','3'],
  "9/8,2": ['1','2'],
  "9/8,3": ['1','2','3']
};

const barToNum = {
  "4/4,4,8bar": '128',
  "4/4,4,4bar": '64',
  "4/4,4,2bar": '32',
  "4/4,6,8bar": '192',
  "4/4,6,4bar": '96',
  "4/4,6,2bar": '48',

  "3/4,4,8bar": '96',
  "3/4,4,4bar": '48',
  "3/4,4,2bar": '24',
  "3/4,6,8bar": '144',
  "3/4,6,4bar": '72',
  "3/4,6,2bar": '36',

  "6/8,2,8bar": '96',
  "6/8,2,4bar": '48',
  "6/8,2,2bar": '24',
  "6/8,3,8bar": '144',
  "6/8,3,4bar": '72',
  "6/8,3,2bar": '36',

  "9/8,3,8bar": '216',
  "9/8,3,4bar": '108',
  "9/8,3,2bar": '54',
};

const numToBar = {
  "4/4,4" : {'128': '8bar' , '64': '4bar', '32': '2bar'},
  "4/4,6" : {'192': '8bar' , '96': '4bar', '48': '2bar'},

  "3/4,4" : {'96': '8bar' , '48': '4bar', '24': '2bar'},
  "3/4,6" : {'144': '8bar' , '72': '4bar', '36': '2bar'},

  "6/8,2" : {'96': '8bar' , '48': '4bar', '24': '2bar'},
  "6/8,3" : {'144': '8bar' , '72': '4bar', '36': '2bar'},

  "9/8,3" : {'216': '8bar' , '108': '4bar', '54': '2bar'},
};

const rythmIncrementOption = {
  "4/4,4": [
    ["32"],
    ["16"],
    ["12","12(4)","12(8)"],
    ["8","8(4)"],
    ["6","6(2)","6(4)"],
    ["4","4(2)"],
    ["3","3(1)","3(2)"],
    ["2","2(1)"],
    ["1"]
  ],
  "4/4,6": [
    ["48"],
    ["24"],
    ["18","18(6)","18(12)"],
    ["12","12(6)"],
    ["9","9(3)","9(6)"],
    ["8","8(2)","8(4)","8(6)"],
    ["6","6(2)","6(3)","6(4)"],
    ["4","4(2)"],
    ["3","3(1)","3(2)"],
    ["2","2(1)"],
    ["1"]
  ],

  "3/4,4": [["24"], ["12"], ["8","8(4)"],["6","6(2)","6(4)"],["4","4(2)"],["3","3(1)","3(2)"],["2","2(1)"], ["1"]],
 
  "3/4,6": [["36"],["18"],["12","12(6)"],["9","9(3)","9(6)"],["8","8(2)","8(4)","8(6)"],["6","6(2)","6(3)","6(4)"],["4","4(2)"],["3","3(1)","3(2)"],["2","2(1)"], ["1"]],
  
  "6/8,2": [['24'],['12'],['8','8(2)','8(4)','8(6)'],['6','6(2)','6(4)'],['4','4(2)'],['3','3(1)','3(2)'],['2','2(1)'],['1']],
  
  //3(+1)のノリは除外する(3*6を2*9に変換して捉えれば変でもないが2*9の拍感が明示されていなければ変)
  "6/8,3": [['36'],['18'],['12','12(3)','12(6)','12(9)'],['9','9(3)','9(6)'],['6','6(2)','6(3)'],['4','4(2)'],['3','3(2)'],['2','2(1)'], ["1"]],

  "9/8,2": [['36'],['18'],['12','12(2)','12(4)','12(6)','12(8)'],['9','9(3)','9(6)'],['6','6(2)','6(4)'],['4','4(2)'],['3','3(1)','3(2)'],['2','2(1)'], ["1"]],
  
  //3(+1)のノリは除外する(上と同様)
  "9/8,3": [['54'],['27'],['18','18(3)','18(6)','18(9)','18(12)'],['12','12(3)','12(6)','12(9)'],['9','9(3)','9(6)'],['6','6(3)'],['3','3(2)'],['2','2(1)'], ["1"]],
};

const layerBkForChordIncrementOption = {
  "4/4,4": [
    ["4bar","32","16","12","8","6"],
    ["27","24","18","9"],
  ],
  "4/4,6": [
    ["4bar","48","24","18","12","9"],
    ["36","32","27","16","8"],
  ],
  "3/4,4": [
    ["4bar","24","12","8","6"],
    ["18","16","9"],
  ],
  "3/4,6": [
    ["4bar","36","18","12","9"],
    ["32","27","24","16","8"],
  ],
  "6/8,2": [
    ["4bar","24","12","8","6"],
    ["18","16","9"],
  ],
  "6/8,3": [
    ["4bar","36","18","12","9"],
    ["32","27","24","16","8"],
  ],
  "9/8,3": [
    ["4bar","54","27","18","12"],
    ["36","32","24","16","8"],
  ],
};

const chordIncrementOption = {
  "4/4,4": [
    ["8bar","4bar","32","16","12","8","6","4"],
    ["27","24","18","9","3"],
  ],
  "4/4,6": [
    ["8bar","4bar","48","24","18","12","9","6"],
    ["36","32","27","16","8","4"],
  ],
  "3/4,4": [
    ["8bar","4bar","24","12","8","6","4"],
    ["18","16","9","3"],
  ],
  "3/4,6": [
    ["8bar","4bar","36","18","12","9","6"],
    ["32","27","24","16","8","4"],
  ],
  "6/8,2": [
    ["8bar","4bar","24","12","8","6","4"],
    ["18","16","9","3"],
  ],
  "6/8,3": [
    ["8bar","4bar","36","18","12","9","6"],
    ["32","27","24","16","8","4"],
  ],
  "9/8,3": [
    ["8bar","4bar","54","27","18","12","9"],
    ["36","32","24","16","8","6"],
  ],
};

const layerBkIncrementOption = {
  "4/4,4": [["32","16","12","8","6","4","3","2"],],
  "4/4,6": [["48","24","18","12","9","8","6","4","3","2"],],
  "3/4,4": [["24", "12", "8","6","4","3","2"]],
  "3/4,6": [["36","18","12","9","8","6","4","3","2"]],
  "6/8,2": [['24','12','8','6','4','3','2']],
  "6/8,3": [['36','18','12','9','6','4','3','2']],
  "9/8,2": [['36','18','12','9','6','4','3','2']],
  "9/8,3": [['54','27','18','12','9','6','3','2']],
};

const layerBkRythmIncrementOption = {
  "4/4,4": [
    ["32"],
    ["16"],
    ["12","12(4)","12(8)"],
    ["8","8(4)"],
    ["6","6(2)","6(4)"],
    ["4","4(2)"],
    ["3","3(1)","3(2)"],
    ["2","2(1)"],
    ["1"]
  ],
  "4/4,6": [
    ["48"],
    ["24"],
    ["18","18(6)","18(12)"],
    ["12","12(6)"],
    ["9","9(3)","9(6)"],
    ["8","8(2)","8(4)","8(6)"],
    ["6","6(2)","6(3)","6(4)"],
    ["4","4(2)"],
    ["3","3(1)","3(2)"],
    ["2","2(1)"],
    ["1"]
  ],

  "3/4,4": [["24"], ["12"], ["8","8(4)"],["6","6(2)","6(4)"],["4","4(2)"],["3","3(1)","3(2)"],["2","2(1)"], ["1"]],
 
  "3/4,6": [["36"],["18"],["12","12(6)"],["9","9(3)","9(6)"],["8","8(2)","8(4)","8(6)"],["6","6(2)","6(3)","6(4)"],["4","4(2)"],["3","3(1)","3(2)"],["2","2(1)"], ["1"]],
  
  "6/8,2": [['24'],['12'],['8','8(2)','8(4)','8(6)'],['6','6(2)','6(4)'],['4','4(2)'],['3','3(1)','3(2)'],['2','2(1)'],['1']],
  
  //3(+1)のノリは除外する(3*6を2*9に変換して捉えれば変でもないが2*9の拍感が明示されていなければ変)
  "6/8,3": [['36'],['18'],['12','12(3)','12(6)','12(9)'],['9','9(3)','9(6)'],['6','6(2)','6(3)','6(4)'],['4','4(2)'],['3','3(2)'],['2','2(1)'], ["1"]],

  "9/8,2": [['36'],['18'],['12','12(-8)','12(2)','12(4)','12(6)','12(8)'],['9','9(3)','9(6)'],['6','6(2)','6(4)'],['4','4(2)'],['3','3(1)','3(2)'],['2','2(1)'], ["1"]],

  //3(+1)のノリは除外する(上と同様)
  "9/8,3": [['54'],['27'],['18','18(3)','18(6)','18(9)','18(12)'],['12','12(3)','12(6)','12(9)'],['9','9(3)','9(6)'],['6','6(3)'],['3','3(2)'],['2','2(1)'], ["1"]],
};

const rythmIncrementBasicSet = {
  "4/4,4": ["16","12","8","8(4)","6","6(2)","6(4)","4","4(2)","3","3(1)","3(2)","2","2(1)","1"],
  "4/4,6": ["24","18","12","12(6)","9","9(3)","9(6)","6","6(2)","6(3)","6(4)","3","3(1)","3(2)","2","2(1)","1"],
  "3/4,4": ["12","8","6","6(2)","6(4)","4","4(2)","3","3(1)","3(2)","2","2(1)","1"], 
  "3/4,6": ["18","12","9","9(3)","9(6)","6","6(2)","6(3)","6(4)","3","3(1)","3(2)","2","2(1)","1"],
  "6/8,2": ['12','8','6','6(2)','6(4)','4','4(2)','3','3(1)','3(2)','2','2(1)','1'],
  //3(+1)のノリは除外する(3*6を2*9に変換して捉えれば変でもないが2*9の拍感が明示されていなければ変)
  "6/8,3": ['18','12','9','9(3)','9(6)','6','6(3)','3','3(2)','2','2(1)',"1"],
  //3(+1)のノリは除外する(上と同様)
  "9/8,3": ['27','18','9','9(3)','9(6)','3','3(2)','2','2(1)','1'],
};

const layerBkForChordIncrementBasicSet = {
  "4/4,4": ["4bar","32","16"],
  "4/4,6": ["4bar","48","24"],
  "3/4,4": ["4bar","24","12"],
  "3/4,6": ["4bar","36","18"],
  "6/8,2": ["4bar","24","12"],
  "6/8,3": ["4bar","36","18"],
  "9/8,3": ["4bar","54","27"],
};

const chordIncrementBasicSet = {
  "4/4,4": ["32","16","8","4"],
  "4/4,6": ["48","24","12","6"],
  "3/4,4": ["24","12","4"],
  "3/4,6": ["36","18","6"],
  "6/8,2": ["24","12","6","4"],
  "6/8,3": ["36","18","9","6"],
  "9/8,3": ["54","27","9"],
};

const layerBkIncrementBasicSet = {
  "4/4,4": ["32","16","12","8","6","4","3"],
  "4/4,6": ["48","24","18","12","9","6","3"],
  "3/4,4": ["24", "12", "8","6","4","3"],
  "3/4,6": ["36","18","12","9","6","3"],
  "6/8,2": ['24','12','6','3','2'],
  "6/8,3": ['36','18','9','6','3'],
  "9/8,3": ['54','27','9','3'],
};

const layerBkRythmIncrementBasicSet = {
  "4/4,4": ["16","12","8","8(4)","6","6(2)","6(4)","4","4(2)","3","3(1)","3(2)","2","2(1)","1"],
  "4/4,6": ["24","18","12","12(6)","9","9(3)","9(6)","6","6(2)","6(3)","6(4)","3","3(1)","3(2)","2","2(1)","1"],
  "3/4,4": ["12","8","6","6(2)","6(4)","4","4(2)","3","3(1)","3(2)","2","2(1)","1"], 
  "3/4,6": ["18","12","9","9(3)","9(6)","6","6(2)","6(3)","6(4)","3","3(1)","3(2)","2","2(1)","1"],
  "6/8,2": ['12','8','6','6(2)','6(4)','4','4(2)','3','3(1)','3(2)','2','2(1)','1'],
  //3(+1)のノリは除外する(3*6を2*9に変換して捉えれば変でもないが2*9の拍感が明示されていなければ変)
  "6/8,3": ['18','12','9','9(3)','9(6)','6','6(3)','3','3(2)','2','2(1)',"1"],
  //3(+1)のノリは除外する(上と同様)
  "9/8,3": ['27','18','9','9(3)','9(6)','3','3(2)','2','2(1)','1'],
};  

const avoidRestStartPoint = {
  "4/4,4": [2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32],
  "4/4,6": [
    2, 5, 6, 8, 11, 12, 14, 17, 18, 20, 23, 24, 26, 29, 30, 32, 35, 36, 38,
    41, 42, 44, 47, 48,
  ],
  "3/4,4": [2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24],
  "3/4,6": [
    2, 5, 6, 8, 11, 12, 14, 17, 18, 20, 23, 24, 26, 29, 30, 32, 35, 36,
  ],
  "6/8,2": [2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24],
  "6/8,3": [
    2, 3, 5, 6, 8, 9, 11, 12, 14, 15, 17, 18, 20, 21, 23, 24, 26, 27, 29, 30,
    32, 33, 35, 36,
  ],
  "9/8,2": [
    2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36,
  ],
  "9/8,3": [
    2, 3, 5, 6, 8, 9, 11, 12, 14, 15, 17, 18, 20, 21, 23, 24, 26, 27, 29, 30,
    32, 33, 35, 36, 38, 39, 41, 42, 44, 45, 47, 48, 50, 51, 53, 54,
  ],
};

//表の改行位置を規定
const breakpoint = {
  "4/4,4": [0,16,32,48,64,80,96,112,128],
  "4/4,6": [0,24,48,72,96,120,144,168,192],
  "3/4,4": [0,12,24,36,48,60,72,84,96],
  "3/4,6": [0,18,36,54,72,90,108,126,144],
  "6/8,2": [0,12,24,36,48,60,72,84,96],
  "6/8,3": [0,18,36,54,72,90,108,126,144],
  "9/8,2": [0,18,36,54,72,90,108,126,144],
  "9/8,3": [0,27,54,81,108,135,162,189,216],
};

const noteTheme = { //"#fb7185"赤
  note: { 
    symbol: (
      <svg width="13px" height="13px" viewBox="0 0 24 24" style={{verticalAlign:'middle', display:'inline-block'}}>
        <circle cx="12" cy="12" r="10" fill="currentColor"/>
      </svg>
    ), 
    color: "#0075FF"}, // 青
  sustain: { symbol: "ー", color: "#0075FF" }, // 青
  rest: { symbol: "／", color: "#fb7185" }, // 空白
  repeat: { 
    symbol: (
      <svg width="13px" height="13px" viewBox="0 0 24 24" style={{verticalAlign:'middle', display:'inline-block'}}>
        <circle cx="12" cy="12" r="10" fill="currentColor"/>
      </svg>
    ),  
    color: "#C4C8CC" 
  }, //グレー
  former: { symbol: "▶︎", color: "#1ADED5" }, // ターコイズ
  latter: { 
    symbol: (
      <svg width="13px" height="13px" viewBox="0 0 24 24" style={{verticalAlign:'middle', display:'inline-block'}}>
        <circle cx="12" cy="12" r="10" fill="currentColor"/>
      </svg>
    ), 
    color: "#0075FF" 
  }, // 青
};


/*
<svg width="14px" height="14px" viewBox="0 0 24 24" style={{verticalAlign:'middle', display:'inline-block'}}>
        <circle cx="12" cy="12" r="10" fill="currentColor"/>
      </svg>
*/








export default function Main({ values }) {
  const {
    hyoushi: hyoushi,
    setHyoushi: setHyoushi,
    minimum: minimum,
    setMinimum: setMinimum,
    minimumLimit, setMinimumLimit,
   
    chordWhole, setChordWhole,
    chordRythm: chordRythm,
    setChordRythm: setChordRythm,
    chordRythmIncrement: chordRythmIncrement,
    setChordRythmIncrement: setChordRythmIncrement,
    chordAmount: chordAmount,
    setChordAmount: setChordAmount,

    availableLayerBkForChordIncrement, setAvailableLayerBkForChordIncrement,
    availableChordIncrement, setAvailableChordIncrement,
    layerBkForChordOneByOne, setLayerBkForChordOneByOne,

    sectionLength: sectionLength,
    setSectionLength: setSectionLength,
    rythm: rythm,
    setRythm: setRythm,
    rythmIncrement: rythmIncrement,
    setRythmIncrement: setRythmIncrement,
    amount: amount,
    setAmount: setAmount,
    availableIncrement: availableIncrement,
    setAvailableIncrement: setAvailableIncrement,
    repeatIsChecked: repeatIsChecked,
    setRepeatIsChecked: setRepeatIsChecked,
    auftaktIsChecked, setAuftaktIsChecked,
    oneByOne: oneByOne,
    setOneByOne: setOneByOne,
    
    availableSlideValue: availableSlideValue,
    setAvailableSlideValue: setAvailableSlideValue,
    slideData: slideData,
    setSlideData: setSlideData,
    
    layerBkWhole, setLayerBkWhole,
    availableLayerBkIncrement: availableLayerBkIncrement,
    setAvailableLayerBkIncrement: setAvailableLayerBkIncrement,

    availableLayerBkRythmIncrement: availableLayerBkRythmIncrement,
    setAvailableLayerBkRythmIncrement: setAvailableLayerBkRythmIncrement,
    layerBkRythmRepeatIsChecked: layerBkRythmRepeatIsChecked,
    setLayerBkRythmRepeatIsChecked: setLayerBkRythmRepeatIsChecked,

    layerBkObj: layerBkObj,
    setLayerBkObj: setLayerBkObj,
    layerBkOneByOne: layerBkOneByOne,
    setLayerBkOneByOne: setLayerBkOneByOne,
    layerBkStart0, setLayerBkStart0,

    keishikiA, setKeishikiA,
    keishikiB, setKeishikiB,
    keishikiAmount, setKeishikiAmount,
    keishikiStartAlpha, setKeishikiStartAlpha,
    exKeishiki, setExKeishiki,
    

    pitchLevels: pitchLevels,
    setPitchLevels: setPitchLevels,
    melodyLineAmount: melodyLineAmount,
    setMelodyLineAmount: setMelodyLineAmount ,
    basePoint: basePoint,
    setBasePoint: setBasePoint,

    partData, setPartData,

  } = values;


  

  

  
  //リズム///////////////////////////////////////////////////

  
  
  const handleSectionLength = (e) => {
    setSectionLength(e.target.value);
  };

  const handleChordWhole = (e) => {
    setChordWhole(e.target.value);
  };

  const handleAvailableLayerBkForChordIncrement = (e) => {
    const value = e.target.value.includes('bar') ? barToNum[`${hyoushi},${minimum},${e.target.value}`] : e.target.value;
    if (e.target.checked) {
      // チェックされたら配列に追加
      setAvailableLayerBkForChordIncrement([...availableLayerBkForChordIncrement, value]);
    } else {
      // チェックが外れたら配列から削除
      setAvailableLayerBkForChordIncrement(
        availableLayerBkForChordIncrement.filter((item) => item !== value)
      );
    }
  };

  // 基本セットにチェックを入れる関数
  const handleLayerBkChordBasicSet = () => {
    const currentOptions = layerBkForChordIncrementOption[`${hyoushi},${minimum}`];
    if (currentOptions) {
      // 2次元配列を1次元に平坦化（flat）して全ての値を取得
      const values = currentOptions.flat().filter((item) => layerBkForChordIncrementBasicSet[`${hyoushi},${minimum}`].includes(item) && ! minimumLimit.includes(item));
      // 重複を防ぐためSet
      setAvailableLayerBkForChordIncrement(Array.from(new Set([...values])));
    }
  };

  const handleSelectAllLayerBkChordIncrement = () => {
    const currentOptions = layerBkForChordIncrementOption[`${hyoushi},${minimum}`];
    if (currentOptions) {
      // 2次元配列を1次元に平坦化（flat）して全ての値を取得
      const allValues = currentOptions.flat().filter((item) => ! minimumLimit.includes(item));
      // 重複を防ぐため Set を使って結合、または全選択状態にする
      setAvailableLayerBkForChordIncrement(Array.from(new Set([...allValues])));
    }
  };

  // 一括で全てチェックを外す関数
  const handleDeselectAllLayerBkChordIncrement = () => {
    setAvailableLayerBkForChordIncrement([]);
  };

  const handleAvailableChordIncrement = (e) => {
    const value = e.target.value.includes('bar') ? barToNum[`${hyoushi},${minimum},${e.target.value}`] : e.target.value;
    if (e.target.checked) {
      // チェックされたら配列に追加
      setAvailableChordIncrement([...availableChordIncrement, value]);
    } else {
      // チェックが外れたら配列から削除
      setAvailableChordIncrement(
        availableChordIncrement.filter((item) => item !== value)
      );
    }
  };

  // 基本セットにチェックを入れる関数
  const handleChordIncrementBasicSet = () => {
    const currentOptions = chordIncrementOption[`${hyoushi},${minimum}`];
    if (currentOptions) {
      // 2次元配列を1次元に平坦化（flat）して全ての値を取得
      const values = currentOptions.flat().filter((item) => chordIncrementBasicSet[`${hyoushi},${minimum}`].includes(item) && ! minimumLimit.includes(item));
      // 重複を防ぐためSet
      setAvailableChordIncrement(Array.from(new Set([...values])));
    }
  };

  const handleSelectAllChordIncrement = () => {
    const currentOptions = chordIncrementOption[`${hyoushi},${minimum}`];
    if (currentOptions) {
      // 2次元配列を1次元に平坦化（flat）して全ての値を取得
      const allValues = currentOptions.flat().filter((item) => ! minimumLimit.includes(item));
      // 重複を防ぐため Set を使って結合、または全選択状態にする
      setAvailableChordIncrement(Array.from(new Set([...allValues])));
    }
  };

  // 一括で全てチェックを外す関数
  const handleDeselectAllChordIncrement = () => {
      setAvailableChordIncrement([]);
  };

 

  const handleAvailableIncrement = (e) => {
    const value = e.target.value.includes('bar') ? barToNum[`${hyoushi},${minimum},${e.target.value}`] : e.target.value; 
    if (e.target.checked) {
      // チェックされたら配列に追加
      setAvailableIncrement([...availableIncrement, value]);
    } else {
      // チェックが外れたら配列から削除
      setAvailableIncrement(
        availableIncrement.filter((item) => item !== value)
      );
    }
  };


  // 基本セットにチェックを入れる関数
  const handleBasicSet = () => {
    const currentOptions = rythmIncrementOption[`${hyoushi},${minimum}`];
    if (currentOptions) {
      // 2次元配列を1次元に平坦化（flat）して全ての値を取得
      const values = currentOptions.flat().filter((item) => rythmIncrementBasicSet[`${hyoushi},${minimum}`].includes(item) && ! minimumLimit.includes(item));
      // 重複を防ぐためSet
      setAvailableIncrement(Array.from(new Set([...values])));
    } 
  };

  // 一括で全てチェックを入れる関数
  const handleSelectAllIncrement = () => {
    const currentOptions = rythmIncrementOption[`${hyoushi},${minimum}`];
    if (currentOptions) {
      // 2次元配列を1次元に平坦化（flat）して全ての値を取得
      const allValues = currentOptions.flat().filter((item) => ! minimumLimit.includes(item));
      // 重複を防ぐため Set を使って結合、または全選択状態にする
      setAvailableIncrement(Array.from(new Set([...allValues])));
    }
  };

  // 一括で全てチェックを外す関数
  const handleDeselectAllIncrement = () => {
      setAvailableIncrement([]);
  };

  const handleRepeat = (e) => {
    setRepeatIsChecked(e.target.checked); 
  };

  const handleAuftakt = (e) => {
    setAuftaktIsChecked(e.target.checked); 
  };

  const handleLayerBkWhole = (e) => {
    setLayerBkWhole(e.target.value);
  };

  const handleAvailableLayerBkIncrement = (e) => {
    const value = e.target.value.includes('bar') ? barToNum[`${hyoushi},${minimum},${e.target.value}`] : e.target.value; 
    if (e.target.checked) {
      // チェックされたら配列に追加
      setAvailableLayerBkIncrement([...availableLayerBkIncrement, value]);
    } else {
      // チェックが外れたら配列から削除
      setAvailableLayerBkIncrement(
        availableLayerBkIncrement.filter((item) => item !== value)
      );
    }
  };

  // 基本セットにチェックを入れる関数
  const handleLayerBkIncrementBasicSet = () => {
    const currentOptions = layerBkIncrementOption[`${hyoushi},${minimum}`];
    if (currentOptions) {
      // 2次元配列を1次元に平坦化（flat）して全ての値を取得
      const values = currentOptions.flat().filter((item) => layerBkIncrementBasicSet[`${hyoushi},${minimum}`].includes(item) && ! minimumLimit.includes(item));
      // 重複を防ぐためSet
      setAvailableLayerBkIncrement(Array.from(new Set([...values])));
    }
  };

  // 一括で全てチェックを入れる関数
  const handleSelectAllLayerBkIncrement = () => {
    const currentOptions = layerBkIncrementOption[`${hyoushi},${minimum}`];
    if (currentOptions) {
      // 2次元配列を1次元に平坦化（flat）して全ての値を取得
      const allValues = currentOptions.flat().filter((item) => ! minimumLimit.includes(item));
      // 重複を防ぐため Set を使って結合、または全選択状態にする
      setAvailableLayerBkIncrement(Array.from(new Set([...allValues])));
    }
  };

  // 一括で全てチェックを外す関数
  const handleDeselectAllLayerBkIncrement = () => {
      setAvailableLayerBkIncrement([]);
  };

  const handleAvailableLayerBkRythmIncrement = (e) => {
    const value = e.target.value.includes('bar') ? barToNum[`${hyoushi},${minimum},${e.target.value}`] : e.target.value; 
    if (e.target.checked) {
      // チェックされたら配列に追加
      setAvailableLayerBkRythmIncrement([...availableLayerBkRythmIncrement, value]);
    } else {
      // チェックが外れたら配列から削除
      setAvailableLayerBkRythmIncrement(
        availableLayerBkRythmIncrement.filter((item) => item !== value)
      );
    }
  }; 

  // 基本セットにチェックを入れる関数
  const handleLayerBkRythmIncrementBasicSet = () => {
    const currentOptions = layerBkRythmIncrementOption[`${hyoushi},${minimum}`];
    if (currentOptions) {
      // 2次元配列を1次元に平坦化（flat）して全ての値を取得
      const values = currentOptions.flat().filter((item) => layerBkRythmIncrementBasicSet[`${hyoushi},${minimum}`].includes(item) && ! minimumLimit.includes(item));
      // 重複を防ぐためSet
      setAvailableLayerBkRythmIncrement(Array.from(new Set([...values])));
    }
  };

  // 一括で全てチェックを入れる関数
  const handleSelectAllLayerBkRythmIncrement = () => {
    const currentOptions = layerBkRythmIncrementOption[`${hyoushi},${minimum}`];
    if (currentOptions) {
      // 2次元配列を1次元に平坦化（flat）して全ての値を取得
      const allValues = currentOptions.flat().filter((item) => ! minimumLimit.includes(item));
      // 重複を防ぐため Set を使って結合、または全選択状態にする
      setAvailableLayerBkRythmIncrement(Array.from(new Set([...allValues])));
    }
  };

  // 一括で全てチェックを外す関数
  const handleDeselectAllLayerBkRythmIncrement = () => {
      setAvailableLayerBkRythmIncrement([]);
  };

  const handleLayerBkRythmRepeat = (e) => {
    setLayerBkRythmRepeatIsChecked(e.target.checked); // e.target.checked で true/false を取得
  };

  const handleMelodyLineAmount = (e) => {
    setMelodyLineAmount(Number(e.target.value));
  };

  const handleBasePoint = (e) => {
    setBasePoint(Number(e.target.value));
  }

  const handleSlideValue = (e) => {
    const value = e.target.value;
    if (e.target.checked) {
      // チェックされたら配列に追加
      setAvailableSlideValue([...availableSlideValue, value]);
    } else {
      // チェックが外れたら配列から削除
      setAvailableSlideValue(
        availableSlideValue.filter((item) => item !== value)
      );
    }
  };

  const handleKeishikiAmount = (e) => {
    setKeishikiAmount(Number(e.target.value));
  };

  const handleKeishikiStartAlpha = (e) => {
    setKeishikiStartAlpha(e.target.value);
  };

  const handleExKeishiki = (e) => {
    setExKeishiki(e.target.value);
  };

  const handleMinimumLimit = (e) => {
    const value = e.target.value;
    const translated = minimumLimitTranslation[`${hyoushi},${minimum}`][value];
    if (e.target.checked) {
      // チェックされたら
      setMinimumLimit([...minimumLimit, ...translated]);
      setAvailableChordIncrement(
        availableChordIncrement.filter((item) => ! translated.includes(item))
      );
      setAvailableIncrement(
        availableIncrement.filter((item) => ! translated.includes(item))
      );
      setAvailableLayerBkIncrement(
        availableLayerBkIncrement.filter((item) => ! translated.includes(item))
      );
      setAvailableLayerBkRythmIncrement(
        availableLayerBkRythmIncrement.filter((item) => ! translated.includes(item))
      );
    } else {
      // チェックが外れたら
      setMinimumLimit(
        minimumLimit.filter((item) => ! translated.includes(item))
      );
    }
  };

 

  

  

  





  //拍子////////////////////////////////////////////////
  function randomSelectHyoushi() {
    const hyoushi = weightedChoice(hyoushiOptions, hyoushiWeights);
    setHyoushi(hyoushi);
    setMinimum("");
  }




  //最小単位//////////////////////////////////////////////////////
  function randomSelectMinimum(hyoushi) {
    const option = minimumOptions[hyoushi];
    const weights = minimumWeights[hyoushi];
    const minimum = weightedChoice(option, weights);
    setMinimum(minimum);
    setSectionLength("");

    setMinimumLimit([]);

    setPartData([]);
    
    setChordWhole("");
    setAvailableLayerBkForChordIncrement([]);
    setAvailableChordIncrement([]);
    setLayerBkForChordOneByOne([]);

    setAvailableIncrement([]);
    setOneByOne([]);

    setLayerBkWhole("");
    setAvailableLayerBkIncrement([]);
    setAvailableLayerBkRythmIncrement([]);
    setRepeatIsChecked(false);
    setLayerBkRythmRepeatIsChecked(false);
    setLayerBkOneByOne([]);
    setLayerBkObj({});

    setSlideData([]);
  }


  function getMinimumLimit() {
    const chosen = weightedChoice(minimumLimitLevelPreset[`${hyoushi},${minimum}`]['option'], minimumLimitLevelPreset[`${hyoushi},${minimum}`]['w']);
    const result = [];
    chosen.forEach((item) => {
        result.push(...minimumLimitTranslation[`${hyoushi},${minimum}`][item]);
    });
    console.log('getMinimumLimit関数結果=',JSON.stringify(result));
    setMinimumLimit(result);
    setAvailableChordIncrement(
      availableChordIncrement.filter((item) => ! translated.includes(item))
    );
    setAvailableIncrement(
      availableIncrement.filter((item) => ! translated.includes(item))
    );
    setAvailableLayerBkIncrement(
      availableLayerBkIncrement.filter((item) => ! translated.includes(item))
    );
    setAvailableLayerBkRythmIncrement(
      availableLayerBkRythmIncrement.filter((item) => ! translated.includes(item))
    );
  }

  function judgeForMinimumLimitCheckbox(japanese){
    const nList = minimumLimitTranslation[`${hyoushi},${minimum}`][japanese];
    if (minimumLimit.includes(nList[0])){
        return true;
    } else {
        return false;
    }
  }
  

  //2小節への出力前提とする
  //returnは{[打点位置], "音価単位"}
  function getRandomChordRythm() {
    const incrementOption = [];
    const twoBar = parseInt(hyoushi, 10) * minimum * 2;
    if (availableChordIncrement.includes(twoBar)) {
      incrementOption.push(twoBar);
    }
    for (let i = 0; i < availableChordIncrement.length; i++) {
      //選択された音価のうち、まとまりの中で2つ以上収まる音価のみ抜き出す(ずらし音価により手前にはみ出る分は含めない)
      const numA = parseInt(availableChordIncrement[i], 10);
      const match = availableChordIncrement[i].match(/\((-?\d+)\)/);
      const numB = Number(match?.[1] || 0);
      if (numB >= 0) {
        if (numA * 2 + numB <= twoBar) {
          incrementOption.push(availableChordIncrement[i]);
        }
      }else {
        if (numA * 2 <= twoBar) {
          incrementOption.push(availableChordIncrement[i]);
        }
      }  
    }
    const tempoWeights = []; //残った音価の選択肢に対してweightsを動的に作る
    const reOptions = []; //一旦辞書にして順が狂う可能性があるので完全に対応させるための再定義用
    const sameNumA = {}; //numAごとにグループ分けする
    incrementOption.forEach((item) => {
      const n = parseInt(item, 10);
      if (!sameNumA[n]) sameNumA[n] = [];
      sameNumA[n].push(item);
    });
    Object.keys(sameNumA).forEach((item) => {
      //sameNumAのキーを辿り、各配列にweightsを考えていく
      const arr = sameNumA[item];
      arr.sort((a, b) => (a.includes("(") ? 1 : -1)); //カッコあり音価が万一前にくるのを防ぐためのソート
      if (arr.length === 1) {
        reOptions.push(arr[0]);
        tempoWeights.push(1);
      } else {
        reOptions.push(arr[0]);
        tempoWeights.push(0.5);
        for (let i = 1; i < arr.length; i++) {
          reOptions.push(arr[i]);
          tempoWeights.push(0.5 / (arr.length - 1));
        }
      }
    });
    const selectedIncrement = weightedChoice(reOptions, tempoWeights); //使用音価を選ぶ
    const baseNum = parseInt(selectedIncrement, 10);
    const startNum = (Number(selectedIncrement.match(/\(([^)]+)\)/)?.[1]) || 0) + 1;
    const finalOptions = []; //使用音価の目盛り
    let i = startNum;
    while (i <= twoBar) {
      finalOptions.push(i);
      i += baseNum;
    }
    const amountOption = Array.from(
      { length: finalOptions.length },
      (_, i) => i + 1
    );
    const amountWeights = []; //amountOptionのためのweightsを動的生成
    if (finalOptions.length === 1) {
      amountWeights.push(1);
    } else {
      for (let i = 1; i <= finalOptions.length; i++) {
        amountWeights.push(1);
      }
    }
    const amount = weightedChoice(amountOption, amountWeights);
    const result = { location: [], increment: selectedIncrement, amount }; //result用意
    if (selectedIncrement.includes("(")) {
      //和音リズムは最初は必ず打つ。(4),12,12なら最初は5と考える。先頭タイのパターンは和音の偶然の一致に任せても得られるはず
      result.location.push(startNum);
    } else {
      result.location.push(1);
    }
    finalOptions.splice(0, 1);
    const selected =
      finalOptions && finalOptions.length > 0
        ? randomSample(finalOptions, amount - 1)
        : [];
    result.location.push(...selected);
    result.location.sort((a, b) => a - b);
    return result;
  }
  




  //基本引数は有効音価単位と全体。bkFlagは後述
  //打点位置の配列(location)と音価単位(increment)、打点数(amount)のオブジェクトを返す
  //bkFlagがtrueなら部屋割り用の処理をする。長い音価ほど重めに選ぶ。打点数1や2など少ないものを避ける
  //サステイン、休符は別の関数で定義する
  //firstFlagがtrueなら先頭を必ず打つ
  //atLeast2がtrueならwholeが1の場合除き2つ以上打つ。大抵firstFlagと併用するはず
  //hitAllFlag: trueなら打点を全て打つ。自動的にputRestも素通りする。基本的に和音の部屋割りに使うはず
  function getRandomRythm(increment, whole, bkFlag = false, firstFlag = false, atLeast2 = false, hitAllFlag = false) {
    console.log('______________【getRandomRythm関数start】___________________');
    const incrementOption = [];

    if (bkFlag === false && atLeast2 === false) {
      if (increment.some((item) => parseInt(item,10) >= Number(whole))) {
        incrementOption.push(String(whole));
      }
    }

    for (let i = 0; i < increment.length; i++) {
      //渡された音価のうち、まとまりの中で2つ以上収まる音価のみ抜き出す(ずらし音価により手前にはみ出る分は含めない)
      const numA = parseInt(increment[i], 10);
      const numB = Number(increment[i].match(/\(([^)]+)\)/)?.[1]) || 0;
      if (numB >= 0) {
        if (numA * 2 + numB <= Number(whole)) {
          incrementOption.push(increment[i]);
        }
      } else { //numBがマイナス値なら
        if (numA * 2 <= Number(whole)) {
          incrementOption.push(increment[i]);   
        }
      }  
    }
    console.log('incrementOption=',JSON.stringify(incrementOption));

    const tempoWeights = []; //残った音価の選択肢に対してweightsを動的に作る(ずらし系を持つ音価をその数分薄めるだけ)
    const reOptions = []; //辞書にして順が狂う可能性があるので完全に対応させるための再定義
    const sameNumA = {}; //基本音価ごとにグループ分けする
    incrementOption.forEach((item) => {
      const n = parseInt(item, 10);
      if (!sameNumA[n]) sameNumA[n] = [];
      sameNumA[n].push(item);
    });
    let nForBk = 1;
    Object.keys(sameNumA).forEach((item) => {
      //sameNumAのキーを辿り、各配列にweightsを考えていく
      //bkの場合は長い音価ほど重くする。ループは短い音価順のため、nForBkを増やしながら重みにかけていく
      const arr = sameNumA[item];
      arr.sort((a, b) => (a.includes("(") ? 1 : -1)); //カッコあり音価が万一前にくるのを防ぐためのソート
      if (arr.length === 1) {  
        reOptions.push(arr[0]);
        bkFlag === false ? tempoWeights.push(1) : tempoWeights.push(1 * nForBk);
      } else { //複数あるなら
        if (!arr[0].includes('(')){ //素の音価とカッコ音価含むなら
          reOptions.push(arr[0]);
          bkFlag === false
            ? tempoWeights.push(0.5)
            : tempoWeights.push(0.5 * nForBk);
          for (let i = 1; i < arr.length; i++) {
            reOptions.push(arr[i]);
            bkFlag === false
              ? tempoWeights.push(0.5 / (arr.length - 1))
              : tempoWeights.push((0.5 / (arr.length - 1)) * nForBk);
          }
        } else { //カッコ音価のみで複数なら
          for (let i = 0; i < arr.length; i++) {
            reOptions.push(arr[i]);
            bkFlag === false
              ? tempoWeights.push(1 / arr.length)
              : tempoWeights.push((1 / arr.length) * nForBk);
          }
        }
      }
      nForBk *= 2;
    });
    console.log('reOptions=',JSON.stringify(reOptions));
    //使用音価を選ぶ
    const selectedIncrement = weightedChoice(reOptions, tempoWeights); 
    const baseNum = parseInt(selectedIncrement, 10);
    const startNum = (Number(selectedIncrement.match(/\(([^)]+)\)/)?.[1]) || 0) + 1;
    console.log('startNum=',startNum);
    const finalOptions = []; //使用音価の目盛り
    let i = startNum;
    while (i <= Number(whole)) {
      finalOptions.push(i);
      i += baseNum;
    }
    console.log('finalOptions=',JSON.stringify(finalOptions));
    const amountOption = Array.from(
      { length: finalOptions.length },
      (_, i) => i + 1
    );
    //引数のatLeast2がtrueならamountの選択肢から1を除外
    if (amountOption.length > 1 && atLeast2 === true) {
      const iOf1 = amountOption.indexOf(1);
      amountOption.splice(iOf1,1);
    }
    const amountWeights = []; //amountOptionのためのweightsを動的生成
    
    //極端に少ないパターンを避ける
    const threshold = amountOption.length > 1 && atLeast2 === true ? Math.sqrt(amountOption.length) + 1 : Math.sqrt(amountOption.length);
    for (let i = 0; i < amountOption.length; i++) {
      if (amountOption[i] <= threshold) {
        amountWeights.push(0.1);
      } else {
        amountWeights.push(1);
      }
    }

    //打数の規定
    const amount = hitAllFlag === true || Math.random() < 0.2 ? Math.max(...amountOption) : weightedChoice(amountOption, amountWeights);
    //result用意
    const result = { location: [], increment: selectedIncrement, amount }; 
    
    if (firstFlag === true || Math.random() < 0.5) { //最初を必ず打つかの分岐
      if (selectedIncrement.includes("(")) {
        //(4),12,12なら最初は5と考える
        result.location.push(startNum);
      } else {
        result.location.push(1);
      }
      finalOptions.splice(0, 1);
      const selected =
        finalOptions && finalOptions.length > 0
          ? randomSample(finalOptions, amount - 1)
          : [];
      result.location.push(...selected);
    } else {
      const selected = randomSample(finalOptions, amount);
      result.location.push(...selected);
    }
    result.location.sort((a, b) => a - b);
    console.log('【getRandomRythm関数result】=',JSON.stringify(result));
    return result;
  }
  








  //同音反復の関数。locationの各隙間にn.2として反復点を追加する
  //引数例：locaton[-1,1,4,7.1,10,16.1](休符化後想定), increment[8,4,4(-2),4(+2)....2,1], whole8(全体というか最終locationの意味)など
  //結果例：[1,4.2,16.2,17,18.2,19.2,28.2,29.2,30.2,32.2] (引数のlocationを直接いじるだけ)
  function repeatA(location, increment, whole){ 
    console.log('______________【repeatA関数start】___________________');
    //console.log('受け取ったincrement=',JSON.stringify(increment));
    //console.log('whole=',whole);

    //最小incの規定
    const minInc = Math.min(...increment.map(item => parseInt(item,10)));

    //受け取ったincのうちカッコ内がマイナスまたは最小inc未満は使わないので除外する
    const incFormated = increment.filter(i => {
      const parenN = Number(i.match(/\(([^)]+)\)/)?.[1]) || 0;
      if (parenN === 0 || parenN >= minInc) {
        return true;
      } else {
        return false;
      }
    });   
    //console.log('incFormated=',JSON.stringify(incFormated));
    if (incFormated.length === 0) {
      console.log('使用可能なincがありません');
      console.log('______________【repeatA関数end】___________________');
      return location;
    }  

    //対象打点の選別。最小incで反復不可能な打点と休符を除外
    console.log('minInc=',minInc);
    const targetI = []; 
    location.forEach((loc,locI) => {
      if (loc * 10 - Math.trunc(loc) * 10 === 1){ //休符ならパス(小数点では綺麗に0.1にならないので10かけてる)

      } else if (locI === location.length -1) { //最後の要素なら
        const space = Number(whole) + 1 - loc;
        if (space >= minInc * 2) {
          targetI.push(locI);
        }
      } else { //通常のsubs
        const space = Math.trunc(location[locI + 1]) - loc;
        if (space >= minInc * 2) {
          targetI.push(locI);
        }
      }
    });
    //もしtargetIが一つも入らなかったら
    if (targetI.length === 0) {
      console.log('反復可能な隙間がありません');
      console.log('______________【repeatA関数end】___________________');
      return location;
    }  
    
    //console.log('可能targetI=',JSON.stringify(targetI));

    //targetIから反復の対象を選ぶ(全部orランダム)
    if (Math.random() > 0.66) { //2/3でランダム選択(ランダムでも全選択ありえる)。全部ならtargetIはそのまま通すだけ
      const amount = Math.trunc(Math.random() * targetI.length) + 1;
      if (amount < targetI.length) { //(amount = targetI(全選択)なら処理の必要なし)
        const exclusion = randomSample(targetI,targetI.length - amount);
        exclusion.forEach((item) => {
          const exclusionI = targetI.indexOf(item);
          targetI.splice(exclusionI,1);
        });
      }
    }
    //console.log('確定targetI=',JSON.stringify(targetI));

    //確定した対象に反復を与えていく
    //2つめ以降の隙間には既出パターンを適用する可能性を与える
    //(全く同じ既出隙間のみ参照する、でもいいがそれだと664などの4が6と同じになる機会が得られない)
    //同じ・近い隙間ほど高確率(小さい値÷大き値＝nとしてn^2でカーブを作る)。当隙間の範囲に最初の反復点がないものは除外
    const repeatNotes = []; //実際に付与するlocation(n.2)を格納
    const repeatData = new Map(); //既存の反復データ
    location.forEach((loc,locI) => {
      //console.log('■location=',loc,'の処理');
      if (! targetI.includes(locI)){ 
        //console.log('対象外です');
      } else { //subsの通常処理
        const space = locI !== location.length -1 ? Math.trunc(location[locI + 1]) - loc : Number(whole) + 1 - loc ;
        //console.log('space=',space);
        if (repeatData.size > 0) { //既存データがあるなら
          //とりあえず既存データの活用可能なものを列挙
          const option = []; //候補(最初の打点が当該スペース内にある)
          const optionWeights = [];
          repeatData.forEach((value,key) => {
            let accForEven = 0; //同じ隙間に現時点で複数候補があるならその数で重みを割るため
            value.forEach((arr) => {
              if (arr[0] <= space) {
                option.push(structuredClone(arr));
                accForEven ++;
              }
            });
            //w ex.4 ÷ 6 = 0.75 → 0.75 * 0.75 = 0.56 をさらにaccForEvenで割る
            if (accForEven > 0) {
              console.log('accForEven=',accForEven);
              const w = key <= space ? (key / space) ** 2 / accForEven : (space / key) ** 2 / accForEven;
              optionWeights.push(...Array(accForEven).fill(w));
            }
          });
          //console.log('option結果=',JSON.stringify(option));
          //console.log('optionWeights=',JSON.stringify(optionWeights));
          //もし候補があれば1/2で候補から選ぶ。それ以外は新規
          if (option.length > 0 && randomChoice([0,1]) === 0) {
            //console.log('既存パターンから選択します');
            const chosenArr = weightedChoice(option, optionWeights);
            //console.log('chosenArr=',JSON.stringify(chosenArr));
            //当該隙間からはみ出す打点がるパターンならそれらを除外
            const cutArr = chosenArr.filter(item => item <= space);
            //新しいパターンならデータに追加する
            if (repeatData.has(space)) { 
              const hasArr = repeatData.get(space).some(arr => arr.length === cutArr.length && arr.every((val,i) => val === cutArr[i]));
              if (hasArr === false) repeatData.get(space).push(cutArr);
            } else {
              repeatData.set(space,[cutArr]);
            }
            //実際のロケーションに直し格納
            const realArr = cutArr.map(p => p + loc - 1 >= 0? p + loc - 1 + 0.2 : p + loc - 1 - 0.2);
            repeatNotes.push(...realArr);
            //console.log('得られた反復=',JSON.stringify(realArr))

          } else { //既存から参照しない。新規の処理
            //console.log('新規パターンを作ります');
            //リズム取得
            const points = getRandomRythm(incFormated,space,false,true,true).location;
            if (points.includes(1)) {//1を消す
              const iOf1 = points.indexOf(1);
              points.splice(iOf1,1); 
            } 
            repeatData.set(space,[points]); //Mapにデータ追加
            //実際のロケーションに直す
            const realPoints = points.map(p => p + loc - 1 >= 0? p + loc - 1 + 0.2 : p + loc - 1 - 0.2);
            repeatNotes.push(...realPoints);
            //console.log('得られた反復=',JSON.stringify(realPoints))
          }

        } else { //既存データがないなら
          //console.log('新規パターンを作ります');
          //リズム取得
          const points = getRandomRythm(incFormated,space,false,true,true).location;
          if (points.includes(1)) { //1を消す
            const iOf1 = points.indexOf(1);
            points.splice(iOf1,1); 
          }  
          repeatData.set(space,[points]); //Mapにデータ追加
          //実際のロケーションに直す
          const realPoints = points.map(p => p + loc - 1 >= 0? p + loc - 1 + 0.2 : p + loc - 1 - 0.2);
          repeatNotes.push(...realPoints);
          //console.log('得られた反復=',JSON.stringify(realPoints))
        }
      }
    });
    //console.log('repeatData最終状態=',repeatData);

    location.push(...repeatNotes);
    location.sort((a,b) => a - b);
    console.log('repeatA結果=',JSON.stringify(location));
    console.log('______________【repeatA関数end】___________________');
  }




  



  //repeatAは打点ごと。Bは16,16の各範囲のここは必ず打つ、のように総合リズム的に考える(当面repeatAだけで進める)
  function repeatB(){
  }







  //引数例：location[5,9,13,17,25]、increment"12(4)"、whole32
  //return: なし。単にpointArrに休符開始点をn.1で表現して追加するだけ
  //音価(increment)が拍以上ならその音価単位でサステインを切る。拍未満なら1単位の目盛りで切るが半端な点を避ける制限をつける
  //手前から単位目盛りを辿り、隙間の区間(半小節以上)が確定するごとに1/2でランダムな位置でサステカットする
  function sustainCut(location, increment, whole) {
    console.log("-----------【sustainCut関数 start】----------------");
    const baseNum = parseInt(increment, 10);
    console.log('baseNum=',baseNum);
    const startNum = (Number(increment.match(/\(([^)]+)\)/)?.[1]) || 0) + 1;
    console.log('startNum=',startNum);
    if (baseNum >= Number(minimum)) {
      console.log('拍以上の音価用の処理をします');
      //拍以上の音価単位ならその単位でサステインカット考える
      const step = []; //使用音価の目盛り
      const incForStep = baseNum % Number(minimum) === 0 ? Number(minimum) : baseNum;
      console.log('incForStep=',incForStep);
      for (let i = startNum; i <= Number(whole); i += incForStep) {
        step.push(i);
      }
      console.log('step=',JSON.stringify(step));
      const lastNum = step[step.length - 1];
      console.log('lastNum=',lastNum);
      let firstLocationFlag = false;
      let susFlag = false;
      let acc = [];
      step.forEach((item) => {
        if (location.includes(item) && susFlag === false) {
          if (item === location[0]) {
            firstLocationFlag = true;
          }
        } else if (
          !location.includes(item) &&
          susFlag === false &&
          item !== lastNum
        ) {
          acc.push(item);
          susFlag = true;
        } else if (
          !location.includes(item) &&
          susFlag === true &&
          item !== lastNum
        ) {
          acc.push(item);
        } else {
          //手前が隙間で打点ならacc分を休符化処理。または最後の隙間なら手前に関わらず処理
          if (!location.includes(item) && item === lastNum) {
            acc.push(item);
          }
          if (firstLocationFlag === true) {
            const accAbove0 = acc.filter(a => a >= 0); //1未満の休符は除く
            const n = randomChoice(accAbove0);
            const n1 = n >= 0 ? n + 0.1 : n - 0.1;
            if (Math.random() > 0.4) { 
              location.push(n1);
              console.log(JSON.stringify(acc),'から',n1,'を休符点にしました');
            } else {
              console.log(JSON.stringify(acc),'からの選出はスキップします');
            }
          }
          susFlag = false;
          acc = [];
        }
      });
    } else {
      console.log('拍未満の音価用の処理をします');
      //拍未満の音価単位なら1単位でサステインカット考える
      const step = [];
      for (let i = startNum; i <= Number(whole); i ++) {
        step.push(i);
      }
      console.log('step=',JSON.stringify(step));
      console.log('避けるべき休符開始点=',JSON.stringify(avoidRestStartPoint[`${hyoushi},${minimum}`]));
      const threshold = hyoushi.slice(-1) === "4" ? Number(minimum) : Number(minimum) * 2; //これ以上の長さの間隔が処理対象(拍子は4分の〜か8分の〜しかない前提)
      const lastNum = step[step.length - 1];
      let firstLocationFlag = false;
      let susFlag = false;
      let acc = 0;
      let oder = startNum;
      step.forEach((item) => {
        if (location.includes(item) && susFlag === false) {
          firstLocationFlag = true;
        } else if (
          !location.includes(item) &&
          susFlag === false &&
          item !== lastNum
        ) {
          acc += 1;
          susFlag = true;
        } else if (
          !location.includes(item) &&
          susFlag === true &&
          item !== lastNum
        ) {
          acc += 1;
        } else {
          //手前が隙間、現在打点または最後の隙間、accが十分な長さなら休符化処理(厳密には最後の隙間なら手前は打点でも(どうせ長さは足りないが))
          if (!location.includes(item) && item === lastNum) {
            acc += 1;
          }
          if (acc > threshold) {
            const startEnd = {};
            if (item === lastNum) {
              startEnd.s = oder - (acc - 1);
              startEnd.e = oder;
            } else {
              startEnd.s = oder - acc;
              startEnd.e = oder - 1;
            }
            const shortestRestLength = { 4: 2, 6: 3, 3: 3, 2: 2 }; //endが8として8から休符しても16分の隙間しかないので最低どれほどの長さの休符を確保するかの定義
            const option = [];
            for (let i = startEnd.s; i <= startEnd.e - (shortestRestLength[minimum] - 1); i++) {
              if (!avoidRestStartPoint[`${hyoushi},${minimum}`].includes(i)) {
                option.push(i);
              }
            }
            if (option.length !== 0 && firstLocationFlag === true && Math.random() > 0.4) { 
              const optionAbove0 = option.filter(a => a >= 0); //1未満の休符は除く
              const n = randomChoice(optionAbove0);
              const n1 = n >= 0 ? n + 0.1 : n - 0.1;
              location.push(n1);
              console.log(JSON.stringify(option),'から',n1,'を休符点にしました');
            } else {
              console.log(JSON.stringify(option),'からの選出はスキップします');
            }
          }
          susFlag = false;
          acc = 0;
        }
        oder += 1;
      });
    }
    location.sort((a, b) => a - b);
    console.log('sustainCut結果=',JSON.stringify(location));
    console.log("-----------【sustainCut関数 end】----------------");
  }




  //概要: bkのサブ関数。打点配列の隙間にrestを表すn.1を充填するだけ
  //引数例：打点位置[1,5,9,17,29], 単位4, 全体の長さ32
  //return: ↑なら音価4単位の全打点のうちlocationに含まれていないものをn.1で表した[1,5,9,13.1,17,21.1,25.1,29]など
  function putRest(location, increment, whole) {
    //console.log("-----------【putRest関数 開始】----------------");
    const baseNum = parseInt(increment, 10);
    const startNum = (Number(increment.match(/\(([^)]+)\)/)?.[1]) || 0) + 1;
    const step = []; //音価単位の目盛り
    for (let i = startNum; i <= Number(whole); i += baseNum) {
      step.push(i);
    }
    //console.log('step=',JSON.stringify(step));
    const newLocation = [];
    step.forEach((item) => {
      if (!location.includes(item)) {
        const n = item >= 0 ? item + 0.1 : item - 0.1;
        newLocation.push(n);
      } else {
        newLocation.push(item);
      }
    });
    console.log('【putRest関数result】=',JSON.stringify(newLocation));
    //console.log("-----------【putRest関数 終了】----------------");
    return newLocation;
  }





  //const keishikiList = () => {keishiki(4,["A"])};

  function randomChordRythm() {
    const chordRythm = getRandomChordRythm();
    setChordRythm(chordRythm.location);
    setChordRythmIncrement(chordRythm.increment);
    setChordAmount(chordRythm.amount);
  }

  //引数にメインリズムのオブジェクトを受け取り直接改変する
  function getAuftakt(obj){
    console.log("-----------【getAuftakt関数 スタート】----------------");

    const oneBar = parseInt(hyoushi,10) * Number(minimum);
    const oneBeat = Number(minimum);

    const wholeOption = Array.from({length:oneBar}, (_,i) => i+1);
    const whole = randomChoice(wholeOption);

    //音価を拍以下のみにする。拍より大きい音価しかない場合はそのまま渡す(wholeに入らない音価しかない場合の対策はgetRandomRythm側にあり)
    const lessThanBeat = availableIncrement.some(item => parseInt(item,10) <= oneBeat);
    const adjustedInc = lessThanBeat === true ? availableIncrement.filter(item => parseInt(item,10) <= oneBeat) : [...availableIncrement];

    console.log('adjustedInc=',JSON.stringify(adjustedInc));

    const rythm = getRandomRythm(adjustedInc, whole, bkFlag = false, firstFlag = true, atLeast2 = true);

    //console.log('getRandomRythm取得時打点=',JSON.stringify(rythm.location));
    
    //反転する
    const reversed = rythm.location.map(item => {
        const reversedN = item - ((item - 1) * 2);
        return reversedN;
    })
    reversed.sort((a,b) => a - b);
    console.log('反転後=',JSON.stringify(reversed));

    //初打点を消す
    if (reversed.includes(1)) {
        reversed.splice(reversed.indexOf(1),1)
        rythm.amount -= 1;
    }  

    console.log('1を消した後=',JSON.stringify(reversed));

    //前方に偏りすぎるリズムは直す。小節/2にあるか -> ない -> 1拍ずらす -> あるか -> ...
    const thre = 1 - oneBar / 2;
    while(true){
        const havePoint = reversed.some(item => item > thre);
        if (havePoint === false) {
            reversed.forEach((item, i) => {
                reversed[i] += oneBeat;
            });
        } else {
            break;
        }
    }

    console.log('前ずらし通過後=',JSON.stringify(reversed));

    obj.location.push(...reversed);
    obj.location.sort((a,b) => a - b);
    obj.increment = `${rythm.increment},${obj.increment}`;
    obj.amount += rythm.amount;

    console.log("-----------【getAuftakt関数 エンド】----------------");
  }




  function randomRythm() {
    console.log('sectionLength=',sectionLength);
    const whole = String(sectionLength).includes('bar') ?  barToNum[`${hyoushi},${minimum},${sectionLength}`] : sectionLength; 
    console.log('whole=',whole);

    const rythm = getRandomRythm(availableIncrement, Number(whole));

    sustainCut(rythm.location, rythm.increment, Number(whole));

    if (auftaktIsChecked) getAuftakt(rythm);

    if (repeatIsChecked === true) repeatA(rythm.location, availableIncrement, Number(whole));

    setRythm(rythm.location);
    setRythmIncrement(rythm.increment);
    setAmount(rythm.amount);
    const firstLocation = rythm.location[0];

    //以下図表出力のための操作
    const oneByOneArr = [];
    let restFlag = false;
    const start = firstLocation > 0 ? 1 : 1 - parseInt(hyoushi) * Number(minimum);
    for (let i = start; i <= Number(whole); i++) {
      if (rythm.location.includes(i)) {
        oneByOneArr.push(i < 1 ? [i, "former"] : [i, "note"]);
        restFlag = false;
      } else if (rythm.location.includes(i + 0.1) || rythm.location.includes(i - 0.1)) {
        oneByOneArr.push([i, "rest"]);
        restFlag = true;
      } else if (rythm.location.includes(i + 0.2) || rythm.location.includes(i - 0.2)) {
        oneByOneArr.push([i, "repeat"]);
      } else if (!rythm.location.includes(i) && restFlag === true) {
        oneByOneArr.push([i, "rest"]);
      } else {
        oneByOneArr.push([i, "sustain"]);
      }
    }
    //console.log('oneByOneArr=',JSON.stringify(oneByOneArr));


    const oneByOne = [];
    //改行すべき長さごとに配列に格納。3次元になる
    let rowAcc = [];
    for (let i = 0; i < oneByOneArr.length; i++) {
      rowAcc.push(oneByOneArr[i]);
      if (breakpoint[`${hyoushi},${minimum}`].includes(oneByOneArr[i][0])){
        oneByOne.push(rowAcc);
        rowAcc = [];
      }
    }
    if (rowAcc.length > 0) {
      oneByOne.push(rowAcc);
    }
    //console.log('oneByOne=',JSON.stringify(oneByOne));
    setOneByOne(oneByOne);
  }
  



  //不均等な長さの部分群への形式出力。引数は単純に各部分の長さのみの数値配列に仕立てて渡すことex[2,2,4,8,2,4]
  function keishikiForUneven(arr, lastAlpha) {
    const onka = []; //ex[2,4,8]
    arr.forEach((item) => {
      if (!onka.includes(item)) onka.push(item);
    });
    onka.sort((a, b) => a - b);
    //console.log('onka=',JSON.stringify(onka));
    const group = []; //ex[[2], [4], [8]]
    for (const i of onka) {
      group.push([i]);
    }
    //console.log('group=',JSON.stringify(group));
    //グループをまとめる
    for (let i = 0; i < 10; i++) {
      //10はありえる音価種の一応の上限
      if (group.length === 1) break;
      const ratio = []; //ex[1.5, 1.33, 2, 1.33]
      for (let j = 0; j < group.length - 1; j++) {
        const n1 = group[j].reduce((a, b) => a + b, 0) / group[j].length;
        const n2 =
          group[j + 1].reduce((a, b) => a + b, 0) / group[j + 1].length;
        const gap = n2 - n1;
        ratio.push(gap);
      }
      let min = ratio[0]; //ex 1.33
      for (const num of ratio) {
        if (num < min) {
          min = num;
        }
      }
      const a = []; //ex[1,3] minがあったindex
      for (let j = 0; j < ratio.length; j++) {
        if (ratio[j] === min) a.push(j);
      }
      const b = randomChoice(a); //ex 3
      group[b].push(...group[b + 1]);
      group.splice(b + 1, 1);
      if (i === 0) {
        if (randomChoice([0, 1]) === 0) break;
      } else {
        if (randomChoice(Array.from({ length: i }, (_, i) => i + 1)) !== 1)
          break;
      }
    }
    //console.log('まとめ後group=',JSON.stringify(group));
    //以上でgroupが[[2], [3,4], [6,8]]などになる
    const obj = {}; //ex{ 0: {onka:[2,3], count:5, alpha:[A,A,A,B,B]},  1: {onka:[4], count:3, alpha:[B,A,C]}.....}
    for (let i = 0; i < group.length; i++) {
      obj[i] = {};
      obj[i].onka = [...group[i]];
      obj[i].count = 0;
      obj[i].alpha = [];
    }
    const restoreOder = []; //ex[0,2,0,3,1,0,2,2] (引数arrの各要素がこのobjキー＝グループに属していますよ、の配列)
    arr.forEach((item) => {
      for (const i of Object.keys(obj)) {
        if (obj[i].onka.includes(item)) {
          obj[i].count += 1;
          restoreOder.push(i);
        }
      }
    });
    //console.log('restoreOder=',JSON.stringify(restoreOder));
    //console.log('obj形式前');
    for (let i = 0; i < Object.keys(obj).length; i++) {
      //objデバック用
      //console.log('obj',i,'=',JSON.stringify(obj[i]));
    }
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
    //第1グループの形式を作る
    const firstAlpha = simpleKeishiki(obj[0].count, lastAlpha);
    obj[0].alpha.push(...firstAlpha);
    //console.log('firstAlpha=',JSON.stringify(firstAlpha));
    //第2グループ以降を作る
    for (let i = 1; i < Object.keys(obj).length; i++) {
      //console.log('group',i,'処理ーーー');
      const tempoAlpha = simpleKeishiki(obj[i].count, ["default"]); //たたき台のlastAlpha気にしない形式
      const marked = tempoAlpha.map((item) => item + "#");
      //console.log('marked=',JSON.stringify(marked));
      const exObj = {};
      //たたき台のアルファを既存や新アルファから選んだものに入れ替える
      marked.forEach((item, index) => {
        //console.log(item,'処理ーーー');
        if (!Object.keys(exObj).includes(item)) {
          const option = []; //手前グループで出た要素と新アルファ
          const weights = [];
          //既存アルファの選択肢用意
          for (let j = 0; j < i; j++) {
            obj[j].alpha.forEach((k) => {
              if (!option.includes(k)) {
                option.push(k);
                const n1 =
                  obj[i].onka.reduce((a, b) => a + b, 0) / obj[i].onka.length;
                const n2 =
                  obj[j].onka.reduce((a, b) => a + b, 0) / obj[j].onka.length;
                if (n1 > n2) {
                  const w = n2 / n1;
                  weights.push(w);
                } else {
                  const w = n1 / n2;
                  weights.push(w);
                }
              }
            });
          }
          //新アルファの用意
          const lastAlphaIndex = alphabet.indexOf(lastAlpha[0]);
          option.push(alphabet[lastAlphaIndex + 1]);
          weights.push(1);
          //exObjに存在する要素は除いたreOptionを作る
          const reOption = [];
          const reWeights = [];
          if (Object.keys(exObj).length > 0) {
            for (let j = 0; j < option.length; j++) {
              if (!Object.values(exObj).includes(option[j])) {
                reOption.push(option[j]);
                reWeights.push(weights[j]);
              }
            }
          } else {
            reOption.push(...option);
            reWeights.push(...weights);
          }
          //console.log('reOption=',JSON.stringify(reOption));
          //console.log('reWeights=',JSON.stringify(reWeights));
          const selected = weightedChoice(reOption, reWeights);
          //console.log('selected=',selected);
          tempoAlpha[index] = selected;
          exObj[item] = selected;
          if (selected === alphabet[lastAlphaIndex + 1])
            lastAlpha[0] = alphabet[lastAlphaIndex + 1];
        } else {
          //console.log('既存');
          tempoAlpha[index] = exObj[item];
        }
      });
      obj[i].alpha.push(...tempoAlpha);
    }
    //console.log('obj形式後');
    for (let i = 0; i < Object.keys(obj).length; i++) {
      //objデバック用
      //console.log('obj',i,'=',JSON.stringify(obj[i]));
    }
    const result = [];
    for (let i = 0; i < restoreOder.length; i++) {
      for (const j of Object.keys(obj)) {
        if (j === restoreOder[i]) {
          result.push(obj[j].alpha[0]);
          obj[j].alpha.splice(0, 1);
        }
      }
    }
    //console.log('result=',JSON.stringify(result));
    //return result;
    setKeishiki(result);
  }







  //末端ダッシュを消し、その上層への影響も調性する。getLayerBkの補助関数。引数のobjを直接変更
  function removeBottomDash(obj){
    console.log('\n【removeBottomDash関数_START_________________________________】');

    //最下層を定義
    const bL = parseInt(Object.keys(obj).at(-1));
    console.log('最下層 =',bL );
    
    //末端ダッシュを消す
    obj[`${bL}層`].forEach((item, i) => {
        item.forEach((item2, i2) => {
            if (item2.type === 'subs' && item2.alpha.includes("'")) {
                const a = item2.alpha.split("'")[0]; //素のアルファを抜き出す
                console.log(obj[`${bL}層`][i][i2].alpha,'を',a,'に変更します');
                obj[`${bL}層`][i][i2].alpha = a;
            }    
        });
    });

    //修正処理のための関数用意
    function sameOrNot(a,b){ //共に子層のブロック
      console.log('sameOrNot関数スタート______');
        if (a.length < 2 || b.length < 2 || a.length !== b.length) { //要素が1ならsubsではない。要素数が違えば同じ要素ではない
          return false;
        } else {
          const copyA = structuredClone(a);
          const copyB = structuredClone(b);
          const trimedA = copyA.map((elm, elmI) => {
            if (elm.location) delete copyA[elmI].location;
            if (elm.tenkai) delete copyA[elmI].tenkai;
            return elm;
          });
          const trimedB = copyB.map((elm, elmI) => {
            if (elm.location) delete copyB[elmI].location;
            if (elm.tenkai) delete copyB[elmI].tenkai;
            return elm;
          });
          console.log('trimedA=',JSON.stringify(trimedA));
          console.log('trimedB=',JSON.stringify(trimedB));

          if (JSON.stringify(trimedA) === JSON.stringify(trimedB)) {
            return true;
          } else {
            return false;
          }
        }
    }
    
    console.log('修正ループ開始');
    //上層への影響を処理。同じならダッシュ消す
    for (let i = bL - 1; i > 0; i--){
      console.log('親層=',i,'子層=',i+1);
        //親層の各ブロック内要素数。復元で使う
        const lengthForRestore = obj[`${i}層`].map(n => n.length);
        console.log('lengthForRestore=',JSON.stringify(lengthForRestore));
        //親層平坦化
        const pFlatten = [];
        obj[`${i}層`].forEach((item) => {
            item.forEach((item2) => {
                pFlatten.push(item2);
            });
        });
        console.log('pFlatten=',JSON.stringify(pFlatten));
        

        //修正処理
        for (let j = 0; j < obj[`${i+1}層`].length -2 ; j++){
          for (let k = j+1; k < obj[`${i+1}層`].length - 1; k++) {
                if (sameOrNot(obj[`${i+1}層`][j], obj[`${i+1}層`][k]) === true) {
                    pFlatten[k].alpha = pFlatten[j].alpha;
                }
             }
        }
        
        
        //デバグ用
        console.log('ダッシュ飛ばし処理前状態');
        for (const i in obj){
          console.log(i,'............');
          let acc = 1;
          for (const j of obj[i]){
            console.log('[第',acc,'ブロック]');
            for (const k of j){
              console.log(JSON.stringify(k));
            }
            acc ++;
          }
        }

        //A'を消してもA''が残るなどを整える
        const alphaAndIndex = {};
        pFlatten.forEach((item,itemI) => {
            if (item.type === 'subs' && ! item.alpha in alphaAndIndex){
                alphaAndIndex[item.alpha] = [itemI];
            } else if (item.type === 'subs' && item.alpha in alphaAndIndex) {
                alphaAndIndex[item.alpha].push(itemI);
            }
        });
        const alphaCount = {};
        for (const key in alphaAndIndex) {
            const planeA = key.split("'")[0];
            if (! planeA in alphaCount){
                alphaCount[planeA] = 0;
            } else if (key.includes("'")){
                if ((key.split("'").length - 1) - alphaCount[planeA] > 1){
                    const gap = key.split("'").length - 1 - alphaCount[planeA] - 1;
                    let newAlpha = key;
                    for (let j = 0; j < gap; j++){
                        newAlpha = newAlpha.replace("'", "");
                    }
                    alphaAndIndex[newAlpha] = alphaAndIndex[key];
                    delete alphaAndIndex[key];
                    alphaCount[planeA] ++;
                }
            }
        }

        //pFlattenの修正
        pFlatten.forEach((item,itemI) => {
            for (const j in alphaAndIndex) {
                if (alphaAndIndex[j].includes(itemI)){
                    pFlatten[itemI].alpha = j;
                }
            }
        });

        //pFlattenの復元
        const restored = [];
        let index = 0;
        lengthForRestore.forEach((item) => {
            restored.push(pFlatten.slice(index, index + item));
            index += item;
        });
        obj[`${i}層`] = restored;

        //デバグ用
        console.log('ダッシュ飛ばし処理後状態(result)');
        for (const i in obj){
          console.log(i,'............');
          let acc = 1;
          for (const j of obj[i]){
            console.log('[第',acc,'ブロック]');
            for (const k of j){
              console.log(JSON.stringify(k));
            }
            acc ++;
          }
        }
    }
    console.log('\n【removeBottomDash関数_END_________________________________】');
  }


  function getLayerBk(bkInc, whole, forChord = false) {
    console.log("-----------【getLayerBk関数 開始】----------------");
    const mainObj = {};
    const lastAlpha = ["default"];
    const dashMaxObj = {
      A: 0,
      B: 0,
      C: 0,
      D: 0,
      E: 0,
      F: 0,
      G: 0,
      H: 0,
      I: 0,
      J: 0,
      K: 0,
      L: 0,
      M: 0,
      N: 0,
      O: 0,
      P: 0,
      Q: 0,
      R: 0,
      S: 0,
      T: 0,
      U: 0,
      V: 0,
      W: 0,
      X: 0,
      Y: 0,
      Z: 0,
    };
    

    //第一層の打点を定義
    const firstSubs = forChord === false ? getRandomRythm(bkInc, whole, true) : getRandomRythm(bkInc, whole, true, false, false, true);
    //第1層の形式を取得
    const firstKeishiki = simpleKeishiki(firstSubs.amount, lastAlpha);

    //アルファベットに反復があるなら1/2でダッシュ化
    let alphaCount = {};
    for (const item of firstKeishiki) {
      alphaCount[item] = (alphaCount[item] || 0) + 1;
    }
    if (Object.values(alphaCount).some((a) => a > 1) && Math.random() > 0.5) {
      dash(firstKeishiki, dashMaxObj);
    }

    const putRestInFirstSubs = putRest(
      firstSubs.location,
      firstSubs.increment,
      whole
    );
    firstSubs.location = [...putRestInFirstSubs];

    //mainObjに第一層を定義
    mainObj["1層"] = [[]];
    let iForKeishiki = 0; //rest部分によりsubsとkeishikiはインデックスがズレるため形式専用i
    firstSubs.location.forEach((item) => {
      if (Number.isInteger(item)) {
        mainObj["1層"][0].push({
          type: "subs",
          location: item,
          increment: firstSubs.increment, //incrementをそのまま格納するので12(5)なども入る
          alpha: firstKeishiki[iForKeishiki],
          tenkai: false,
        });
        iForKeishiki += 1;
      } else {
        mainObj["1層"][0].push({
          type: "rest",
          location: Math.trunc(item),
          increment: firstSubs.increment
        });
      }
    });
    //デバグ用
    console.log("\n【1層result】");
    for (const i of mainObj["1層"]) {
      for (const j of i) {
        console.log(JSON.stringify(j));
      }
    }
    
    //1層で終わる可能性を確保(実部が2つ以上かつ形式に反復がある場合。それ以外はあわよくば下層で反復、最悪反復なし)
    let keishikiRepeat = false;
    if (new Set(firstKeishiki).size !== firstKeishiki.length) keishikiRepeat = true;
    if (firstSubs.amount > 1 && keishikiRepeat === true && Math.random() < 0.5) {
      //末端ダッシュを取り除く
      removeBottomDash(mainObj);
      console.log("-----------【getLayerBk関数 第１層で終了】----------------");
      return mainObj;
    }  

    //第二層以降をループで作る
    let pLayer = 1; //parentLayer

    while (true) {
      //階層に対応
      console.log('\n【',pLayer + 1, "層", "処理】----------------------------");
      mainObj[`${pLayer + 1}層`] = [];

      //各初期化
      lastAlpha[0] = "default";
      for (const i in dashMaxObj) {
        dashMaxObj[i] = 0;
      }
      const exElement = {};
      let tenkaiFlag = false;

      //親ブロック(配列)に対応
      mainObj[`${pLayer}層`].forEach((block, blockIndex) => {
        //親ブロック内各要素(オブジェクト)に対応
        block.forEach((elem, elemIndex) => {
          console.log("\n【第",blockIndex + 1,"ブロック,","第",elemIndex + 1,"要素】");
          //上層引き継ぎ要素の場合
          if (elem.type === "=") {
            console.log("対象=", "=上層(引き継ぎのみ)");
            const copy = [structuredClone(elem)]; //念の為クローン
            mainObj[`${pLayer + 1}層`].push(copy);
          }
          //休符の場合
          else if (elem.type === "rest") {
            console.log("対象=", "rest(引き継ぎのみ)");
            const copy = [structuredClone(elem)]; //念の為クローン
            mainObj[`${pLayer + 1}層`].push(copy);
          }
          //実部の場合
          else {
            //既出要素の場合
            if (elem.alpha in exElement) {
              console.log("対象=", "subs(既出, 参照のみ)", elem.alpha);
              if (exElement[elem.alpha][0].type !== '=') mainObj[`${pLayer}層`][blockIndex][elemIndex].tenkai = true;

              //locationの調整
              const firstLocation = exElement[elem.alpha][0].location;
              console.log('firstLocation=',firstLocation);
              let locationGap;
              if (exElement[elem.alpha][0].type === '=') {
                locationGap = elem.location - firstLocation;
              } else {
                const parenNum = Number(exElement[elem.alpha][0].increment.match(/\(([^)]+)\)/)?.[1] || 0);
                locationGap = elem.location - firstLocation + parenNum;
              }  
              console.log('locationGap=',locationGap);
              const copy = structuredClone(exElement[elem.alpha]);
              for (let i = 0; i < copy.length; i++){
                copy[i].location += locationGap;
              }
              if (copy[0].type === '=') {
                copy[0].parentAddress[1] = blockIndex;
                copy[0].parentAddress[2] = elemIndex;
              }

              mainObj[`${pLayer + 1}層`].push(copy);
              console.log('push内容=',JSON.stringify(copy));
            }
            //新要素なら
            else {
              //新アルファベットの場合
              if (!elem.alpha.includes("'")) {
                console.log("対象=", "subs(新アルファ)", elem.alpha);

                //親音価が6(-4)で子音価が3(-2)ならずらし分が6を超えてしまうような場合は有効音価から除外する(かっこ内数値合算 >= 親音価絶対値)
                //↑やはりシンプルに親が(-4)なら子はその半分未満とする
                const filterdIncrements = bkInc.filter((item) => {
                  if (elem.increment.includes('(')) {
                    const parenNum1 = Number(elem.increment.match(/\(([^)]+)\)/)?.[1] || 0);
                    const parenNum2 = Number(item.match(/\(([^)]+)\)/)?.[1] || 0);
                    //const addition = Math.abs(parenNum1 + parenNum2);
                    //const baseN = parseInt(elem.increment,10);
                    //return addition <= baseN;
                    return Math.abs(parenNum2) < Math.abs(parenNum1) / 2;
                  } else {
                    return true;
                  }
                });
                console.log('filterdIncrements=',JSON.stringify(filterdIncrements));

                //有効Incrementの最小音価*2を定義。カッコ内も考慮する(後ろずらしのみ換算)。4(2)→10、4(-2)→8
                const rooms = [];
                if (filterdIncrements) {
                  filterdIncrements.forEach((item) => {
                    const numA = parseInt(item,10);
                    const numB = Number(item.match(/\(([^)]+)\)/)?.[1] || 0);
                    if (numB >= 0) {
                      const doubled = numA * 2 + numB;
                      rooms.push(doubled);
                    }else { //numBがマイナス値なら
                      const doubled = numA * 2;
                      rooms.push(doubled);
                    }  
                  });
                } else {
                  rooms.push(100); //必ず展開できない値
                }
                const minRoom = Math.min(...rooms);
                console.log('minRoom=',minRoom);

                //minRoomが分割有効な長さなら1/2ほどで展開する
                if (
                  parseInt(elem.increment, 10) >= minRoom &&
                  Math.random() < 0.5
                ) {
                  console.log('展開あり');
                  tenkaiFlag = true;
                  mainObj[`${pLayer}層`][blockIndex][elemIndex].tenkai = true;
                  const subs = forChord === false ? getRandomRythm(filterdIncrements,parseInt(elem.increment, 10),true) : getRandomRythm(filterdIncrements,parseInt(elem.increment, 10),true, false, false, true);
                  const keishiki = simpleKeishiki(subs.amount, lastAlpha);
                  //アルファベットに反復があるなら1/2でダッシュ化
                  let alphaCount = {};
                  for (const item of keishiki) {
                    alphaCount[item] = (alphaCount[item] || 0) + 1;
                  }
                  if (
                    Object.values(alphaCount).some((a) => a > 1) &&
                    Math.random() > 0.5
                  ) {
                    dash(keishiki, dashMaxObj);
                  }
                  //休符を挿入
                  const putRestInSubs = putRest(
                    subs.location,
                    subs.increment,
                    parseInt(elem.increment, 10)
                  );
                  subs.location = [...putRestInSubs];

                  //locationの調整
                  for (let i = 0; i < subs.location.length; i++){
                    if (subs.location[i] - Math.trunc(subs.location[i]) === 0){
                      subs.location[i] += elem.location - 1;
                    } else {
                      const dicimai = Math.abs(subs.location[i] * 10 - Math.trunc(subs.location[i]) * 10 ) / 10;
                      if (Math.trunc(subs.location[i]) + elem.location - 1 >= 0) {
                        subs.location[i] = Math.trunc(subs.location[i]) + elem.location - 1 + dicimai;
                      } else {
                        subs.location[i] = Math.trunc(subs.location[i]) + elem.location - 1 - dicimai;
                      }
                      
                    }
                  }

                  console.log("subs.location=", JSON.stringify(subs.location));
                  console.log("keishiki=", JSON.stringify(keishiki));

                  //mainobjに追加する
                  const tempoArr = [];
                  let iForKeishiki = 0; //rest部分によりsubsとkeishikiはインデックスがズレるため形式専用i
                  subs.location.forEach((item) => {
                    if (Number.isInteger(item)) {
                      tempoArr.push({
                        type: "subs",
                        location: item,
                        increment: subs.increment, //incrementをそのまま格納するので12(5)なども入る
                        alpha: keishiki[iForKeishiki],
                        tenkai: false,
                      });
                      iForKeishiki ++;
                    } else {
                      tempoArr.push({
                        type: "rest",
                        location: Math.trunc(item),
                        increment: subs.increment,
                      });
                    }
                  });
                  mainObj[`${pLayer + 1}層`].push(structuredClone(tempoArr));
                  exElement[elem.alpha] = structuredClone(tempoArr);
                  console.log('push内容=',JSON.stringify(tempoArr));

                  /*デバグ用
                  console.log("\n【第",blockIndex + 1,"ブロック,","第",elemIndex + 1,"要素】展開結果=");
                  for (let i = 0; i < tempoArr.length; i++) {
                    console.log(JSON.stringify(tempoArr[i]));
                  }
                  */


                } else {
                  //新アルファを展開しないなら
                  console.log("展開なし");
                  const tempoArr = [
                    {
                      type: "=",
                      location: elem.location,
                      increment: elem.increment,
                      parentAddress: [pLayer,blockIndex,elemIndex], //type=のみ参照すべき親要素の所在を残しておく(要素展開の際必要)
                      alpha: `${pLayer}_${elem.alpha}`
                    },
                  ];
                  mainObj[`${pLayer + 1}層`].push(structuredClone(tempoArr));
                  exElement[elem.alpha] = structuredClone(tempoArr);
                }
              } else {
                //新ダッシュなら
                console.log("対象=", "subs(新ダッシュ)", elem.alpha);
                if (exElement[elem.alpha[0]][0].type !== '=') { //素のアルファが展開されているか(例え最下層ダッシュを認めても、部屋的A'(一部要素変更)では素のアルファの展開が必要)
                  //ダッシュを数えてA'’ならAとA'を参照としてA'関数に渡す
                  const dashCount = elem.alpha.split("'").length - 1;
                  const reference = {};
                  let alphaCopy = elem.alpha;
                  for (let i = 0; i < dashCount; i++){
                    alphaCopy = alphaCopy.replace(/'$/,"");
                    reference[alphaCopy] = structuredClone(exElement[alphaCopy]);
                  }
                  const tempoArr = aDash(reference, lastAlpha, dashMaxObj);
                  mainObj[`${pLayer}層`][blockIndex][elemIndex].tenkai = true;

                  //locationの調整
                  const firstLocation = tempoArr[0].location;
                  console.log('firstLocation=',firstLocation);
                  const parenNum = Number(tempoArr[0].increment.match(/\(([^)]+)\)/)?.[1] || 0);
                  const locationGap = elem.location - firstLocation + parenNum;
                  console.log('locationGap=',locationGap);
                  for (let i = 0; i < tempoArr.length; i++){
                    tempoArr[i].location += locationGap;
                  }
                  mainObj[`${pLayer + 1}層`].push(structuredClone(tempoArr));
                  exElement[elem.alpha] = structuredClone(tempoArr);
                  console.log('push内容=',JSON.stringify(tempoArr));
                }
                else { //素のアルファが展開されていないなら
                  console.log('元アルファが展開されていないので展開なし(引き継ぎのみ)');
                  const initAlpha = elem.alpha.split("'")[0];
                  mainObj[`${pLayer}層`][blockIndex][elemIndex].alpha = initAlpha;
                  const tempoArr = [
                    {
                      type: "=",
                      location: elem.location,
                      increment: elem.increment,
                      parentAddress: [pLayer,blockIndex,elemIndex], //type=のみ参照すべき親要素の所在を残しておく(要素展開の際必要)
                      alpha: `${pLayer}_${initAlpha}`
                    },
                  ];
                  mainObj[`${pLayer + 1}層`].push(structuredClone(tempoArr));
                  exElement[elem.alpha] = structuredClone(tempoArr);
                }
              }
            }
          }
        });
      });
      //デバグ用
      console.log('\n【exElement】=');
      for (const i in exElement){
        console.log('【', i, '】');
        for (const j of exElement[i]){
          console.log(JSON.stringify(j));
        }
      }
      //デバグ用
      console.log("\n【", pLayer+1, "層result】");
      mainObj[`${pLayer+1}層`].forEach((item, i) => {
        console.log('【第',i + 1,'ブロック】');
        for (const j of item) {
          console.log(JSON.stringify(j));
        }
      });

      //次の階層へ移行するかの処理
      if (tenkaiFlag === true){
        if (randomChoice(Array.from({length:pLayer+1}, (_,i) => i)) === 0){
          console.log(`第${pLayer+1}層で全体終了します-------------------`);
          pLayer ++; //最後の処理でplayerを揃えるため++
          break;
        }
        else {
          pLayer ++;
          continue;
        }
      }
      //ひとつも展開されなかったら
      else {
        for (let i = 0; i < mainObj[`${pLayer}層`].length; i++){
          for (let j = 0; j < mainObj[`${pLayer}層`][i].length; j++){
            if (mainObj[`${pLayer}層`][i][j].tenkai) {
              mainObj[`${pLayer}層`][i][j].tenkai = false;
            } 
          }
        }
        delete mainObj[`${pLayer+1}層`];
        console.log(`展開がなかったので第${pLayer}層で全体終了します------------------`);
        break;
      }
    }//while end
    
    //末端ダッシュを取り除く
    removeBottomDash(mainObj);

    //デバグ用
    console.log('\n【layerBk結果】');
    for (const i in mainObj){
      console.log(i,'............');
      let acc = 1;
      for (const j of mainObj[i]){
        console.log('[第',acc,'ブロック]');
        for (const k of j){
          console.log(JSON.stringify(k));
        }
        acc ++;
      }
    }


    console.log('【getLayerBk関数_END_________________________________】');
   
    return mainObj;
  }


  function getLayerBkRythm (obj, rythmInc, whole) {
    console.log('\n【getLayerBkRythm関数_START_________________________________】');
    const copyObj = structuredClone(obj);
    const bL = parseInt(Object.keys(copyObj).at(-1)); //bottomLayer
    console.log('最下層 =',bL );

    //まずは最下要素を平坦な配列に整理(eachIはそれらを辿れる情報[層,ブロック,インデックス])
    const bLFlatten = [];
    const eachI = [];
    copyObj[`${bL}層`].forEach((blck,blckI) => {
      blck.forEach((elm,elmI) => {
        if (elm.type === '='){
          bLFlatten.push(elm);
          eachI.push(elm.parentAddress);          
        } else { //subsとrest
          bLFlatten.push(elm);
          eachI.push([bL,blckI,elmI]); 
        }
      });
    });
    console.log('最下要素平坦化=',JSON.stringify(bLFlatten));
    console.log('最下要素各所在=',JSON.stringify(eachI));
  
    //各アルファに初期値としての最大前後範囲を規定する。ダッシュ要素の範囲取り分は素アルファと共通とする
    const oneBar = parseInt(hyoushi, 10) * minimum;
    const elemPossession = {};
    bLFlatten.forEach((item) => {
      if (item.type !== 'rest') {
        const inc = parseInt(item.increment, 10);
        const planeAlpha = item.alpha.split("'")[0]; //素のアルファを抜き出す。1-A'なども対応
        if (!Object.keys(elemPossession).includes(planeAlpha)) {
          elemPossession[planeAlpha] = [inc-1,inc-1,1,item.increment,[]]; //前初期値、後初期値、要素数、インクリメント,打点arr(前後統合))
        }
        else {
          elemPossession[planeAlpha][2] ++;
        }
      }
    });
    console.log('elemPossession初期値=',JSON.stringify(elemPossession));

    //アルファ種(素とそのダッシュ)ごとにBLFlattenを繰り返し辿り隙間を列挙
    //手前幅なら最小値を選ぶ(そうでないと手前要素の頭を飲み込む)。後ろ幅は個数で優位な隙間があるならそれ。同数なら小さい方を選ぶ。6,6,4なら6。6,4なら4
    //基本的に現要素のインデックスを0として、「0のlocation」 - 「-1のlocation」-1で前の隙間「+1のlocation」 - 「0のlocation」-1で後の隙間がわかる
    //追い越しで隠れる要素は、追い越す要素がないとした状態で隙間を決める
    //追い越しの都合により、手前・後ろ要素は都度whileで手前ならn>・後ろならn<の中から最も近いlocationの要素を探す
    Object.keys(elemPossession).forEach((alpha) => {
      const FAcc = []; //当該アルファごと手前隙間をここに列挙
      const LAcc = []; //当該アルファごと後ろ隙間をここに列挙
      bLFlatten.forEach((elm,elmI) => {
        if (elm.alpha?.split("'")[0] === alpha){
          if (elmI === 0){ //最初の要素なら
            //手前の処理
            //最初の手前幅はinc-1にする。ただし手前小節頭以前にならないように
            const start = elm.location - (parseInt(elm.increment,10) - 1) < 1 - oneBar? 1 - oneBar : elm.location - (parseInt(elm.increment,10) - 1) ; 
            const former = elm.location - start; //(startが-1されているので-1不要)
            FAcc.push(former);
            //後ろ処理
            let minimumLocation = 1000;
            let targetI;
            for (let i = elmI + 1; i < bLFlatten.length; i++){
              if (bLFlatten[i].location > elm.location && bLFlatten[i].location < minimumLocation ){
                minimumLocation = bLFlatten[i].location;
                targetI = i;
              }
            }
            const latter = bLFlatten[targetI].location - elm.location - 1;
            LAcc.push(latter);
          } else if (elmI === bLFlatten.length - 1) { //最後の要素なら
            //手前処理
            let targetI;
            for (let i = elmI - 1; i >= 0; i--){
              if (bLFlatten[i].location < elm.location){
                targetI = i;
                break;
              }
            }
            const former = elm.location - bLFlatten[targetI].location - 1;
            FAcc.push(former);
            //後ろ処理
            const latter = parseInt(elm.increment,10) - 1; //最後の要素にはinc-1の長さを認める
            LAcc.push(latter);
          } else { //最初と最後以外
            //手前処理
            let targetIF;
            for (let i = elmI - 1; i >= 0; i--){
              if (bLFlatten[i].location < elm.location){
                 targetIF = i;
                 break;
              }
            }
            const former = elm.location - bLFlatten[targetIF].location - 1;
            FAcc.push(former);
            //後ろ処理
            let minimumLocation = 1000;
            let targetIL;
            for (let i = elmI + 1; i < bLFlatten.length; i++){
              if (bLFlatten[i].location > elm.location && bLFlatten[i].location < minimumLocation ){
                minimumLocation = bLFlatten[i].location;
                targetIL = i;
              }
            }
            const latter = bLFlatten[targetIL].location - elm.location - 1;
            LAcc.push(latter);
          }
        }
      });
      console.log('FAcc=',JSON.stringify(FAcc));
      console.log('LAcc=',JSON.stringify(LAcc));
      

      //FAccの選定
      //Fは手前要素を飲み込むため手前要素の始点を追い越すことはできない。最小値にとどめておく必要がある
      const minimumFAcc = Math.min(...FAcc) < 1 ? 0 : Math.min(...FAcc);
      elemPossession[alpha][0] = minimumFAcc;


      //LAccの選定(new)
      const countsForLAcc = new Map();
      let maxCountForLAcc = 0;
      for (const num of LAcc) {
        const newCount = (countsForLAcc.get(num) || 0) + 1;
        countsForLAcc.set(num, newCount);
        if (newCount > maxCountForLAcc) {
          maxCountForLAcc = newCount;
        }
      }
      const leadersForLAcc = [];
      for (const [num, count] of countsForLAcc) {
        if (count === maxCountForLAcc) {
          leadersForLAcc.push(num);
        }
      }
      if (leadersForLAcc.length === 1) { //リーダー(数的に優位な幅)が一つならそれ
        elemPossession[alpha][1] = leadersForLAcc[0] > 0 ? leadersForLAcc[0] : 0;
      } else { //リーダー(数的に優位な幅)が同数タイなら小さい方。ただし0は極力避ける(降順に並べて手前からたどり1以上なら選出)
        leadersForLAcc.sort((a,b) => b - a); 
        let gotLeader = false; 
        leadersForLAcc.forEach((leader) => {
            if (leader > 0) {
                elemPossession[alpha][1] = leader;
                gotLeader === true;
            }
        });
        if (gotLeader === false) elemPossession[alpha][1] = 0;
      }  
    });  
    console.log('elemPossession取り分決定前=',JSON.stringify(elemPossession));

    //展開順(多い順)を決める
    //展開の有無を先に決めなくとも、全て処理は通して前後展開なしなら隙間に変化はないだけで他の処理に影響しない
    const elemPossessionEntries = Object.entries(elemPossession);
    elemPossessionEntries.sort((a, b) => a[1][2] - b[1][2]);
    //得た順のアルファベットのみの配列
    const alphaOder = elemPossessionEntries.map((item) => {
      return item[0];
    });
    console.log('alphaOder=',JSON.stringify(alphaOder));

    //順に取り分を決め打点を決めていく
    const minInc = Math.min(...rythmInc.map(item => parseInt(item,10))); //最小inc(numA)
    console.log('minInc*2-1=',minInc * 2 - 1);
   
    alphaOder.forEach((alp,alpI) => {
      console.log('対象alpha=',alp);
      console.log('elemPossession[alp][0]=',elemPossession[alp][0]);
      console.log('elemPossession[alp][1]=',elemPossession[alp][1]);
      //前展開のみ、後ろ展開のみ、両方、展開なしを決める(最小incが2なら出力には少なくとも元打点+3マス必要。最小inc*2-1)
      let howToApply;
      if (elemPossession[alp][0] >= minInc * 2 - 1 && elemPossession[alp][1] < minInc * 2 - 1) { //後ろに隙間がないとき
        howToApply = '前のみ';
 
      } else if (elemPossession[alp][0] < minInc * 2 - 1 && elemPossession[alp][1] >= minInc * 2 - 1) { //前に隙間がないとき
        howToApply = '後のみ';

      } else if (elemPossession[alp][0] < minInc * 2 - 1 && elemPossession[alp][1] < minInc * 2 - 1) { //前後両方隙間がないとき
        howToApply = '展開なし';
      } else { //前後両方に隙間があるとき
        howToApply = randomChoice(['前のみ','後のみ','前後両方']);
      }
      console.log(alp,'展開方向=',howToApply);

      //実際の取り分を決める
      if (howToApply === '前後両方') {
        //前→後, 後→前、両方の処理を一から書く。大部分は重複するがコードとして安全のため
        //もし前後どちらかが取り分を全て奪ってしまったら片方はなしとする。実質前のみ・後ろのみと同じ
        let eitherFlag = false; //どちらかが埋まった場合のフラッグ
        const FLorLF = randomChoice(['FL','LF']); //前後順番を決める
        console.log('決める順番=',FLorLF);
        if (FLorLF === 'FL') { //前→後の処理  

          //手前隙間の自由出力
          const FshareOp = [];
          for (let i = minInc * 2 - 1; i <= elemPossession[alp][0]; i++){
            FshareOp.push(i);
          }
          const Fshare = FshareOp.length > 0 ? randomChoice(FshareOp) : 0;
          elemPossession[alp][0] = Fshare;
          console.log(alp,'手前取り分=',Fshare);
       
          //手前取り分による影響処理走査
          bLFlatten.forEach((elm,elmI) => {
            if (elm.type === 'subs' && elm.alpha.startsWith(alp) && elmI !== 0) {
              //対象の検索
              let maxLocation = 0;
              let targetIF = elmI - 1;
              for (let i = elmI - 1; i >= 0; i--){
                if (bLFlatten[i].location < elm.location && bLFlatten[i].location > maxLocation){
                  maxLocation = bLFlatten[i].location;
                  targetIF = i;
                }
              }
              //対象がrestなら取り分の重複はないのでsubsか＝の場合のみ問題になる
              if (bLFlatten[targetIF].type !== 'rest') {
                const maxF = elm.location - bLFlatten[targetIF].location - 1; //互いの実際の隙間
                const targetPlaneAlpha = bLFlatten[targetIF].alpha.split("'")[0];
                if (maxF - Fshare < elemPossession[targetPlaneAlpha][1]) {
                  elemPossession[targetPlaneAlpha][1] = maxF - Fshare;
                }
              }
            }
          });
          console.log('手前影響処理後elemPossession=',JSON.stringify(elemPossession));


          //後ろ取り分の決定(手前の影響で後ろが0になっていたらスキップ)
          if (elemPossession[alp][1] >= minInc * 2 - 1) {
            const LshareOp = [];
            for (let i = minInc * 2 - 1; i <= elemPossession[alp][1]; i++){
              LshareOp.push(i);
            }
            //順番最後の要素なら取れるだけ取る
            let Lshare;
            if (alpI === alphaOder.length - 1) { //最後なら
              Lshare = LshareOp.length > 0 ? Math.max(...LshareOp) : 0;
            } else { //最後以外
              Lshare = LshareOp.length > 0 ? randomChoice(LshareOp) : 0;
            }
            elemPossession[alp][1] = Lshare;
            console.log(alp,'後ろ取り分=',Lshare);

            //後ろ取り分による影響処理走査
            bLFlatten.forEach((elm,elmI) => {
              if (elm.type === 'subs' && elm.alpha.startsWith(alp) && elmI !== bLFlatten.length-1) {
                //対象の検索
                let minLocation = 100;
                let targetIL = elmI + 1;
                for (let i = elmI + 1; i < bLFlatten.length; i++){
                  if (bLFlatten[i].location > elm.location && bLFlatten[i].location < minLocation){
                    minLocation = bLFlatten[i].location;
                    targetIL = i;
                  }
                }
                //対象がrestなら取り分の重複はないのでsubsか＝の場合のみ問題になる
                if (bLFlatten[targetIL].type !== 'rest') {
                  const maxL = bLFlatten[targetIL].location - elm.location - 1; //互いの実際の隙間
                  const targetPlaneAlpha = bLFlatten[targetIL].alpha.split("'")[0];
                  if (maxL - Lshare < elemPossession[targetPlaneAlpha][0]) {
                    elemPossession[targetPlaneAlpha][0] = maxL - Lshare;
                  }
                }
              }
            });
          } else {
            eitherFlag = true;
            elemPossession[alp][1] = 0;
            console.log('前がほぼ取ったため',alp,'後ろ取り分は0');
          }

        
        } else { //L→Fの場合

          //後ろ隙間の出力
          const LshareOp = [];
          for (let i = minInc * 2 - 1; i <= elemPossession[alp][1]; i++){
            LshareOp.push(i);
          }
          const Lshare = LshareOp.length > 0 ? randomChoice(LshareOp) : 0;
          elemPossession[alp][1] = Lshare;
          console.log(alp,'後ろ取り分=',Lshare);
       
          //後ろ取り分による影響処理走査
          bLFlatten.forEach((elm,elmI) => {
            if (elm.type === 'subs' && elm.alpha.startsWith(alp) && elmI !== bLFlatten.length - 1) {
              //対象の検索
              let minLocation = 100;
              let targetIL = elmI + 1;
              for (let i = elmI + 1; i < bLFlatten.length; i++){
                if (bLFlatten[i].location > elm.location && bLFlatten[i].location < minLocation){
                  minLocation = bLFlatten[i].location;
                  targetIL = i;
                }
              }
              //対象がrestなら取り分の重複はないのでsubsか＝の場合のみ問題になる
              if (bLFlatten[targetIL].type !== 'rest') {
                const maxL = bLFlatten[targetIL].location - elm.location - 1; //互いの実際の隙間
                const targetPlaneAlpha = bLFlatten[targetIL].alpha.split("'")[0];
                if (maxL - Lshare < elemPossession[targetPlaneAlpha][0]) {
                  elemPossession[targetPlaneAlpha][0] = maxL - Lshare;
                }
              }
            }
          });
          console.log('後ろ影響処理後elemPossession=',JSON.stringify(elemPossession));

          //手前取り分の決定(後ろの影響で後ろが0になっていたらスキップ)
          if (elemPossession[alp][0] >= minInc * 2 - 1) {
            const FshareOp = [];
            for (let i = minInc * 2 - 1; i <= elemPossession[alp][0]; i++){
              FshareOp.push(i);
            }
            //順番最後の要素なら取れるだけ取る
            let Fshare;
            if (alpI === alphaOder.length - 1) { //最後なら
              Fshare = FshareOp.length > 0 ? Math.max(FshareOp) : 0;
            } else { //最後以外
              Fshare = FshareOp.length > 0 ? randomChoice(FshareOp) : 0;
            }
            elemPossession[alp][0] = Fshare;
            console.log(alp,'手前取り分=',Fshare);

            //手前取り分による影響処理走査
            bLFlatten.forEach((elm,elmI) => {
              if (elm.type === 'subs' && elm.alpha.startsWith(alp) && elmI !== 0) {
                //対象の検索
                let maxLocation = 0;
                let targetIF = elmI - 1;
                for (let i = elmI - 1; i >= 0; i--){
                  if (bLFlatten[i].location < elm.location && bLFlatten[i].location > maxLocation){
                    maxLocation = bLFlatten[i].location;
                    targetIF = i;
                  }
                }
                //対象がrestなら取り分の重複はないのでsubsか＝の場合のみ問題になる
                if (bLFlatten[targetIF].type !== 'rest') {
                  const maxF = elm.location - bLFlatten[targetIF].location - 1; //互いの実際の隙間
                  const targetPlaneAlpha = bLFlatten[targetIF].alpha.split("'")[0];
                  if (maxF - Fshare < elemPossession[targetPlaneAlpha][1]) {
                    elemPossession[targetPlaneAlpha][1] = maxF - Fshare;
                  }
                }
              }
            });
          } else {
            eitherFlag = true;
            elemPossession[alp][0] = 0;
            console.log('後ろがほぼ取ったため',alp,'手前取り分は0');
          }
        }

        //確定した取り分にリズムを出力する。順番はどちらからでもいいので前から
        if (elemPossession[alp][0] >= minInc * 2 - 1) { //有効な取り分があるか確認
          //親incに応じてインクリメントを選別
          const incForFormer = rythmInc.filter((item) => {
            const numA = parseInt(item, 10);
            const numB = Number(item.match(/\(([^)]+)\)/)?.[1]) || 0;
            if (numB >= 0) {
              if (numA * 2 + numB <= parseInt(elemPossession[alp][3],10)) {
                return true;
              } else {
                return false;
              }
            } else { //numBがマイナス値なら
              return false;
            }  
          })
          //(追記:不要)自身のinc(numA)で反復できないものは除いた。最後に自身のnumAを追加する(自身が3(+1)ならそのノリの可能性を残す)
          //incForFormer.push(String(parseInt(elemPossession[alp][3],10)));
          console.log('incForFormer=',JSON.stringify(incForFormer));
          //起点から後ろに続くリズムを出力し、反転する
          const rythmF = eitherFlag === false ? getRandomRythm(incForFormer, elemPossession[alp][0] + 1, false).location : getRandomRythm(incForFormer, elemPossession[alp][0] + 1, false, false, true).location;
          //if (layerBkRythmRepeatIsChecked === true) repeatA(rythmF, incForFormer, elemPossession[alp][0] + 1);
          console.log('前リズム反転前=',JSON.stringify(rythmF));
          const rythmFReversed = rythmF.map(item => {
            const integer = Math.trunc(item);
            const dicimal = (item * 10 - integer * 10 ) / 10; //小数の乱れを避けるため10倍で計算
            const reversedInteger = integer - ((integer - 1) * 2);
            if (dicimal === 0) {
              return reversedInteger;
            } else {
              return reversedInteger >= 0 ? reversedInteger + dicimal : reversedInteger - dicimal;
            }
          })
          elemPossession[alp][4].push(...rythmFReversed);
          console.log('前リズム反転後=',JSON.stringify(rythmFReversed));
        }

        //後ろのリズムを出力する
        if (elemPossession[alp][1] >= minInc * 2 - 1) { //有効な取り分があるか確認
          //親incに応じてインクリメントを選別
          const incForLatter = rythmInc.filter((item) => {
            const numA = parseInt(item, 10);
            const numB = Number(item.match(/\(([^)]+)\)/)?.[1]) || 0;
            if (numB >= 0) {
              if (numA * 2 + numB <= parseInt(elemPossession[alp][3],10)) {
                return true;
              } else {
                return false;
              }
            } else { //numBがマイナス値なら
              return false;
            }  
          })
          //(追記:不要)自身のinc(numA)で反復できないものは除いた。最後に自身のnumAを追加する(自身が3(+1)ならそのノリの可能性を残す)
          //incForLatter.push(String(parseInt(elemPossession[alp][3],10)));
          console.log('incForLatter=',JSON.stringify(incForLatter));
          //起点から後ろに続くリズムを出力
          const rythmL = eitherFlag === false ? getRandomRythm(incForLatter, elemPossession[alp][1] + 1, false).location : getRandomRythm(incForLatter, elemPossession[alp][1] + 1, false, false, true).location;
          //if (layerBkRythmRepeatIsChecked === true) repeatA(rythmL, incForLatter, elemPossession[alp][1] + 1);
          elemPossession[alp][4].push(...rythmL);
          console.log('後リズム=',JSON.stringify(rythmL));
        }
        const removeSameNum = [...new Set(elemPossession[alp][4])]; //重複を取り除いた配列
        removeSameNum.sort((a,b) => a - b); //昇順ソート
        
        //同音反復を付与
        if (layerBkRythmRepeatIsChecked === true) repeatA(removeSameNum, rythmInc, elemPossession[alp][1] + 1);
        
        /*暫定不要/反転で同音反復が手前にする可能性があるので除外する
        while (true) {
          if (Math.abs(removeSameNum[0] * 10 - Math.trunc(removeSameNum[0]) * 10) === 2) {
            removeSameNum.splice(0,1);
          } else {
            break;
          }  
        }

        //最初の打点から最後の打点の隙間にsustainを表すn.3を挿入する
        //取り分の最初、最後のあまりは無視する。どうせプロットすれば隙間にはsustainが入るため
        //処理の都合でまずremoveSameNumを全てMath.truncする
        const removeSameNumFloor = removeSameNum.map(n => Math.trunc(n));
        for (let i = removeSameNumFloor[0]; i < removeSameNumFloor[removeSameNumFloor.length-1]; i++){
          if (! removeSameNumFloor.includes(i)) {
            const i03 = i < 0 ? i - 0.3 : i + 0.3;  
            removeSameNum.push(i03);
          }
        }
        */


        removeSameNum.sort((a,b) => a - b); //昇順ソート
        elemPossession[alp][4] = removeSameNum; //要素打点の完成
        elemPossession[alp][4].sort((a,b) => a - b); //昇順ソート
        console.log('前後リズム統合=',JSON.stringify(removeSameNum));



      } else if (howToApply === '前のみ') {
        //手前隙間へ自由出力
        const FshareOp = [];
        for (let i = minInc * 2 - 1; i <= elemPossession[alp][0]; i++){
          FshareOp.push(i);
        }
        //順番最後の要素なら取れるだけ取る
        let Fshare;
        if (alpI === alphaOder.length - 1) { //最後なら
          Fshare = FshareOp.length > 0 ? Math.max(...FshareOp) : 0;
        } else { //最後以外
          Fshare = FshareOp.length > 0 ? randomChoice(FshareOp) : 0;
        }
        elemPossession[alp][0] = Fshare;
        console.log(alp,'手前取り分=',Fshare);
     
        //手前取り分による影響処理走査
        bLFlatten.forEach((elm,elmI) => {
          if (elm.type === 'subs' && elm.alpha.startsWith(alp) && elmI !== 0) {
            //対象の検索
            let maxLocation = 0;
            let targetIF = elmI - 1;
            for (let i = elmI - 1; i >= 0; i--){
              if (bLFlatten[i].location < elm.location && bLFlatten[i].location > maxLocation){
                maxLocation = bLFlatten[i].location;
                targetIF = i;
              }
            }
            //対象がrestなら取り分の重複はないのでsubsか＝の場合のみ問題になる
            if (bLFlatten[targetIF].type !== 'rest') {
              const maxF = elm.location - bLFlatten[targetIF].location - 1; //互いの実際の隙間
              const targetPlaneAlpha = bLFlatten[targetIF].alpha.split("'")[0];
              if (maxF - Fshare < elemPossession[targetPlaneAlpha][1]) {
                elemPossession[targetPlaneAlpha][1] = maxF - Fshare;
              }
            }
          }
        });
        //確定した取り分にリズムを出力する
        if (elemPossession[alp][0] >= minInc * 2 - 1) { //有効な取り分があるか確認
          //親incに応じてインクリメントを選別
          const incForFormer = rythmInc.filter((item) => {
            const numA = parseInt(item, 10);
            const numB = Number(item.match(/\(([^)]+)\)/)?.[1]) || 0;
            if (numB >= 0) {
              if (numA * 2 + numB <= parseInt(elemPossession[alp][3],10)) {
                return true;
              } else {
                return false;
              }
            } else { //numBがマイナス値なら
              return false;
            }  
          })
          //(追記:不要)自身のinc(numA)で反復できないものは除いた。最後に自身のnumAを追加する(自身が3(+1)ならそのノリの可能性を残す)
          //incForFormer.push(String(parseInt(elemPossession[alp][3],10)));
          console.log('incForFormer=',JSON.stringify(incForFormer));
          //起点から後ろに続くリズムを出力し、反転する
          const rythmF = getRandomRythm(incForFormer, elemPossession[alp][0] + 1, false, false, true).location;
          console.log('前リズム反転前=',JSON.stringify(rythmF));
          const rythmFReversed = rythmF.map(item => {
            const integer = Math.trunc(item);
            const dicimal = (item * 10 - integer * 10 ) / 10; //小数の乱れを避けるため10倍で計算
            const reversedInteger = integer - ((integer - 1) * 2);
            if (dicimal === 0) {
              return reversedInteger;
            } else {
              return reversedInteger >= 0 ? reversedInteger + dicimal : reversedInteger - dicimal;
            }
          })

          /*暫定不要
          if (rythmFReversed.includes(1)) { //1を取り除く
            const iOf1 = rythmFReversed.indexOf(1);
            rythmFReversed.splice(iOf1,1);
          }
          

          //反転で同音反復が手前にくる可能性があるので除外する
          while (true) {
            if (Math.abs(rythmFReversed[0] * 10 - Math.trunc(rythmFReversed[0]) * 10) === 2) {
              rythmFReversed.splice(0,1);
            } else {
              break;
            }  
          }
          */

          //最初の打点から最後の打点の隙間にsustainを表すn.3を挿入する
          //取り分の最初、最後のあまりは無視する。どうせプロットすれば隙間にはsustainが入るため
          //処理の都合でまずremoveSameNumを全てMath.truncする
          //const rythmFReversedFloor = rythmFReversed.map(n => Math.trunc(n));
          //for (let i = rythmFReversedFloor[0]; i < rythmFReversedFloor[rythmFReversedFloor.length-1]; i++){
            //if (! rythmFReversedFloor.includes(i)) {
              //const i03 = i < 0 ? i - 0.3 : i + 0.3;  
              //rythmFReversed.push(i03);
            //}
          //}
          rythmFReversed.sort((a,b) => a - b); //昇順ソート
          if (layerBkRythmRepeatIsChecked === true) repeatA(rythmFReversed, rythmInc, 1);//前のみなら最後のlocationは基点の1
          elemPossession[alp][4].push(...rythmFReversed);
          elemPossession[alp][4].sort((a,b) => a - b); //昇順ソート
          console.log('前リズム反転後=',JSON.stringify(rythmFReversed));
        } 

      } else if (howToApply === '後のみ') {
        //後ろ隙間へ自由出力
        const LshareOp = [];
        for (let i = minInc * 2 - 1; i <= elemPossession[alp][1]; i++){
          LshareOp.push(i);
        }

        //順番最後の要素なら取れるだけ取る
        let Lshare;
        if (alpI === alphaOder.length - 1) { //最後なら
          Lshare = LshareOp.length > 0 ? Math.max(...LshareOp) : 0;
        } else { //最後以外
          Lshare = LshareOp.length > 0 ? randomChoice(LshareOp) : 0;
        }
        elemPossession[alp][1] = Lshare;
        console.log(alp,'後ろ取り分=',Lshare);

        //後ろ取り分による影響処理走査
        bLFlatten.forEach((elm,elmI) => {
          if (elm.type === 'subs' && elm.alpha.startsWith(alp) && elmI !== bLFlatten.length - 1) {
            //対象の検索
            let minLocation = 100;
            let targetIL = elmI + 1;
            for (let i = elmI + 1; i < bLFlatten.length; i++){
              if (bLFlatten[i].location > elm.location && bLFlatten[i].location < minLocation){
                minLocation = bLFlatten[i].location;
                targetIL = i;
              }
            }
            //対象がrestなら取り分の重複はないのでsubsか＝の場合のみ問題になる
            if (bLFlatten[targetIL].type !== 'rest') {
              const maxL = bLFlatten[targetIL].location - elm.location - 1; //互いの実際の隙間
              const targetPlaneAlpha = bLFlatten[targetIL].alpha.split("'")[0];
              if (maxL - Lshare < elemPossession[targetPlaneAlpha][0]) {
                elemPossession[targetPlaneAlpha][0] = maxL - Lshare;
              }
            }
          }
        });
        //後ろのリズムを出力する
        if (elemPossession[alp][1] >= minInc * 2 - 1) { //有効な取り分があるか確認
          //親incに応じてインクリメントを選別
          const incForLatter = rythmInc.filter((item) => {
            const numA = parseInt(item, 10);
            const numB = Number(item.match(/\(([^)]+)\)/)?.[1]) || 0;
            if (numB >= 0) {
              if (numA * 2 + numB <= parseInt(elemPossession[alp][3],10)) {
                return true;
              } else {
                return false;
              }
            } else { //numBがマイナス値なら
              return false;
            }  
          })
          //自身のinc(numA)で反復できないものは除いた。最後に自身のnumAを追加する(自身が3(+1)ならそのノリの可能性を残す)
          incForLatter.push(String(parseInt(elemPossession[alp][3],10)));
          console.log('incForLatter=',JSON.stringify(incForLatter));
          //起点から後ろに続くリズムを出力
          const rythmL = getRandomRythm(incForLatter, elemPossession[alp][1] + 1, false, false, true).location;
          
          /*暫定不要
          if (rythmL.includes(1)) { //1を取り除く
            const iOf1 = rythmL.indexOf(1);
            rythmL.splice(iOf1,1);
          }
          
          //最初の打点から最後の打点の隙間にsustainを表すn.3を挿入する
          //取り分の最初、最後のあまりは無視する。どうせプロットすれば隙間にはsustainが入るため
          //処理の都合でまずremoveSameNumを全てMath.truncする
          //const rythmLFloor = rythmL.map(n => Math.trunc(n));
          //for (let i = rythmLFloor[0]; i < rythmLFloor[rythmLFloor.length-1]; i++){
            //if (! rythmLFloor.includes(i)) {
              //const i03 = i < 0 ? i - 0.3 : i + 0.3;  
              //rythmL.push(i03);
            //}
          //}
          */

          rythmL.sort((a,b) => a - b); //昇順ソート
          if (layerBkRythmRepeatIsChecked === true) repeatA(rythmL, rythmInc, elemPossession[alp][1] + 1);
          elemPossession[alp][4].push(...rythmL);
          elemPossession[alp][4].sort((a,b) => a - b); //昇順ソート
          console.log('後リズム=',JSON.stringify(rythmL));
        }

      } else { //展開なしのとき
        //同音反復だけ出力するかしないか
        if (elemPossession[alp][1] >= minInc * 2 - 1 && Math.random() > 0.5) { //有効な取り分があるか確認
          console.log(alp,'は「展開なしですが同音反復だけします');

          /*暫定不要
          //親incに応じてインクリメントを選別
          const incForLatter = rythmInc.filter((item) => {
            const numA = parseInt(item, 10);
            const numB = Number(item.match(/\(([^)]+)\)/)?.[1]) || 0;
            if (numB >= 0) {
              if (numA * 2 + numB <= parseInt(elemPossession[alp][3],10)) {
                return true;
              } else {
                return false;
              }
            } else { //numBがマイナス値なら
              return false;
            }  
          })
          //自身のinc(numA)で反復できないものは除いた。最後に自身のnumAを追加する(自身が3(+1)ならそのノリの可能性を残す)
          //incForLatter.push(String(parseInt(elemPossession[alp][3],10)));
          console.log('incForLatter=',JSON.stringify(incForLatter));
          */

          const rythmL = [1];
          if (layerBkRythmRepeatIsChecked === true) repeatA(rythmL, rythmInc, elemPossession[alp][1] + 1);
          
          /*暫定不要
          if (rythmL.includes(1)) { //1を取り除く
            const iOf1 = rythmL.indexOf(1);
            rythmL.splice(iOf1,1);
          }
          rythmL.sort((a,b) => a - b); //昇順ソート
          //最初の打点から最後の打点の隙間にsustainを表すn.3を挿入する
          //取り分の最初、最後のあまりは無視する。どうせプロットすれば隙間にはsustainが入るため
          //処理の都合でまずremoveSameNumを全てMath.truncする
          //const rythmLFloor = rythmL.map(n => Math.trunc(n));
          //for (let i = rythmLFloor[0]; i < rythmLFloor[rythmLFloor.length-1]; i++){
            //if (! rythmLFloor.includes(i)) {
              //const i03 = i < 0 ? i - 0.3 : i + 0.3;  
              //rythmL.push(i03);
            //}
          //}
          */

          rythmL.sort((a,b) => a - b); //昇順ソート
          elemPossession[alp][4].push(...rythmL);
          elemPossession[alp][4].sort((a,b) => a - b); //昇順ソート
          console.log('展開なし、同音反復のみ結果=',JSON.stringify(rythmL));
        } else {
          console.log(alp,'は「展開なしです');
          elemPossession[alp][4].push(1);
        }
      }
    });  //alphaOder.forEach end

    //elemPossessionの各point配列の隙間にn.3を充填する
    //取り分の最初、最後のあまりは無視する。どうせプロットすれば隙間にはsustainが入るため
    Object.keys(elemPossession).forEach((key) => {
      const arrTrunc = elemPossession[key][4].map(n => Math.trunc(n)); //一旦整数に
      for (let i = arrTrunc[0]; i < arrTrunc[arrTrunc.length-1]; i++){
        if (! arrTrunc.includes(i)) {
          const i03 = i < 0 ? i - 0.3 : i + 0.3;  
          elemPossession[key][4].push(i03);
        } 
      }
      elemPossession[key][4].sort((a,b) => a - b);
    });

    console.log('elemPossession結果=',JSON.stringify(elemPossession));

    //実際のresultのオブジェクトに打点配列(起点を1とした)を付与
    bLFlatten.forEach((item,i) => {
      const [layer, block, elem] = eachI[i];
      console.log('layer=',layer,'block=',block,'elem=',elem);
      if (item.type !== 'rest') {
        console.log('item.alpha=',item.alpha);
        const keyAlpha = item.alpha.split("'")[0];
        copyObj[`${layer}層`][block][elem].point =  structuredClone(elemPossession[keyAlpha][4]);
      } 
    });

    
    //(旧案)実際のresultのオブジェクトに打点配列(起点を1とした)を付与
    //eachI.forEach(([layer, block, elem]) => {
      //if (copyObj[`${layer}層`][block][elem].type !== 'rest') {
        //const extractedAlpha = copyObj[`${layer}層`][block][elem].alpha.split("'")[0];
        //copyObj[`${layer}層`][block][elem].point =  structuredClone(elemPossession[extractedAlpha]?.[4]);
      //}  
    //});
    

    //実際の打点の配列をこの段階で作っておく(bLFlattenが都合がいいため)
    //まずBLFlattenから追い越される要素を除く
    const bLFlattenUnipue = bLFlatten.filter((elem, elemI) => {
      let overlapFlag = false; 
      const now = elem.location;
      for (let i = elemI + 1; i < bLFlatten.length; i++){
        if (bLFlatten[i].location <= now) {
          overlapFlag = true;
        }
      }
      return overlapFlag === false? true : false;
    })
    console.log('bLFlattenUnipue=',JSON.stringify(bLFlattenUnipue));

    //通し番号を定義。マイナスからか1からか
    let firstLocation = 1;
    for (let i = 1; i <= bL ; i++){
      if (copyObj[`${i}層`][0][0].type === 'subs' && copyObj[`${i}層`][0][0].point){
        const v = copyObj[`${i}層`][0][0].location + copyObj[`${i}層`][0][0].point[0] - 1;
        if (v < firstLocation) firstLocation = v;
      } else { //打点列を持たない上層subsか休符か＝なら(=なら必ずその前にその元subsのマイナスlocationが得られているので良い)
        const v = copyObj[`${i}層`][0][0].location;
        if (v < firstLocation) firstLocation = v; 
      }
    }
    console.log('firstLocation =',firstLocation );
    const start = firstLocation > 0 ? 1 : 1 - (parseInt(hyoushi, 10) * minimum);
    const end = whole;
    console.log('start=', start);
    console.log('end=',end);

    //sustainで埋め尽くした全マスをMapで用意。そうすれば打点と休符をプロットするだけでシンプルになる
    const realPointMap = new Map();
    for (let i = start; i <= end; i++){
      realPointMap.set(i,'sustain');
    }
    
    //各打点と休符をプロットしていく
    console.log('【notesプロット開始】');
    bLFlattenUnipue.forEach((elem, elemI) => {
      console.log('対象要素=',JSON.stringify(elem));
      if (elem.type !== 'rest') { //subsか=ならその要素(=なら親要素)に与えた[-2,-1.2,0,1.3,2]などの打点配列をたどり実際のlocationに直してプロットする
        //console.log('要素はsubsまたは=です');
        const extractedAlpha = elem.alpha.split("'")[0];
        //console.log('extractedAlpha=',extractedAlpha);
        //console.log('参照point=',JSON.stringify(elemPossession[extractedAlpha][4]));
        elemPossession[extractedAlpha][4].forEach((p) => {
          const absP = Math.abs(p);
          const decimalPart = Math.round(absP * 10) % 10;
          //console.log('point=',p);
          if (decimalPart === 0) { //整数、通常打点なら
            //console.log('対象はn.',p * 10 - Math.trunc(p) * 10,'正味打点です');
            if (p < 1) { //former
              if (realPointMap.has(elem.location + p - 1)) realPointMap.set(elem.location + p - 1, 'former');
              //console.log(elem.location + p - 1,'にformerをsetしました');
            } else if (p === 1) { //起点
              if (realPointMap.has(elem.location + p - 1)) realPointMap.set(elem.location + p - 1, 'note');
              //console.log(elem.location + p - 1,'にnoteをsetしました');
            } else { //latter
              //console.log(elem.location + p - 1,'にlatterをsetしました');
              if (realPointMap.has(elem.location + p - 1)) realPointMap.set(elem.location + p - 1, 'latter');
            }
          } else if (decimalPart === 2) { //n.2、同音反復なら
            //console.log('対象はn.',Math.abs(p * 10 - Math.trunc(p) * 10),'同音反復です');
            if (realPointMap.has(elem.location + Math.trunc(p) - 1)) realPointMap.set(elem.location + Math.trunc(p) - 1, 'repeat');
          } else { //n.3、sustainなら
            //console.log('対象はn.',Math.abs(p * 10 - Math.trunc(p) * 10),'sustainです');
            if (realPointMap.has(elem.location + Math.trunc(p) - 1)) realPointMap.set(elem.location + Math.trunc(p) - 1, 'sustain');
          }
        });

        

      } else { //type = restなら次の要素までをrestで埋める
        //console.log('要素はrestです');
        const nextElemLocation = bLFlattenUnipue[elemI + 1] !== undefined ? bLFlattenUnipue[elemI + 1].location : end + 1;
        for (let i = elem.location; i < nextElemLocation; i++){
          //console.log(i,'にrestをsetしました');
          realPointMap.set(i, 'rest');
        }
      }
    });
    const result = {'obj': copyObj, 'notes': [...realPointMap.values()]}

    //デバグ用
    console.log('\n【layerBkRythm結果】');
    for (const i in copyObj){
      console.log(i,'層............');
      let acc = 1;
      for (const j of copyObj[i]){
        console.log('[第',acc,'ブロック]');
        for (const k of j){
          console.log(JSON.stringify(k));
        }
        acc ++;
      }
    }
    console.log('notes結果=',JSON.stringify(result.notes));
    console.log('notes個数=',result.notes.length);

    return result;
  }


  //getLayerBkRythmをもとにコード用に改変。大部分は不要な流れだがひとまずこれで
  function getLayerBkRythmForChord (obj, rythmInc, whole) {
    console.log('\n【getLayerBkRythmForChord関数_START_________________________________】');
    const copyObj = structuredClone(obj);
    const bL = parseInt(Object.keys(copyObj).at(-1)); //bottomLayer
    console.log('最下層 =',bL );

    //まずは最下要素を平坦な配列に整理(eachIはそれらを辿れる情報[層,ブロック,インデックス])
    const bLFlatten = [];
    const eachI = [];
    copyObj[`${bL}層`].forEach((blck,blckI) => {
      blck.forEach((elm,elmI) => {
        if (elm.type === '='){
          bLFlatten.push(elm);
          eachI.push(elm.parentAddress);          
        } else { //subsとrest
          bLFlatten.push(elm);
          eachI.push([bL,blckI,elmI]); 
        }
      });
    });
    console.log('最下要素平坦化=',JSON.stringify(bLFlatten));
    console.log('最下要素各所在=',JSON.stringify(eachI));
  
    //各アルファに初期値としての最大前後範囲を規定する。ダッシュ要素の範囲取り分は素アルファと共通とする
    const oneBar = parseInt(hyoushi, 10) * minimum;
    const elemPossession = {};
    bLFlatten.forEach((item) => {
      if (item.type !== 'rest') {
        const inc = parseInt(item.increment, 10);
        const planeAlpha = item.alpha.split("'")[0]; //素のアルファを抜き出す。1-A'なども対応
        if (!Object.keys(elemPossession).includes(planeAlpha)) {
          elemPossession[planeAlpha] = [inc-1,inc-1,1,item.increment,[]]; //前初期値、後初期値、要素数、インクリメント,打点arr(前後統合))
        }
        else {
          elemPossession[planeAlpha][2] ++;
        }
      }
    });
    console.log('elemPossession初期値=',JSON.stringify(elemPossession));

    //コードの場合、incrementに自由出力して終わり
    Object.keys(elemPossession).forEach((alp) => {
        const rythm = getRandomRythm(rythmInc, elemPossession[alp][3], false, true, true).location;
        elemPossession[alp][4] = [...rythm];
    });


    //elemPossessionの各point配列の隙間にn.3を充填する
    //取り分の最初、最後のあまりは無視する。どうせプロットすれば隙間にはsustainが入るため
    Object.keys(elemPossession).forEach((key) => {
      const arrTrunc = elemPossession[key][4].map(n => Math.trunc(n)); //一旦整数に
      for (let i = arrTrunc[0]; i < arrTrunc[arrTrunc.length-1]; i++){
        if (! arrTrunc.includes(i)) {
          const i03 = i < 0 ? i - 0.3 : i + 0.3;  
          elemPossession[key][4].push(i03);
        } 
      }
      elemPossession[key][4].sort((a,b) => a - b);
    });

    console.log('elemPossession結果=',JSON.stringify(elemPossession));

    //実際のresultのオブジェクトに打点配列(起点を1とした)を付与
    bLFlatten.forEach((item,i) => {
      const [layer, block, elem] = eachI[i];
      console.log('layer=',layer,'block=',block,'elem=',elem);
      if (item.type !== 'rest') {
        console.log('item.alpha=',item.alpha);
        const keyAlpha = item.alpha.split("'")[0];
        copyObj[`${layer}層`][block][elem].point =  structuredClone(elemPossession[keyAlpha][4]);
      } 
    });

    
    //(旧案)実際のresultのオブジェクトに打点配列(起点を1とした)を付与
    //eachI.forEach(([layer, block, elem]) => {
      //if (copyObj[`${layer}層`][block][elem].type !== 'rest') {
        //const extractedAlpha = copyObj[`${layer}層`][block][elem].alpha.split("'")[0];
        //copyObj[`${layer}層`][block][elem].point =  structuredClone(elemPossession[extractedAlpha]?.[4]);
      //}  
    //});
    

    //実際の打点の配列をこの段階で作っておく(bLFlattenが都合がいいため)
    //まずBLFlattenから追い越される要素を除く
    const bLFlattenUnipue = bLFlatten.filter((elem, elemI) => {
      let overlapFlag = false; 
      const now = elem.location;
      for (let i = elemI + 1; i < bLFlatten.length; i++){
        if (bLFlatten[i].location <= now) {
          overlapFlag = true;
        }
      }
      return overlapFlag === false? true : false;
    })
    console.log('bLFlattenUnipue=',JSON.stringify(bLFlattenUnipue));

    //通し番号を定義。マイナスからか1からか
    let firstLocation = 1;
    for (let i = 1; i <= bL ; i++){
      if (copyObj[`${i}層`][0][0].type === 'subs' && copyObj[`${i}層`][0][0].point){
        const v = copyObj[`${i}層`][0][0].location + copyObj[`${i}層`][0][0].point[0] - 1;
        if (v < firstLocation) firstLocation = v;
      } else { //打点列を持たない上層subsか休符か＝なら(=なら必ずその前にその元subsのマイナスlocationが得られているので良い)
        const v = copyObj[`${i}層`][0][0].location;
        if (v < firstLocation) firstLocation = v; 
      }
    }
    console.log('firstLocation =',firstLocation );
    const start = firstLocation > 0 ? 1 : 1 - (parseInt(hyoushi, 10) * minimum);
    const end = whole;
    console.log('start=', start);
    console.log('end=',end);

    //sustainで埋め尽くした全マスをMapで用意。そうすれば打点と休符をプロットするだけでシンプルになる
    const realPointMap = new Map();
    for (let i = start; i <= end; i++){
      realPointMap.set(i,'sustain');
    }
    
    //各打点と休符をプロットしていく
    console.log('【notesプロット開始】');
    bLFlattenUnipue.forEach((elem, elemI) => {
      console.log('対象要素=',JSON.stringify(elem));
      if (elem.type !== 'rest') { //subsか=ならその要素(=なら親要素)に与えた[-2,-1.2,0,1.3,2]などの打点配列をたどり実際のlocationに直してプロットする
        console.log('要素はsubsまたは=です');
        const extractedAlpha = elem.alpha.split("'")[0];
        console.log('extractedAlpha=',extractedAlpha);
        console.log('参照point=',JSON.stringify(elemPossession[extractedAlpha][4]));
        elemPossession[extractedAlpha][4].forEach((p) => {
          const absP = Math.abs(p);
          const decimalPart = Math.round(absP * 10) % 10;
          console.log('point=',p);
          if (decimalPart === 0) { //整数、通常打点なら
            console.log('対象はn.',p * 10 - Math.trunc(p) * 10,'正味打点です');
            if (p < 1) { //former
              if (realPointMap.has(elem.location + p - 1)) realPointMap.set(elem.location + p - 1, 'former');
              console.log(elem.location + p - 1,'にformerをsetしました');
            } else if (p === 1) { //起点
              if (realPointMap.has(elem.location + p - 1)) realPointMap.set(elem.location + p - 1, 'note');
              console.log(elem.location + p - 1,'にnoteをsetしました');
            } else { //latter
              console.log(elem.location + p - 1,'にlatterをsetしました');
              if (realPointMap.has(elem.location + p - 1)) realPointMap.set(elem.location + p - 1, 'latter');
            }
          } else if (decimalPart === 2) { //n.2、同音反復なら
            console.log('対象はn.',Math.abs(p * 10 - Math.trunc(p) * 10),'同音反復です');
            if (realPointMap.has(elem.location + Math.trunc(p) - 1)) realPointMap.set(elem.location + Math.trunc(p) - 1, 'repeat');
          } else { //n.3、sustainなら
            console.log('対象はn.',Math.abs(p * 10 - Math.trunc(p) * 10),'sustainです');
            if (realPointMap.has(elem.location + Math.trunc(p) - 1)) realPointMap.set(elem.location + Math.trunc(p) - 1, 'sustain');
          }
        });

        

      } else { //type = restなら次の要素までをrestで埋める
        console.log('要素はrestです');
        const nextElemLocation = bLFlattenUnipue[elemI + 1] !== undefined ? bLFlattenUnipue[elemI + 1].location : end + 1;
        for (let i = elem.location; i < nextElemLocation; i++){
          console.log(i,'にrestをsetしました');
          realPointMap.set(i, 'rest');
        }
      }
    });
    const result = {'obj': copyObj, 'notes': [...realPointMap.values()]}

    //デバグ用
    console.log('\n【layerBkRythmForChord結果】_____________________');
    for (const i in copyObj){
      console.log(i,'層............');
      let acc = 1;
      for (const j of copyObj[i]){
        console.log('[第',acc,'ブロック]');
        for (const k of j){
          console.log(JSON.stringify(k));
        }
        acc ++;
      }
    }
    console.log('notes結果=',JSON.stringify(result.notes));
    console.log('notes個数=',result.notes.length);

    return result;
  }

  //音高の形式を付与する。引数のオブジェクトを直接操作
  function addToneKeishiki(obj){
    console.log('\n【addToneKeishiki関数_START_________________________________】');


    const bL = parseInt(Object.keys(obj).at(-1)); //bottomLayer

    //まずは最下要素を平坦な配列に整理
    //eachIはそれらを辿れる情報[層,ブロック,インデックス]
    const bLFlatten = [];
    const eachI = [];
    obj[`${bL}層`].forEach((blck,blckI) => {
      blck.forEach((elm,elmI) => {
        if (elm.type === '='){
          bLFlatten.push(elm);
          eachI.push(elm.parentAddress);          
        } else { //subsとrest
          bLFlatten.push(elm);
          eachI.push([bL,blckI,elmI]); 
        }
      });
    });
    
    //各アルファを数える
    const alphaCount = {};
    bLFlatten.forEach((elm) => {
        if (elm.type !== 'rest') {
            if (! alphaCount[elm.alpha]){
                alphaCount[elm.alpha] = {'amount': 1, 'toneAlpha': []};
            } else {
                alphaCount[elm.alpha]['amount'] += 1;
            }
        }
    });

    
    //音高用形式を得る
    const dashMaxObjForTone = {
      A: 0,
      B: 0,
      C: 0,
      D: 0,
      E: 0,
      F: 0,
      G: 0,
      H: 0,
      I: 0,
      J: 0,
      K: 0,
      L: 0,
      M: 0,
      N: 0,
      O: 0,
      P: 0,
      Q: 0,
      R: 0,
      S: 0,
      T: 0,
      U: 0,
      V: 0,
      W: 0,
      X: 0,
      Y: 0,
      Z: 0,
    };
    for (const alp in alphaCount) {
        const k = simpleKeishiki(alphaCount[alp]['amount'],['default']);
        const d = dash(k,dashMaxObjForTone);
        //小文字に変換(一発の組み込み関数あり)
        const lowercased = k.map(item => item.toLowerCase());  
        alphaCount[alp]['toneAlpha'].push(...lowercased);
    }

    console.log('alphaCount=');
    for (const item in alphaCount) {
        console.log(item);
        console.log(JSON.stringify(alphaCount[item]));
    }

    //アルファごとにbLFlattenをたどりalphaを差し替えていく
    for (const alp in alphaCount) {
        let alpOder = 0;
        bLFlatten.forEach((elm, elmI) => {
            if (elm.alpha === alp) {
                obj[`${eachI[elmI][0]}層`] [eachI[elmI][1]] [eachI[elmI][2]].alpha += alphaCount[alp]['toneAlpha'][alpOder];
                alpOder ++;
            }
        });
    }

    console.log('\n【addToneKeishiki関数_END_________________________________】');




  }

  
  function layerBk(forChord = false) {
    console.log('【layerBk関数start__________________________________】');

    const bkInc = forChord === false ? availableLayerBkIncrement : availableLayerBkForChordIncrement; 
    const rythmInc = forChord === false ? availableLayerBkRythmIncrement : availableChordIncrement; 
    const wholeStr = forChord === false ? layerBkWhole : chordWhole;
    const whole = wholeStr.includes('bar') ? Number(barToNum[`${hyoushi},${minimum},${wholeStr}`]) : Number(wholeStr); 

    console.log('bkInc=',JSON.stringify(bkInc));
    console.log('rythmInc=',JSON.stringify(rythmInc));
    console.log('wholeStr=',wholeStr);  
    console.log('whole=',whole);

    //具体リズム音価の最小値で反復できない形式音価を除く
    let requiredBkLength; 
    rythmInc.forEach((item) => {
      const numA = parseInt(item,10);
      const numB = Number(item.match(/\(([^)]+)\)/)?.[1] || 0);
      if (numB >= 0) {
        const doubled = numA * 2 + numB;
        if (requiredBkLength) {
          if (doubled < requiredBkLength) requiredBkLength = doubled;
        } else {
          requiredBkLength = doubled;
        }
      } else { //numBがマイナス値なら
        const doubled = numA * 2;
        if (requiredBkLength) {
          if (doubled < requiredBkLength) requiredBkLength = doubled;
        } else {
          requiredBkLength = doubled;
        }
      }  
    });
    const bkIncFilterd = bkInc.filter((item) => {
      return parseInt(item,10) >= requiredBkLength;
    });
    console.log('requiredBkLength=',requiredBkLength);
    console.log('bkIncFilterd=',JSON.stringify(bkIncFilterd));
    
    //階層的部分形式を得る
    const objA = forChord === false ? getLayerBk(bkIncFilterd, whole) : getLayerBk(bkIncFilterd, whole, true);
    //各要素のリズムを得る
    const objB = forChord === false ? getLayerBkRythm(objA, rythmInc, whole) : getLayerBkRythmForChord(objA, rythmInc, whole);
    //最下層の要素に音高の形式を付与
    addToneKeishiki(objB.obj);

    const obj = objB.obj;

    //bkが何層か定義
    let bottomLayer = 1;
    Object.keys(obj).forEach((key) => {
      if (parseInt(key,10) > bottomLayer) bottomLayer = parseInt(key,10);
    });
    console.log('bottomLayer=',bottomLayer);
    console.log('第一要素=',JSON.stringify(obj['1層'][0][0]));

    //通し番号を定義。マイナスからか1からか
    let firstLocation = 1;
    for (let i = 1; i <= bottomLayer ; i++){
      if (obj[`${i}層`][0][0].type === 'subs' && obj[`${i}層`][0][0].point){
        const v = obj[`${i}層`][0][0].location + obj[`${i}層`][0][0].point[0] - 1;
        if (v < firstLocation) firstLocation = v;
      } else { //打点列を持たない上層subsか休符か＝なら(=なら必ずその前にその元subsのマイナスlocationが得られているので良い)
        const v = obj[`${i}層`][0][0].location;
        if (v < firstLocation) firstLocation = v; 
      }
    }
    console.log('firstLocation =',firstLocation );
    const start = firstLocation > 0 ? 1 : 1 - (parseInt(hyoushi, 10) * minimum);
    const end = whole;
    console.log('start=', start);
    console.log('end=',end);

    //表示の小節表示の都合でマイナススタートか知りたい
    if (start < 1) {
      setLayerBkStart0(true);
    } else {
      setLayerBkStart0(false);
    }


    //テキスト表示用のobjを用意(locationを通し番から1小節_12,2小節_3などに)
    const objForDisplay = structuredClone(obj);
    const thre = breakpoint[`${hyoushi},${minimum}`];
    Object.keys(objForDisplay).forEach((l) => {
      objForDisplay[l].forEach((b,bi) => {
        b.forEach((el,eli) => {
          thre.forEach((t,ti) => {
            if (el.location <= t){
              objForDisplay[l][bi][eli].location = `${ti}小節_${objForDisplay[l][bi][eli].location - (parseInt(hyoushi, 10) * minimum) * (ti - 1)}`
            }
          });
        });
      });
    });
    setLayerBkObj(objForDisplay);


    const oneByOneArr = [];

    for (let i = 1; i <= bottomLayer ; i++){ //obj層に対応

      const flat = obj[`${i}層`].flat(); //objのi層を一次元にする
      /*console.log('flat=');
      flat.forEach((item) => {
        console.log(JSON.stringify(item));
      }); 
      */
      let oder = start;
      let flatIndex = 0;
      const pushArr = []; 
      if (i === 1) { //１層なら列番号の行を用意
        const orderArr = [];
        let acc = 1;
        for (let j = start; j <= end; j ++){
          orderArr.push(acc);
          if (acc === parseInt(hyoushi, 10) * minimum) acc = 0;
          acc ++;
        }  
        oneByOneArr.push([...orderArr]);
      }
      while(oder <= end){
        if (flat[flatIndex]){ //最後の要素起点を過ぎたらundefinedになるため確認の分岐
          if (flat[flatIndex].location > oder){ //隙間
            pushArr[oder+ start * -1] = {type: 'space'};
          } else if (flat[flatIndex].location < oder){ //追い越し時(restなら戻る必要はないと考える)
            if (flat[flatIndex].type === 'subs'){
              oder = flat[flatIndex].location;
              pushArr[oder+ start * -1] = {type: 'subs', increment: flat[flatIndex].increment, alpha: flat[flatIndex].alpha + '※'};
            } else if (flat[flatIndex].type === '='){
              oder = flat[flatIndex].location;
              pushArr[oder+ start * -1] = {type: '=', increment: flat[flatIndex].increment,alpha: '※'};
            }
            flatIndex ++;
          } else { //通常一致時
            if (flat[flatIndex].type === 'subs'){
              pushArr[oder+ start * -1] = {type: 'subs', increment: flat[flatIndex].increment, alpha: flat[flatIndex].alpha};
            } else if (flat[flatIndex].type === 'rest'){
              pushArr[oder+ start * -1] = {type: 'rest', increment: flat[flatIndex].increment};
            } else { //'='なら
              pushArr[oder+ start * -1] = {type: '=', increment: flat[flatIndex].increment};
            }
            flatIndex ++;
          }
        } else { //最後の要素起点を過ぎたら(flat[flatIndex]がundefinedなら)
          pushArr[oder+ start * -1] = {type: 'space'};
        }  
        oder ++;
      }
      oneByOneArr.push([...pushArr]);
    } 

    //打点の配列をoneByOneArrにpushする
    oneByOneArr.push([...objB.notes]);

    //デバグ
    console.log('oneByOneArr分割前=');
    oneByOneArr.forEach((item) => {
      console.log(JSON.stringify(item));
    });

 
    //改行すべき長さごとに分割
    const oneByOne = [];
    const oneBar = parseInt(hyoushi,10) * minimum;
    let i = 0;
    while(i < oneByOneArr[0].length){
      const barBlock = [];
      oneByOneArr.forEach((arr) => {
        barBlock.push(arr.slice(i, i + oneBar));
      });
      oneByOne.push([...barBlock]);
      i += oneBar;
    }

    //デバグ
    console.log('【oneByOneArr分割後】=');
    for (let i = 0; i < oneByOne.length; i++){
      console.log('第',i+1,'ブロック=');
      oneByOne[i].forEach((item) => {
        console.log(JSON.stringify(item));
      });  
    }
    if (forChord === false) {
      setLayerBkOneByOne(oneByOne);
    } else {
      setLayerBkForChordOneByOne(oneByOne);
    }  
  }


  //ずらしのアイデアを出力する関数
  function slide () {
    console.log('【ずらし関数start__________________________________】');

    const oneBar = parseInt(hyoushi,10) * minimum;
    const AorAA = randomChoice(['A','AA']);
    const incOp = {
      '4/4': [4,2,1],
      '3/4': [3,1],
      '6/8': [6,3,2],
      '9/8': [9,3]
    };
    const inc = randomChoice(incOp[hyoushi]);
    const option = [];
    const length = AorAA === 'A'? parseInt(hyoushi,10) * 2 : parseInt(hyoushi,10);
    for (let i = 1; i <= length; i += inc){
      option.push(i);
    }
    const amountOp = Array.from({length:option.length}, (_,i) => i + 1);
    const amountW = [];
    let ratio = 0.5;
    amountOp.forEach((item) => {
      const threshold = length / 2;
      if (item <= threshold) {
        amountW.push(1);
      } else {
        amountW.push(1 * ratio);
        ratio * 0.5;
      }
    });
    const amount = weightedChoice(amountOp, amountW);
    const pointSelect = randomSample(option,amount);
    const points = [];
    for (let i = 1; i <= (AorAA === 'A' ? parseInt(hyoushi,10) * 2 : parseInt(hyoushi,10)); i++){
      if (pointSelect.includes(i)) {
        points.push(i);
      } else {
        points.push(null);
      }
    }

    const directionStyle = randomChoice(['統一','個別']);
    const directionForTheSame = randomChoice(['左','右']);
    const direction = [];
    points.forEach((item) => {
      if (item !== null) {
        if (directionStyle === '統一'){
          direction.push(directionForTheSame);
        } else {
          const d = randomChoice(['左','右']);
          direction.push(d);
        }
      } else {
        direction.push(null);
      }  
    });

    const valueStyle = randomChoice(['統一','個別']);
    const valueForTheSame = Number(randomChoice(availableSlideValue));
    const values = [];
    points.forEach((item) => {
      if (item !== null) {
        if (valueStyle === '統一'){
          values.push(valueForTheSame);
        } else {
          const v = Number(randomChoice(availableSlideValue));
          values.push(v);
        }
      } else {
        values.push(null);
      }
    });
    
    const resultPoints = [...points];
    if (AorAA === 'AA') {
      points.forEach((item) => {
        if (item !== null) {
          resultPoints.push(item + parseInt(hyoushi,10));
        } else {
          resultPoints.push(null);
        }
      });
    }
    const resultDirection = AorAA === 'A' ? [...direction] : [...direction,...direction];
    const resultValues = AorAA === 'A' ? [...values] : [...values,...values];

    const result = [];
    resultPoints.forEach((item,itemI) => {
      let str;
      if (item !== null) {
        if (resultDirection[itemI] === '左') {
          str = '-';
        } else {
          str = '+';
        }
        str += String(resultValues[itemI]);
        result.push(str);
      } else {
        result.push(null);
      }
    });

    let firstFlag = false;
    let forwardI;
    const absValue = 1 / minimum;
    const distanceThre = {
      '4/4': 0.5,
      '3/4': 0.5,
      '6/8': 1,
      '9/8': 1
    };
    result.forEach((item,itemI) => {
      if (item !== null) {
        if (firstFlag === false) {
          firstFlag = true;
          forwardI = itemI;
        } else {
          const forwardPoint = forwardI + 1 + (absValue * Number(result[forwardI])); 
          const curentPoint = itemI + 1 + (absValue * Number(item)); 
          if (curentPoint - forwardPoint < distanceThre[hyoushi]) {
            if (Math.random() < 0.5) {
              result[itemI] = null;
            } else {
              result[forwardI] = null;
            } 
          } else {
            forwardI = itemI;
          }
        }
      }  
    });

    setSlideData(result);
    
    console.log('【slide関数結果】___________________________');
    console.log('result=',JSON.stringify(result));
  }

  //旋律線を出力する関数
  //同音反復は含めない。repeatに任せる
  //basePointは部分形式の要素の起点を明示したい時用
  function melodyLine(amount){
    console.log('【melodyLine関数start__________________________________】');

    //打点数に対して音高数を規定し、それを指標として新しい音へ進む確率を規定する
    //音高数の最大は人声の音域(oct+6度の13音)程度にしておく。が、weightsにより実際は10以上はほぼないだろう
    //自由リズムで打点32としても1つのコード区間など小分けに出力するのが実際的
    const formatAmount = amount < 14 ? amount : 13;
    console.log('formatAmount=',formatAmount);
    const toneAmountOption = Array.from({length:formatAmount - 1}, (_,i) => 2+i)
    const toneAmountWeights = [];
    let WeightRate = 0.6; //多い音高数を軽く。仮に音数4として5や6になる可能性はあるので強めに抑えるべき
    for (let i = 2; i <= formatAmount; i++){
      if (i > Math.round(formatAmount ** 0.5) + 1) { //多い打数の抑制。打数4から音数4以上が軽くなる。打数7から音数5以上が軽くなる
        toneAmountWeights.push(1 * WeightRate);
        WeightRate *= 0.6;
      //} else if (amount > 4 && i === 2) { //音数2がやけに多く感じるため下げてみる
        //toneAmountWeights.push(0.5);
      } else {
        toneAmountWeights.push(1);
      }
    }
    const toneAmount = weightedChoice(toneAmountOption,toneAmountWeights);
    let newToneChance = amount - 2 > 0 ? (toneAmount - 2) / (amount - 2): 0;
    console.log('toneAmountOption=',JSON.stringify(toneAmountOption));
    console.log('toneAmountWeights=',JSON.stringify(toneAmountWeights));
    console.log('toneAmount=',toneAmount);
    console.log('newToneChance=',newToneChance);

    //音高数が最大の場合、一直線のパターンを1/2で返して終わる
    if (toneAmount === formatAmount && Math.random() < 0.5){
      if (Math.random() < 0.5) {
        const upPattern = Array.from({length:toneAmount}, (_,i) => i + 1);
        setPitchLevels(upPattern);
        console.log('結果(早期リターン)=',JSON.stringify(upPattern));
        console.log('【melodyLine関数end__________________________________】');
        return;
      } else {
        const downPattern = Array.from({length:toneAmount}, (_,i) => toneAmount - i);
        setPitchLevels(downPattern);
        console.log('結果(早期リターン)=',JSON.stringify(downPattern));
        console.log('【melodyLine関数end__________________________________】');
        return;
      }  
    }

    //折れ線の反転数を決める。これも定数でなく確率
    const maxTurnAmount = amount - 2;
    const minTurnAmount = amount - 2 > 0 ? Math.trunc((amount - 2) / (toneAmount - 1)) : 0;
    const turnAmountOption = Array.from({length:maxTurnAmount - (minTurnAmount - 1)}, (_,i) => minTurnAmount + i);
    const turnAmountWeights = [];
    let WeightRate2 = 0.6; //多い反転数を軽く
    turnAmountOption.forEach((item) => {
      if (item >= Math.round(amount ** 0.5) + 1) { //多い反転数の抑制。基本増えるほど抑えていく。1としても結果は4回折れるなど全然あるので
        turnAmountWeights.push(1 * WeightRate2);
        WeightRate2 *= 0.6;
      } else { 
        turnAmountWeights.push(1);
      }
    });
    const turnAmount = weightedChoice(turnAmountOption,turnAmountWeights);
    let turnChance = amount - 2 > 0 ? turnAmount / (amount - 2) * 0.7 : 1; //0.7は補正。大抵多くなるため
    
    console.log('maxTurnAmount=',maxTurnAmount);
    console.log('minTurnAmount=',minTurnAmount);
    console.log('turnAmountOption=',JSON.stringify(turnAmountOption));
    console.log('turnAmountWeights=',JSON.stringify(turnAmountWeights));
    console.log('turnAmount=',turnAmount);
    console.log('turnChance=',turnChance)

    //結果となる配列
    const pitchLevels = [];
    //音高選択肢
    const pitchs = Array.from({length:toneAmount}, (_,i) => i+1);
    //方向
    let direction = randomChoice(['上','下']);
    console.log('direction初期値=',direction);
    const firstNote = randomChoice(pitchs);
    console.log('firstNote=',firstNote);
    pitchLevels.push(firstNote); //1音目を追加
    const exTone = [firstNote];
    let reap = 0;
    let newToneRemain = toneAmount - 1;
    let turnRemain = turnAmount;

    for (let i = 2; i <= amount; i++){
      console.log('option=',JSON.stringify(pitchs));
      console.log('exTone=',JSON.stringify(exTone));
      const curentTone = pitchLevels[pitchLevels.length-1];
      const curentToneI = pitchs.indexOf(curentTone);
      const optionWeights = []; //選択肢はpitchそのものでいい
      console.log('curentTone=',curentTone);

      //newToneChanceを反映
      pitchs.forEach((item) => {
        if (!exTone.includes(item)) { //newToneなら
          const divideN = pitchs.length - exTone.length;
          optionWeights.push(divideN > 0 ? newToneChance / divideN : 0);
        } else { //既出なら
          if (item === curentTone) {
            optionWeights.push(0);
          } else {
            const divideN = exTone.length - 1;
            optionWeights.push(divideN > 0 ? (1 - newToneChance) / divideN : 0); //-1はcurentToneの分
          }  
        }
      });
      //すべての重みが0になってしまった場合の処置  
      //curentTone以外の選べる音に均等に確率を割り振る
      if (optionWeights.every(w => w === 0)) {
        pitchs.forEach((item, itemI) => {
          if (item !== curentTone) {
            optionWeights[itemI] = 1; 
          }
        });
      }  
      console.log('optionWeightsにnewToneChanceを反映=',JSON.stringify(optionWeights));



      //turnChanceを反映
      if (i > 2) { //2番目はturnがないためこの分岐が必要
        let rower = 0;
        let upper = 0;
        pitchs.forEach((item,itemI) => {
          if (itemI < curentToneI) {
            rower ++;
          }else if (itemI > curentToneI) {
            upper ++;
          }
        });
        pitchs.forEach((item,itemI) => {
          if (direction === '上') {
            if (item < curentTone) { 
              optionWeights[itemI] *= turnChance / (rower > 0 ? rower : 1);
            } else {
              optionWeights[itemI] *= (1 - turnChance) / (upper > 0 ? upper : 1);
            }
          } else { //direction === '下'なら
            if (item > curentTone) { 
              optionWeights[itemI] *= turnChance / (upper > 0 ? upper : 1);
            } else { 
              optionWeights[itemI] *= (1 - turnChance) / (rower > 0 ? rower : 1);
            }
          }
        });
      }
      //すべての重みが0になってしまった場合の処置  
      //curentTone以外の選べる音に均等に確率を割り振る
      if (optionWeights.every(w => w === 0)) {
        pitchs.forEach((item, itemI) => {
          if (item !== curentTone) {
            optionWeights[itemI] = 1; 
          }
        });
      }  
      console.log('optionWeightsにturnChanceを反映=',JSON.stringify(optionWeights));

      //順次進行の重みを反映
      //例えば2→3ときていて2.5をこの後選ぶなら、2→3の順次を損なう点で既存の隣はより重く、新しい隣は少し重くする(両端は手前とは無関係なので既存の隣と同じ扱い)
      //既存の順次：　新しい順次：跳躍を4:3:2にする。新順次は必ず2つあるので3/2で1.5(端は2)をかける。既存順次は2つか1つなので*4か*2。残りは残り数で1を割る
      let stepwiseCount = 0;
      let stepwiseI = [];
      pitchs.forEach((item,itemI) => {
        if (Math.abs(curentToneI - itemI) === 1) { //隣なら
          optionWeights[itemI] *= 2 * (1 + reap);
          stepwiseCount ++;
          stepwiseI.push(itemI);
        }
      });

      //順次でないものに、応じた率を分配
      pitchs.forEach((item,itemI) => {
        if (!stepwiseI.includes(itemI)) { 
          optionWeights[itemI] *= (1 / (pitchs.length - stepwiseCount));
        }
      });
      console.log('stepwiseCount=',stepwiseCount);
      console.log('stepwiseI=',JSON.stringify(stepwiseI));
      console.log('optionWeightsに順次進行を反映==',JSON.stringify(optionWeights));

      //音高出力。美しくないが自身が選ばれたらやり直しで他が出るまで
      const tone = weightedChoice(pitchs,optionWeights);
      console.log('tone=',tone);
       
      //exToneに追加
      if (!exTone.includes(tone)) exTone.push(tone);

      //跳躍ならreapに++
      if (Math.abs(curentTone - tone) > 1.1){  // > 1 でいいが浮動小数を避けるため1.1にしておく
        reap ++;
      } else {
        reap = 0;
      }

      //newToneなら--
      if (!exTone.includes(tone)) {
        newToneRemain --;
      }

      //directionの更新とturnAccの--
      if (tone < curentTone) {
        if (direction === '上') turnRemain --;
        direction = '下';
      }  
      if (tone > curentTone) {
        if (direction === '下') turnRemain --;
        direction = '上';
      }  
      
      //newToneChanceを更新
      if (amount - i > 0 && newToneRemain > 0) {
        newToneChance = newToneRemain / (amount - i) < 1 ? newToneRemain / (amount - i) : 1;
      } else {
        newToneChance = 0;
      }

      //turnChanceを更新
      if (amount - i > 0 && turnRemain > 0) {
        turnChance = turnRemain / (amount - i) < 1 ? turnRemain / (amount - i) * 0.7 : 1;
      } else {
        turnChance = 0.01;
      }

      //結果を追加する
      pitchLevels.push(tone);
      console.log('pitchLevels=',JSON.stringify(pitchLevels));

      console.log('newToneRemain=',newToneRemain);
      console.log('turnRemain=',turnRemain);
      console.log('newToneChance=',newToneChance);
      console.log('turnChance=',turnChance);
    }
    console.log('結果=',JSON.stringify(pitchLevels));
    setPitchLevels(pitchLevels);
    console.log('【melodyLine関数end__________________________________】');
  }



  //表示の「形式を出力する」のための関数。最後のアルファ以降の新要素群を得る
  function keishikiFreeA(){

    console.log('\n【keishikiFreeA関数_START_________________________________】');

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
    const dashMaxObj = {
        A: 0,
        B: 0,
        C: 0,
        D: 0,
        E: 0,
        F: 0,
        G: 0,
        H: 0,
        I: 0,
        J: 0,
        K: 0,
        L: 0,
        M: 0,
        N: 0,
        O: 0,
        P: 0,
        Q: 0,
        R: 0,
        S: 0,
        T: 0,
        U: 0,
        V: 0,
        W: 0,
        X: 0,
        Y: 0,
        Z: 0,
    };

    const crean = (input) => {
        const a = input.normalize('NFKC'); //全角を半角に
        const b = a.toUpperCase(); //大文字に
        const c = b.trim(); //無駄なスペースを除く
        return c
    };

    const startAlp = crean(keishikiStartAlpha);
    console.log('startAlp=',JSON.stringify(startAlp));
    
    let startAlpI = alphabet.indexOf(startAlp);
    console.log('startAlp=',alphabet[startAlpI]);

    const a = [alphabet[startAlpI-1]];
    const alphas = simpleKeishiki(keishikiAmount, a);
    console.log('simpleKeishikiで取得=',JSON.stringify(alphas));
    dash(alphas, dashMaxObj);
    console.log('ダッシュ付与(結果)=',JSON.stringify(alphas));
    setKeishikiA(alphas);
    console.log('\n【keishikiFreeA関数_END_________________________________】');
  }



  //既存の形式アルファを含めた続きの形式を出力するための関数
  //動機、小楽節の展開を想定しているのでせいぜい要素数は4個程度推奨。それ以上は煩雑になりやすいはず
  function keishikiFreeB(){
    console.log('\n【keishikiFreeB関数_START_________________________________】');
    
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
    
    const dashMaxObj = {
        A: 0,
        B: 0,
        C: 0,
        D: 0,
        E: 0,
        F: 0,
        G: 0,
        H: 0,
        I: 0,
        J: 0,
        K: 0,
        L: 0,
        M: 0,
        N: 0,
        O: 0,
        P: 0,
        Q: 0,
        R: 0,
        S: 0,
        T: 0,
        U: 0,
        V: 0,
        W: 0,
        X: 0,
        Y: 0,
        Z: 0,
    };

    const crean = (input) => {
        const a = input.normalize('NFKC'); //全角を半角に
        const b = a.toUpperCase(); //大文字に
        const c = b.split(/[,,\s]+/); //配列に
        const d = c.map(item => item.trim()).filter(item => item.length > 0); //無駄なスペースや空文字を除く
        return d
    };

    const arr = crean(exKeishiki);
    console.log('arr=',JSON.stringify(arr));
    
    let lastAlpI = 0;
    arr.forEach((alp) => {

        if (alphabet.indexOf(alp[0]) > lastAlpI) lastAlpI = alphabet.indexOf(alp[0]);

        if (alp.includes("'")) {
            n = alp.split("'").length - 1;
            if (n > dashMaxObj[alp[0]]) dashMaxObj[alp[0]] = n;
        }
    });
    console.log('lastAlpI開始前=',lastAlpI);
    console.log('dashMaxObj処理開始前=',JSON.stringify(dashMaxObj));

    const elmType = ['new', 'ex', 'newDash'];
    const elmTypeW = [2,2,1];

    const result = [];
    for (let i = 0; i < keishikiAmount; i++){
        const ChosenType = weightedChoice(elmType,elmTypeW);
        if (ChosenType === 'new') {
            result.push(alphabet[lastAlpI+1]);
            arr.push(alphabet[lastAlpI+1])
            lastAlpI ++;
        } else if (ChosenType === 'ex') {
            const chosenEx = randomChoice(arr);
            result.push(chosenEx);
        } else { //'newDash'なら
            const chosenEx = randomChoice(arr);
            const dashAmount = dashMaxObj[chosenEx[0]]+1;
            const dashed = chosenEx[0] + "'".repeat(dashAmount);
            result.push(dashed);
            dashMaxObj[chosenEx[0]] ++;
            arr.push(dashed);
        }
    }

    setKeishikiB(result);
    console.log('結果=',JSON.stringify(result));
    console.log('\n【keishikiFreeB関数_END_________________________________】');
      
  }

  //メロディと伴奏、楽曲の構造の目安を作る。これらの要素を元にオーケストレーションを作る
  function partIdea(){
        
    //１つの伴奏要素の声部数パターン
    const harmonyAmountData = {
        'sustain': {'amount':['1','2','3','4','5','6~'], 'w':[1,1,2,2,1,1]},
        'arpeggio': {'amount':['2','3','4','5','6~'], 'w':[1,1,1,1,1]},
        'rythm1': {'amount':['1','2','3','4','5','6~'], 'w':[2,1,2,2,1,1]},
        'rythm2': {'amount':['3','4','5','6~'], 'w':[1,2,2,1]},
    };

    //伴奏の基本音域パターン(不要かも)
    const backingRangeData = {
        'sustain': {},
        'arpeggio': {},
        'rythm1': {},
        'rythm2': {},
    };
    
    //要素数を決める
    const partAmount = weightedChoice([1,2,3,4,5,6],[2,2,4,4,2,1]);
    
    //結果となるオブジェクト
    const obj = {};
    for (let i = 0; i < partAmount; i++){
        obj[`要素${i+1}`] = {};
    }

    const firstElmType = randomChoice(['旋律','伴奏'],partAmount !== 1 ? [1,1] : [1,4]);
    obj['要素1']['type'] = firstElmType;

    if (firstElmType === '旋律'){
        const range = weightedChoice(['soprano','bass'],[2,1]);
        obj['要素1']['range'] = range;
    } else { //伴奏なら
        const backingType = weightedChoice(['sustain','arpeggio','rythm1','rythm2'],[2,2,1,1]);
        obj['要素1']['backingType'] = backingType;
        const harmonyAmount = weightedChoice(harmonyAmountData[backingType]['amount'],harmonyAmountData[backingType]['w']);
        obj['要素1']['harmonyAmount'] = harmonyAmount;
    }
    
    //第2要素以降を決める
    for (let i = 0; i < partAmount - 1; i++){
        
        const type = randomChoice(['旋律','伴奏'],[1,1]);
        obj[`要素${i+2}`]['type'] = type;
        if (type === '旋律'){
            const rangeOption = ['soprano','alto','tenor','bass'];
            const rangeOptionW = [4,1,1,2];
            for (let j = 0; j < i+1; j++){
                if (obj[`要素${j+1}`]['type'] === '旋律'){
                    const index = rangeOption.indexOf(obj[`要素${j+1}`]['range']);
                    rangeOption.splice(index,1);
                    rangeOptionW.splice(index,1);
                }
            }
            const range = weightedChoice(rangeOption,rangeOptionW);
            obj[`要素${i+2}`]['range'] = range;

        } else { //伴奏なら
            const backingTypeOption = ['sustain','arpeggio','rythm1','rythm2'];
            const backingTypeOptionW = [2,2,1,1];
            for (let j = 0; j < i+1; j++){
                if (obj[`要素${j+1}`]['type'] === '伴奏'){
                    const index = backingTypeOption.indexOf(obj[`要素${j+1}`]['backingType']);
                    backingTypeOptionW[index] *= 0.25;
                }
            }
            const backingType = weightedChoice(backingTypeOption,backingTypeOptionW);
            obj[`要素${i+2}`]['backingType'] = backingType;
            const harmonyAmount = weightedChoice(harmonyAmountData[backingType]['amount'],harmonyAmountData[backingType]['w']);
            obj[`要素${i+2}`]['harmonyAmount'] = harmonyAmount;
        }
    }

    const result = [];
    Object.keys(obj).forEach((elm, elmI) => {
        if (obj[elm]['type'] === '旋律'){
            result.push(`${elm}: 旋律, ${obj[elm]['range']}`);
        } else {
            result.push(`${elm}: 伴奏, ${obj[elm]['backingType']},  voice: ${obj[elm]['harmonyAmount']}`);
        }
    });

    setPartData(result);

  }




  


  


 



  // 2. 描画用の静的パラメータ
  const MLwidth = Math.sqrt(pitchLevels.length) * 80;      // グラフの横幅 (px)
  const MLheight = Math.sqrt(Math.max(...pitchLevels)) * 80;     // グラフの高さ (px)
  const MLpadding = 30;     // 余白 (px)

  const MLminPitch = pitchLevels.length > 0 ? Math.min(...pitchLevels) : 0;
  const MLmaxPitch = pitchLevels.length > 0 ? Math.max(...pitchLevels) : 1;

  // 3. 描画エリアの有効サイズ計算
  const MLdrawWidth = MLwidth - MLpadding * 2;
  const MLdrawHeight = MLheight - MLpadding * 2;

  // 4. 音高からY座標（px）への変換関数
  const getNominalY = (pitch) => {
    const ratio = (pitch - MLminPitch) / (MLmaxPitch - MLminPitch);
    // Y軸は上方向が0になるため反転処理
    return MLheight - MLpadding - (ratio * MLdrawHeight);
  };

  // 5. 背景のグリッド（横線）用に音高一覧を準備 [0, 1, 2, 3, 4, 5]
  const gridPitches = Array.from(
    { length: MLmaxPitch - MLminPitch + 1 },
    (_, i) => MLminPitch + i
  );

  // 6. 各打点の(X, Y)座標リストを計算
  const calculatedPoints = pitchLevels.map((pitch, index) => {
    // X座標: 配列要素数に応じて等間隔に配置
    const x = MLpadding + (index / (pitchLevels.length - 1)) * MLdrawWidth;
    const y = getNominalY(pitch);
    return { x, y, pitch, index };
  });

   //7. <polyline> に渡す文字列フォーマット "x1,y1 x2,y2 ..." に変換
  const polylinePoints = calculatedPoints
    .map(p => `${p.x},${p.y}`)
    .join(" ");









  // 2. ずらし描画用の静的パラメータ
  const Swidth = 360;   
  const Sheight = 48;   
  const Spadding = 30;    
  const textY = 15;  
  const lineTopY = 22;
  const lineTopY2 = 25;
  const lineBottomY = 42;
  const lineBottomY2 = 39; 

  // 3. 描画エリアの有効サイズ計算
  const SdrawWidth = Swidth - Spadding * 2;

  const calculateWidth = slideData.map((point, index) => {
    const x = Spadding + (index / (slideData.length - 1)) * SdrawWidth;
    return { x, point, index };
  });
  




  const renderCellContent = (data) => {
    if (!data || data.type === 'space') return <span style={{ color: "#eee" }}>.</span>;
  
    switch (data.type) {
      case 'subs':
        const n = Number(data.increment) < parseInt(hyoushi, 10) * minimum * 2 ? data.increment : numToBar[`${hyoushi},${minimum}`]?.[data.increment];
        return (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <span style={{ fontSize: "12px", color: "#000" }}>{n}</span>
            <span style={{ fontWeight: "bold", fontSize: "15px" }}>{data.alpha}</span>
          </div>
        );
      case 'rest':
        return (
          <div style={{ fontSize: "12px", color: "#000" }}>
            {data.increment}
          </div>
        );
      case '=':
        return <div style={{ fontSize: "18px", fontWeight: "bold" }}>=</div>;
      default:
        return null;
    }
  };





   
  //表示/////////////////////////////////////////////////////

  return (
    <div style={{
      display: "flex",
      flexDirection:"column",
      alignItems:"center",
      width:"100%",
      padding: "0px",
      fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
      color: "#333333",

    }}>

    
      <h4>リズム</h4>
      <p style={{fontSize:"15px"}}>
        <Link to="/ChordTest">
          和音ページへ
        </Link>
      </p>

      <hr style={{width:"100%",}} />

      <h4>拍子を出力する</h4>

      <p>拍子</p>

      <div style={{display: "flex",alignItems:"center"}}>
        <select
          value={hyoushi}
          onChange={(e) => {
            setHyoushi(e.target.value);
            setMinimum("");
          }}
          style={{
            marginRight: "12px",
            height: "24px",
            width:"48px"
          }}
        >
          <option value="">---</option>
          {hyoushiOptions.map((f) => (
            <option key={f} value={f}>
              {f}
            </option>
          ))}
        </select>

        <button onClick={randomSelectHyoushi}>ランダム</button>
      </div>

      <p>1拍の割り方</p>

      <div style={{display: "flex",alignItems:"center"}}>
        <select 
          value={minimum} 
          onChange={(e) => {
            setMinimum(Number(e.target.value));
            setAvailableIncrement([]);
            setAvailableLayerBkIncrement([]);
            setAvailableLayerBkRythmIncrement([]);
            setLayerBkForChordOneByOne([]);
            setRythm([]);
            setOneByOne([]);
            setLayerBkOneByOne([]);
            setLayerBkObj({});

          }}
          style={{
            marginRight: "12px",
            height: "24px",
            width:"42px"
          }}
        >
          <option value="">---</option>
          {minimumOptions[hyoushi]?.map((f) => (
            <option key={f} value={f}>
              {f}
            </option>
          ))}
        </select>

        <button onClick={() => randomSelectMinimum(hyoushi)}>ランダム</button>
        
      </div>


      <p style={{marginTop:"30px", marginBottom:"1px"}}>最小単位の制限</p>

      <p style={{fontSize:"11px", marginTop:"2px", marginBottom:"8px"}}>
          (チェック入=除外)
      </p>


      <div>

        {minimumLimitOption[`${hyoushi},${minimum}`]?.map((item) => (

          <label
            key={item}
            style={{
              whiteSpace: "nowrap",
              marginLeft:"12px",
              
            }}
          >
            <input
              type="checkbox"
              value={item}
              checked={judgeForMinimumLimitCheckbox(item)}
              onChange={(e) => handleMinimumLimit(e)}
            />
              {item}
          </label>

        ))}
      </div>

      <div style={{marginTop:"12px"}}>
        <button onClick={() => getMinimumLimit()}>ランダム</button>
      </div>    


      







      <hr style={{width:"100%",marginTop: "30px"}}/>

      <h4>要素の構成を出力する</h4>

      <button style={{marginTop: "24px"}} onClick={() => partIdea()}>
        ランダム
      </button>

      <div style={{ display: "inline-block", verticalAlign: "middle",marginTop: "12px"}}>

        
        
        <div
          style={{
            marginBottom: "6px",
            border: "1px solid #ccc",
            padding: "10px",
            minWidth: "160px",
            borderRadius: "4px",
            backgroundColor: "#f9f9f9",
          }}
        >
          {partData.map((item) => (
            <p key={item}>{item}</p>

          ))}
        </div>
      
      </div>
      

      




      <hr style={{width:"100%",marginTop: "30px"}}/>


      <h4>和音リズムを出力する</h4>


      <div style={{ padding: "1px", marginTop:"24px"}}>
        <label style={{ display: "block", marginBottom: "8px" }}>
          出力範囲
        </label>
        <input
          type="text"
          value={chordWhole} // Stateの値を表示
          onChange={handleChordWhole} // 文字が変わるたびに実行
          list="chordWholeOption"
          placeholder=""
          style={{
            padding: "8px",
            borderRadius: "4px",
            border: "1px solid #ccc",
            width: "60px",
          }}
        />

        <datalist id="chordWholeOption">
          <option value="8bar"/>
          <option value="4bar"/>
          <option value="2bar"/>
        </datalist>
        
      </div>


      <p>形式の有効音価</p>

      {layerBkForChordIncrementOption[`${hyoushi},${minimum}`]?.map((group, groupIdx) => (
  
        <div
          key={groupIdx}
          style={{
            display: "flex",
            gap: "10px",
            flexWrap: "wrap",
            marginBottom: "12px", // グループ同士の縦の隙間
          }}
        >
          {/* 2つ目のループ：グループ内の個々の音価（'8' などの文字列）を取り出して描画 */}
          {group.map((item) => (
            <label
              key={item}
              style={{
                display: "flex",
                alignItems: "center",
                whiteSpace: "nowrap",
              }}
            >
              <input
                type="checkbox"
                value={item}
                checked={availableLayerBkForChordIncrement.includes(item.includes('b') ? barToNum[`${hyoushi},${minimum},${item}`] : item)}
                onChange={(e) => handleAvailableLayerBkForChordIncrement(e)}
              />
              {item}
            </label>
          ))}
        </div>

      ))}


      <div style={{ marginBottom: "12px", display: "flex", gap: "8px" }}>
        

        <button
          type="button"
          onClick={handleSelectAllLayerBkChordIncrement}
          style={{
            fontSize: "11px",      /* 文字を小さく */
            padding: "1px 3px",     /* 上下・左右の余白を小さく */
            cursor: "pointer"
          }}
        >
          すべてチェック
        </button>

        <button
          type="button"
          onClick={handleDeselectAllLayerBkChordIncrement}
          style={{
            fontSize: "11px",
            padding: "1px 13px",
            cursor: "pointer"
          }}
        >
          すべて外す
        </button>

        <button
          type="button"
          onClick={handleLayerBkChordBasicSet}
          style={{
            fontSize: "11px",      /* 文字を小さく */
            padding: "1px 3px",     /* 上下・左右の余白を小さく */
            cursor: "pointer"
          }}
        >
          基本セット
        </button>
      </div>




      <p>和音リズムの有効音価</p>

      {chordIncrementOption[`${hyoushi},${minimum}`]?.map((group, groupIdx) => (
  
        <div
          key={groupIdx}
          style={{
            display: "flex",
            gap: "10px",
            flexWrap: "wrap",
            marginBottom: "12px", // グループ同士の縦の隙間
          }}
        >
          {/* 2つ目のループ：グループ内の個々の音価（'8' などの文字列）を取り出して描画 */}
          {group.map((item) => (
            <label
              key={item}
              style={{
                display: "flex",
                alignItems: "center",
                whiteSpace: "nowrap",
              }}
            >
              <input
                type="checkbox"
                value={item}
                checked={availableChordIncrement.includes(item.includes('b') ? barToNum[`${hyoushi},${minimum},${item}`] : item)}
                onChange={(e) => handleAvailableChordIncrement(e)}
              />
              {item}
            </label>
          ))}
        </div>
      ))}  

      <div style={{ marginBottom: "12px", display: "flex", gap: "8px" }}>
        

        <button
          type="button"
          onClick={handleSelectAllChordIncrement}
          style={{
            fontSize: "11px",      /* 文字を小さく */
            padding: "1px 3px",     /* 上下・左右の余白を小さく */
            cursor: "pointer"
          }}
        >
          すべてチェック
        </button>

        <button
          type="button"
          onClick={handleDeselectAllChordIncrement}
          style={{
            fontSize: "11px",
            padding: "1px 13px",
            cursor: "pointer"
          }}
        >
          すべて外す
        </button>

        <button
          type="button"
          onClick={handleChordIncrementBasicSet}
          style={{
            fontSize: "11px",      /* 文字を小さく */
            padding: "1px 3px",     /* 上下・左右の余白を小さく */
            cursor: "pointer"
          }}
        >
          基本セット
        </button>
      </div>

      <button 
        style={{ marginTop:"24px" , opacity:chordWhole ? 1 : 0.5}} 
        onClick={() => layerBk(true)} 
        disabled={! chordWhole}
      >
        出力
      </button>
         
   
      

      
      <div style={{ width: "100%", maxWidth: "100%", overflowX: "auto", boxSizing: "border-box" }}>
        {layerBkForChordOneByOne.map((block, blockIdx) => (
          <div key={blockIdx} style={{ overflowX: "auto" }}>
            <h4 style={{ fontSize: "12px", marginBottom: "2px" }}>第{blockIdx + 1}小節</h4>

            <table style={{ borderCollapse: "collapse", border: "1px solid #333", backgroundColor: "#fff" }}>
              <tbody>
                {block.map((row, rowIdx) => (
                  <tr key={rowIdx}>
                    {/* 行の先頭に層のラベルを表示する */}    
                    <td style={{
                      border: "1px solid #ccc",
                      background: "#f0f0f0",
                      fontSize: "9px",
                      textAlign: "center",
                      width: "20px",
                      position: "sticky", // 横スクロールしてもラベルが見えるようにすると便利
                      left: 0,
                      zIndex: 1
                    }}>
                      {rowIdx === 0 || rowIdx === block.length-1 ? "" : `${rowIdx}層`}
                        
                    </td>
                    {row.map((cell, cellIdx) => {
                      // 1行目（列番号）のスタイル
                      if (rowIdx === 0) {
                        return (
                          <th key={cellIdx} style={{
                            borderTop: "1px solid #ccc",
                            borderRight: "1px solid #ccc",
                            borderBottom: "1px solid #ccc",
                            borderLeft: cellIdx % minimum === 0 && cellIdx !== 0 ? "2px solid #333" : "1px solid #ccc",
                            background: "#f0f0f0",
                            fontSize: "9px",
                            padding: "1px",
                            minWidth: "24px",
                            height: "15px"
                          }}>
                            {cell}
                          </th>
                        );
                      //最後なら(打点配列のスタイル)
                      } else if (rowIdx === block.length - 1) { 
                        const theme = noteTheme[cell];
                        return (
                          <td
                            key={cellIdx}
                            style={{
                              borderTop: "1px solid #000",
                              borderRight: "1px solid #000",
                              borderBottom: "1px solid #000",
                              borderLeft: cellIdx % minimum === 0 && cellIdx !== 0  ? "2px solid #333" : "1px solid #000",
                              //background: "#FCFCFC",
                              width: "30px",
                              height: "32px",
                              textAlign: "center",
                              fontSize: "15px"
                            }}
                          >
                            <div style={{ color: theme.color }}>{theme.symbol}</div>
                          </td>
                        );
                      } 
                      // 2行目以降（各層形式のデータ）の表示
                      return (
                        <td key={cellIdx} style={{
                          borderTop: "1px solid #000",
                          borderRight: "1px solid #000",
                          borderBottom: "1px solid #000",
                          borderLeft: cellIdx % minimum === 0 && cellIdx !== 0  ? "2px solid #333" : "1px solid #000",
                          width: "30px",
                          height: "32px",
                          textAlign: "center",
                          fontSize: "12px",
                          backgroundColor: cell?.type === 'rest' ? '#fecdd3' : cell?.type === 'space' ? '#fff' : '#e3f2fd'  
                       }}>
                          {renderCellContent(cell)}
                       </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>

      <div>
        {/* SVG要素 */}
        <p style={{fontSize:"10px", marginLeft: "10px", marginBottom:"1px"}}> (グルーヴ目安) </p>
        <svg 
          width={Swidth} 
          height={Sheight} 
          style={{ background: '#fff', borderRadius: '6px', marginLeft: "10px" }}
        >
          {calculateWidth.map((pt,ptI) => (
            <g key = {pt.index}>
              <text
                x = {pt.x}
                y = {textY}
                fill = {pt.point === null ? 'none' : '#000'}
                fontSize = "12"
                //fontWeight = "bold"
                textAnchor = "middle"
              >
                {pt.point}
              </text>  

              <line 
                x1 = {pt.x}
                y1 = {ptI % parseInt(hyoushi,10) === 0 ? lineTopY : lineTopY2}
                x2 = {pt.x}
                y2 = {ptI % parseInt(hyoushi,10) === 0 ? lineBottomY : lineBottomY2}
                stroke = "#333"
                strokeWidth = {ptI % parseInt(hyoushi,10) === 0 ? "2.5" : "1"}
              />
            </g>  
          ))}
        </svg>
      </div>

      <p style={{fontSize:"15px", marginTop:"24px"}}>
        <Link to="/ChordTest">
          和音ページへ
        </Link>
      </p>


      


      <hr style={{width:"100%",marginTop: "30px"}}/>

      <h4>リズムを出力する</h4>

      <div style={{ padding: "1px" }}>
        <label style={{ display: "block", marginBottom: "8px",marginTop: "24px" }}>
          全体の長さ
        </label>
        <input
          type="text"
          value={sectionLength} // Stateの値を表示
          onChange={handleSectionLength} // 文字が変わるたびに実行
          list="sectionLengthOption"
          placeholder=""
          style={{
            padding: "8px",
            borderRadius: "4px",
            border: "1px solid #ccc",
            width: "60px",
          }}
        />

        <datalist id="sectionLengthOption">
          <option value="8bar"/>
          <option value="4bar"/>
          <option value="2bar"/>
        </datalist>
        
      </div>

      <p>有効音価</p>


      {rythmIncrementOption[`${hyoushi},${minimum}`]?.map((group, groupIdx) => (
  
        <div
          key={groupIdx}
          style={{
            display: "flex",
            gap: "10px",
            flexWrap: "wrap",
            marginBottom: "12px", // グループ同士の縦の隙間
          }}
        >
          {/* 2つ目のループ：グループ内の個々の音価（'8' などの文字列）を取り出して描画 */}
          {group.map((item) => (
            <label
              key={item}
              style={{
                display: "flex",
                alignItems: "center",
                whiteSpace: "nowrap",
              }}
            >
              <input
                type="checkbox"
                value={item}
                checked={availableIncrement.includes(item)}
                onChange={(e) => handleAvailableIncrement(e)}
              />
              {item}
            </label>
          ))}
        </div>

      ))}


      <div style={{ marginBottom: "12px", display: "flex", gap: "8px" }}>
        

        <button
          type="button"
          onClick={handleSelectAllIncrement}
          style={{
            fontSize: "11px",      /* 文字を小さく */
            padding: "1px 3px",     /* 上下・左右の余白を小さく */
            cursor: "pointer"
          }}
        >
          すべてチェック
        </button>

        <button
          type="button"
          onClick={handleDeselectAllIncrement}
          style={{
            fontSize: "11px",
            padding: "1px 13px",
            cursor: "pointer"
          }}
        >
          すべて外す
        </button>

        <button
          type="button"
          onClick={handleBasicSet}
          style={{
            fontSize: "11px",      /* 文字を小さく */
            padding: "1px 3px",     /* 上下・左右の余白を小さく */
            cursor: "pointer"
          }}
        >
          基本セット
        </button>
      </div>



      <div style={{ padding: '10px', marginBottom: "10px" }}>
        
        <label style={{ cursor: 'pointer', userSelect: 'none', marginLeft:"24px"}}>
          <input
            type="checkbox"
            checked={repeatIsChecked}
            onChange={handleRepeat}
          />
          同音反復を出力する
        </label>

        <label style={{ cursor: 'pointer', userSelect: 'none' }}>
          <input
            type="checkbox"
            checked={auftaktIsChecked}
            onChange={handleAuftakt}
          />
          弱起を出力する
        </label>
      </div>

      

      <div style={{ display: "inline-block", verticalAlign: "middle" }}>

        <div
          style={{
            fontSize: "0.75rem",
            color: "#666",
            marginTop: "4px",
            minHeight: "1em",
          }}
        >
          <div>
          
            <button 
              onClick={() => randomRythm()}
              disabled={! sectionLength}
              style={{ marginBottom:"12px" , opacity:sectionLength ? 1 : 0.5}} 
            >
              出力
            </button>
          </div>
         
          
        </div>
      </div>

      <div style={{ width: "100%", maxWidth: "100%", overflowX: "auto", boxSizing: "border-box" , marginTop: "12px"}}>
        <table style={{ borderCollapse: "collapse" ,border: "1px solid #696969"}}>
          <tbody>
            {oneByOne.map((arr, index) => (
              <tr key={index}>
                {arr.map((data, dI) => {
                  const theme = noteTheme[data[1]];

                  return (
                    <td
                      key={data[0]}
                      style={{
                        padding: "3px",
                        fontSize: "13px",
                        minWidth: "17px",
                        borderTop: "1px solid #696969",
                        borderRight: "1px solid #696969",
                        borderBottom: "1px solid #696969",
                        borderLeft: (data[0] % minimum === 1 || data[0] % minimum === (minimum - 1) * -1 ) && dI !== 0 ? "2px solid #696969" : "1px solid #696969",
                      }}
                    >
                      <div style={{ fontSize: "9px", color: "#696969" }}>
                        {data[0]}
                      </div>
                      <div style={{ color: theme.color }}>{theme.symbol}</div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{fontSize:"12px", marginLeft: "6px", marginBottom:"1px", marginTop:"3px", color: "#696969"}}>{`音価単位 :${rythmIncrement}, 音数 :${amount}`}</div>


      <div>
        {/* SVG要素 */}
        <p style={{fontSize:"10px", marginLeft: "6px", marginBottom:"1px", marginTop:"20px"}}> (グルーヴ目安)</p>
        <svg 
          width={Swidth} 
          height={Sheight} 
          style={{ background: '#fff', borderRadius: '6px', marginLeft: "1px" }}
        >
          {calculateWidth.map((pt,ptI) => (
            <g key = {pt.index}>
              <text
                x = {pt.x}
                y = {textY}
                fill = {pt.point === null ? 'none' : '#000'}
                fontSize = "12"
                //fontWeight = "bold"
                textAnchor = "middle"
              >
                {pt.point}
              </text>  

              <line 
                x1 = {pt.x}
                y1 = {ptI % parseInt(hyoushi,10) === 0 ? lineTopY : lineTopY2}
                x2 = {pt.x}
                y2 = {ptI % parseInt(hyoushi,10) === 0 ? lineBottomY : lineBottomY2}
                stroke = "#333"
                strokeWidth = {ptI % parseInt(hyoushi,10) === 0 ? "2.5" : "1"}
              />
            </g>  
          ))}
        </svg>
      </div>






      <hr style={{width:"100%",marginTop: "30px"}} />

      

      <h4>部分形式ありでリズムを出力する</h4>

      <div style={{ padding: "1px" }}>
        <label style={{ display: "block", marginBottom: "8px",marginTop: "24px" }}>
          全体の長さ
        </label>
        <input
          type="text"
          value={layerBkWhole} // Stateの値を表示
          onChange={handleLayerBkWhole} // 文字が変わるたびに実行
          list="layerBkWholeOption"
          placeholder=""
          style={{
            padding: "8px",
            borderRadius: "4px",
            border: "1px solid #ccc",
            width: "60px",
          }}
        />

        <datalist id="layerBkWholeOption">
          <option value="4bar"/>
          <option value="2bar"/>
        </datalist>
        
      </div>


      <p>形式の有効音価</p>

      {layerBkIncrementOption[`${hyoushi},${minimum}`]?.map((group, groupIdx) => (
  
        <div
          key={groupIdx}
          style={{
            display: "flex",
            gap: "10px",
            flexWrap: "wrap",
            marginBottom: "12px", // グループ同士の縦の隙間
          }}
        >
          {/* 2つ目のループ：グループ内の個々の音価（'8' などの文字列）を取り出して描画 */}
          {group.map((item) => (
            <label
              key={item}
              style={{
                display: "flex",
                alignItems: "center",
                whiteSpace: "nowrap",
              }}
            >
              <input
                type="checkbox"
                value={item}
                checked={availableLayerBkIncrement.includes(item)}
                onChange={(e) => handleAvailableLayerBkIncrement(e)}
              />
              {item}
            </label>
          ))}
        </div>

      ))}

      <div style={{ marginBottom: "12px", display: "flex", gap: "8px" }}>

        

        <button
          type="button"
          onClick={handleSelectAllLayerBkIncrement}
          style={{
            fontSize: "11px",      /* 文字を小さく */
            padding: "1px 3px",     /* 上下・左右の余白を小さく */
            cursor: "pointer"
          }}
        >
          すべてチェック
        </button>
        <button
          type="button"
          onClick={handleDeselectAllLayerBkIncrement}
          style={{
            fontSize: "11px",
            padding: "1px 13px",
            cursor: "pointer"
          }}
        >
          すべて外す
        </button>

        <button
          type="button"
          onClick={handleLayerBkIncrementBasicSet}
          style={{
            fontSize: "11px",      /* 文字を小さく */
            padding: "1px 3px",     /* 上下・左右の余白を小さく */
            cursor: "pointer"
          }}
        >
          基本セット
        </button>
      </div>



      <p>リズムの有効音価</p>

      {layerBkRythmIncrementOption[`${hyoushi},${minimum}`]?.map((group, groupIdx) => (
  
        <div
          key={groupIdx}
          style={{
            display: "flex",
            gap: "10px",
            flexWrap: "wrap",
            marginBottom: "12px", // グループ同士の縦の隙間
          }}
        >
          {/* 2つ目のループ：グループ内の個々の音価（'8' などの文字列）を取り出して描画 */}
          {group.map((item) => (
            <label
              key={item}
              style={{
                display: "flex",
                alignItems: "center",
                whiteSpace: "nowrap",
              }}
            >
              <input
                type="checkbox"
                value={item}
                checked={availableLayerBkRythmIncrement.includes(item)}
                onChange={(e) => handleAvailableLayerBkRythmIncrement(e)}
              />
              {item}
            </label>
          ))}
        </div>

      ))}

      <div style={{ marginBottom: "12px", display: "flex", gap: "8px" }}>

        
        <button
          type="button"
          onClick={handleSelectAllLayerBkRythmIncrement}
          style={{
            fontSize: "11px",      /* 文字を小さく */
            padding: "1px 3px",     /* 上下・左右の余白を小さく */
            cursor: "pointer"
          }}
        >
          すべてチェック
        </button>
        <button
          type="button"
          onClick={handleDeselectAllLayerBkRythmIncrement}
          style={{
            fontSize: "11px",
            padding: "1px 13px",
            cursor: "pointer"
          }}
        >
          すべて外す
        </button>

        <button
          type="button"
          onClick={handleLayerBkRythmIncrementBasicSet}
          style={{
            fontSize: "11px",      /* 文字を小さく */
            padding: "1px 3px",     /* 上下・左右の余白を小さく */
            cursor: "pointer"
          }}
        >
          基本セット
        </button>

      </div>

      <div style={{ padding: '10px', marginBottom: "10px" }}>
        <label style={{ cursor: 'pointer', userSelect: 'none' }}>
          <input
            type="checkbox"
            checked={layerBkRythmRepeatIsChecked}
            onChange={handleLayerBkRythmRepeat}
          />
          同音反復を出力する
        </label>
      </div>



      
      <div style={{ display: "inline-block", verticalAlign: "middle" }}>
        <div
          style={{
            fontSize: "0.75rem",
            color: "#666",
            marginTop: "4px",
            minHeight: "1em",
          }}
        >
          <div>
            <button 
              onClick={() => layerBk()}
              disabled={! layerBkWhole}
              style={{ marginBottom:"12px" , opacity:layerBkWhole ? 1 : 0.5}} 
            >
              出力  
            </button>
          </div>
        </div>
      </div>

      
      <div style={{ width: "100%", maxWidth: "100%", overflowX: "auto", boxSizing: "border-box" }}>
        {layerBkOneByOne.map((block, blockIdx) => (
          <div key={blockIdx} style={{ overflowX: "auto" }}>
            <h4 style={{ fontSize: "6px", marginBottom: "2px" }}>第{layerBkStart0 === true ? blockIdx : blockIdx + 1}小節</h4>

            <table style={{ borderCollapse: "collapse", border: "1px solid #333", backgroundColor: "#fff" }}>
              <tbody>
                {block.map((row, rowIdx) => (
                  <tr key={rowIdx}>
                    {/* 行の先頭に層のラベルを表示する */}    
                    <td style={{
                      border: "1px solid #ccc",
                      background: "#f0f0f0",
                      fontSize: "9px",
                      textAlign: "center",
                      width: "20px",
                      position: "sticky", // 横スクロールしてもラベルが見えるようにすると便利
                      left: 0,
                      zIndex: 1
                    }}>
                      {rowIdx === 0 || rowIdx === block.length-1 ? "" : `${rowIdx}層`}
                        
                    </td>
                    {row.map((cell, cellIdx) => {
                      // 1行目（列番号）のスタイル
                      if (rowIdx === 0) {
                        return (
                          <th key={cellIdx} style={{
                            borderTop: "1px solid #ccc",
                            borderRight: "1px solid #ccc",
                            borderBottom: "1px solid #ccc",
                            borderLeft: cellIdx % minimum === 0 && cellIdx !== 0 ? "2px solid #333" : "1px solid #ccc",
                            background: "#f0f0f0",
                            fontSize: "9px",
                            padding: "1px",
                            minWidth: "24px",
                            height: "15px"
                          }}>
                            {cell}
                          </th>
                        );
                      //打点配列のスタイル
                      } else if (rowIdx === block.length - 1) { 
                        const theme = noteTheme[cell];
                        return (
                          <td
                            key={cellIdx}
                            style={{
                              borderTop: "1px solid #000",
                              borderRight: "1px solid #000",
                              borderBottom: "1px solid #000",
                              borderLeft: cellIdx % minimum === 0 && cellIdx !== 0  ? "2px solid #333" : "1px solid #000",
                              //background: "#FCFCFC",
                              width: "30px",
                              height: "32px",
                              textAlign: "center",
                              fontSize: "13px"
                            }}
                          >
                            <div style={{ color: theme.color }}>{theme.symbol}</div>
                          </td>
                        );
                      } 
                      // 2行目以降（各層形式のデータ）の表示
                      return (
                        <td key={cellIdx} style={{
                          borderTop: "1px solid #000",
                          borderRight: "1px solid #000",
                          borderBottom: "1px solid #000",
                          borderLeft: cellIdx % minimum === 0 && cellIdx !== 0  ? "2px solid #333" : "1px solid #000",
                          width: "30px",
                          height: "32px",
                          textAlign: "center",
                          fontSize: "9px",
                          backgroundColor: cell?.type === 'rest' ? '#fecdd3' : cell?.type === 'space' ? '#fff' : '#e3f2fd'  
                       }}>
                          {renderCellContent(cell)}
                       </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>

      <div>
        {/* SVG要素 */}
        <p style={{fontSize:"10px", marginLeft: "10px", marginBottom:"1px"}}> (グルーヴ目安) </p>
        <svg 
          width={Swidth} 
          height={Sheight} 
          style={{ background: '#fff', borderRadius: '6px', marginLeft: "10px" }}
        >
          {calculateWidth.map((pt,ptI) => (
            <g key = {pt.index}>
              <text
                x = {pt.x}
                y = {textY}
                fill = {pt.point === null ? 'none' : '#000'}
                fontSize = "12"
                //fontWeight = "bold"
                textAnchor = "middle"
              >
                {pt.point}
              </text>  

              <line 
                x1 = {pt.x}
                y1 = {ptI % parseInt(hyoushi,10) === 0 ? lineTopY : lineTopY2}
                x2 = {pt.x}
                y2 = {ptI % parseInt(hyoushi,10) === 0 ? lineBottomY : lineBottomY2}
                stroke = "#333"
                strokeWidth = {ptI % parseInt(hyoushi,10) === 0 ? "2.5" : "1"}
              />
            </g>  
          ))}
        </svg>
      </div>

      
      <div style={{
        marginLeft: '120px',
        marginRight: '90px',
        fontFamily: 'monospace', // 等幅フォントでコンソール風にする
        fontSize: '12px',
        lineHeight: '1.5'
      }}>
        <p>{hyoushi} ・ 1拍: {minimum}</p>
        <p>data</p>
        {/* 1層目のループ: for (const i in mainObj) */}
        {Object.keys(layerBkObj).map((i) => (
          <div key={i} style={{ marginBottom: '10px'}}>
          
            <div>{i} ________________________</div>

            {/* 2層目のループ: for (const j of mainObj[i]) */}
            {layerBkObj[i].map((j, jIdx) => {
              // ループのインデックス（0から始まる）を利用して、[第 1 ブロック] の数値を出す
              const acc = jIdx + 1;

              return (
                <div key={jIdx} style={{ marginTop: '5px' }}>
                
                  {/* console.log('[第', acc, 'ブロック]'); */}
                  <div>[第 {acc} ブロック]</div>

                  {/* 3層目のループ: for (const k of j) */}
                  {j.map((k, kIdx) => (
                    <div key={kIdx}>
                    
                      {/* console.log(JSON.stringify(k)); */}
                      {JSON.stringify(k)}

                    </div>
                  ))}

                </div>
              );
            })}

          </div>
        ))}
      </div>

      <hr style={{width:"100%",marginTop: "30px"}}/>




      <h4>形式を出力する</h4>

      <div style={{ padding: "1px",marginTop: "24px" }}>
        <label style={{ display: "block", marginBottom: "8px" }}>
          要素数
        </label>
        <input
          type="text"
          value={keishikiAmount} // Stateの値を表示
          onChange={handleKeishikiAmount} // 文字が変わるたびに実行
          placeholder="1"
          style={{
            padding: "8px",
            borderRadius: "4px",
            border: "1px solid #ccc",
            width: "50px",
          }}
        />
      </div>

      <p style={{ display: "block", marginBottom: "8px" }}>
          開始アルファベット
      </p>

      <div style={{  }}>
        
        <input
          type="text"
          value={keishikiStartAlpha} // Stateの値を表示
          onChange={handleKeishikiStartAlpha} // 文字が変わるたびに実行
          placeholder="A"
          style={{
            padding: "6px",
            borderRadius: "4px",
            border: "1px solid #ccc",
            width: "30px",
          }}
        />
      </div>
      <button style={{ marginTop: "12px", marginBottom: "12px" }} onClick={() => keishikiFreeA(keishikiStartAlpha)}>
        出力
      </button>

      <div style={{ display: "inline-block", verticalAlign: "middle" }}>
        
        <div
          style={{
            border: "1px solid #ccc",
            padding: "10px",
            minWidth: "160px",
            borderRadius: "4px",
            backgroundColor: "#f9f9f9",
          }}
        >
          {keishikiA.join(',')}
        </div>
      </div>

      


      <h4 style={{marginTop:"40px", marginBottom:"8px"}}>
        既出要素を含める場合
      </h4>
      
        <label style={{ display: "block", marginBottom: "4px" }}>
          既出要素入力
        </label>
        
        
        <input
          type="text"
          value={exKeishiki} // Stateの値を表示
          onChange={handleExKeishiki} // 文字が変わるたびに実行
          placeholder=""
          style={{
            padding: "6px",
            borderRadius: "4px",
            border: "1px solid #ccc",
            width: "167px",
          }}
        />

        <p style={{fontSize:"12px", margin:"1px"}}>
          (半角カンマで区切り既出アルファベット(ダッシュ要素含む)を入力)
        </p>
        
      

      <button style={{ marginTop: "12px", marginBottom: "12px" }} onClick={() => keishikiFreeB(exKeishiki)}>
        出力
      </button>

      <div style={{ display: "inline-block", verticalAlign: "middle" }}>
        <div
          style={{
            border: "1px solid #ccc",
            padding: "10px",
            minWidth: "160px",
            borderRadius: "4px",
            backgroundColor: "#f9f9f9",
          }}
        >
          {keishikiB.join(',')}
        
        </div>
        

        
      </div>




      

      <hr style={{width:"100%",marginTop: "30px"}}/>

      <h4>旋律型を出力する</h4>

      <div style={{ padding: "1px", marginTop: "24px"}}>
          <label style={{ display: "block", marginBottom: "8px" }}>
            打点数
          </label>
          <input
            type="text"
            value={melodyLineAmount} // Stateの値を表示
            onChange={handleMelodyLineAmount} // 文字が変わるたびに実行
            placeholder="0"
            style={{
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid #ccc",
              width: "50px",
              marginBottom: "12px"
            }}
          />
          
          
      </div>
      <div>
          <button onClick={() => melodyLine(melodyLineAmount)}>出力</button>
      </div>

          

          
        {/* SVG要素 */}
        <svg 
          width={MLwidth} 
          height={MLheight} 
          style={{ background: '#fff', borderRadius: '6px' }}
        >
          {/* 背景のグリッド横線 */}
          {gridPitches.map((pitch) => {
            const y = getNominalY(pitch);
            return (
              <g key={pitch}>
                <line
                  x1={MLpadding}
                  y1={y}
                  x2={MLwidth - MLpadding}
                  y2={y}
                  stroke="#333"
                  strokeWidth="1"
                  strokeDasharray="2,2"
                    
                />
                {/* Y軸の目盛りテキスト（音高） */}
                <text
                  x={MLpadding - 8}
                  y={y + 4}
                  fill="#C4C8CC"
                  fontSize="10"
                  textAnchor="end"
                >
                  {}
                </text>
              </g>
            );
          })}

          {/* 音高を結ぶ折れ線 */}
          <polyline
            fill="none"
            stroke="#0075FF" //#C4C8CCグレー
            strokeWidth="2"
            points={polylinePoints}
          />

          {/* 各打点のポイント（丸印） */}
          {calculatedPoints.map((pt) => (
            <circle
              key={pt.index}
              cx={pt.x}
              cy={pt.y}
              r="6"
              fill={pt.index === basePoint - 1? "#fa5252" : "#0075FF"}  
            />
          ))}
        </svg>

        {/* データの状態確認用表示 */}
        {<div style={{  color: '#000', fontSize: '13px' }}>
           音高数:{pitchLevels.length > 0 ? Math.max(...pitchLevels) : "--"}
        </div>}
     






      <hr style={{width:"100%",marginTop: "30px"}} />

      <h4>グルーヴの目安を出力する</h4>

      <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap", marginBottom: "20px" , fontSize: '15px'}}>
          <p style={{ margin: 0 }}>ずらし幅選択</p>
    
          {slideValueOption[`${hyoushi},${minimum}`]?.map((item, itemI) => (
            <label
              key={itemI}
              style={{
                display: "inline-flex", // flexからinline-flexに変更して横並びを安定化
                alignItems: "center",
                gap: "4px",             // チェックボックスと文字の間隔
                whiteSpace: "nowrap",
                cursor: "pointer",
              }}
            >
              <input
                type="checkbox"
                value={item}
                checked={availableSlideValue.includes(item)}
                onChange={(e) => handleSlideValue(e)}
              />
              {item}
            </label>
          ))}
          <button onClick={() => slide()}>出力</button>
        </div>
        
        
        <div>
          {/* SVG要素 */}
          <svg 
            width={Swidth} 
            height={Sheight} 
            style={{ background: '#f3f3f3', borderRadius: '6px' }}
          >
            {calculateWidth.map((pt,ptI) => (
              <g key = {pt.index}>
                <text
                  x = {pt.x}
                  y = {textY}
                  fill = {pt.point === null ? 'none' : '#000'}
                  fontSize = "12"
                  //fontWeight = "bold"
                  textAnchor = "middle"
                >
                  {pt.point}
                </text>  

                <line 
                  x1 = {pt.x}
                  y1 = {ptI % parseInt(hyoushi,10) === 0 ? lineTopY : lineTopY2}
                  x2 = {pt.x}
                  y2 = {ptI % parseInt(hyoushi,10) === 0 ? lineBottomY : lineBottomY2}
                  stroke = "#333"
                  strokeWidth = {ptI % parseInt(hyoushi,10) === 0 ? "2.5" : "1"}
                />
              </g>  
            ))}
          </svg>
      </div>
      
      <p style = {{fontSize:"12px", margin:"5px"}}>{hyoushi} ・ 1拍: {minimum}</p>

      <hr style={{width:"100%",marginTop:"30px", marginBottom:"100px"}}/>




    </div>
  );
}








