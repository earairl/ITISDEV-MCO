# ITISDEV-MCO

## Dev Tools and Notes
- Install Tailwind CSS Intellisense extension in VSCode
- Tailwind Fold is a useful extension to hide tailwind css, use wisely :p
- This README isn't finished, probably some inaccuracies hehe
- if you run just "npm install" it usually downloads all the needed dependencies found in the package.json

## Project Setup and Installation (Work In Progress)

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

## Installation Guide (Two Ways)

## Local Host
### 1. Clone or Extract the Project
- If using a ZIP file, unzip `filename`.
- Move the extracted `filename` folder to a safe directory.
- Open **Command Prompt** and navigate to the project directory:

 ``` sh
  cd path\to\CCAPDEV-Phase3-Group10
 ```

### 2. Install Dependencies
Run the following command to install all required packages:

```sh
npm install dotenv express nodemon mongoose
```

### 3. Run the Server
Start the Node.js server with:

```sh
npm run dev
```
- The server will be listening on **port 3000**.

### 4. Open the Web Application
Once the server is running, open your web browser and visit:
```
http://localhost:3000
```

---

## Troubleshooting
- **If `npm run dev` does not work**, check the `package.json` file to ensure it contains:
  ```json
  "scripts": {
    "dev": "nodemon app.js"
  }
  ```

## Web Host






## Dev Tools and Notes
- Install Tailwind CSS Intellisense extension in VSCode
- Tailwind Fold is a useful extension to hide tailwind css, use wisely :p
- This README isn't finished, probably some inaccuracies hehe
- if you run just "npm install" it usually downloads all the needed dependencies found in the package.json
- use "npm run dev" to run program 

## Project Setup and Installation (Work In Progress)

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

## Installation Guide (Two Ways)

## Local Host
### 1. Clone or Extract the Project
- If using a ZIP file, unzip `filename`.
- Move the extracted `filename` folder to a safe directory.
- Open **Command Prompt** and navigate to the project directory:

 ``` sh
  cd path/yourprojectpath/
 ```

### 2. Install Dependencies
Run the following command to install all required packages:

```sh
npm install dotenv express nodemon
```

### 3. Run the Server
Start the Node.js server with:

```sh
npm run dev
```
- The server will be listening on **port 3000**.

### 4. Open the Web Application
Once the server is running, open your web browser and visit:
```
http://localhost:3000
```

---

## Troubleshooting
- **If `npm run dev` does not work**, check the `package.json` file to ensure it contains:
  ```json
  "scripts": {
    "dev": "nodemon app.js"
  }
  ```

## Web Host
TBD