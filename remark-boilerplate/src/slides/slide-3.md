
## Async med Promise


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

* Alla fel fångas automatiskt
* ...och vi kan hantera dem där de är relevanta
* Hur ser `readSomeSettings` ut då?

---

## Async med Promise


```js
function readSomeSettings () {

	return fsp.readFile('settings.json')
		.then(JSON.parse);
}
```

---


## Async med Promise


```js
function readSomeSettings () {

	return fsp.readFile('settings.json')
		.then(JSON.parse);
}
```

(lol)

---

