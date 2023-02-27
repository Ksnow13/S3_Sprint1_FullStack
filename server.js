//-----------------------------------------------------------------

global.DEBUG = true;

const http = require("http");
const fs = require("fs");
const { parse } = require("querystring");
const { newToken, countToken, checkExperyDate } = require("./scripts/token");
const { tr } = require("date-fns/locale");

const server = http.createServer(async (request, response) => {
  var path = "./scripts/views/";

  switch (request.url) {
    case "/":
      response.statusCode = 200;
      path += "home.html";
      fetchFile(path);
      break;
    case "/newtoken":
      if (request.method === "POST") {
        getRequestedData(request, (result) => {
          var theNewToken = newToken(result.username);

          fs.readFile(
            __dirname + "/scripts/json/tokens.json",
            "utf-8",
            (error, data) => {
              if (error) throw error;

              let tokens = JSON.parse(data);

              let userMatch = false;

              for (x of tokens) {
                if (x.username === result.username) {
                  userMatch = true;
                }
              }
              if (DEBUG) console.log("Username already taking: " + userMatch);

              if (!userMatch) {
                response.write(`
                <!doctype html>
                <html>
                <body>
                    ${result.username} token is ${theNewToken} <br />
                    <a href="http://localhost:3000">[home]</a> <br />
                    <button><a href="http://localhost:3000/newtoken">Create another token</a></button>
                    <button><a href="http://localhost:3000">Home</a></button>

                </body>
                </html>
            `);

                response.end();
              } else {
                response.write(`
                <!doctype html>
                <html>
                <body>
                    ${result.username} token is taking. please try again <br />
                    <a href="http://localhost:3000">[home]</a> <br />
                    <button><a href="http://localhost:3000/newtoken">Create another token</a></button>
                    <button><a href="http://localhost:3000">Home</a></button>

                </body>
                </html>
            `);
              }
            }
          );
        });
      } else {
        response.statusCode = 200;
        path += "createToken.html";
        fetchFile(path);
      }
      break;
    case "/count":
      var count = await countToken();
      response.end(`
        <!doctype html>
                <html>
                <body>
                    Token count is ${count} <br />
                    <a href="http://localhost:3000">[home]</a>
                </body>
                </html>
        `);
      break;
    case "/expire":
      var expiredList = await checkExperyDate();
      response.end(`
        <!doctype html>
                <html>
                <body>
                    expired token(s) ${JSON.stringify(expiredList)} <br />
                    <a href="http://localhost:3000">[home]</a>
                </body>
                </html>
        `);

      break;
    default:
      response.statusCode = 404;
      path += "404.html";
      fetchFile(path);
      break;
  }

  //-----------------------------------------------------------

  function fetchFile(path) {
    fs.readFile(path, function (err, data) {
      if (err) {
        console.log(err);
        response.end();
      } else {
        if (DEBUG) console.log("file was served.");
        response.writeHead(response.statusCode, {
          "Content-Type": "text/html",
        });
        response.write(data);
        response.end();
      }
    });
  }
});

//server.listen(3000);

server.listen(3000, "localhost", () => {
  console.log(
    "listening on port 3000, Visit http://localhost:3000/ to view the page."
  );
  console.log("Press Ctrl C to terminate...");
});

//----------------------------------------------

function getRequestedData(request, callback) {
  const FORM_URLENCODED = "application/x-www-form-urlencoded";
  if (request.headers["content-type"] === FORM_URLENCODED) {
    var body = "";
    request.on("data", (chunk) => {
      body += chunk.toString();
    });
    request.on("end", () => {
      callback(parse(body));
    });
  } else {
    callback(null);
  }
}

//--------------------------------------------------------
