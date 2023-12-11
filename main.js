import ReservationStation from './tomasulo/ReservationStation.js'
import RSinstructions from './tomasulo/RSinstructions.js'
import RegisterFile from './tomasulo/RegisterFile.js'
import LRUCache from './tomasulo/LRUCache.js'

const codeEditor = document.getElementById('code-editor')
const runButton = document.getElementById('submit-code')
const saveButton = document.getElementById('save-config')
const resetRegisterButton = document.getElementById('reset-registers')
const resetCacheButton = document.getElementById('reset-cache')
const selectedCacheSelect = document.getElementById('selected-cache')

const _config = {}

let File = new RegisterFile()

let oldCapacity = 64
let DataCache = new LRUCache(oldCapacity)
for (let i = 0; i < 64; i++) {
    DataCache.put(i, 0)
}

save()
runButton.addEventListener('click', run)
saveButton.addEventListener('click', save)
resetRegisterButton.addEventListener('click', resetRegisters)
resetCacheButton.addEventListener('click', resetCache)

function output(
    clock,
    addersRSOutput,
    multRSOutput,
    LoadBufferOutput,
    StoreBufferOutput,
    registerFileOutput,
    DataCacheInput
) {
    let h4 = document.createElement('h4')
    h4.textContent = `Clock Cycles: ${clock}`
    let container = document.createElement('div')
    container.id = 'output-container'
    container.appendChild(h4)
    container.classList.add('output-container')
    document.getElementById('tab').appendChild(container)

    addersRSOutput.forEach((data) => {
        createTable(container, 'adders-rs', 'Adders RS', data)
    })
    multRSOutput.forEach((data) => {
        createTable(container, 'mult-rs', 'Multiplication RS', data)
    })
    LoadBufferOutput.forEach((data) => {
        createTable(container, 'sb', 'Store Buffer', data)
    })
    StoreBufferOutput.forEach((data) => {
        createTable(container, 'lb', 'Load Buffer', data)
    })

    showRegisters(container, registerFileOutput)
    showCache(container, DataCacheInput)
}

function showRegisters(parent, registerFileOutput) {
    let table = document.getElementById('registers-table')
    let newTableQ = table.cloneNode(true)
    let newTableV = table.cloneNode(true)

    newTableQ.id = 'registers-table-q'
    newTableV.id = 'registers-table-v'

    newTableQ.removeChild(newTableQ.childNodes[0])
    newTableV.removeChild(newTableV.childNodes[0])

    let registerCells = newTableQ.querySelectorAll('.register-cell')
    for (let i = 0; i < registerCells.length; i++) {
        let cell = registerCells[i]
        cell.classList.remove('register-cell')
        cell.classList.add('register-cell-q')
        cell.id = `q-${cell.id}`
        cell.textContent = registerFileOutput[i].q
    }

    registerCells = newTableV.querySelectorAll('.register-cell')
    for (let i = 0; i < registerCells.length; i++) {
        let cell = registerCells[i]
        cell.classList.remove('register-cell')
        cell.classList.add('register-cell-v')
        cell.id = `v-${cell.id}`
        cell.textContent = registerFileOutput[i].value
    }

    let titleQ = document.createElement('h5')
    titleQ.textContent = 'Qi'
    let titleV = document.createElement('h5')
    titleV.textContent = 'Vi'

    parent.appendChild(titleQ)
    parent.appendChild(newTableQ)
    parent.appendChild(titleV)
    parent.appendChild(newTableV)
}

function showCache(parent, cacheList) {
    const table = document.createElement('table')
    table.id = 'cache-table'

    const heading = document.createElement('h5')
    heading.textContent = 'Cache'
    table.appendChild(heading)

    let trH
    let trD

    for (let i = 0; i < cacheList.length; i++) {
        if (i % 32 === 0) {
            trH = document.createElement('tr')
            trD = document.createElement('tr')
            table.appendChild(trH)
            table.appendChild(trD)
        }

        const th = document.createElement('th')
        const td = document.createElement('td')

        th.textContent = cacheList[i].key
        td.textContent = cacheList[i].value

        td.classList.add('cache-cell-a')

        td.id = `c${cacheList[i].key}`
        trH.appendChild(th)
        trD.appendChild(td)
    }
    table.appendChild(trH)
    table.appendChild(trD)

    parent.appendChild(table)
}

function displayCache(DataCache) {
    const cacheList = []

    console.log(DataCache.cache)
    for (const [key, value] of DataCache.cache) {
        cacheList.push({ key, value })
    }

    const table = document.createElement('table')
    table.id = 'cache-table'

    const heading = document.createElement('h3')
    heading.textContent = 'Cache'
    table.appendChild(heading)

    let trH
    let trD

    for (let i = 0; i < cacheList.length; i++) {
        if (i % 32 === 0) {
            trH = document.createElement('tr')
            trD = document.createElement('tr')
            table.appendChild(trH)
            table.appendChild(trD)
        }

        const th = document.createElement('th')
        const td = document.createElement('td')

        th.textContent = cacheList[i].key
        td.textContent = cacheList[i].value

        td.classList.add('cache-cell')

        td.id = `c${cacheList[i].key}`
        trH.appendChild(th)
        trD.appendChild(td)

        const option = document.createElement('option')
        option.value = `c${cacheList[i].key}`
        option.textContent = `Entry ${cacheList[i].key}`
        selectedCacheSelect.appendChild(option)
    }
    table.appendChild(trH)
    table.appendChild(trD)
    document.getElementById('settings-3').innerHTML = ''
    document.getElementById('settings-3').appendChild(table)
}

function resetRegisters() {
    const registerCells = document.querySelectorAll('.register-cell')
    registerCells.forEach((cell) => {
        cell.textContent = '0'
    })
}

function resetCache() {
    const cacheCells = document.querySelectorAll('.cache-cell')
    cacheCells.forEach((cell) => {
        cell.textContent = '0'
    })
}

function save() {
    console.log('save')
    const registerAddress = document.getElementById('selected-register').value
    const cacheAddress = document.getElementById('selected-cache').value
    const registerValue = document.getElementById('reg-value').value
    const cacheValue = document.getElementById('cache-value').value

    // Latencies

    const addLatency = document.getElementById('addLatency').value
    const subLatency = document.getElementById('subLatency').value
    const multLatency = document.getElementById('multLatency').value
    const divLatency = document.getElementById('divLatency').value
    const loadLatency = document.getElementById('loadLatency').value
    const storeLatency = document.getElementById('storeLatency').value

    // Capacities

    const dataCacheCapacity = document.getElementById('DataCache').value
    const storeBufferCapacity = document.getElementById('StoreBuffer').value
    const loadBufferCapacity = document.getElementById('LoadBuffer').value
    const adderRSCapacity = document.getElementById('adderRS').value
    const multRSCapacity = document.getElementById('multRS').value

    if (dataCacheCapacity != oldCapacity) {
        oldCapacity = dataCacheCapacity
        DataCache = new LRUCache(dataCacheCapacity)
        for (let i = 0; i < dataCacheCapacity; i++) {
            insertToDataCache(i, 0)
        }
    }

    const insertToRF = (registerNum, value) => {
        File.registers[1][registerNum] = value // 0 to 31 f, 32 to 63 r
    }

    const insertToDataCache = (address, value) => {
        // DataCache.delete(address)
        DataCache.put(address, value)
    }

    _config.DataCache = DataCache

    displayCache(DataCache)

    if (addLatency) {
        _config.addLatency = addLatency
    }
    if (subLatency) {
        _config.subLatency = subLatency
    }
    if (multLatency) {
        _config.multLatency = multLatency
    }
    if (divLatency) {
        _config.divLatency = divLatency
    }
    if (loadLatency) {
        _config.loadLatency = loadLatency
    }
    if (storeLatency) {
        _config.storeLatency = storeLatency
    }
    if (dataCacheCapacity) {
        _config.dataCacheCapacity = dataCacheCapacity
    }
    if (storeBufferCapacity) {
        _config.storeBufferCapacity = storeBufferCapacity
    }
    if (loadBufferCapacity) {
        _config.loadBufferCapacity = loadBufferCapacity
    }
    if (adderRSCapacity) {
        _config.adderRSCapacity = adderRSCapacity
    }
    if (multRSCapacity) {
        _config.multRSCapacity = multRSCapacity
    }

    if (registerAddress && registerValue) {
        const registerCell = document.getElementById(registerAddress)
        registerCell.textContent = registerValue
    }

    if (cacheAddress && cacheValue) {
        const cacheCell = document.getElementById(cacheAddress)
        cacheCell.textContent = cacheValue
    }

    const registerCells = document.querySelectorAll('.register-cell')
    registerCells.forEach((cell) => {
        if (cell.id[0] == 'f') {
            insertToRF(cell.id.slice(1) * 1, cell.textContent * 1)
        } else if (cell.id[0] == 'r') {
            insertToRF(cell.id.slice(1) * 1 + 32, cell.textContent * 1)
        }
    })

    const cacheCells = document.querySelectorAll('.cache-cell')
    cacheCells.forEach((cell) => {
        insertToDataCache(cell.id.slice(1), cell.textContent * 1)
    })
}

function run() {
    if (codeEditor.reportValidity()) {
        let code = codeEditor.value
        _config.code = code
        save()
        main(_config)
    }
}

function createTable(parent, containerClass, title, data) {
    let container = document.createElement('div')
    container.classList.add(containerClass)
    let table = document.createElement('table')
    table.classList.add('table')
    let h3 = document.createElement('h5')

    h3.textContent = title

    let trH = document.createElement('tr')
    let trD = document.createElement('tr')

    let th1 = document.createElement('th')
    let th2 = document.createElement('th')
    let th3 = document.createElement('th')
    let th4 = document.createElement('th')
    let th5 = document.createElement('th')
    let th6 = document.createElement('th')
    let th7 = document.createElement('th')
    let th8 = document.createElement('th')

    th1.textContent = 'Tag'
    th2.textContent = 'Busy'
    th3.textContent = 'Op'
    th4.textContent = 'Vj'
    th5.textContent = 'Vk'
    th6.textContent = 'Qj'
    th7.textContent = 'Qk'
    th8.textContent = 'Time Left'

    trH.appendChild(th1)
    trH.appendChild(th2)
    trH.appendChild(th3)
    trH.appendChild(th4)
    trH.appendChild(th5)
    trH.appendChild(th6)
    trH.appendChild(th7)
    trH.appendChild(th8)

    let td1 = document.createElement('td')
    let td2 = document.createElement('td')
    let td3 = document.createElement('td')
    let td4 = document.createElement('td')
    let td5 = document.createElement('td')
    let td6 = document.createElement('td')
    let td7 = document.createElement('td')
    let td8 = document.createElement('td')

    td1.textContent = data.tag
    td2.textContent = data.busy
    td3.textContent = data.op
    td4.textContent = data.vj
    td5.textContent = data.vk
    td6.textContent = data.qj
    td7.textContent = data.qk
    td8.textContent = data.timeLeft

    trD.appendChild(td1)
    trD.appendChild(td2)
    trD.appendChild(td3)
    trD.appendChild(td4)
    trD.appendChild(td5)
    trD.appendChild(td6)
    trD.appendChild(td7)
    trD.appendChild(td8)

    table.appendChild(h3)
    table.appendChild(trH)
    table.appendChild(trD)
    container.appendChild(table)
    parent.appendChild(container)
}

function main(_config) {
    document.getElementById('tab').innerHTML = ''
    let titleTab = document.createElement('h3')
    titleTab.textContent = 'Output'
    document.getElementById('tab').appendChild(titleTab)

    const DataCache = _config.DataCache
    const StoreBuffer = new ReservationStation(_config.storeBufferCapacity)
    const LoadBuffer = new ReservationStation(_config.loadBufferCapacity)
    const adderRS = new ReservationStation(_config.adderRSCapacity)
    const multRS = new ReservationStation(_config.multRSCapacity)

    let instructionQueue = []
    let instructionQueue2 = []
    let bus = []

    const addLatency = _config.addLatency
    const subLatency = _config.subLatency
    const multLatency = _config.multLatency
    const divLatency = _config.divLatency
    const loadLatency = _config.loadLatency
    const storeLatency = _config.storeLatency

    let clock = 1

    const checkallRSisDone = () => {
        let flag = true
        for (let i = 0; i < adderRS.capacity; i++) {
            if (adderRS.instructions[i].busy == 1) {
                flag = false
                break
            }
        }
        for (let i = 0; i < multRS.capacity; i++) {
            if (multRS.instructions[i].busy == 1) {
                flag = false
                break
            }
        }
        for (let i = 0; i < LoadBuffer.capacity; i++) {
            if (LoadBuffer.instructions[i].busy == 1) {
                flag = false
                break
            }
        }
        for (let i = 0; i < StoreBuffer.capacity; i++) {
            if (StoreBuffer.instructions[i].busy == 1) {
                flag = false
                break
            }
        }
        return flag
    }

    const fillRSInstMem = (currentInst, index) => {
        index += 1
        let r1 = currentInst[1]
        let address = currentInst[2]
        let time = null

        let letter
        let vj = null
        let qj = null

        if (currentInst[0] == 'LD') {
            letter = 'L'
        } else if (currentInst[0] == 'SD') {
            letter = 'S'
        }

        if (currentInst[0] == 'LD') {
            time = loadLatency
        } else if (currentInst[0] == 'SD') {
            time = storeLatency
        }

        if (currentInst[0] == 'SD') {
            if (File.registers[0][(r1[1] + (r1[2] || '')) * 1] == 0) {
                vj = File.registers[1][(r1[1] + (r1[2] || '')) * 1]
            } else {
                qj = File.registers[0][(r1[1] + (r1[2] || '')) * 1]
            }
        }

        if (!(currentInst[0] == 'SD')) {
            File.registers[0][(r1[1] + (r1[2] || '')) * 1] = letter + '' + index
        }

        return new RSinstructions(
            letter + '' + index,
            1,
            address,
            vj,
            null,
            qj,
            null,
            currentInst,
            time
        )
    }

    const fillRSInstALU = (currentInst, index) => {
        index += 1
        let r1 = currentInst[2]
        let r2 = currentInst[3]
        let dest = currentInst[1]
        if (currentInst[0] == 'BNEZ') {
            r1 = currentInst[1]
        }

        let vj = null
        let vk = null
        let qj = null
        let qk = null
        let time = null

        let letter

        if (
            currentInst[0] == 'ADD' ||
            currentInst[0] == 'SUB' ||
            currentInst[0] == 'ADDI' ||
            currentInst[0] == 'SUBI' ||
            currentInst[0] == 'BNEZ'
        ) {
            letter = 'A'
        } else if (currentInst[0] == 'MUL' || currentInst[0] == 'DIV') {
            letter = 'M'
        }

        if (
            currentInst[0] == 'ADDI' ||
            currentInst[0] == 'SUBI' ||
            currentInst[0] == 'BNEZ'
        ) {
            time = 1
        }
        if (currentInst[0] == 'ADD') {
            time = addLatency
        } else if (currentInst[0] == 'SUB') {
            time = subLatency
        } else if (currentInst[0] == 'MUL') {
            time = multLatency
        } else if (currentInst[0] == 'DIV') {
            time = divLatency
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

        if (File.registers[0][(r1[1] + (r1[2] || '')) * 1] == 0) {
            vj = File.registers[1][(r1[1] + (r1[2] || '')) * 1]
        } else {
            qj = File.registers[0][(r1[1] + (r1[2] || '')) * 1]
        }
        if (
            currentInst[0] != 'ADDI' &&
            currentInst[0] != 'SUBI' &&
            currentInst[0] != 'BNEZ'
        ) {
            if (File.registers[0][(r2[1] + (r2[2] || '')) * 1] == 0) {
                vk = File.registers[1][(r2[1] + (r2[2] || '')) * 1]
            } else {
                qk = File.registers[0][(r2[1] + (r2[2] || '')) * 1]
            }
        } else {
            if (currentInst[0] != 'BNEZ') vk = currentInst[3] * 1
            else vk = currentInst[2] * 1
        }
        if (!(currentInst[0] == 'BNEZ')) {
            File.registers[0][(dest[1] + (dest[2] || '')) * 1] =
                letter + '' + index
        }

        return new RSinstructions(
            letter + '' + index,
            1,
            currentInst[0],
            vj,
            vk,
            qj,
            qk,
            currentInst,
            time
        )
    }

    const INST = {
        SUB: 'SUB',
        ADD: 'ADD',
        ADDI: 'ADDI',
        SUBI: 'SUBI',
        MUL: 'MUL',
        DIV: 'DIV',
        BNEZ: 'BNEZ',
        LD: 'LD',
        SD: 'SD',
    }
    const pattern = /^\d+$/

    function containsNumbersOnly(inputString) {
        return pattern.test(inputString)
    }

    function capitalizeWord(word) {
        return word.toUpperCase()
    }

    ;(function readInput() {
        const lines = _config.code.split('\n')

        if (lines.length == 0) {
            throw new Error('There is no instructions added to get executed')
        }

        for (let i = 0; i < lines.length; i++) {
            let words = lines[i].split(/\s+|,/)
            if (words[0] != 'LD' && words[0] != 'SD') {
                words.splice(4, 1)
            } else {
                words.splice(3, 1)
            }

            //------------------------------------------------------------------------------------------//
            //----------------------Errors checking-----------------------------------------------------//

            if (
                (words[0] == INST.SD || words[0] == INST.LD) &&
                words.length != 3
            ) {
                throw new Error(
                    `Line ${i + 1}:Wrong instruction format for ${
                        words[0]
                    } instruction`
                )
            }
            if (
                (words[0] == INST.SD || words[0] == INST.LD) &&
                !containsNumbersOnly(words[2])
            ) {
                throw new Error(
                    `Line ${i + 1}:Wrong address format for ${
                        words[0]
                    } instruction`
                )
            }
            if (
                words[0] == INST.SD ||
                words[0] == INST.LD ||
                words[0] == INST.BNEZ
            ) {
                let D = words[1]
                let S1 = words[2]
                if (D[0] == 'R' || D[0] == 'r') {
                    let x = D.slice(1) * 1 + 32
                    D = 'F' + x
                    words[1] = D
                }
                if (S1[0] == 'R' || S1[0] == 'r') {
                    let x = S1.slice(1) * 1 + 32
                    S1 = 'F' + x
                    words[2] = S1
                }
            }
            if (
                words[0] != INST.SD &&
                words[0] != INST.LD &&
                words[0] != INST.BNEZ
            ) {
                if (words.length != 4) {
                    console.log(words.length)
                    throw new Error(`Line ${i + 1}:Wrong instruction format`)
                } else {
                    let D = words[1]
                    let S1 = words[2]
                    let S2 = words[3]
                    if (D[0] == 'R' || D[0] == 'r') {
                        let x = D.slice(1) * 1 + 32
                        D = 'F' + x
                        words[1] = D
                    }
                    if (S1[0] == 'R' || S1[0] == 'r') {
                        let x = S1.slice(1) * 1 + 32
                        S1 = 'F' + x
                        words[2] = S1
                    }
                    if (S2[0] == 'R' || S2[0] == 'r') {
                        let x = S2.slice(1) * 1 + 32
                        S2 = 'F' + x
                        words[3] = S2
                    }
                    if (
                        words[0] != 'ADDI' &&
                        words[0] != 'SUBI' &&
                        words[0] != 'BNEZ'
                    ) {
                        if (S1.length > 3 || S2.length > 3 || D.length > 3) {
                            throw new Error(`Line ${i + 1}:Wrong memory format`)
                        }
                        if (
                            S1[0].toUpperCase() != 'F' ||
                            S2[0].toUpperCase() != 'F' ||
                            D[0].toUpperCase() != 'F'
                        ) {
                            throw new Error(
                                `Line ${i + 1}:Wrong memory format only F`
                            )
                        }
                        if (
                            Number(S1[2]) < 0 ||
                            Number(S1[1] > 63) ||
                            Number(S2[2]) < 0 ||
                            Number(S2[1] > 63) ||
                            Number(D[2]) < 0 ||
                            Number(D[1] > 63)
                        ) {
                            throw new Error(
                                `Line ${i + 1}:in available memory [F0-F31]`
                            )
                        }
                    } else {
                        if (words[0] === 'BNEZ') {
                            if (D.length > 3) {
                                throw new Error(
                                    `Line ${i + 1}:Wrong memory format`
                                )
                            }
                            if (D[0].toUpperCase() != 'F') {
                                throw new Error(
                                    `Line ${i + 1}:Wrong memory format only F`
                                )
                            }
                            if (Number(D[2]) < 0 || Number(D[1] > 63)) {
                                throw new Error(
                                    `Line ${i + 1}:in available memory [F0-F31]`
                                )
                            }
                        } else {
                            if (S1.length > 3 || D.length > 3) {
                                throw new Error(
                                    `Line ${i + 1}:Wrong memory format`
                                )
                            }
                            if (
                                S1[0].toUpperCase() != 'F' ||
                                D[0].toUpperCase() != 'F'
                            ) {
                                throw new Error(
                                    `Line ${i + 1}:Wrong memory format only F`
                                )
                            }
                            if (
                                Number(S1[2]) < 0 ||
                                Number(S1[1] > 63) ||
                                Number(D[2]) < 0 ||
                                Number(D[1] > 63)
                            ) {
                                throw new Error(
                                    `Line ${i + 1}:in available memory [F0-F31]`
                                )
                            }
                        }
                    }
                }
            }
            for (let j = 0; j < words.length; j++) {
                words[j] = capitalizeWord(words[j])
            }
            if (!INST.hasOwnProperty(words[0])) {
                throw new Error(`Line ${i + 1}:Inavailable instruction is used`)
            }

            //------------------------------------------------------------------------------------------//
            //----------------------End of Errors checking-----------------------------------------------------//

            instructionQueue.push(words)
            instructionQueue2.push(words)
        }

        const initialQueueLength = instructionQueue.length
        for (let i = 0; i < initialQueueLength; i++) {
            console.log('forfor')
            if (!Array.isArray(instructionQueue[i])) {
                instructionQueue = instructionQueue.splice(i, 1)
                i--
            }
        }

        while (true) {
            let currentInst = instructionQueue[0]
            let issuedNow
            let issuedNowType
            let dontIssueAdd = false
            let dontIssueMult = false
            let dontIssueLoad = false
            let dontIssueStore = false

            console.log('in for')
            for (let i = 0; i < adderRS.capacity; i++) {
                if (
                    adderRS.instructions[i].busy == 1 &&
                    adderRS.instructions[i].op == 'BNEZ' &&
                    adderRS.instructions[i].timeLeft == 0
                ) {
                    if (adderRS.instructions[i].vj != 0) {
                        instructionQueue = []
                        instructionQueue = instructionQueue2.slice(
                            adderRS.instructions[i].vk - 1
                        )
                        currentInst = instructionQueue[0]
                    }
                    adderRS.instructions[i].busy = 0
                    adderRS.instructions[i].op = null
                    adderRS.instructions[i].vj = null
                    adderRS.instructions[i].vk = null
                    adderRS.instructions[i].qj = null
                    adderRS.instructions[i].qk = null
                    adderRS.instructions[i].A = null
                    adderRS.instructions[i].timeLeft = null
                } else if (
                    adderRS.instructions[i].busy == 1 &&
                    adderRS.instructions[i].op == 'BNEZ' &&
                    adderRS.instructions[i].timeLeft > 0
                ) {
                    dontIssueAdd = true
                    dontIssueMult = true
                    dontIssueLoad = true
                    dontIssueStore = true
                }
            }

            if (currentInst) {
                if (
                    (currentInst[0] == 'ADD' ||
                        currentInst[0] == 'SUB' ||
                        currentInst[0] == 'ADDI' ||
                        currentInst[0] == 'SUBI' ||
                        currentInst[0] == 'BNEZ') &&
                    adderRS.isFull()
                ) {
                    dontIssueAdd = true
                }
                if (
                    (currentInst[0] == 'MUL' || currentInst[0] == 'DIV') &&
                    multRS.isFull()
                ) {
                    dontIssueMult = true
                }

                if (currentInst[0] == 'LD' && LoadBuffer.isFull()) {
                    dontIssueLoad = true
                }

                if (currentInst[0] == 'SD' && StoreBuffer.isFull()) {
                    dontIssueStore = true
                }

                let loadAddresses = []
                for (let i = 0; i < LoadBuffer.capacity; i++) {
                    loadAddresses.push(LoadBuffer.instructions[i].op)
                }

                let storeAddresses = []
                for (let i = 0; i < StoreBuffer.capacity; i++) {
                    storeAddresses.push(StoreBuffer.instructions[i].op)
                }

                if (
                    currentInst[0] == 'LD' &&
                    storeAddresses.includes(currentInst[2])
                ) {
                    dontIssueLoad = true
                }
                if (
                    currentInst[0] == 'SD' &&
                    loadAddresses.includes(currentInst[2]) &&
                    storeAddresses.includes(currentInst[2])
                ) {
                    dontIssueStore = true
                }

                //issue
                if (currentInst[0] == 'LD' && !dontIssueLoad) {
                    for (let i = 0; i < LoadBuffer.capacity; i++) {
                        if (LoadBuffer.instructions[i].busy == 0) {
                            LoadBuffer.instructions[i] = fillRSInstMem(
                                currentInst,
                                i
                            )
                            issuedNow = i
                            issuedNowType = 'L'
                            break
                        }
                    }
                }

                if (currentInst[0] == 'SD' && !dontIssueStore) {
                    for (let i = 0; i < StoreBuffer.capacity; i++) {
                        if (StoreBuffer.instructions[i].busy == 0) {
                            StoreBuffer.instructions[i] = fillRSInstMem(
                                currentInst,
                                i
                            )
                            issuedNow = i
                            issuedNowType = 'S'
                            break
                        }
                    }
                }

                if (
                    (currentInst[0] == 'ADD' ||
                        currentInst[0] == 'SUB' ||
                        currentInst[0] == 'ADDI' ||
                        currentInst[0] == 'SUBI' ||
                        currentInst[0] == 'BNEZ') &&
                    !dontIssueAdd
                ) {
                    for (let i = 0; i < adderRS.capacity; i++) {
                        if (adderRS.instructions[i].busy == 0) {
                            adderRS.instructions[i] = fillRSInstALU(
                                currentInst,
                                i
                            )
                            issuedNow = i
                            issuedNowType = 'A'
                            break
                        }
                    }
                }

                if (
                    (currentInst[0] == 'MUL' || currentInst[0] == 'DIV') &&
                    !dontIssueMult
                ) {
                    for (let i = 0; i < multRS.capacity; i++) {
                        if (multRS.instructions[i].busy == 0) {
                            multRS.instructions[i] = fillRSInstALU(
                                currentInst,
                                i
                            )
                            issuedNow = i
                            issuedNowType = 'M'
                            break
                        }
                    }
                }
            }

            //execute
            for (let i = 0; i < adderRS.capacity; i++) {
                //vj, vk exists ????
                if (i == issuedNow && issuedNowType == 'A') {
                    continue
                }
                if (
                    adderRS.instructions[i].busy == 1 &&
                    adderRS.instructions[i].vj != null &&
                    adderRS.instructions[i].vk != null
                ) {
                    adderRS.instructions[i].timeLeft -= 1
                }
            }
            for (let i = 0; i < multRS.capacity; i++) {
                if (i == issuedNow && issuedNowType == 'M') {
                    continue
                }
                if (
                    multRS.instructions[i].busy == 1 &&
                    multRS.instructions[i].vj != null &&
                    multRS.instructions[i].vk != null
                ) {
                    multRS.instructions[i].timeLeft -= 1
                }
            }
            for (let i = 0; i < LoadBuffer.capacity; i++) {
                if (i == issuedNow && issuedNowType == 'L') {
                    continue
                }
                if (LoadBuffer.instructions[i].busy == 1) {
                    LoadBuffer.instructions[i].timeLeft -= 1
                }
            }
            for (let i = 0; i < StoreBuffer.capacity; i++) {
                if (i == issuedNow && issuedNowType == 'S') {
                    continue
                }
                if (
                    StoreBuffer.instructions[i].busy == 1 &&
                    StoreBuffer.instructions[i].vj != null
                ) {
                    StoreBuffer.instructions[i].timeLeft -= 1
                }
            }

            //wb at -1
            for (let i = 0; i < adderRS.capacity; i++) {
                if (
                    adderRS.instructions[i].busy == 1 &&
                    adderRS.instructions[i].timeLeft == -1
                ) {
                    //File.registers[1][adderRS.instructions[i].tag[1] * 1] = adderRS.instructions[i].A;
                    //File.registers[0][adderRS.instructions[i].tag[1] * 1] = 0;
                    let value
                    if (
                        adderRS.instructions[i].op == 'ADD' ||
                        adderRS.instructions[i].op == 'ADDI'
                    ) {
                        value =
                            adderRS.instructions[i].vj +
                            adderRS.instructions[i].vk
                    } else if (
                        adderRS.instructions[i].op == 'SUB' ||
                        adderRS.instructions[i].op == 'SUBI'
                    ) {
                        value =
                            adderRS.instructions[i].vj -
                            adderRS.instructions[i].vk
                    } else {
                        // if(adderRS.instructions[i].vj != 0){
                        //     instructionQueue = []
                        //     instructionQueue = instructionQueue2.slice(adderRS.instructions[i].vk - 1)
                        // }
                    }

                    bus.push({
                        tag: adderRS.instructions[i].tag,
                        value,
                        inst: adderRS.instructions[i].A,
                    })
                    adderRS.instructions[i].busy = 0
                    adderRS.instructions[i].op = null
                    adderRS.instructions[i].vj = null
                    adderRS.instructions[i].vk = null
                    adderRS.instructions[i].qj = null
                    adderRS.instructions[i].qk = null
                    adderRS.instructions[i].A = null
                    adderRS.instructions[i].timeLeft = null
                }
            }
            for (let i = 0; i < multRS.capacity; i++) {
                if (
                    multRS.instructions[i].busy == 1 &&
                    multRS.instructions[i].timeLeft == -1
                ) {
                    //File.registers[1][multRS.instructions[i].tag[1] * 1] = multRS.instructions[i].A;
                    //File.registers[0][multRS.instructions[i].tag[1] * 1] = 0;
                    let value
                    if (multRS.instructions[i].op == 'MUL') {
                        value =
                            multRS.instructions[i].vj *
                            multRS.instructions[i].vk
                    } else if (multRS.instructions[i].op == 'DIV') {
                        value =
                            multRS.instructions[i].vj /
                            multRS.instructions[i].vk
                    }
                    bus.push({
                        tag: multRS.instructions[i].tag,
                        value,
                        inst: multRS.instructions[i].A,
                    })
                    multRS.instructions[i].busy = 0
                    multRS.instructions[i].op = null
                    multRS.instructions[i].vj = null
                    multRS.instructions[i].vk = null
                    multRS.instructions[i].qj = null
                    multRS.instructions[i].qk = null
                    multRS.instructions[i].A = null
                    multRS.instructions[i].timeLeft = null
                }
            }
            for (let i = 0; i < LoadBuffer.capacity; i++) {
                if (
                    LoadBuffer.instructions[i].busy == 1 &&
                    LoadBuffer.instructions[i].timeLeft == -1
                ) {
                    //File.registers[1][LoadBuffer.instructions[i].tag[1] * 1] = DataCache.get(LoadBuffer.instructions[i].A);
                    //File.registers[0][LoadBuffer.instructions[i].tag[1] * 1] = 0;
                    let value = DataCache.get(LoadBuffer.instructions[i].op)
                    bus.push({
                        tag: LoadBuffer.instructions[i].tag,
                        value,
                        inst: LoadBuffer.instructions[i].A,
                    })
                    LoadBuffer.instructions[i].busy = 0
                    LoadBuffer.instructions[i].op = null
                    LoadBuffer.instructions[i].vj = null
                    LoadBuffer.instructions[i].vk = null
                    LoadBuffer.instructions[i].qj = null
                    LoadBuffer.instructions[i].qk = null
                    LoadBuffer.instructions[i].A = null
                    LoadBuffer.instructions[i].timeLeft = null
                }
            }
            for (let i = 0; i < StoreBuffer.capacity; i++) {
                if (
                    StoreBuffer.instructions[i].busy == 1 &&
                    StoreBuffer.instructions[i].timeLeft == -1
                ) {
                    DataCache.put(
                        StoreBuffer.instructions[i].op,
                        StoreBuffer.instructions[i].vj
                    )
                    StoreBuffer.instructions[i].busy = 0
                    StoreBuffer.instructions[i].op = null
                    StoreBuffer.instructions[i].vj = null
                    StoreBuffer.instructions[i].vk = null
                    StoreBuffer.instructions[i].qj = null
                    StoreBuffer.instructions[i].qk = null
                    StoreBuffer.instructions[i].A = null
                    StoreBuffer.instructions[i].timeLeft = null
                }
            }

            //bus handle
            bus.sort((a, b) => {
                const indexA = instructionQueue2.indexOf(a.inst)
                const indexB = instructionQueue2.indexOf(b.inst)
                return indexA - indexB
            })
            if (bus.length > 0) {
                for (let j = 0; j < adderRS.capacity; j++) {
                    if (
                        adderRS.instructions[j].busy == 1 &&
                        adderRS.instructions[j].qj == bus[0].tag
                    ) {
                        adderRS.instructions[j].vj = bus[0].value
                        adderRS.instructions[j].qj = null
                    }
                    if (
                        adderRS.instructions[j].busy == 1 &&
                        adderRS.instructions[j].qk == bus[0].tag
                    ) {
                        adderRS.instructions[j].vk = bus[0].value
                        adderRS.instructions[j].qk = null
                    }
                }
                for (let j = 0; j < multRS.capacity; j++) {
                    if (
                        multRS.instructions[j].busy == 1 &&
                        multRS.instructions[j].qj == bus[0].tag
                    ) {
                        multRS.instructions[j].vj = bus[0].value
                        multRS.instructions[j].qj = null
                    }
                    if (
                        multRS.instructions[j].busy == 1 &&
                        multRS.instructions[j].qk == bus[0].tag
                    ) {
                        multRS.instructions[j].vk = bus[0].value
                        multRS.instructions[j].qk = null
                    }
                }
                for (let j = 0; j < LoadBuffer.capacity; j++) {
                    if (
                        LoadBuffer.instructions[j].busy == 1 &&
                        LoadBuffer.instructions[j].qj == bus[0].tag
                    ) {
                        LoadBuffer.instructions[j].vj = bus[0].value
                        LoadBuffer.instructions[j].qj = null
                    }
                }
                for (let j = 0; j < StoreBuffer.capacity; j++) {
                    if (
                        StoreBuffer.instructions[j].busy == 1 &&
                        StoreBuffer.instructions[j].qj == bus[0].tag
                    ) {
                        StoreBuffer.instructions[j].vj = bus[0].value
                        StoreBuffer.instructions[j].qj = null
                    }
                }
                for (let j = 0; j < File.registers[0].length; j++) {
                    if (File.registers[0][j] == bus[0].tag) {
                        File.registers[1][j] = bus[0].value
                        File.registers[0][j] = 0
                    }
                }
                bus.shift()
            }
            // File.displayRF()
            // DataCache.displayCache()

            // createTable('adders-rs', 'Adders RS', adderRS.outputRS()[0])

            console.log('reg', File.outputRF())
            console.log('cache', DataCache.outputCache())

            output(
                clock,
                adderRS.outputRS(),
                multRS.outputRS(),
                LoadBuffer.outputRS(),
                StoreBuffer.outputRS(),
                File.outputRF(),
                DataCache.outputCache()
            )

            clock += 1
            if (
                !(
                    dontIssueAdd ||
                    dontIssueMult ||
                    dontIssueLoad ||
                    dontIssueStore
                )
            ) {
                instructionQueue.shift()
            }
            let allRSisDone = checkallRSisDone()
            // console.log(instructionQueue.length)
            // console.log(allRSisDone)
            if (
                instructionQueue.length == 0 &&
                bus.length == 0 &&
                allRSisDone
            ) {
                break
            }
        }
        try {
            displayCache(DataCache)
            const registerCells = document.querySelectorAll('.register-cell')
            registerCells.forEach((cell) => {
                if (cell.id[0] == 'f') {
                    cell.textContent = File.registers[1][cell.id.slice(1) * 1]
                } else if (cell.id[0] == 'r') {
                    cell.textContent =
                        File.registers[1][cell.id.slice(1) * 1 + 32]
                }
            })
        } catch (error) {
            console.error(error)
        }
    })()
}
