//Variables and buildDeck function from Kenny Yip Coding
var deck = [];
var hidden= '';
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

    dealerSum += cardValue(hidden);
    dealerAce += isAce(hidden);

    //console.log(hidden)
    //console.log(dealerSum);

    //Second card
    let cardTwoImg = document.createElement('img');
    let cardTwo = deck.pop();
    cardTwoImg.src = './cards/' + cardTwo + '.png';
    document.getElementById('dealer-cards').append(cardTwoImg);

    dealerSum += cardValue(cardTwo);
    dealerAce += isAce(cardTwo);

    //console.log(dealerSum);

    document.getElementById('dealer-sum').innerText = dealerSum - cardValue(hidden);
}

function yourCards() {
    //First 2 cards
    for (let i = 0; i < 2; i++) {
    let cardImg = document.createElement('img');
    let card = deck.pop();
    cardImg.src = './cards/' + card + '.png';
    yourSum += cardValue(card);
    yourAce += isAce(card);
    document.getElementById('your-cards').append(cardImg);
    }

    //console.log(yourSum);

    yourSum = aceRule(yourSum, yourAce);
    document.getElementById('your-sum').innerText = yourSum;

    //Hit, Stand, restart
    document.getElementById('hit').addEventListener('click', hit);
    document.getElementById('stand').addEventListener('click', stand);    
    document.getElementById('restart').addEventListener('click', restart);
}

function dealerDraw() {
    let currentSum = getReducedDealerSum();

    while (currentSum < 17) {
        const card = deck.pop();
        const cardImg = document.createElement('img');
        cardImg.src = './cards/' + card + '.png';
        cardImg.classList.add('card');
        document.getElementById('dealer-cards').append(cardImg);

        dealerSum += cardValue(card);
        dealerAce += isAce(card);

        currentSum = getReducedDealerSum(); // update sum with reduced Ace
    }
}

function getReducedDealerSum() {
    return aceRule(dealerSum, dealerAce);
}

function cardValue(card) {
    const [value] = card.split('-');

    if (value === 'A') return 11;
    if (['K', 'Q', 'J'].includes(value)) return 10;

    return parseInt(value);
}

function isAce(card) {
    const [value] = card.split('-');
    return value === 'A' ? 1 : 0;
}

function hit() {
    if (!canHit) {
        return;
    }

    let cardImg = document.createElement('img');
    let card = deck.pop();
    cardImg.src = './cards/' + card + '.png';
    cardImg.classList.add('card');
    document.getElementById('your-cards').append(cardImg);

    yourSum += cardValue(card);
    yourAce += isAce(card);

    let newSum = aceRule(yourSum, yourAce);
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

    dealerSum = aceRule(dealerSum, dealerAce);
    yourSum = aceRule(yourSum, yourAce);


    let message = '';
    if (dealerSum > 21) {
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

function aceRule(sum, aceCount) {
    while (sum > 21 && aceCount > 0) {
        sum -= 10;
        aceCount -= 1;
    }
    return sum;
}
