//

const configurationJson = {
  name: "AppConfigCLI",
  version: "1.0.0",
  description: "The Command Line Interface (CLI) for the MyApp.",
  main: "myapp.js",
  superuser: "adm1n",
  database: "exampledb",
};

//--------------------

const tokenJson = [
  {
    username: "example_username",
    email: "user@example.com",
    phone: "0000000000",
    token: "example_token",
    created: "1969-01-31 12:30:00",
    expiry: "1969-02-03 12:30:00",
    confirmed: "tbd",
    status: "valid",
  },
];

//---------------------

const folders = ["models", "views", "routes", "logHistory", "json"];

//--------------------

const usagetxt = `

index <command> <option>

Usage:

index --help                            displays all help options
index init --all                        creates all folders and files
index init --mk                         creates all folders
index init --cat                        creates the config file with default settings
index config --show                     displays a list of the current config settings
index config --reset                    resets the config file with default settings
index config --set                      sets a specific config setting
index token --count                     displays a count of the tokens created
index token --list                      list all the usernames with tokens
index token --new <username>            generates a token for a given username, saves tokens to the json file
index token --upd p <username> <phone>  updates the json entry with phone number
index token --upd e <username> <email>  updates the json entry with email
index token --search u <username>       searches a token for a given username
index token --search e <email>          searches a token for a given email
index token --search p <phone>          searches a token for a given phone number

`;

//-------------------

const inittxt = `

myapp init <command> <option>

Usage:

myapp init --all          creates the folder structure and config file
myapp init --mk           creates the folder structure
myapp init --cat          creates the config file with default settings

`;

//------------------

const configtxt = `

myapp <command> <option>

Usage:

myapp config --show     displays a list of the current config settings
myapp config --reset    resets the config file with default settings
myapp config --set      sets a specific config setting

`;

//---------------------

const tokentxt = `

myapp <command> <option>

Usage:

myapp token --count                     displays a count of the tokens created
myapp token --list                      list all the usernames with tokens
myapp token --new <username>            generates a token for a given username, saves tokens to the json file
myapp token --upd p <username> <phone>  updates the json entry with phone number
myapp token --upd e <username> <email>  updates the json entry with email
myapp token --search u <username>       searches a token for a given username
myapp token --search e <email>          searches a token for a given email
myapp token --search p <phone>          searches a token for a given phone number

`;

module.exports = {
  folders,
  configurationJson,
  tokenJson,
  usagetxt,
  inittxt,
  configtxt,
  tokentxt,
};
