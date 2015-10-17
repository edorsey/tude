# Tude

This is a simple module that allows you to encode and decode latitude and longitude coordinates for use in URLs while keeping the space the information occupies to a minimum. This is useful if you are wanting to pass GPS coordinates in a URL and keep the link as short as possible (for example, SMS or Twitter).

## API

### encode(lat, lng, [precision=6])

```js
var tude = require('tude');

tude.encode(39.092765, -94.584045); //62E1Ot-6oRD7
```

The first character represents the precision of the encoding. This is basically how many decimal places to keep intact. A smaller precision will result in a shorter string. `precision` defaults to `6`.

### decode(encodedLatLng)

```js
var tude = require('tude');

tude.decode("62E1Ot-6oRD7"); //{ lat: 39.092765, lng: -94.584045 }
```
