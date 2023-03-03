/*************************
 * Folder Name: Sprint1
 * Purpose: Full Stack sprint 1: build a simple CLI for a web application that needs to confirm new user accounts.
 *
 * see usage.txt file
 *
 * Start Date: 16 Feb 2023
 * Authors: Kyle S, Ken C, Tyler P, Kayleigh M
 *
 *************************/

// global.debug to help with debuging

global.DEBUG = true;

// getting functions and data from other files

const { initializeApp } = require("./scripts/initialize");

const { configurationApp } = require("./scripts/configuration");

const { tokenApp } = require("./scripts/token");

const { usagetxt } = require("./scripts/template");

// main switch statement for the CLI

const Args = process.argv.slice(2);
if (DEBUG)
  if (Args.length >= 1) console.log(`Arguments entered for index.js: `, Args);

switch (Args[0]) {
  case "init":
  case "i":
    if (DEBUG) console.log(Args[0], " - initializeApp() was reached\n");
    initializeApp();
    break;
  case "config":
  case "c":
    if (DEBUG) console.log(Args[0], " - configurationApp() was reached\n");
    configurationApp();
    break;
  case "token":
  case "t":
    if (DEBUG) console.log(Args[0], " - tokenApp() was reached\n");
    tokenApp();
    break;
  case "--help":
  case "--h":
  default:
    console.log(usagetxt);
}
