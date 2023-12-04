const registers={
    F0:"F0",
    F1:"F1",
    F2:"F2",
    F3:"F3",
    F4:"F4",
    F5:"F5",
    F6:"F6"
}

const registerFile = new Array(2).fill(0).map(() => new Array(6));


module.exports = { registerFile, registers };