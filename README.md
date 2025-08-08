# ITISDEV-MCO

## Dev Tools and Notes
- certain changes in react may require you to reload the whole browser, i.e. importing a component that you forgot to export

## Project Setup and Installation

### Prerequisites
Before setting up the project, ensure you have the following installed:
- **Node.js** (Download from [Node.js official website](https://nodejs.org/))
- **MongoDB** (Ensure MongoDB is installed and running)

To verify Node.js installation, run the following commands in Command Prompt:
```
node -v
npm -v
```
If both commands return version numbers, Node.js and npm are correctly installed.

---

## Installation Guide

## Local Host
### 1. Clone or Extract the Project
- If using a ZIP file, unzip `filename`.
- Move the extracted `filename` folder to a safe directory.
- Open the terminal/command line to the root directory of the project

### 2. Install Dependencies
- Navigate to both client and server directories, type `npm init` and enter, then install the backend dependencies:
```sh
npm install
```

### 3. Run the Server
Start the frontend and backend server by typing this under the respective directories:
```sh
npm run dev
```

### 4. Open the Web Application
Once the server is running, open your web browser and visit:
```
http://localhost:5173
```

---

## Troubleshooting
- **If `npm run dev` does not work**, check the `package.json` file to ensure it contains:
  ```json
  "scripts": {
    "dev": "nodemon app.js"
  }
  ```
