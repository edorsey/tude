var assert = require('assert');
var tude = require('../');

var testLocations = [{
  lat: 84.541361,
  lng: -174.3756743,
  encoded: "7VdgHo-1U0CML",
  precision: 7,
  divider: "-"
}, {
  lat: 39.092765,
  lng: -94.584045,
  encoded: "62E1Ot-6oRD7",
  precision: 6,
  divider: "-"
}, {
  lat: -9.622414,
  lng: -55.898437,
  encoded: "6Enee_3MxJH",
  precision: 6,
  divider: "_"
}, {
  lat: -33.870416,
  lng: 151.204834,
  encoded: "62i7f2~aerhE",
  precision: 6,
  divider: "~"
}, {
  lat: 65.07213,
  lng: 170.859375,
  encoded: "64p2eu*byUkn",
  precision: 6,
  divider: "*"
}, {
  lat: -81.823794,
  lng: 125.859375,
  encoded: "65xk6C~8w5LV",
  precision: 6,
  divider: "~"
}, {
  lat: -80.760615,
  lng: -107.578125,
  encoded: "65sRwz_7hnZ3",
  precision: 6,
  divider: "_"
}, {
  lat: 0,
  lng: 0,
  encoded: "60*0",
  precision: 6,
  divider: "*"
}];

describe('#encode', function() {
  describe('From location Array', function() {
    testLocations.forEach(function(location) {
      it("should encode", function() {
        var encoded = tude.encode(location.lat, location.lng, location.precision);
        assert(encoded, location.encoded);
      });
    });
  });
  
  describe('Invalid input', function() {
    describe('latitude', function() {
      it("should throw an error", function() {
        assert.throws(function() {
          tude.encode("Test", 10);
        }, /Latitude is not a number/);
      });
    });
    describe('latitude', function() {
      it("should throw an error", function() {
        assert.throws(function() {
          tude.encode(10, "test");
        }, /Longitude is not a number/);
      });
    });
    describe('both', function() {
      it("should throw an error", function() {
        assert.throws(function() {
          tude.encode("test", "test");
        }, /Latitude is not a number/);
      });
    });
    describe('both', function() {
      it("should throw an error", function() {
        assert.throws(function() {
          tude.encode("test", "test");
        }, /Latitude is not a number/);
      });
    });
    describe('precision', function() {
      it("should throw an error", function() {
        assert.throws(function() {
          tude.encode(10, 10, "test");
        }, /Precision is not a number/);
      });
    });
  });
});

describe('#decode', function() {
  describe('From location Array', function() {
    testLocations.forEach(function(location) {
      it("should decode", function() {
        var decoded = tude.decode(location.encoded);
        assert(decoded, location.decoded);
      });
    });
  });
  
  describe('Invalid input', function() {
    describe('arbitrary string with precision value', function() {
      it("should throw an error", function() {
        assert.throws(function() {
          tude.decode("6testtestetsttest");
        }, /No divider found/);
      });
    });
    
    describe('arbitrary string without precision value', function() {
      it("should throw an error", function() {
        assert.throws(function() {
          tude.decode("testtestetsttest");
        }, /Precision value is not valid/);
      });
    });
    
    describe('no value', function() {
      it("should throw an error", function() {
        assert.throws(function() {
          tude.decode();
        }, /Encoded value is not a string/);
      });
    });
    
    describe('number', function() {
      it("should throw an error", function() {
        assert.throws(function() {
          tude.decode(100);
        }, /Encoded value is not a string/);
      });
    });
    
    describe('short string', function() {
      it("should throw an error", function() {
        assert.throws(function() {
          tude.decode("tes");
        }, /Encoded value is not valid/);
      });
    });
  });
});

describe('#encodeDivider', function() {
  describe('From location Array', function() {
    testLocations.forEach(function(location) {
      it("should return " + location.divider, function() {
        var divider = tude.encodeDivider(location.lat, location.lng);
        assert(divider, location.divider);
      });
    });
  });
});

describe('#decodeDivider', function() {
  describe('From location Array', function() {
    testLocations.forEach(function(location) {
      it("should return " + location.divider, function() {
        var divider = tude.decodeDivider(location.encoded);
        assert(divider, location.divider);
      });
    });
  });
  
  describe('Invalid input', function() {
    it("should throw an error", function() {
      assert.throws(function() {
        tude.decodeDivider("test");
      }, Error);
    });
  });
});

describe('#getMultipliers', function() {
  describe('From location Array', function() {
    testLocations.forEach(function(location) {
      var expectedLatMultiplier = 1;
      if (location.lat < 0) expectedLatMultiplier = -1;
      it("should return lat = " + expectedLatMultiplier, function() {
        var multipliers = tude.getMultipliers(location.encoded);
        assert(multipliers.lat, expectedLatMultiplier);
      });
      
      var expectedLngMultiplier = 1;
      if (location.lng < 0) expectedLngMultiplier = -1;
      it("should return lng = " + expectedLngMultiplier, function() {
        var multipliers = tude.getMultipliers(location.encoded);
        assert(multipliers.lng, expectedLngMultiplier);
      });
    });
  });
  
  describe('Invalid input', function() {
    it("should throw an error", function() {
      assert.throws(function() {
        tude.getMultipliers("test");
      }, Error);
    });
  });
});

describe('#encodeCoordinate', function() {
  describe('From location Array', function() {
    testLocations.forEach(function(location) {
      var encodedArray = location.encoded.slice(1).split(location.divider);
      
      it("should encode the latitude coordindate correctly", function() {
        var encodedCoordinate = tude.encodeCoordinate(location.lat, location.precision);
        assert(encodedCoordinate, encodedArray[0]);
      });
      
      it("should encode the longitude coordindate correctly", function() {
        var encodedCoordinate = tude.encodeCoordinate(location.lng, location.precision);
        assert(encodedCoordinate, encodedArray[1]);
      });
    });
  });
});

describe('#decodeCoordinate', function() {
  describe('From location Array', function() {
    testLocations.forEach(function(location) {
      var encodedArray = location.encoded.slice(1).split(location.divider);
      
      it("should decode the latitude coordindate correctly", function() {
        var decodedCoordinate = tude.decodeCoordinate(encodedArray[0], location.precision);
        assert(decodedCoordinate === Math.abs(location.lat));
      });
      
      it("should decode the longitude coordindate correctly", function() {
        var decodedCoordinate = tude.decodeCoordinate(encodedArray[1], location.precision);
        assert(decodedCoordinate === Math.abs(location.lng));
      });
    });
  });
});