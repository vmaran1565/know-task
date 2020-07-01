const express = require("express");
const bodyParser = require("body-parser");
const serviceData = require("./serviceData");
const config = serviceData.config;
let overAllData = serviceData.data;
const mergeColumns = [];
const path = require("path");
const app = express();
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.disable("etag");

let sendJsonResult = (res, obj) => {
  setTimeout(() => {
    res.setHeader("Content-Type", "application/json");
    res.send(JSON.stringify(obj));
  }, 1000);
};
app.use(express.static(__dirname + "/public"));
app.listen(process.env.PORT || 8080, function () {
  console.log("Listening!");
});

app.get("/getData", function (req, res) {
  const output = mergeDataFn(serviceData.data);
  sendJsonResult(res, {
    output: output,
    config: mergeColumns,
  });
});
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

const applyConfigFn = (data) => {
  let obj = {};
  config.forEach((el) => {
    obj[el.HeaderName] =
      typeof el.Column == "function" ? el.Column(data) : data[el.HeaderName];
    el.Merge && !mergeColumns.includes(el.HeaderName)
      ? mergeColumns.push(el.HeaderName)
      : "";
  });
  return obj;
};
const mergeDataFn = (data) => {
  data = data.map((el) => {
    return (el = applyConfigFn(el));
  });
  return data;
};
