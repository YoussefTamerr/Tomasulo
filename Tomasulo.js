

import fs from 'fs';
import ReservationStation from "./ReservationStation.js";
import RSinstructions from "./RSinstructions.js";
import RegisterFile from "./RegisterFile.js";
import LRUCache from "./LRUCache.js";

//Components//
//import InstructionQueue from './InstructionQueue.js';
const filePath = './Instructions.txt';
const File=new RegisterFile();
const DataCache=new LRUCache(6);
const StoreBuffer=new ReservationStation(4);
const LoadBuffer=new ReservationStation(3);
const adderRS=new ReservationStation(3);
const multRS=new ReservationStation(2);
let instructionQueue=[];
let instructionQueue2=[];
let bus = [];

const addLatency =2;
const subLatency =2;
const multLatency =10;
const divLatency =40;
const loadLatency =2;
const storeLatency =2;

let clock = 1;

const insertToRF = (registerNum, value) => {
  File.registers[1][registerNum] = value;
}

const insertToDataCache = (address, value) => {
  DataCache.put(address, value);
}

const checkallRSisDone = () => {
  let flag = true;
  for(let i = 0; i < adderRS.capacity; i++) {
    if(adderRS.instructions[i].busy == 1) {
      flag = false;
      break;
    }
  }
  for(let i = 0; i < multRS.capacity; i++) {
    if(multRS.instructions[i].busy == 1) {
      flag = false;
      break;
    }
  }
  for(let i = 0; i < LoadBuffer.capacity; i++) {
    if(LoadBuffer.instructions[i].busy == 1) {
      flag = false;
      break;
    }
  }
  for(let i = 0; i < StoreBuffer.capacity; i++) {
    if(StoreBuffer.instructions[i].busy == 1) {
      flag = false;
      break;
    }
  }
  return flag;
}

const fillRSInstMem = (currentInst, index) => {
  index += 1;
  let r1 = currentInst[1];
  let address = currentInst[2];
  let time = null;


  let letter;
  let vj = null;
  let qj = null;

  if(currentInst[0] == 'LD') {
    letter = 'L';
  } else if(currentInst[0] == 'SD') {
    letter = 'S';
  }

  if(currentInst[0] == 'LD') {
    time = loadLatency;
  } else if(currentInst[0] == 'SD') {
    time = storeLatency;
  }


  if(currentInst[0] == 'SD') {
    if(File.registers[0][(r1[1]+ (r1[2] || '')) * 1] == 0) {
      vj = File.registers[1][(r1[1]+ (r1[2] || '')) * 1]; 
    } else {
      qj = File.registers[0][(r1[1]+ (r1[2] || '')) * 1]; 
    }
  }
  

  File.registers[0][(r1[1]+ (r1[2] || '')) * 1] = letter + '' +index;


  return new RSinstructions(letter + '' +index, 1, address, vj, null, qj, null, null, time);
}

const fillRSInstALU = (currentInst, index) => {
  index += 1;
  let r1 = currentInst[2];
  let r2 = currentInst[3];
  let dest = currentInst[1];
  if (currentInst[0] == 'BNEZ') {
    r1 = currentInst[1];
  }

  let vj = null;
  let vk = null;
  let qj = null;
  let qk = null;
  let time = null;

  let letter;

  if(currentInst[0] == 'ADD' || currentInst[0] == 'SUB' || currentInst[0] == 'ADDI' || currentInst[0] == 'SUBI' || currentInst[0] == 'BNEZ') {
    letter = 'A';
  } else if(currentInst[0] == 'MUL' || currentInst[0] == 'DIV') {
    letter = 'M';
  }

  if (currentInst[0] == 'ADDI' || currentInst[0] == 'SUBI' || currentInst[0] == 'BNEZ') {
    time = 1
  }
  if(currentInst[0] == 'ADD') {
    time = addLatency;
  } else if(currentInst[0] == 'SUB') {
    time = subLatency;
  } else if(currentInst[0] == 'MUL') {
    time = multLatency;
  } else if(currentInst[0] == 'DIV') {
    time = divLatency;
  }


  // if(File.registers[0][r1[1] * 1] == 0) {
  //   vj = File.registers[1][r1[1] * 1]; 
  // } else {
  //   qj = File.registers[0][r1[1] * 1]; 
  // }

  // if(File.registers[0][r2[1] * 1] == 0) {
  //   vk = File.registers[1][r2[1] * 1];
  // } else {
  //   qk = File.registers[0][r2[1] * 1]
  // }
  
  if(File.registers[0][(r1[1]+ (r1[2] || '')) * 1] == 0) {
    vj = File.registers[1][(r1[1]+ (r1[2] || '')) * 1]; 
  } else {
    qj = File.registers[0][(r1[1]+ (r1[2] || '')) * 1]; 
  }
  if (currentInst[0] != 'ADDI' && currentInst[0] != 'SUBI' && currentInst[0] != 'BNEZ') {
        if(File.registers[0][(r2[1]+ (r2[2] || '')) * 1] == 0) {
            vk = File.registers[1][(r2[1]+ (r2[2] || '')) * 1];
        } else {
            qk = File.registers[0][(r2[1]+ (r2[2] || '')) * 1]
        }
    }else {
        if (currentInst[0] != 'BNEZ')
            vk = currentInst[3] * 1;
        else
            vk = currentInst[2] * 1; 
    }
  if (!(currentInst[0] == 'BNEZ')) {
    File.registers[0][(dest[1]+ (dest[2] || '')) * 1] = letter + '' +index;
  }

  return new RSinstructions(letter + '' +index, 1, currentInst[0], vj, vk, qj, qk, null, time);
}

const INST = {
  SUB: 'SUB',
  ADD: 'ADD',
  ADDI: 'ADDI',
  SUBI: 'SUBI',
  MUL: 'MUL',
  DIV: 'DIV',
  BNEZ: 'BNEZ',
  LD:"LD",
  SD:"SD"
};
const pattern = /^\d+$/;

function containsNumbersOnly(inputString) {
  return pattern.test(inputString);
}

function capitalizeWord(word) {
  return word.toUpperCase();
}
fs.promises.readFile(filePath, 'utf-8')
  .then(text => {
   
    const lines =text.split('\n')

    if(lines.length==0){
      throw new Error('There is no instructions added to get executed')
    }
   
    for (let i=0;i< lines.length;i++){
    let words = lines[i].split(/\s+|,/);
    if(words[0]!='LD' && words[0]!='SD'){
    words.splice(4,1);
    } else {
    words.splice(3,1);
    }
    

//------------------------------------------------------------------------------------------//
//----------------------Errors checking-----------------------------------------------------//

if((words[0]==INST.SD || words[0]==INST.LD) && (words.length!=3)){
  throw new Error(`Line ${i+1}:Wrong instruction format for ${words[0]} instruction`)
}
if((words[0]==INST.SD || words[0]==INST.LD) && (!containsNumbersOnly(words[2]))){
  throw new Error(`Line ${i+1}:Wrong address format for ${words[0]} instruction`)
}
if((words[0]!=INST.SD && words[0]!=INST.LD) ){
  if(words.length!=4){
  throw new Error(`Line ${i+1}:Wrong instruction format`)
  }else{
   
    let D=words[1];
    let S1=words[2];
    let S2=words[3];
    if(D[0]=='R' || D[0]=='r'){
      let x = (D.slice(1)*1) + 32;
      D = 'F'+ x;
      words[1]=D;
    }
    if(S1[0]=='R' || S1[0]=='r'){
      let x = (S1.slice(1)*1) + 32
      S1 = 'F'+ x;
      words[2]=S1;
    }
    if(S2[0]=='R' || S2[0]=='r'){
      let x = (S2.slice(1)*1) + 32
      S2 = 'F'+x;
      words[3]=S2;  
    }
    if (words[0] != 'ADDI' && words[0] != 'SUBI' && words[0] != 'BNEZ') {
        if(S1.length>3 || S2.length>3 || D.length>3){
        throw new Error(`Line ${i+1}:Wrong memory format`)
        }
        if(S1[0].toUpperCase()!='F' || S2[0].toUpperCase()!='F'|| D[0].toUpperCase()!='F'){
        throw new Error(`Line ${i+1}:Wrong memory format only F`)
        }
        if((Number(S1[2])<0 || Number(S1[1]>63)) || (Number(S2[2])<0 || Number(S2[1]>63)) || (Number(D[2])<0 || Number(D[1]>63)) ){
        throw new Error(`Line ${i+1}:in available memory [F0-F31]`)
        }
    }else {
        if (words[0] === 'BNEZ'){
            if(D.length>3){
            throw new Error(`Line ${i+1}:Wrong memory format`)
            }
            if(D[0].toUpperCase()!='F'){
            throw new Error(`Line ${i+1}:Wrong memory format only F`)
            }
            if((Number(D[2])<0 || Number(D[1]>63)) ){
            throw new Error(`Line ${i+1}:in available memory [F0-F31]`)
            }
        }
        else {
            if(S1.length>3 || D.length>3){
            throw new Error(`Line ${i+1}:Wrong memory format`)
            }
            if(S1[0].toUpperCase()!='F' || D[0].toUpperCase()!='F'){
            throw new Error(`Line ${i+1}:Wrong memory format only F`)
            }
            if((Number(S1[2])<0 || Number(S1[1]>63)) ||(Number(D[2])<0 || Number(D[1]>63)) ){
            throw new Error(`Line ${i+1}:in available memory [F0-F31]`)
            }
        }
    }
  }

}
    for(let j=0;j<words.length;j++){
      words[j]=capitalizeWord(words[j]);

    }
    if(!INST.hasOwnProperty(words[0])){
      throw new Error(`Line ${i+1}:Inavailable instruction is used`)
    }

    //------------------------------------------------------------------------------------------//
//----------------------End of Errors checking-----------------------------------------------------//  



    instructionQueue.push(words);
    instructionQueue2.push(words);
    }

    insertToDataCache('100', 6);
    insertToDataCache('200', 3);

    insertToRF(0, 0);
    insertToRF(1, 5);
    insertToRF(2, 6);
    insertToRF(3, 7);
    insertToRF(4, 8);
    insertToRF(5, 9);
    insertToRF(6, 10);
    insertToRF(1+32, 1);
    insertToRF(2+32, 12);
    insertToRF(5+32, 1);
    insertToRF(4+32, 14);
    console.log(instructionQueue);
    while(true) {
      let currentInst = instructionQueue[0];
      let issuedNow;
      let issuedNowType;
      let dontIssueAdd = false;
      let dontIssueMult = false;
      let dontIssueLoad = false;
      let dontIssueStore = false;

      for(let i = 0; i < adderRS.capacity; i++) {
        if(adderRS.instructions[i].busy == 1 && adderRS.instructions[i].op == 'BNEZ') {
          dontIssueAdd = true;
          dontIssueMult = true;
          dontIssueLoad = true;
          dontIssueStore = true;
        }
      }

      if(currentInst) {
        if((currentInst[0] == 'ADD' || currentInst[0] == 'SUB' || currentInst[0] == 'ADDI' || currentInst[0] == 'SUBI' || currentInst[0] == 'BNEZ') && adderRS.isFull()) {
          dontIssueAdd = true;      
        }
        if((currentInst[0] == 'MUL' || currentInst[0] == 'DIV') && multRS.isFull()) {
          dontIssueMult = true;
        }
  
        if(currentInst[0] == 'LD' && LoadBuffer.isFull()) {
          dontIssueLoad = true;
        }
  
        if(currentInst[0] == 'SD' && StoreBuffer.isFull()) {
          dontIssueStore = true;
        }
  
        let loadAddresses = [];
        for(let i = 0; i < LoadBuffer.capacity; i++) {
          loadAddresses.push(LoadBuffer.instructions[i].op);
        }
  
        let storeAddresses = [];
        for(let i = 0; i < StoreBuffer.capacity; i++) {
          storeAddresses.push(StoreBuffer.instructions[i].op);
        }
  
        if(currentInst[0] == 'LD' && storeAddresses.includes(currentInst[2])) {
          dontIssueLoad = true;
        }
        if(currentInst[0] == 'SD' && loadAddresses.includes(currentInst[2]) && storeAddresses.includes(currentInst[2])) {
          dontIssueStore = true;
        }
  
        //issue
        if(currentInst[0] == 'LD' && !dontIssueLoad) {
          for(let i = 0; i < LoadBuffer.capacity; i++) {
            if(LoadBuffer.instructions[i].busy == 0) {
              LoadBuffer.instructions[i] = fillRSInstMem(currentInst, i);
              issuedNow = i;
              issuedNowType = 'L';
              break;
            }
          }
        }
  
        if(currentInst[0] == 'SD' && !dontIssueStore) {
          for(let i = 0; i < StoreBuffer.capacity; i++) {
            if(StoreBuffer.instructions[i].busy == 0) {
              StoreBuffer.instructions[i] = fillRSInstMem(currentInst, i);
              issuedNow = i;
              issuedNowType = 'S';
              break;
            }
          }
        }
  
        if((currentInst[0] == 'ADD' || currentInst[0] == 'SUB' || currentInst[0] == 'ADDI' || currentInst[0] == 'SUBI' || currentInst[0] == 'BNEZ') && !dontIssueAdd) {
          for(let i = 0; i < adderRS.capacity; i++) {
            if(adderRS.instructions[i].busy == 0) {
              adderRS.instructions[i] = fillRSInstALU(currentInst, i);
              issuedNow = i;
              issuedNowType = 'A';
              break;
            }
          }
        }
  
        if((currentInst[0] == 'MUL' || currentInst[0] == 'DIV') && !dontIssueMult) {
          for(let i = 0; i < multRS.capacity; i++) {
            if(multRS.instructions[i].busy == 0) {
              multRS.instructions[i] = fillRSInstALU(currentInst, i);
              issuedNow = i;
              issuedNowType = 'M';
              break;
            }
          }
        }
      }

      //execute
      for(let i = 0; i < adderRS.capacity; i++) { //vj, vk exists ????
        if( i == issuedNow && issuedNowType == 'A') {
          continue;
        }
        if(adderRS.instructions[i].busy == 1 && adderRS.instructions[i].vj != null && adderRS.instructions[i].vk != null) {
          adderRS.instructions[i].timeLeft -= 1;
        }
      }
      for(let i = 0; i < multRS.capacity; i++) {
        if( i == issuedNow && issuedNowType == 'M') {
          continue;
        }
        if(multRS.instructions[i].busy == 1 && multRS.instructions[i].vj != null && multRS.instructions[i].vk != null) {
          multRS.instructions[i].timeLeft -= 1;
        }
      }
      for(let i = 0; i < LoadBuffer.capacity; i++) {
        if( i == issuedNow && issuedNowType == 'L') {
          continue;
        }
        if(LoadBuffer.instructions[i].busy == 1) {
          LoadBuffer.instructions[i].timeLeft -= 1;
        }
      }
      for(let i = 0; i < StoreBuffer.capacity; i++) {
        if( i == issuedNow && issuedNowType == 'S') {
          continue;
        }
        if(StoreBuffer.instructions[i].busy == 1 && StoreBuffer.instructions[i].vj != null) {
          StoreBuffer.instructions[i].timeLeft -= 1;
        }
      }

      //wb at -1
      for(let i = 0; i < adderRS.capacity; i++) {
        if(adderRS.instructions[i].busy == 1 && adderRS.instructions[i].timeLeft == -1) {
          //File.registers[1][adderRS.instructions[i].tag[1] * 1] = adderRS.instructions[i].A;
          //File.registers[0][adderRS.instructions[i].tag[1] * 1] = 0;
          let value;
          if(adderRS.instructions[i].op == 'ADD' || adderRS.instructions[i].op == 'ADDI') {
            value = adderRS.instructions[i].vj + adderRS.instructions[i].vk;
          } else if(adderRS.instructions[i].op == 'SUB' || adderRS.instructions[i].op == 'SUBI') {
            value = adderRS.instructions[i].vj - adderRS.instructions[i].vk;
          }else {
            if(adderRS.instructions[i].vj != 0){
                instructionQueue = []
                instructionQueue = instructionQueue2.slice(adderRS.instructions[i].vk - 1)
            }
          }
          bus.push( { tag: adderRS.instructions[i].tag, value } )
          adderRS.instructions[i].busy = 0;
          adderRS.instructions[i].op = null;
          adderRS.instructions[i].vj = null;
          adderRS.instructions[i].vk = null;
          adderRS.instructions[i].qj = null;
          adderRS.instructions[i].qk = null;
          adderRS.instructions[i].A = null;
          adderRS.instructions[i].timeLeft = null;
        }
      }
      for(let i = 0; i < multRS.capacity; i++) {
        if(multRS.instructions[i].busy == 1 && multRS.instructions[i].timeLeft == -1) {
          //File.registers[1][multRS.instructions[i].tag[1] * 1] = multRS.instructions[i].A;
          //File.registers[0][multRS.instructions[i].tag[1] * 1] = 0;
          let value;
          if(multRS.instructions[i].op == 'MUL') {
            value = multRS.instructions[i].vj * multRS.instructions[i].vk;
          } else if(multRS.instructions[i].op == 'DIV') {
            value = multRS.instructions[i].vj / multRS.instructions[i].vk;
          }
          bus.push( { tag: multRS.instructions[i].tag, value } )
          multRS.instructions[i].busy = 0;
          multRS.instructions[i].op = null;
          multRS.instructions[i].vj = null;
          multRS.instructions[i].vk = null;
          multRS.instructions[i].qj = null;
          multRS.instructions[i].qk = null;
          multRS.instructions[i].A = null;
          multRS.instructions[i].timeLeft = null;
        }
      }
      for(let i = 0; i < LoadBuffer.capacity; i++) {
        if(LoadBuffer.instructions[i].busy == 1 && LoadBuffer.instructions[i].timeLeft == -1) {
          //File.registers[1][LoadBuffer.instructions[i].tag[1] * 1] = DataCache.get(LoadBuffer.instructions[i].A);
          //File.registers[0][LoadBuffer.instructions[i].tag[1] * 1] = 0;
          let value = DataCache.get(LoadBuffer.instructions[i].op);
          bus.push( { tag: LoadBuffer.instructions[i].tag, value } )
          LoadBuffer.instructions[i].busy = 0;
          LoadBuffer.instructions[i].op = null;
          LoadBuffer.instructions[i].vj = null;
          LoadBuffer.instructions[i].vk = null;
          LoadBuffer.instructions[i].qj = null;
          LoadBuffer.instructions[i].qk = null;
          LoadBuffer.instructions[i].A = null;
          LoadBuffer.instructions[i].timeLeft = null;
        }
      }
      for(let i = 0; i < StoreBuffer.capacity; i++) {
        if(StoreBuffer.instructions[i].busy == 1 && StoreBuffer.instructions[i].timeLeft == -1) {
          DataCache.put(StoreBuffer.instructions[i].op, StoreBuffer.instructions[i].vj);
          StoreBuffer.instructions[i].busy = 0;
          StoreBuffer.instructions[i].op = null;
          StoreBuffer.instructions[i].vj = null;
          StoreBuffer.instructions[i].vk = null;
          StoreBuffer.instructions[i].qj = null;
          StoreBuffer.instructions[i].qk = null;
          StoreBuffer.instructions[i].A = null;
          StoreBuffer.instructions[i].timeLeft = null;
        }
      }
      
      //bus handle
      if(bus.length > 0) {
        for(let j = 0; j < adderRS.capacity; j++) {
          if(adderRS.instructions[j].busy == 1 && adderRS.instructions[j].qj == bus[0].tag) {
            adderRS.instructions[j].vj = bus[0].value;
            adderRS.instructions[j].qj = null;
          }
          if(adderRS.instructions[j].busy == 1 && adderRS.instructions[j].qk == bus[0].tag) {
            adderRS.instructions[j].vk = bus[0].value;
            adderRS.instructions[j].qk = null;
          }
        }
        for(let j = 0; j < multRS.capacity; j++) {
          if(multRS.instructions[j].busy == 1 && multRS.instructions[j].qj == bus[0].tag) {
            multRS.instructions[j].vj = bus[0].value;
            multRS.instructions[j].qj = null;
          }
          if(multRS.instructions[j].busy == 1 && multRS.instructions[j].qk == bus[0].tag) {
            multRS.instructions[j].vk = bus[0].value;
            multRS.instructions[j].qk = null;
          }
        }
        for(let j = 0; j < LoadBuffer.capacity; j++) {
          if(LoadBuffer.instructions[j].busy == 1 && LoadBuffer.instructions[j].qj == bus[0].tag) {
            LoadBuffer.instructions[j].vj = bus[0].value;
            LoadBuffer.instructions[j].qj = null;
          }
        }
        for(let j = 0; j < StoreBuffer.capacity; j++) {
          if(StoreBuffer.instructions[j].busy == 1 && StoreBuffer.instructions[j].qj == bus[0].tag) {
            StoreBuffer.instructions[j].vj = bus[0].value;
            StoreBuffer.instructions[j].qj = null;
          }
        }
        for(let j = 0; j < File.registers[0].length; j++) {
          if(File.registers[0][j] == bus[0].tag) {
            File.registers[1][j] = bus[0].value;
            File.registers[0][j] = 0;
          }
        }
        bus.shift();
      }
      console.log('Clock: ', clock);
      console.log('adder rs: ');
      adderRS.displayRS();
      console.log('mult rs: ');
      multRS.displayRS();
      console.log('Load Buffer: ');
      LoadBuffer.displayRS();
      console.log('Store Buffer: ');
      StoreBuffer.displayRS();
      console.log('Register File: ');
      File.displayRF();
      console.log('Data Cache: ');
      DataCache.displayCache();
      clock += 1;
      if(!(dontIssueAdd || dontIssueMult || dontIssueLoad || dontIssueStore)) {
        instructionQueue.shift();
      }
      let allRSisDone = checkallRSisDone();
      if(instructionQueue.length == 0 && bus.length == 0 && allRSisDone) {
        break;
      }
    }
    
  })
  .catch(error => {
    console.error(error);
  });

 