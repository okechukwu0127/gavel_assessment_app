const { ip, name } = require("../../env.json");
const { log, error, time, count } = require("./helper.js");
const axios = require("axios");

const setupEndpoints = (app) => {
  app.get("/api/info", (req, res) => {
    log("api info (app started)");
    res.json({ success: true });
  });

  /**
   * API CHALLENGE
   * Here you have to make an API call to another server
   * So your local node server has to call https://letsgavel.com/api/personalitytest [GET] and return the result to the app.
   * If you don't know how to start check out the (already installed) npm package axios
   * and use log on response to find out how the GET endpoint https://letsgavel.com/api/personalitytest works
   */

  app.get("/api/personalitytest", async (req, res) => {
    //log("api url [change function in ./server/src/api.js:22]");

    let url = "https://letsgavel.com/api/personalitytest?name=" + name;

    log(url);

    try {
      const response = await axios.get(url);
      //console.log(response.data);
      res.json(response.data);
    } catch (err) {
    res.json({
      success: false,
      url: false,
      msg: "sorry " + name + ", this is not an URL so far",
    });

     //console.log(JSON.stringify(err))
    }

    //alert(JSON.stringify(response));

    // put your code here to call https://letsgavel.com/api/personalitytest
    // and change the following line to forward the response from letsgavel.com to the app
  });
};

const setupViews = (app) => {
  app.get("/", (req, res) => {
    log("view index");
    res.render("index", { name: name });
  });

  app.get("/test", (req, res) => {
    log("view test");
    res.render("test", { ip: ip });
  });
};

// MODULE INTERACTION

const listen = function (app, callback) {
  setupEndpoints(app);
  setupViews(app);
  log("api listening");
  if (typeof callback == "function") callback();
};

const api = {
  listen: listen,
};

module.exports = {
  api,
};
