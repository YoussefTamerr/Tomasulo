const registers=require('./RegisterFile');
const INST=require('./InstructionsEnum');
const fs = require('fs');
const filePath = 'C:/Users/moham/OneDrive/Desktop/Tomasulo/Instructions.txt';
const instructionQueue=[];

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

 
if(words.length!=4){
  throw new Error(`Line ${i+1}:Wrong instruction format`)
}
    for(let j=0;j<words.length;j++){
      words[j]=capitalizeWord(words[j]);

    }
    if(!INST.hasOwnProperty(words[0])){
      throw new Error(`Line ${i+1}:Inavailable instruction is used`)
    }
    instructionQueue.push(words);
    }


    console.log(instructionQueue);
    
    
    
    
  })
  .catch(error => {
    console.error(error);
  });

  module.exports=instructionQueue;
