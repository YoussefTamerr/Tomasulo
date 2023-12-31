# Tomasulo

## Description

This project is a simulation of the Tomasulo architecture, designed to demonstrate the functioning of reservation stations in a processor during each clock cycle. It also illustrates the behavior of the cache and the register file. Users can input assembly code, and the simulator will execute it, providing a detailed, cycle-by-cycle visualization of the process.

## Features

- **Assembly Code Execution:** Simulate how your assembly code executes in a Tomasulo-based processor.
- **Cycle-by-Cycle Visualization:** Observe the operations in reservation stations at each clock cycle.
- **Cache and Register File Tracking:** Monitor changes and states of the cache and the register file throughout the simulation.

## Installation

To set up the Tomasulo Architecture Simulator on your local machine, follow these steps:

### Prerequisites

- [Node.js](https://nodejs.org/en/download/) (v12.0 or higher recommended)
- [npm](https://www.npmjs.com/) (usually comes with Node.js)

### Steps

1. Clone the Repository:

```bash
git clone https://github.com/YoussefTamerr/Tomasulo.git
cd Tomasulo
```

2. Install Dependencies:

```bash
npm install
```

3. Start the Simulator:

```bash
npm start
```

## Usage

After starting the simulator, you will be presented with an interface to input your assembly code. Additionally, the simulator allows you to customize initial values in both the cache and the register file before the simulation begins. This feature enables you to test different scenarios and see how varying data impacts the execution process.

### Steps for Usage:

1. **Input Assembly Code:**

Enter your assembly code into the provided interface. This code will be used for the simulation.

2. **Customize Cache and Register File:**

Before starting the simulation, you have the option to add or modify values in the cache and register file. This allows you to set up specific conditions or data for your simulation.

3. **Execute and Observe:**

Once your assembly code and initial values are set, start the simulation. The simulator will execute your assembly code, allowing you to observe the operations within the reservation stations at each clock cycle. You can also monitor the state and changes of the cache and register file throughout the simulation.

This simulator is an excellent tool for educational purposes, helping users understand the intricacies of the Tomasulo architecture and how different components interact during the execution of assembly code.

