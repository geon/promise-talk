
##Async looping is hard. Gah!

<style>
.small-code code {
	font-size: 0.5em;
}
</style>
.small-code[
```js


fetchListOfUrls(function (error, urlsJson) {

	if (error) {
		return;
	}

	var urls;
	try {

		urls = JSON.parse(urlsJson);

	} catch (e) {

		// Can't really pass it back up to caller.
		console.log(e);
	}

	var urlContents = [];
	var failed = false;
	var numCompleted = 0;
	for (var i = 0; i < urls.length; ++i) {
		var url = urls[i];

		fetchUrl(url, function (error, urlContent) {

			if (error) {

				failed = true;

				console.log(error);
				return;
			}

			if (failed) {

				return;
			}

			urlContents.push(urlContent);

			++numCompleted;

			if (numCompleted == urls.length) {

				// ... One more loop to save to disk.
			}
		});
	}
});
```
]

???

Med asynk kod Måste du hålla ordning på hur många callbacks som är gjorda, och om alla var OK.

Tänk dig det, fast ett par scoop djupare. Jag bara orkar inte.

That's clearly unacceptable. But the looping can easily be abstracted out. Again, with the library `async`:


---

##Async looping is hard. Gah!

<style>
.small-code code {
	font-size: 0.5em;
}
</style>
.small-code[
```js

fetchListOfUrls(function (error, urlsJson) {

	if (error) {

		console.log(error);
		return;
	}

	var urls;
	try {

		urls = JSON.parse(urlsJson);

	} catch (error) {

		// Can't really pass it back up to caller.
		console.log(error);
		return;
	}

	async.map(urls, fetchUrl, function (error, urlContents) {

		if (error) {

			// Can't really pass it back up to caller.
			console.log(e);
			return;
		}

		async.map(urlContents, saveToDisk, function (error) {

			// This callback is optional, but you wouldn't know about the errors.
			if (error) {

				console.log(error);
				return; // Not necessary here, but what if you add code below it later?
			}
		});
	});
});

```
]

???

Better, but the code is like 90 % error handling! No wonder we like to ignore errors...

---


##Looping with Promises


```js
fetchListOfUrls
	.then(function (urlsJson) {

		return Promise.all(
			JSON.parse(urlsJson)
				.map(function (url) {

					return fetchUrl(url);
						.then(function (urlContent) {

							return saveToDisk(urlContent);
						});
				});
		)
	});
```

???

Nu slipper vi all felhantering, men koden är...

It's 3 scopes deep and just barely readable. In a real application it would be even worse. We can start with the low hanging fruit by breaking out `JSON.parse` and `Promise.all`.


---


##Nice looping with Promises


```js
fetchListOfUrls
	.then(JSON.parse)
	.then(function (urls) {

		return urlsJson.map(function (url) {

			return fetchUrl(url);
				.then(function (urlContent) {

					return saveToDisk(urlContent);
				});
		}));
	})
	.then(Promise.all.bind(Promise));
```


???

I think this is better separation of concern. Now we don't need those nested scopes. Let's un-nest them.


---

##Nice looping with Promises


```js
fetchListOfUrls
	.then(JSON.parse)
	.then(function (urls) {

		return urls.map(fetchUrl);
	})
	.then(Promise.all.bind(Promise))
	.then(function (urlsContent) {

		return urlsContent.map(saveToDisk);
	})
	.then(Promise.all.bind(Promise));
```

???

Shallower and clearer, but with lots of boilerplate noise. All the `function () {}` and `return` (which is easy to miss, but hard to debug, by the way) just serve to confuse the meaning of the actual code.

You might have noticed how both anonymous functions are nearly identical, and completely pointless. Let's use an implementation of `map`that works with `then`. Also, `Promise.all.bind(Promise)` looks horribly redundant.

---

##Nice looping with Promises and ae


```js
fetchListOfUrls
	.then(JSON.parse)
	.then(ae.map(fetchUrl))
	.then(ae.all)
	.then(ae.map(saveToDisk))
	.then(ae.all);
```

???

Nice.

---
