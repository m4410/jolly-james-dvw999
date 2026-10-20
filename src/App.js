//バックアップ　App.js

import { BrowserRouter } from "react-router-dom";
import { Routes, Route } from "react-router-dom";
import { useState } from "react";
import Main from "./Main";
import ChordTest from "./ChordTest";

export default function App() {

  const [hyoushi, setHyoushi] = useState("");
  const [minimum, setMinimum] = useState();
  const [minimumLimit, setMinimumLimit] = useState([]);
  
  const [chordWhole, setChordWhole] = useState("");
  const [chordRythm, setChordRythm] = useState([]);
  const [chordRythmIncrement, setChordRythmIncrement] = useState("");
  const [chordAmount, setChordAmount] = useState("");
  const [availableLayerBkForChordIncrement, setAvailableLayerBkForChordIncrement] = useState([]);
  const [availableChordIncrement, setAvailableChordIncrement] = useState([]);
  const [layerBkForChordOneByOne, setLayerBkForChordOneByOne] = useState([]);

  const [sectionLength, setSectionLength] = useState("");
  const [rythm, setRythm] = useState([]);
  const [rythmIncrement, setRythmIncrement] = useState("");
  const [amount, setAmount] = useState("");
  const [availableIncrement, setAvailableIncrement] = useState([]);
  const [repeatIsChecked, setRepeatIsChecked] = useState(false);
  const [auftaktIsChecked, setAuftaktIsChecked] = useState(false);
  const [oneByOne, setOneByOne] = useState([]);
  

  const [availableSlideValue, setAvailableSlideValue] = useState([]);
  const [slideData, setSlideData] = useState([]);
  
  const [layerBkWhole, setLayerBkWhole] = useState("");
  const [availableLayerBkIncrement, setAvailableLayerBkIncrement] = useState([]);
  const [availableLayerBkRythmIncrement, setAvailableLayerBkRythmIncrement] = useState([]);
  const [layerBkRythmRepeatIsChecked, setLayerBkRythmRepeatIsChecked] = useState(false);
  const [layerBkObj, setLayerBkObj] = useState({}); 
  const [layerBkOneByOne, setLayerBkOneByOne] = useState([]);
  const [layerBkStart0, setLayerBkStart0] = useState(false);

  const [keishikiA, setKeishikiA] = useState([]);
  const [keishikiB, setKeishikiB] = useState([]);
  const [keishikiAmount, setKeishikiAmount] = useState();
  const [keishikiStartAlpha, setKeishikiStartAlpha] = useState("A");
  const [exKeishiki, setExKeishiki] = useState("");


  const [pitchLevels, setPitchLevels] = useState([]);
  const [melodyLineAmount, setMelodyLineAmount] = useState();
  const [basePoint, setBasePoint] = useState();

  const [partData, setPartData] = useState([]);




  /////////////////Chord
  
  
  const [availableKey, setAvailableKey] = useState(['0:']);
  const [availableModulation, setAvailableModulation] = useState(['0:']);
  const [numberOfChord, setNumberOfChord] = useState();

  const [cadence, setCadence] = useState([]);
  const [availableAttribute, setAvailableAttribute] = useState([]);
  const [attributeName, setAttributeName] = useState([]);
  
  const [prevChordFlag, setPrevChordFlag] = useState(false);
  const [prevChordKey, setPrevChordKey] = useState("0:");
  const [prevChordChord, setPrevChordChord] = useState("---");
  const [prevChordForm, setPrevChordForm] = useState("---");
  const [prevChordTension, setPrevChordTension] = useState("---");
  const [prevChordInversion, setPrevChordInversion] = useState("---");

  const [chordForGetCharacter, setChordForGetCharacter] = useState("---");
  const [formForGetCharacter, setFormForGetCharacter] = useState("---");
  const [attributeForGetCharacter, setAttributeForGetCharacter] = useState([]);
  const [characterData, setCharacterData] = useState([]);

  






  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Main values ={{
          hyoushi: hyoushi, setHyoushi: setHyoushi,
          minimum: minimum, setMinimum: setMinimum,
          minimumLimit, setMinimumLimit,
          
          chordWhole, setChordWhole,
          chordRythm: chordRythm, setChordRythm: setChordRythm,
          chordRythmIncrement: chordRythmIncrement, setChordRythmIncrement: setChordRythmIncrement,
          chordAmount: chordAmount, setChordAmount: setChordAmount, 

          availableLayerBkForChordIncrement, setAvailableLayerBkForChordIncrement,
          availableChordIncrement: availableChordIncrement, setAvailableChordIncrement:setAvailableChordIncrement,
          layerBkForChordOneByOne, setLayerBkForChordOneByOne,

          sectionLength:sectionLength, setSectionLength: setSectionLength,
          rythm:rythm, setRythm:setRythm,
          rythmIncrement:rythmIncrement, setRythmIncrement:setRythmIncrement,
          amount: amount, setAmount: setAmount, 
          availableIncrement: availableIncrement, setAvailableIncrement: setAvailableIncrement,
          repeatIsChecked: repeatIsChecked, setRepeatIsChecked: setRepeatIsChecked,
          auftaktIsChecked, setAuftaktIsChecked,
          oneByOne: oneByOne, setOneByOne: setOneByOne,

          availableSlideValue: availableSlideValue, setAvailableSlideValue: setAvailableSlideValue,
          slideData: slideData, setSlideData: setSlideData,
          
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


          pitchLevels: pitchLevels, setPitchLevels: setPitchLevels,
          melodyLineAmount: melodyLineAmount, setMelodyLineAmount: setMelodyLineAmount ,
          basePoint: basePoint, setBasePoint: setBasePoint,

          partData, setPartData,
        }}/>} />
        <Route path="/ChordTest" element={<ChordTest values ={{

          

          availableKey, setAvailableKey,
          availableModulation, setAvailableModulation,
          numberOfChord, setNumberOfChord,
          cadence, setCadence,
          availableAttribute, setAvailableAttribute,
          attributeName, setAttributeName,
          
          prevChordFlag, setPrevChordFlag,
          prevChordKey, setPrevChordKey,
          prevChordChord, setPrevChordChord,
          prevChordForm, setPrevChordForm,
          prevChordTension, setPrevChordTension,
          prevChordInversion, setPrevChordInversion,

          chordForGetCharacter, setChordForGetCharacter,
          formForGetCharacter, setFormForGetCharacter,
          attributeForGetCharacter, setAttributeForGetCharacter,
          characterData, setCharacterData,

        }}/>} />
      </Routes>
    </BrowserRouter>
  );
}






