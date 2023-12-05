import RSinstructions from "./RSinstructions.js";
  
class ReservationStation{
    constructor(capacity){
        this.capacity=capacity;
        this.instructions=new Array(capacity);
        for (let i = 0; i < capacity; i++) {
          this.instructions[i]=new RSinstructions(0,null,null,null,null,null,null)
          
        }
        //this.intializeEntries();
    }

    initializeEntries() {
        for (let i = 0; i < this.capacity; i++) {
          this.instructions[i] = null;
        }
      }
  
      addInstruction(i,op,vj,vk,qj,qk,A){
          this.instructions[i].op=op;
          this.instructions[i].vj=vj;
          this.instructions[i].vk=vk;
          this.instructions[i].qj=qj;
          this.instructions[i].qk=qk;
          this.instructions[i].A=A;
      }

      getInstruction(i){
        return this.instructions[i];
      }
      removeInstruction(i){
        this.instructions[i].Intializeinstruction();
      }
      displayRS(){
        for (let i = 0; i < this.capacity; i++) {
          console.log(i+": ")
          console.log(this.instructions[i].displayInstruction())
          
        }
        
      }
    
    }
const Rs=new ReservationStation(3);
Rs.displayRS();




//export default ReservationStation;