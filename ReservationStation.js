import RSinstructions from "./RSinstructions.js";
  
class ReservationStation{
    constructor(capacity){
        this.capacity=capacity;
        this.instructions=new Array(capacity);
        for (let i = 0; i < capacity; i++) {
          this.instructions[i]=new RSinstructions(null,0,null,null,null,null,null,null)
          
        }
        //this.intializeEntries();
    }

    initializeEntries() {
        for (let i = 0; i < this.capacity; i++) {
          this.instructions[i] = null;
        }
      }
  
      addInstruction(tag,op,vj,vk,qj,qk,A){
      const inst=new RSinstructions(tag,1,op,vj,vk,qj,qk,A);
      this.instructions.push()
      }

      getInstruction(i){
        return this.instructions[i];
      }
      removeInstruction(i){
        const emp=new RSinstructions(null,0,null,null,null,null,null,null);
        this.instructions.shift();
        this.instructions.push(emp)
      }
      displayRS(){
        for (let i = 0; i < this.capacity; i++) {
          console.log(i+": ")
          console.log(this.instructions[i].displayInstruction())
          
        }
        
      }
    
    }
// const Rs=new ReservationStation(3);
// Rs.displayRS();




export default ReservationStation;