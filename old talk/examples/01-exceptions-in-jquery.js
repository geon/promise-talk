"use strict";








// SetTimeout har fortfarande ett callback. Osmidigt.

function messyAsynchronousUppercase (s) {

	var deferred = Q.defer();

	setTimeout(function(){

		deferred.resolve(s.toUpperCase());

	}, 1000);

	return deferred.promise;
}



// Kan lösas om man wrappar setTimeout i ett promise:

/*
function makeTimeoutPromise (callback, time) {

	var deferred = Q.defer();

//	deferred.promise.then(callback);

	setTimeout(function(){

		deferred.resolve(callback());

	}, time);

	return deferred.promise;
}
*/

// Ser du hur man skapare ett separat #deferred-objekt som innehåller ett promise?
// .resolve() finns i defered, och följer inte med när man returnerar promise.
// Lite mindre risk att göra bort sig. ( .resolve() ska BARA anropas av koden som skapar promise-objektet.)









// Ta-da!


function goodAsynchronousUppercase (s) {

	return makePromise(function(){

		return s.toUpperCase();

	}).then(makeDelay(1000));
}


// OBS!!! Måste passa in en funktion, inte ett värde, annars måste man ha try/catch i funktionen utanför...

function makePromise (someFunction) {

	var deferred = Q.defer();

	try {

		deferred.resolve(someFunction());
	
	} catch (error) {

		deferred.reject(error);
	}

	return deferred.promise;
}

function makeDelay (time) {

	return function (previousResult) {

		var deferred = Q.defer();

		setTimeout(function(){

			deferred.resolve(previousResult);
	
		}, time);

		return deferred.promise;
	}
}













// Eller ännu bättre med Q's inbyggda: delay():

function betterAsynchronousUppercase (s) {

	return makePromise(function(){

		return s.toUpperCase();

	}).delay(1000);
}




 // Funkar också i jQuery, men crashar besvärligt med exceptions.

function brokenMakeTimeoutPromise (callback, time) {

	var promise = $.Deferred();

	promise.then(callback);

	setTimeout(function(){

		promise.resolve();

	}, 1000);

	return promise;
}

function brokenAsynchronousUppercase (s) {

	return brokenMakeTimeoutPromise(function(){

		return s.toUpperCase();

	}, 1000);
}

/*

// Funkar bra tills man vill wrappa ett callback i ett promise:

// Följer Nodes standard:
// work([args], callback(error, data))
function callbackToPromise (work) { // All arguments to `work`are passed after `work`.

	var deferred = Q.defer();

	// Same as work([arguments...], callback)
	work.apply(null, Array.prototype.slice.call(arguments, 1).concat(function(error, data){

		if (error) {
	
			deferred.reject(error);
	
		} else {

			deferred.resolve(data);
		}
	}));

	return deferred.promise;
}

function nodeCompatibleSetTimeout (time, callback) {

	// setTimeout genererar inga fel eller data...
	setTimeout(callback, time);
}

function testAsynchronousUppercase (s) {

	return callbackToPromise(nodeCompatibleSetTimeout, 1000)
		.then(function(){

			return s.toUpperCase();
		});
}




*/






function testBrokenAsynchronousUppercase (s) {

	return callbackToPromise(function(s){

		return s.toUpperCase();

	}, s);
}


















function brokenAsynchronousUppercase (s) {

	return brokenMakePromise(function(){

		return s.toUpperCase();

	}).then(brokenMakeDelay(1000));
}

function brokenMakePromise (someFunction) {

	var promise = $.Deferred();

	try {

		promise.resolve(someFunction());
	
	} catch (error) {

		promise.reject(error);
	}

	return promise;
}



function brokenMakeDelay (time) {

	return function (previousResult) {

		var promise = $.Deferred();

		setTimeout(function(){

			promise.resolve(previousResult);
	
		}, time);

		return promise;
	}
}








// Förvirrande varningar...
Q.stopUnhandledRejectionTracking();

$(function(){

	$("button").click(function(){

		var functionName = $(this).text();

		window[functionName]($(this).hasClass("crash") ? 1337 : "lowercase text")
			.then(function(s){
				console.log(s);
			}, function(error){
				console.log(error);
			});
	});
});

// Q funkar även utan fel-callback! Testa!
