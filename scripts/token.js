//---------------------------------------

const fs = require("fs");
const path = require("path");

const logEvents = require("./logEvent");
const EventEmitter = require("events");

class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();

myEmitter.on("log", (event, level, msg) => logEvents(event, level, msg));

const crc32 = require("crc/crc32");
const { format, nextWednesday, addDays } = require("date-fns");
const { tokentxt } = require("./template");

//-----------------------------------------------------------------------------------

function countToken() {
  if (DEBUG) console.log("token.countToken(): started\n");
  if (DEBUG) console.log(Args);

  if (fs.existsSync("./scripts/json/tokens.json")) {
    return new Promise(function (resolve, reject) {
      fs.readFile(__dirname + "/json/tokens.json", "utf-8", (error, data) => {
        if (!error) {
          let tokens = JSON.parse(data);
          let count = Object.keys(tokens).length;

          if (count === 0) {
            if (DEBUG)
              console.log(
                "token.json file exists but is currently empty. config --cat to reset to default"
              );
            myEmitter.emit(
              "log",
              "token.tokenCount()",
              "WARNING",
              `token.json is currently empty.`
            );
            resolve(count);
          } else if (count > 0) {
            console.log(`Current token count is ${count}.`);
            myEmitter.emit(
              "log",
              "token.tokenCount()",
              "INFO",
              `Current token count is ${count}.`
            );
            resolve(count);
          }
        } else {
          console.log(error);
          myEmitter.emit(
            "log",
            "token.countToken()",
            "ERROR",
            "failed to count tokens"
          );
        }
      });
    });
  } else {
    console.log("token.josn file doesnt exist");
    myEmitter.emit(
      "log",
      "token.countToken()",
      "ERROR",
      "token.json file doesnt exist"
    );
  }
}

//-----------------------------------------------------------------------------------

function newToken(username) {
  if (DEBUG) console.log("token.newToken(): started\n");
  if (DEBUG) console.log(Args);

  let now = new Date();
  let expiry = addDays(now, 3);

  var tokenToEnter = JSON.parse(`{
    "username": "username",
    "email": "user@example.com",
    "phone": "5556597890",
    "token": "token",
    "created": "1969-01-31 12:30:00",
    "expiry": "1969-02-03 12:30:00",
    "confirmed": "tbd",
    "status": "valid"
}`);

  tokenToEnter.created = `${format(now, "yyyy-MM-dd HH:mm:ss")}`;
  tokenToEnter.expiry = `${format(expiry, "yyyy-MM-dd HH:mm:ss")}`;
  tokenToEnter.username = username;
  tokenToEnter.token = crc32(username).toString(16);

  if (fs.existsSync("./scripts/json/tokens.json")) {
    fs.readFile(__dirname + "/json/tokens.json", "utf-8", (error, data) => {
      if (error) throw error;

      let tokens = JSON.parse(data);
      //-----------------------------------

      let userMatch = false;

      for (x of tokens) {
        if (x.username === tokenToEnter.username) {
          userMatch = true;
        }
      }
      console.log(userMatch);

      if (!userMatch) {
        tokens.push(tokenToEnter);
        userTokens = JSON.stringify(tokens);

        fs.writeFile(__dirname + "/json/tokens.json", userTokens, (error) => {
          if (!error) {
            console.log(
              `New token ${tokenToEnter.token} was created for ${username}.`
            );
            myEmitter.emit(
              "log",
              "token.newToken()",
              "INFO",
              `New token ${tokenToEnter.token} was created for ${username}.`
            );
          } else {
            console.log(error);
            myEmitter.emit(
              "log",
              "token.newToken()",
              "ERROR",
              `failed to create token for ${username}`
            );
          }
        });
      } else {
        if (DEBUG) console.log("Error - Usersame is already taking");
        myEmitter.emit(
          "log",
          "token.newToken()",
          "ERROR",
          `username: ${username} is taking, failed to create new token.`
        );
      }
    });
  } else {
    console.log("token.josn file doesnt exist");
    myEmitter.emit(
      "log",
      "token.countToken()",
      "ERROR",
      "token.json file doesnt exist"
    );
  }
}

//-----------------------------------------------------------------------------------

const Args = process.argv.slice(2);

function tokenApp() {
  if (DEBUG) console.log("token.tokenApp(): started");
  switch (Args[1]) {
    case "--count":
      if (DEBUG) console.log("--count  token.countToken: reached");
      countToken();
      break;
    case "--new":
      if (Args.length !== 3) {
        console.log("invalid syntax. node myapp token --new [username]");
      } else {
        if (DEBUG) console.log("--new token.newToken: reached");
        newToken(Args[2]);
      }
      break;
    case "--help":
    case "--h":
    default:
      console.log(tokentxt);
  }
}

module.exports = {
  tokenApp,
  countToken,
  newToken,
};
