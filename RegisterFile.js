const registers={
    F0:"F0",
    F1:"F1",
    F2:"F2",
    F3:"F3",
    F4:"F4",
    F5:"F5",
    F6:"F6"
}

const registerFile = new Array(3).fill(0).map(() => new Array(6));
registerFile[0][0]=registers.F0;
registerFile[0][1]=registerFile.F1;
registerFile[0][2]=registers.F2;
registerFile[0][3]=registers.F3;
registerFile[0][4]=registers.F4;
registerFile[0][5]=registers.F5;
registerFile[0][6]=registers.F6;

module.exports = { registerFile, registers };