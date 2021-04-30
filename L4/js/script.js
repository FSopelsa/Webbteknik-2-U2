// Globala konstanter och variabler
// Städer och bilder
const allWords = ["Borgholm","Gränna","Gävle","Göteborg","Halmstad","Jönköping","Kalmar","Karlskrona","Kiruna","Ljungby","Malmö","Norrköping","Skara","Stockholm","Sundsvall","Umeå","Visby","Västervik","Växjö","Örebro"];	// Array med namn på städer
const allDescriptions = ["Kyrkan","Storgatan","Julbock","Operan","Picassoparken","Sofiakyrkan","Domkyrkan","Rosenbom","Stadshus","Garvaren","Stortorget","Spårvagn","Domkyrka","Rosenbad","Hotell Knaust","Storgatan","Stadsmur","Hamnen","Teater","Svampen"];	// Array med kort beskrivning av bilderna för städerna
// Element i gränssnittet
var startGameBtn;		// Referenser till start-knappen (button)
var checkAnswersBtn;	// Referens till knappen för att kontrollera svar (button)
var wordListElem;		// Referens till listan med de ord som kan dras (ul-elemntet)
var	wordElems;			// Array med referenser till elementen för de åtta orden (li-elemnten)
var imgElems;			// Array med referenser till elementen med de fyra bilderna (img) 
var answerElems;		// Array med referenser till elementen för orden intill bilderna (p)
var correctElems;		// Array med referenser till element för rätta svar (p)
var largeImgElem;		// Referens till elementet med den stora bilden (img)
var msgElem; 			// Referens till div-element för utskrift av meddelanden (div)
// Element vid drag and drop
var dragWordElem;		// Det ord som dras (kan vara både li och p)
// ------------------------------
// Funktion som körs då hela webbsidan är inladdad, dvs då all HTML-kod är utförd.
// Initiering av globala variabler samt händelsehanterare.
function init() {
	// Referenser till element i gränssnittet
		startGameBtn = document.getElementById("startGameBtn");
		checkAnswersBtn = document.getElementById("checkAnswersBtn");
		wordListElem = document.getElementById("wordList").getElementsByTagName("ul") [0];
		wordElems = document.getElementById("wordList").getElementsByTagName("li");
		imgElems = document.getElementById("imgList").getElementsByTagName("img");
		answerElems = document.getElementsByClassName("userAnswer");
		correctElems = document.getElementsByClassName("correctAnswer");
		largeImgElem = document.getElementById("largeImg");
		msgElem = document.getElementById("message");
	// Lägg på händelsehanterare
		startGameBtn.addEventListener("click",startGame);
		checkAnswersBtn.addEventListener("click",checkAnswers);
		for (let i = 0; i < imgElems.length; i++) {
			//elem = document.getElementById("imgList");
			imgElems[i].addEventListener("mouseenter",showLargeImg);
			imgElems[i].addEventListener("mouseleave",hideLargeImg);
		} // End for
	// Aktivera/inaktivera knappar
		startGameBtn.disabled = false;
		checkAnswersBtn.disabled = true;
} // End init
window.addEventListener("load",init); // Se till att init aktiveras då sidan är inladdad
// ------------------------------
// Initiera spelet. Välj ord slumpmässigt. Visa ord och bilder.
function startGame() {
	let tempList = allWords.slice(0); // Kopia av allWords
	let words = []; // De ord som slumpats fram för att användas i spelet
	for (let i = 0; i < 4; i++) {
		r = Math.floor(tempList.length*Math.random());
		words.push(tempList[r]);
		let ix = allWords.indexOf(tempList[r]); // Index till tempList som tar fram rätt bilder
		imgElems[i].src = "img/" + ix + ".jpg";
		tempList.splice(r,1);
		imgElems[i].id = ix;
	} // End for 
	for (let i = 0; i < 4; i++) {
		r = Math.floor(tempList.length*Math.random());
		words.push(tempList[r]);
		tempList.splice(r,1);
	} // End for
	words.sort(); // Sorterar words i bokstavsordning
	for (let i = 0; i < wordElems.length; i++) {		
		wordElems[i].innerHTML = words[i];
		wordElems[i].addEventListener("dragstart",dragstartWord);
		wordElems[i].addEventListener("dragend",dragendWord);
		wordElems[i].draggable = true;
	} // End for
	for (let i = 0; i < answerElems.length; i++) {
		answerElems[i].addEventListener("dragstart",dragstartWord);
		answerElems[i].addEventListener("dragend",dragendWord);
		answerElems[i].draggable = true;
		answerElems[i].innerHTML = "";
		correctElems[i].innerHTML = "";
	} // End for 
	msgElem.innerHTML = "";
	startGameBtn.disabled = true;
	checkAnswersBtn.disabled = false;
} // End startGame
// ------------------------------
// Visa förstorad bild
function showLargeImg() {
	largeImgElem.src = this.src;
} // End showLargeImg
// ------------------------------
// Dölj förstorad bild
function hideLargeImg() {
	largeImgElem.src = "img/empty.png";
} // End hideLargeImg
// ------------------------------
// Ett ord börjar dras. Spara data om elementet som dras. Händelsehanterare för drop zones
function dragstartWord(e) { // e är Event-objektet
	for (let i = 0; i < imgElems.length; i++) {
		imgElems[i].addEventListener("dragover",wordOverImg);
		imgElems[i].addEventListener("drop",wordOverImg);
	} // End for
	wordListElem.addEventListener("dragover",wordOverList);
	wordListElem.addEventListener("drop",wordOverList);
	dragWordElem = this;
	e.dataTransfer.setData("text",this.innerHTML);
} // End dragstartWord
// ------------------------------
// Drag-händelsen avslutas. Ta bort händelsehanterare på drop zones
function dragendWord() {
	for (let i = 0; i < imgElems.length; i++) {
		imgElems[i].removeEventListener("dragover",wordOverImg);
		imgElems[i].removeEventListener("drop",wordOverImg);
	} // End for
	wordListElem.removeEventListener("dragover",wordOverList);
	wordListElem.removeEventListener("drop",wordOverList);
} // End dragendWord
// ------------------------------
// Hantera händelserna dragover och drop, då ett ord släpps över en bild
function wordOverImg(e) { // e är Event-objektet
	e.preventDefault();
	if (e.type == "drop") {
		dragWordElem.innerHTML = "";
		let dropWordElem = this.nextElementSibling; // Ta fram referens till p-elementet
		if (dropWordElem.innerHTML != "")
			moveBackToList(dropWordElem.innerHTML);
		dropWordElem.innerHTML = e.dataTransfer.getData("text");
	}
} // End wordOverImg
// ------------------------------
// Hantera händelserna dragover och drop, då ett ord släpps över listan med ord
function wordOverList(e) { // e är Event-objektet
	e.preventDefault();
	if (e.type == "drop") {
		dragWordElem.innerHTML = "";
		moveBackToList(e.dataTransfer.getData("text"));
	}
} // End wordOverList
// ------------------------------
// Flytta tillbaks ordet till listan
function moveBackToList(word) { // word är det ord som ska flyttas tillbaks
	for (let i = 0; i < wordElems.length; i++) {
		if (wordElems[i].innerHTML == "") {
		wordElems[i].innerHTML = word;
		break;
		}
	} // End for
} // End moveBackToList
// ------------------------------
// Kontrollera användarens svar och visa de korrekta svaren
function checkAnswers() {
	for (let i = 0; i < answerElems.length; i++) {
		if (answerElems[i].innerHTML == "") {
			alert("Dra först ord till alla bilder");
			return;
		}
	} // End for
	for (let i = 0; i < wordElems.length; i++) {
		wordElems[i].draggable = false;
		wordElems[i].removeEventListener("dragstart",dragstartWord);
		wordElems[i].removeEventListener("dragend",dragendWord);
	} // End for
	for (let i = 0; i < answerElems.length; i++) {
		answerElems[i].draggable = false;
		answerElems[i].removeEventListener("dragstart",dragstartWord);
		answerElems[i].removeEventListener("dragend",dragendWord);
	} // End for
	let points = 0; // Här räknas poäng för varje rätt svar ihop
	for (let i = 0; i < answerElems.length; i++) {
		ix = imgElems[i].id;
		if (answerElems[i].innerHTML == allWords[ix])
			points++;
		correctElems[i].innerHTML = allWords[ix] + "<br>" + allDescriptions[ix];
	} // End for
	msgElem.innerHTML = "Du fick " + points + " poäng av 4 möjliga.";
	startGameBtn.disabled = false;
	checkAnswersBtn.disabled = true;
} // End checkAnswers
// ------------------------------