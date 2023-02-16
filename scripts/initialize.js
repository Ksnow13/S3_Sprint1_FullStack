//

const fs = require("fs");

const fsPromises = require("fs").promises;

const path = require("path");

const eventLogs = require("./logEvent");
const EventEmitter = require("events");
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();

//------------------------------------------------------------------------

myEmitter.on("log", (event, level, msg) => eventLogs(event, level, msg));

//---------------------------------------------------------------------------

const {
  folders,
  configurationJson,
  tokenJson,
  usagetxt,
  inittxt,
} = require("./template");

function createFolders() {
  if (DEBUG) console.log("init.createFolders(): started\n");

  let count = 0;
  let match = 0;

  if (DEBUG) console.log("List of all Folders:");

  folders.forEach((ele) => {
    if (DEBUG) console.log(ele);
    try {
      if (!fs.existsSync(path.join(__dirname, ele))) {
        fsPromises.mkdir(path.join(__dirname, ele));
        count++;
      } else if (fs.existsSync(path.join(__dirname, ele))) {
        match++;
      }
    } catch (err) {
      console.log(err);
    }
  });

  console.log("\n");

  if (DEBUG) console.log(`${match} folders found that already existed`);

  if (count === 0) {
    console.log(" ** all folder alreadys exist **\n");
    myEmitter.emit(
      "log",
      "init.createFolders()",
      "INFO",
      "All folders already existed."
    );
  } else if (count < folders.length && match > 0) {
    console.log(
      `** ${count} of ${folders.length} total folders were created **\n`
    );
    myEmitter.emit(
      "log",
      "init.createFolders()",
      "INFO",
      count + " of " + folders.length + " folders needed to be created."
    );
  } else if (match === 0) {
    console.log(" ** All folders successfully created **\n");
    myEmitter.emit(
      "log",
      "init.createFolders()",
      "INFO",
      "All folders successfully created."
    );
  }
}

//---------------------------------------------------------------------------------------

function createFiles() {
  if (DEBUG) console.log("init.createFiles(): started\n");

  if (fs.existsSync("./scripts/json")) {
    try {
      let configdata = JSON.stringify(configurationJson, null, 2);

      if (!fs.existsSync(path.join(__dirname, "./scripts/json/config.json"))) {
        if (fs.existsSync("./scripts/json/config.json")) {
          console.log("config.json file already exists");
          myEmitter.emit(
            "log",
            "init.createFiles()",
            "INFO",
            "config.json already exists."
          );
        } else {
          fs.writeFile("./scripts/json/config.json", configdata, (err) => {
            if (err) {
              console.log(err);
              myEmitter.emit(
                "log",
                "init.createFiles()",
                "ERROR",
                "config.json creation was unsuccessful."
              );
            } else {
              if (DEBUG) console.log("Data written to config file");
              myEmitter.emit(
                "log",
                "init.createFiles()",
                "INFO",
                "config.json successfully created."
              );
            }
          });
        }
      }

      let tokendata = JSON.stringify(tokenJson, null, 2);

      if (!fs.existsSync(path.join(__dirname, "./scripts/json/tokens.json"))) {
        if (fs.existsSync("./scripts/json/tokens.json")) {
          console.log("tokens.json file already exists");
          myEmitter.emit(
            "log",
            "init.createFiles()",
            "INFO",
            "token.json already exists."
          );
        } else {
          fs.writeFile("./scripts/json/tokens.json", tokendata, (err) => {
            if (err) {
              console.log(err);
              myEmitter.emit(
                "log",
                "init.createFiles()",
                "ERROR",
                "token.json creation was unsuccessful."
              );
            } else {
              if (DEBUG) console.log("Data written to tokens file");
              myEmitter.emit(
                "log",
                "init.createFiles()",
                "INFO",
                "token.json successfully created."
              );
            }
          });
        }
      }
    } catch (err) {
      console.log(err);
    }
  } else {
    console.log("folder doesn't exist --mk first before --cat");
  }
}

//---------------------------------------------------------------------------------------

const myArgs = process.argv.slice(2);

function initializeApp() {
  if (DEBUG) console.log("init.initailizinApp(): started");

  switch (myArgs[1]) {
    case "--mk":
      if (DEBUG) console.log("init.createFolders(): reached");
      createFolders();
      myEmitter.emit("log", "init --mk", "INFO", "Create all folders.");
      break;
    case "--cat":
    case "--c":
      if (DEBUG) console.log("init.createFiles(): reached");
      createFiles();
      break;
    case "--help":
    case "--h":
    default:
      console.log(inittxt);
  }
}

module.exports = {
  initializeApp,
};
