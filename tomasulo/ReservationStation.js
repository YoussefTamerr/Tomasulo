import RSinstructions from './RSinstructions.js'

class ReservationStation {
    constructor(capacity) {
        this.capacity = capacity
        this.instructions = new Array(capacity)
        for (let i = 0; i < capacity; i++) {
            this.instructions[i] = new RSinstructions(
                null,
                0,
                null,
                null,
                null,
                null,
                null,
                null
            )
        }
        //this.intializeEntries();
    }

    initializeEntries() {
        for (let i = 0; i < this.capacity; i++) {
            this.instructions[i] = null
        }
    }

    isFull() {
        var flag = true
        for (let i = 0; i < this.capacity; i++) {
            if (this.instructions[i].busy == 0) {
                flag = false
                break
            }
        }
        return flag
    }

    addInstruction(tag, op, vj, vk, qj, qk, A) {
        const inst = new RSinstructions(tag, 1, op, vj, vk, qj, qk, A)
        if (this.isFull()) {
            throw new Error('Cannot add as RS is full')
        } else {
            for (let i = 0; i < this.capacity; i++) {
                if (this.instructions[i].busy == 0) {
                    this.instructions[i] = inst
                    break
                }
            }
        }
    }

    getInstruction(i) {
        return this.instructions[i]
    }
    removeInstruction(i) {
        //remove on tag//
        const emp = new RSinstructions(
            null,
            0,
            null,
            null,
            null,
            null,
            null,
            null
        )
        this.instructions.splice(i, 1)
        this.instructions[i] = emp
    }

    displayRS() {
        for (let i = 0; i < this.capacity; i++) {
            console.log(i + ': ')
            console.log(this.instructions[i].displayInstruction())
        }
    }

    outputRS() {
        let output = []
        for (let i = 0; i < this.capacity; i++) {
            output.push(this.instructions[i].outputInstruction())
        }
        return output
    }
}
//  const Rs=new ReservationStation(3);

//  Rs.addInstruction("A1",1,0,1,0,1,0)
//  Rs.addInstruction("S1",1,0,1,0,1,0)
//  Rs.addInstruction("B1",1,0,1,0,1,0)

//  console.log(Rs.isFull());
//  Rs.displayRS();

export default ReservationStation
