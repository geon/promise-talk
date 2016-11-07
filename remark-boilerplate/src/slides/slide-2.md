
## Async med callbacks

```js
var fs = require('fs');

fs.readFile(function (error, buffer) {

	// ...
});
```

???

* Lätt som en plätt.
* Din kod körs när disken är klar.

---

## Async med callbacks

```js
var fs = require('fs');

fs.readFile(function (error, buffer) {

	if (error) {

		console.log(error);
		return;
	}

	// ...
});
```

???

* Felhantering är väl inte så viktigt?
* Kan inte returnera från callback - körs Async
* Kan inte kasta fel - blir globala
* Måste hantera fel direkt i callback

---

## Async med callbacks

```js
readSomeSettings(function (error, settings) {

	if (error) {

		console.log(error);
		return;
	}

	var relevantPieceOfSettings = extractRelevantPiece(settings);

	fetchDataBasedOnSettings(
		relevantPieceOfSettings,
		function (error, dataInJSONFormattedText) {

			if (error) {

				console.log(error);
				return;
			}

			var data = JSON.parse(dataInJSONFormattedText);

			doStuffWithIt(data);
		})
	);
});
```

???

* Börjar bli rörigt
* Gå igenom snabbt
* Måste kolla fel i *varje* callback
* Hur ser det ut i `readSomeSettings`?


---

## Async med callbacks

```js
function readSomeSettings (callback) {

	fs.readFile('settings.json', function(error, data) {

		if (error) {

			callback(error);
			return;
		}

		var json;
		try {

			json = JSON.parse(data);

		} catch (error) {

			callback(error);
			return;
		}

		callback(null, json);
	});
}
```

???

* Ännu rörigare !
* Anropar `callback` på 3 olika platser.
* *Måste* returnera efter *varje* error-`callback`. (Annars vaddå?)
* Kan fortfarande inte hantera kastade fel i `callback`.

---
