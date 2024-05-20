# BookChain Setup

## Introduction

This project provides a template for building a React application integrated with Truffle for smart contract development. Below are the steps to create the project from scratch and instructions for those who want to clone and run the project.

## Creating the Project from Scratch

1. **Create a Project Folder**: Open your terminal and create a folder for your project.
   ```bash
   mkdir my-react-truffle-app
   cd my-react-truffle-app
   ```

2. **Initialize npm**: Initialize npm in your project folder.
   ```bash
   npm init
   ```

3. **Change Entry Point**: Update the entry point to `truffle-config.js` in `package.json`.

4. **Install Dependencies**: Install necessary dependencies.
   ```bash
   npm i
   npm install truffle --save-dev
   ```

5. **Initialize Truffle**: Initialize Truffle inside your project.
   ```bash
   truffle init
   ```

6. **Compile Contracts**: Compile your smart contracts.
   ```bash
   truffle compile
   ```

7. **Add Migration Scripts**: Create migration scripts for deploying contracts.

8. **Migrate Contracts**: Migrate your contracts to the blockchain.
   ```bash
   truffle migrate
   ```
   **Note**: Before migrating, ensure that Ganache is running, as the contracts will be deployed on it.

## After Cloning

1. **Start Ganache**: Ensure that Ganache is running before proceeding with migration.

2. **Update constant.js**: Inside the `Constant` folder.
   ```javascript
   // src/components/Constant/constant.js
   const contractConstants = {
       contractAddress: "<Your_Contract_Address>",
       contractABI: "<Your_Contract_ABI>"
   };

   export default contractConstants;
   ```

## Running the React App

1. **Start the React App**: 
   ```bash
   npm start
   ```

2. **View the App**: 
   Open your browser and go to `http://localhost:3000/` to view the React app.
