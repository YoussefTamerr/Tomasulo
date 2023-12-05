
import {instruction} from './RSinstructions';
class  ReservationStation{

  

    constructor(capacity){
        this.capacity=capacity;
        this.instructions=new Array(capacity);
        this.intializeEntries();
    }

    initializeEntries() {
        for (let i = 0; i < this.capacity; i++) {
          this.instructions[i] = null;
        }
      }
  
      addInstruction(instruction){
        instruction.busy=1;
        this.instructions.push(instruction);
      }

      getInstruction(){
        return this.instructions.shift();
      }
}

export default ReservationStation;