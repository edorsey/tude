var base62 = require('base62');

function encode(lat, lng, precision) {
  lat = parseFloat(lat);
  lng = parseFloat(lng);
  
  if (Number.isNaN(lat)) throw new Error("Latitude is not a number");
  if (Number.isNaN(lng)) throw new Error("Longitude is not a number");
  
  if (!precision) {
    precision = 6;
  }
  else {
    precision = parseFloat(precision);
    if (Number.isNaN(precision)) throw new Error("Precision is not a number");
  }
  
  var divider = encodeDivider(lat, lng);
  return precision.toString() + encodeCoordinate(lat, precision) + divider + encodeCoordinate(lng, precision);
}

function decode(encodedString) {
  if (typeof encodedString !== "string") throw new Error("Encoded value is not a string");
  if (encodedString.length < 4) throw new Error("Encoded value is not valid");
  
  var precision = parseInt(encodedString[0], 10);
  if (Number.isNaN(precision)) throw new Error("Precision value is not valid");
  
  var encodedString = encodedString.slice(1);
  var multipliers = getMultipliers(encodedString);
  var divider = decodeDivider(encodedString);
  
  var coordinates = encodedString.split(divider);
  
  return {
    lat: decodeCoordinate(coordinates[0], precision) * multipliers.lat,
    lng: decodeCoordinate(coordinates[1], precision) * multipliers.lng
  };
}

function encodeCoordinate(coordinate, precision) {
  if (!precision) var precision = 6;
  return base62.encode(Math.round(Math.abs(coordinate) * Math.pow(10, precision)));
}

function decodeCoordinate(coordinate, precision) {
  if (!precision) var precision = 6;
  return parseInt(base62.decode(coordinate), 10) / Math.pow(10, precision);
}

function encodeDivider(lat, lng) {
  if (lat >= 0 && lng >= 0) return "*";
  else if (lat >= 0 && lng < 0) return "-";
  else if (lat < 0 && lng >= 0) return "~";
  else return "_";
}

function decodeDivider(encodedString) {
  var dividers = ["*", "-", "~", "_"];
  
  for (var i = 0; i < dividers.length; i++) {
    if (encodedString.indexOf(dividers[i]) > -1) return dividers[i];
  }
  
  throw new Error("No divider found");
}

function getMultipliers(encodedString) {
  var multiplierMap = {
    "*": { lat: 1, lng: 1 },
    "-": { lat: 1, lng: -1 },
    "~": { lat: -1, lng: 1 },
    "_": { lat: -1, lng: -1 }
  };
  
  var divider = decodeDivider(encodedString);
  
  return multiplierMap[divider];
}

module.exports = {
  encode: encode,
  decode: decode
}

if (process.env.NODE_ENV === "test") {
  module.exports.encodeCoordinate = encodeCoordinate;
  module.exports.decodeCoordinate = decodeCoordinate;
  module.exports.getMultipliers = getMultipliers;
  module.exports.encodeDivider = encodeDivider;
  module.exports.decodeDivider = decodeDivider;
}