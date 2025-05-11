var deck = [];
var hidden = '';
var dealerSum = 0;
var dealerAce = 0;
var yourAce = 0;
var yourSum = 0;
var canHit = true;
var canStand = true;

window.onload = function() {
    buildDeck();
    shuffleDeck();
    startGame();
} 

//Kenny Yip Coding
function buildDeck() {
    let values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
    let types = ['C', 'D', 'H', 'S'];

    for (let i = 0; i < types.length; i++) {
        for (let j = 0; j < values.length; j++) {
            deck.push(values[j] + '-' + types[i]);
        }
    }
    //console.log(deck);
}

function shuffleDeck() {
    //Fisher-Yates shuffle
    	for (let i = deck.length-1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i+1));
            [deck[i], deck[j]] = [deck[j], deck[i]]
        }
    //console.log(deck);
}

function startGame() {
    //dealer gets cards
    dealerCards();
    //player gets cards
    yourCards();
}

function dealerCards() {
    //Hidden card
    hidden = deck.pop();
    dealerSum += getValue(hidden);
    dealerAce += checkAce(hidden);
    //console.log(hidden)
    //console.log(dealerSum);

    //Second card
    let cardTwoImg = document.createElement('img');
    let cardTwo = deck.pop();
    cardTwoImg.src = './cards/' + cardTwo + '.png';
    dealerSum += getValue(cardTwo);
    dealerAce += checkAce(cardTwo);
    document.getElementById('dealer-cards').append(cardTwoImg);
    //console.log(dealerSum);

    document.getElementById('dealer-sum').innerText = dealerSum - getValue(hidden);
}

function yourCards() {
    //First 2 cards
    for (let i = 0; i < 2; i++) {
    let cardImg = document.createElement('img');
    let card = deck.pop();
    cardImg.src = './cards/' + card + '.png';
    yourSum += getValue(card);
    yourAce += checkAce(card);
    document.getElementById('your-cards').append(cardImg);
    }
    //console.log(yourSum);
    yourSum = reduceAce(yourSum, yourAce);
    document.getElementById('your-sum').innerText = yourSum;

    //Hit, Stand, restart
    document.getElementById('hit').addEventListener('click', hit);
    document.getElementById('stand').addEventListener('click', stand);    
    document.getElementById('restart').addEventListener('click', restart);
}

function dealerDraw () {
        //document.getElementById('hidden').src = './cards/' + hidden + '.png';

        while (reduceAce(dealerSum, dealerAce) < 17) {
            let cardImg = document.createElement('img');
            let card = deck.pop();
            cardImg.src = './cards/' + card + '.png';
            cardImg.classList.add('card');
            dealerSum += getValue(card);
            dealerAce += checkAce(card);
            document.getElementById('dealer-cards').append(cardImg);
        }
}

function getValue(card) {
    let data = card.split('-');
    let value = data[0];

    if (isNaN(value)) {
        if (value === 'A') {
            return 11;
        }
        return 10;
    }
    return parseInt(value);
}

function checkAce(card) {
    let data = card.split('-');
    if (card[0] === 'A') {
        return 1;
    }
    return 0;
}

function hit() {
    if (!canHit) {
        return;
    }

    let cardImg = document.createElement('img');
    let card = deck.pop();
    cardImg.src = './cards/' + card + '.png';
    cardImg.classList.add('card');
    yourSum += getValue(card);
    yourAce += checkAce(card);
    document.getElementById('your-cards').append(cardImg);

    let newSum = reduceAce(yourSum, yourAce);
    document.getElementById('your-sum').innerText = newSum;

    if (newSum > 21) {
        canHit = false;
        canStand = false;
        document.getElementById('results').innerText = 'You Lose!';
    }
}

function stand() {
    canHit = false;
    if (!canStand) {
        return;
    }

    //Reveal hidden card
    document.getElementById('hidden').src = './cards/' + hidden + '.png';

    //Dealer draws cards
    dealerDraw();

    dealerSum = reduceAce(dealerSum, dealerAce);
    yourSum = reduceAce(yourSum, yourAce);


    let message = '';
    if (yourSum > 21) {
        message = 'You Lose!'; 
    } else if (dealerSum > 21) {
        message = 'You Win!';
    } else if (dealerSum === yourSum) {
        message = 'Tie!';
    } else if (yourSum > dealerSum) {
        message = 'You Win!';
    } else if (yourSum < dealerSum) {
        message = 'You Lose!';
    }

    document.getElementById('dealer-sum').innerText = dealerSum;
    document.getElementById('your-sum').innerText = yourSum;
    document.getElementById('results').innerText = message;
}

function restart() {
    location.reload();
}

function reduceAce(playerSum, playerAce) {
    while (playerSum > 21 && playerAce > 0) {
        playerSum -= 10;
        playerAce -= 1;
    }
    return playerSum;
}
