const w3DateFilter = require("./w3-date-filter");
const dateFilter = require("./date-filter");
const console = require("./console");
const readableDate = require("./readableDate");
const machineDate = require("./machineDate");
const cssmin = require("./cssmin");
const jsmin = require("./jsmin");

module.exports = {
  date: dateFilter,
  w3DateFilter,
  console,
  readableDate,
  machineDate,
  cssmin,
  jsmin
};
