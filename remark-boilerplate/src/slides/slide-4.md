## Nice async med Promise


```js
readSomeSettings()
	.then(function (settings) {

		var relevantPieceOfSettings = extractRelevantPiece(settings);

		return fetchDataBasedOnSettings(relevantPieceOfSettings)
			.then(function (dataInJSONFormattedText) {

				var data = JSON.parse(dataInJSONFormattedText);

				return doStuffWithIt(data);
			});
	});
```

???

* extractRelevantPiece och JSON.parse kan köras direkt i then.

---

## Nice async med Promise


```js
readSomeSettings()
	.then(extractRelevantPiece)
	.then(function (relevantPieceOfSettings) {

		return fetchDataBasedOnSettings(relevantPieceOfSettings)
			.then(JSON.parse)
			.then(function (data) {

				return doStuffWithIt(data);
			});
	});
```

???

* Nu ser nman att fetchDataBasedOnSettings och doStuffWithIt kan köras direkt i then.

---

## Nice async med Promise


```js
readSomeSettings()
	.then(extractRelevantPiece)
	.then(fetchDataBasedOnSettings)
	.then(JSON.parse)
	.then(doStuffWithIt);
```

???

Niiice.

---
