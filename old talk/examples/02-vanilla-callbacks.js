"use strict";


// Simulera lite jobb. T.ex. Ajax, att läsa en fil, eller en databas-query.

function nodeCompatibleSetTimeout (time, callback) {

	// setTimeout genererar inga fel eller data...
	setTimeout(callback, time);
}




// Någorlunda simpelt, men lite bakvänt.
// ...Tills det krashar. Lycka till att hitta felkällan!

function vanillaCallbackUppercase (s, callback) {

	callback(null, s.toUpperCase());
}


function vanillaCallbackTimeout (s, time, callback) {

	nodeCompatibleSetTimeout(time, function(error, data){ // setTimeout genererar inga fel eller data...

		vanillaCallbackUppercase(s, time, callback);
	});
}







function deepVanillaCallbackTimeout (s, time, callback) {

	nodeCompatibleSetTimeout(time, function(){

		someOtherDeepfunction(s, time, callback);
	});
}
function someOtherDeepfunction (s, time, callback) {

	nodeCompatibleSetTimeout(time, function(){

		someOtherEvenDeeperfunction(s, time, callback);
	});
}
function someOtherEvenDeeperfunction (s, time, callback) {

	nodeCompatibleSetTimeout(time, function(){

		// Allt utanför det aktuella scop-et är oåtkomligt...
		// T.ex. time.

		vanillaCallbackUppercase(s, callback);
	});
}

// (Ja, det här var jobbigt att debugga...)
// vanillaCallbackUppercase aanropas på 3 platser. Vilken av dem var det?
// Allt utanför det aktuella scop-et är oåtkomligt...
// HAR DU TUR så är det en bugg som lätt kan återskapas, annars... Ha en kul eftermiddag!









// Sådär! Överlever exceptions, men...
// * Jobbigt att skriva
// * Lätt att missa
// * Lätt att skriva extra buggar
// * Måste göras "längs in" djupast i all kod
// * ...kanske 3:e-partskod

// OBS!!! Man ser var koden anropades från, men har inte tillgång till scope-et runt omkring.

function exceptionProofVanillaCallbackUppercase (s, callback) {

	var error = null;

	try {

		var result = s.toUpperCase();

	} catch (e) {

		error = e;
	}

	callback(error, result);
}


function exceptionProofVanillaCallbackTimeout (s, time, callback) {

	nodeCompatibleSetTimeout(time, function(){

		exceptionProofVanillaCallbackUppercase(s, callback);
	});
}

// Debuggerna kan bara visa var felet loggas, inte var det uppstod, men kodraden med felet loggas i konsollen.








$(function(){

	$("button").click(function(){

		var functionName = $(this).text();

		window[functionName]($(this).hasClass("crash") ? 1337 : "lowercase text", 1000, function(error, data){

			console.log(error);
			console.log(data);
		})
	});
});
