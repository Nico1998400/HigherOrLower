let deck = {}; // Skapar en variabel för att spara vårat deck i.

const drawCardButton = document.getElementById("drawCard");
const lowerButton = document.getElementById("lower");
const higherButton = document.getElementById("higher");
const userGuess = document.getElementById("user-guess");

let currentCard = 0;
let oldCard = 0;
let secondCard = 0;

async function getDeck() {
    //En asynchron funktion som vi anropar från root för att hämta vårat deck så fort vår kod laddas och exekveras
    const res = await fetch(
        "https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1" // Kolla dokumentationen för api:et hur ni kan skicka in variabler, men här väljer vi att vi bara ska ett deck
    );
    const data = await res.json(); // Vi löser ut body från vårat response och gör om det till ett javascriptobjekt
    //console.log(data);
    deck = data; // Vi assignar data till vårat deck så vi kan använda variabeln senare
    // console.log(deck);
}

getDeck(); // Vi anropar funktionen direkt

async function drawoldCard() {
    const res = await fetch(`https://deckofcardsapi.com/api/deck/${deck.deck_id}/draw/?count=1`);
    const data = await res.json();
    image.setAttribute("src", data.cards[0].image);
    oldCard = data.cards[0].value;
    oldCard = convertRoyals(oldCard);
    userGuess.innerText = "";
    visibleButtons();
}

async function drawnewCard() {
    const res = await fetch(`https://deckofcardsapi.com/api/deck/${deck.deck_id}/draw/?count=1`);
    const data = await res.json();
    image.setAttribute("src", data.cards[0].image);
    currentCard = data.cards[0].value;
    currentCard = convertRoyals(currentCard);
}

drawCardButton.addEventListener("click", async() => {
    drawoldCard();
});

lowerButton.addEventListener("click", async() => {
    await drawnewCard();
    answer(false);
    hideButtons();
});

higherButton.addEventListener("click", async() => {
    await drawnewCard();
    answer(true);
    hideButtons();
});

async function hideButtons() {
    lowerButton.style.visibility = 'hidden';
    higherButton.style.visibility = 'hidden';
}

async function visibleButtons() {
    lowerButton.style.visibility = 'visible';
    higherButton.style.visibility = 'visible';
}

async function answer(guess) {
    if (guess === true && oldCard < currentCard) {
        userGuess.innerText = `Congrats it was higher`
    } else if (guess === false && oldCard > currentCard) {
        userGuess.innerText = `Congrats it was lower`
    } else {
        userGuess.innerText = `Sorry you didn't make it!`
    }
}

function convertRoyals(card) {
    switch (card) {
        case "2":
        case "3":
        case "4":
        case "5":
        case "6":
        case "7":
        case "8":
        case "9":
        case "10":
            card = parseInt(card);
            break
        case 'ACE':
            card = 14
            break
        case 'KING':
            card = 13
            break
        case 'QUEEN':
            card = 12
            break
        case 'JACK':
            card = 11
            break
        default:
            console.log("Somethings Wrong");
            break;
    }
    return card
}