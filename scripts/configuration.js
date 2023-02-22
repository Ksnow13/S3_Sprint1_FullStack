//---------------------------------------

const fs = require("fs");

const logEvents = require("./logEvent");
const EventEmitter = require("events");

class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();

myEmitter.on("log", (event, level, msg) => logEvents(event, level, msg));

const { configurationJson, configtxt } = require("./template");
const { match } = require("assert");

function showConfig() {
  if (DEBUG) console.log("config.showConfig(): started\n");

  if (fs.existsSync("./scripts/json/config.json")) {
    fs.readFile(__dirname + "/json/config.json", (error, data) => {
      if (!error) {
        console.log(JSON.parse(data));

        myEmitter.emit(
          "log",
          "config.displayConfig()",
          "INFO",
          "config.json displayed"
        );
      } else {
        console.log(error);
        myEmitter.emit(
          "log",
          "config.displayConfig()",
          "ERROR",
          "failed to display config.json"
        );
      }
    });
  } else {
    console.log("config.json file doesnt exist");
    myEmitter.emit(
      "log",
      "config.displayConfig()",
      "ERROR",
      "config.json file doesnt exist"
    );
  }
}

//----------------------------------------------------------------------

function setConfig() {
  if (DEBUG) console.log("config.setConfig(): started\n");
  if (DEBUG) console.log(Args);

  let setMatch = false;

  if (fs.existsSync("./scripts/json/config.json")) {
    fs.readFile(__dirname + "/json/config.json", (error, data) => {
      if (!error) {
        if (DEBUG) console.log(JSON.parse(data));

        let cfgData = JSON.parse(data);

        for (key of Object.keys(cfgData)) {
          if (Args[2] === key) {
            cfgData[key] = Args[3];
            setMatch = true;
          }
        }

        if (setMatch) {
          if (DEBUG) console.log(cfgData);

          data = JSON.stringify(cfgData, null, 2);

          fs.writeFile(__dirname + "/json/config.json", data, (error) => {
            if (error) throw error;
            if (DEBUG) console.log("Config file successfully updated.");
            myEmitter.emit(
              "log",
              "config.setConfig()",
              "INFO",
              `config.json "${Args[2]}": updated to "${Args[3]}"`
            );
          });
        } else if (!setMatch) {
          console.log(`invalid key: ${Args[2]}, try another.`);
          myEmitter.emit(
            "log",
            "config.setConfig()",
            "WARNING",
            `invalid key: ${Args[2]}`
          );
        }
      } else {
        console.log(error);
        myEmitter.emit(
          "log",
          "config.setConfig()",
          "ERROR",
          "failed to set config.json"
        );
      }
    });
  } else {
    console.log("config.json file doesnt exist");
    myEmitter.emit(
      "log",
      "config.setConfig()",
      "ERROR",
      "config.json file doesnt exist"
    );
  }
}

//---------------------------------------------------------------------------

function resetConfig() {
  if (DEBUG) console.log("config.ressetConfig(): started\n");
  if (DEBUG) console.log(Args);

  if (fs.existsSync("./scripts/json/config.json")) {
    let defaultConfigData = JSON.stringify(configurationJson, null, 2);
    fs.readFile(__dirname + "/json/config.json", (error, data) => {
      if (!error) {
        fs.writeFile(
          __dirname + "/json/config.json",
          defaultConfigData,
          (error) => {
            if (error) throw error;
            if (DEBUG) console.log("Config file reset to original state");
            myEmitter.emit(
              "log",
              "config.resetConfig()",
              "INFO",
              "config.json reset to original state."
            );
          }
        );
      } else {
        console.log(error);
        myEmitter.emit(
          "log",
          "config.resetConfig()",
          "ERROR",
          "failed to reset config.json"
        );
      }
    });
  } else {
    console.log("config.json file doesnt exist");
    myEmitter.emit(
      "log",
      "config.resetConfig()",
      "ERROR",
      "config.json file doesnt exist"
    );
  }
}

//---------------------------------------------------------------------------

const Args = process.argv.slice(2);

function configurationApp() {
  if (DEBUG) console.log("config.configurationApp(): started");

  switch (Args[1]) {
    case "--show":
      if (DEBUG) console.log("--show  config.showConfig(): reached");
      showConfig();
      break;
    case "--set":
      if (DEBUG) console.log("--set config.setConfig(): reached");
      setConfig();
      break;
    case "--reset":
      if (DEBUG) console.log("--reset config.resetConfig(): reached");
      resetConfig();
      break;
    case "--help":
    case "--h":
    default:
      console.log(configtxt);
  }
}

module.exports = {
  configurationApp,
};
