class RegisterFile {
    constructor() {
        this.registers = new Array(2)
            .fill(null)
            .map(() => new Array(64).fill(0))
        this.IntializeQ()
    }

    IntializeQ() {
        for (let i = 0; i < 7; i++) {
            this.registers[0][i] = 0
        }
    }
    //////////////////////Register setters//////////////////////////////////

    setF0(num) {
        this.registers[1][0] = num
    }
    setF1(num) {
        this.registers[1][1] = num
    }
    setF2(num) {
        this.registers[1][2] = num
    }
    setF3(num) {
        this.registers[1][3] = num
    }
    setF4(num) {
        this.registers[1][4] = num
    }
    setF5(num) {
        this.registers[1][5] = num
    }
    setF6(num) {
        this.registers[1][6] = num
    }

    /////////////////Registers getters////////////////////////////////

    getF0() {
        return this.registers[1][0]
    }
    getF1() {
        return this.registers[1][1]
    }
    getF2() {
        return this.registers[1][2]
    }
    getF3() {
        return this.registers[1][3]
    }
    getF4() {
        return this.registers[1][4]
    }
    getF5() {
        return this.registers[1][5]
    }
    getF6() {
        return this.registers[1][6]
    }

    ////////Qi setters/////////////////////////

    setQ0(num) {
        this.registers[0][0]
    }
    setQ1(num) {
        this.registers[0][1] = num
    }
    setQ2(num) {
        this.registers[0][2] = num
    }
    setQ3(num) {
        this.registers[0][3] = num
    }
    setQ4(num) {
        this.registers[0][4] = num
    }
    setQ5(num) {
        this.registers[0][5] = num
    }
    setQ6(num) {
        this.registers[0][6] = num
    }

    /////////Qi getters/////////////////////

    getQ0() {
        return this.registers[0][0]
    }
    getQ1() {
        return this.registers[0][1]
    }
    getQ2() {
        return this.registers[0][2]
    }
    getQ3() {
        return this.registers[0][3]
    }
    getQ4() {
        return this.registers[0][4]
    }
    getQ5() {
        return this.registers[0][5]
    }
    getQ6() {
        return this.registers[0][6]
    }

    displayRF() {
        console.log(' Qi    ' + 'Ri    ')
        for (let i = 0; i < this.registers[0].length; i++) {
            if (i > 31) {
                console.log(
                    'R' +
                        (i - 32) +
                        ': ' +
                        this.registers[0][i] +
                        ' | ' +
                        this.registers[1][i]
                )
            } else {
                console.log(
                    'F' +
                        i +
                        ': ' +
                        this.registers[0][i] +
                        ' | ' +
                        this.registers[1][i]
                )
            }
        }
    }

    outputRF() {
        let output = []
        for (let i = 0; i < this.registers[0].length; i++) {
            if (i > 31) {
                output.push({
                    type: 'R' + (i - 32),
                    q: this.registers[0][i],
                    value: this.registers[1][i],
                    index: i,
                })
            } else {
                output.push({
                    type: 'F' + i,
                    q: this.registers[0][i],
                    value: this.registers[1][i],
                    index: i,
                })
            }
        }
        return output
    }
}
export default RegisterFile

// const RF=new RegisterFile()
// RF.setF0(1.33);
// console.log(RF.getF0());
// RF.displayRF();
