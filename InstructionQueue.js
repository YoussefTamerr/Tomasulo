

import fs from 'fs';
const filePath = './Instructions.txt';
const instructionQueue=[];

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
    const words = lines[i].split(/\s+|,/);
    words.splice(4,1);

    

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
   
    const D=words[2];
    console.log("D: "+D[0].toUpperCase());
    const S1=words[2];
    const S2=words[3];
    if(S1.length>2 || S2.length>2 || D.length>2){
      throw new Error(`Line ${i+1}:Wrong memory format`)
    }
    if(S1[0].toUpperCase()!='F' || S2[0].toUpperCase()!='F'|| D[0].toUpperCase()!='F'){
      throw new Error(`Line ${i+1}:Wrong memory format only F`)
    }
    if((Number(S1[2])<0 || Number(S1[1]>6)) || (Number(S2[2])<0 || Number(S2[1]>6)) || (Number(D[2])<0 || Number(D[1]>6)) ){
      throw new Error(`Line ${i+1}:in available memory [F0-F6]`)
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
    }

    //console.log(instructionQueue);
    
    
    
    
  })
  .catch(error => {
    console.error(error);
  });
console.log(instructionQueue);
  module.exports=instructionQueue;
