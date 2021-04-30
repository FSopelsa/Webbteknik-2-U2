// Globala konstanter och variabler
const roomPrice = [600,800,950];	// Pris för rumstyperna
const extraPrice = [40,80,100];		// Pris för extravalen
var formElem;		// Referens till elementet med hela formuläret
var totalCostElem;	// Referens till elementet för totalpris
// ------------------------------
// Initiera globala variabler och koppla funktion till knapp
function init() {
	formElem = document.getElementById("booking");
	totalCostElem = document.getElementById("totalCost");
	for (let i = 0; i < formElem.roomType.length; i++) {
		formElem.roomType[i].addEventListener("click",checkIfFamilyRoom);
		formElem.roomType[i].parentNode.lastChild.textContent += " (" + roomPrice[i] + " kr)";
		formElem.roomType[i].addEventListener("click",calculateCost);
	} // End for
	for (let i = 0; i < formElem.extra.length; i++) {
		formElem.extra[i].parentNode.lastChild.textContent += " (" + extraPrice[i] + " kr)";
		formElem.extra[i].addEventListener("click",calculateCost);
	} // End for
	formElem.nrOfNights.addEventListener("change",calculateCost);
	calculateCost();
	checkIfFamilyRoom();

	// Händelsehanterare för textfält som ska kontrolleras
	formElem.city.addEventListener("blur",checkCity);
	formElem.zipcode.addEventListener("blur",checkField);
	formElem.telephone.addEventListener("blur",checkField);
	// Händelsehanterare för kampanjkod
	formElem.campaigncode.addEventListener("focus",startCheckCampaign);
	formElem.campaigncode.addEventListener("keyup",checkCampaign);
	formElem.campaigncode.addEventListener("blur",endCheckCampaign);
} // End init
window.addEventListener("load",init);
// ------------------------------
// Ser ifall man valt familjerum, isf tas alternativet sjöutsikt bort
function checkIfFamilyRoom() {
	if (formElem.roomType[2].checked == true) {
		formElem.persons.disabled == false;
		formElem.persons.parentNode.style.color = "#000";
		formElem.extra[2].disabled == true;
		formElem.extra[2].parentNode.style.color = "#999";
		formElem.extra[2].checked = false;
	}
	else {
		formElem.persons.disabled == true;
		formElem.persons.parentNode.style.color = "#999";
		formElem.extra[2].disabled == false;
		formElem.extra[2].parentNode.style.color = "#000";
	}
} // End checkIfFamilyRoom
// ------------------------------
// Räknar ihop kostnad. Sparar i och visar variabeln price
function calculateCost() {
	var price = parseInt("0"); // Här adderas totalbelopp ihop
	for (let i = 0; i < formElem.roomType.length; i++) {
		if (formElem.roomType[i].checked == true) {
			price += roomPrice[i];
			break;
		}
	}
	for (let i = 0; i < formElem.extra.length; i++) {
		if (formElem.extra[i].checked == true) {
			price += extraPrice[i];
		}
	}
	let nrOfNights = formElem.nrOfNights.value; // Antal nätter att multiplicera med
	totalCostElem.innerHTML = nrOfNights * price;
} // End calculateCost
// ------------------------------
// Ändrar det användaren skriver som ort till versaler
function checkCity() {
	var city = this.value;
	city = city.toUpperCase();
	this.value = city;
} // End checkCity
// ------------------------------
// Ser till att zipcode och telephone skrivs i rätt format
function checkField() {
	const fieldNames = ["zipcode","telephone"];
	const re = [								// Array med reguljära uttyck för fälten
		/^\d{3} ?\d{2}$/,						// Postnummer
		/^\d{1,3}[-/ ]?\d{5,8}$/				// Telefonnummer
	];
	const errMsg = [							// Array med felmeddelanden
		"Postnumret måste bestå av fem siffror.",
		"Telenr måste börja med en 0:a och följas av 6-11 siffror."
	];
	let ix = fieldNames.indexOf(this.name); 	// Index till re och errMsg
	let errMsgElem = this.nextElementSibling;	// Element för felmeddelande
	errMsgElem.innerHTML = "";
	if (!re[ix].test(this.value)) {
		errMsgElem.innerHTML = errMsg[ix];
		return false;							// Fel i fältet
	}
	else return true;							// Fältet är ok
} // End checkField
// ------------------------------
// Ändrar bakgrund och ser till att hela innehållet markeras när man klickar
function startCheckCampaign() {
	this.style.backgroundColor = "#F99";
	this.select();
} // End startCheckCampaign
// ------------------------------
//
function endCheckCampaign() {
	this.style.backgroundColor = "";
	var campaigncode = this.value;
	campaigncode = campaigncode.toUpperCase();
	this.value = campaigncode;
} // End endCheckCampaign
// ------------------------------
// Kollar så att kampanjkoden är skriven korekt
function checkCampaign() {
	const re =
		/^[A-Z]{3}-\d{2}-[A-Z]{1}\d{1}$/i
	;
	if (re.test(this.value)) this.style.backgroundColor = "#6F9";
	else this.style.backgroundColor = "#F99";
} // End checkCampaign
// ------------------------------