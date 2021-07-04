let numberOfPlayers = document.querySelector('#numberOfPlayers')
let generate = document.querySelector('#generate')
let playerList = document.querySelector('#playerList')
let rules = document.querySelector('#rules')
let ruletext = document.querySelector('#ruletext')
let startButton = document.querySelector('#startButton')
let practice = document.querySelector('#practice')
let ranked = document.querySelector('#ranked')
let hint = document.querySelector('#hint')
let help = document.querySelector('#help')
let autoDraw = document.querySelector('#autoDraw')
let menu = document.querySelector('#menu')
let game = document.querySelector('#game')
let buttons = document.querySelector('#buttons')
let cards = document.querySelector('#cards')
let timer = document.querySelector('#timer')
let cardsInTheDeck = document.querySelector('#cardsInTheDeck')
let playerButtons = document.querySelector('#playerButtons')
let gameOver = document.querySelector('#gameOver')
let rankList = document.querySelector('#rankList')
let restartButton = document.querySelector('#restartButton')

generate.addEventListener("click", () =>
{
    let nop = parseInt(numberOfPlayers.value)
    if (nop < 1 || nop > 10)
    {
        console.log("Give a number between 1 and 10")
    }
    else
    {
        while (playerList.lastElementChild)
        {
            playerList.removeChild(playerList.lastChild)
        }
        for (let i = 0; i < nop; i++)
        {
            let bracket = document.createElement("li")
            let playerName = document.createElement("input")
            bracket.appendChild(playerName)
            playerList.appendChild(bracket)
            playerName.value = "Player " + (i + 1)
        }
    }
})

rules.addEventListener("click", () =>
{
    if (ruletext.style.display === "none")
    {
        ruletext.style.display = "block"
    }
    else
    {
        ruletext.style.display = "none"
    }
})

practice.addEventListener("click", () =>
{
    if (options.style.display === "none")
    {
        options.style.display = "block"
    }
})

ranked.addEventListener("click", () =>
{
    if (options.style.display === "block")
    {
        options.style.display = "none"
    }
    hint.value = "n"
    help.value = "n"
    autoDraw.value = "y"
})

let numbers = [1, 2, 3]
let fillings = ["H", "O", "S"]
let colors = ["g", "p", "r"]
let shapes = ["D", "P", "S"]

class Card
{
    constructor(n, f, c, s, src)
    {
        this.n = n
        this.f = f
        this.c = c
        this.s = s
        this.src = src
    }
}

let deck = []

for (let n = 0; n < 3; n++)
{
    for (let f = 0; f < 3; f++)
    {
        for (let c = 0; c < 3; c++)
        {
            for (let s = 0; s < 3; s++)
            {
                let src = "cards/" + numbers[n] + fillings[f] + colors[c] + shapes[s] + ".svg"
                deck.push(new Card(n, f, c, s, src))
            }
        }
    }
}

let cardsOnTable = []
let selectedPlayer = null
let selectedCards = 0
let players = []
let scores = []

function table()
{
    if (hint.value == "y")
    {
        let div = document.createElement("div")
        let hintButton = document.createElement("button")
        hintButton.innerHTML = "Is there a SET?"
        div.appendChild(hintButton)
        buttons.appendChild(div)
        hintButton.addEventListener("click", () =>
        {
            if (setSearcher())
            {
                timer.innerHTML = "Yes"
            }
            else
            {
                timer.innerHTML = "No"
            }
        })
    }
    if (help.value == "y")
    {
        let div = document.createElement("div")
        let helpButton = document.createElement("button")
        helpButton.innerHTML = "Show a SET!"
        div.appendChild(helpButton)
        buttons.appendChild(div)
        helpButton.addEventListener("click", () =>
        {
            setHighlighter()
        })
    }
    if (autoDraw.value == "n")
    {
        let div = document.createElement("div")
        let drawButton = document.createElement("button")
        drawButton.innerHTML = "Draw"
        div.appendChild(drawButton)
        buttons.appendChild(div)
        drawButton.addEventListener("click", () =>
        {   
            if (playingDeck.length != 0)
            {
                for (let i = 0; i < 3; i++)
                {
                    deal()
                }
            }   
        })
    }

    let br = document.createElement("br")
    buttons.appendChild(br)
    class Player
    {
        constructor (name, score, isActive)
        {
            this.name = name
            this.score = score
            this.isActive = isActive
        }
    }

    for (let i = 0; i < playerList.children.length; i++)
    {
        let name = playerList.children[i].getElementsByTagName("input")[0].value
        players.push(new Player(name, 0, true))
        let button = document.createElement("button")
        button.innerHTML = players[i].name + ", score: " + players[i].score
        playerButtons.appendChild(button)
        button.addEventListener("click", () =>
        {
            if (selectedPlayer == null && players[i].isActive)
            {
                button.classList.toggle("selected")
                selectedPlayer = i
                round()
            }
        })
    }
    for (let i = 0; i < 12; i++)
    {
        deal()
    } 
}

let playingDeck = []

function createDeck()
{
    for (let i = 0; i < deck.length; i++)
    {
        if (fillings[deck[i].f] == "S")
        {
            playingDeck.push(deck[i])
        }
    }
}

function deal(index)
{
    if (playingDeck.length != 0)
    {
        let random = Math.floor(Math.random() * (playingDeck.length - 1))
        if (index == undefined)
        {
            cardsOnTable.push(playingDeck[random])
            let img = document.createElement("img")
            img.src = playingDeck[random].src
            img.height = 200
            img.width = 140
            img.addEventListener("click", () =>
            {
                if (selectedPlayer != null)
                {
                    if (img.classList.value.includes("highlighted"))
                    {
                        img.classList.toggle("highlighted")
                        img.classList.toggle("selected")
                        selectedCards++
                    }
                    else if (!img.classList.value.includes("selected"))
                    {
                        img.classList.toggle("selected")
                        selectedCards++
                    }
                    else
                    {
                        img.classList.toggle("selected")
                        selectedCards--
                    } 
                }
            })
            cards.appendChild(img)
        }
        else
        {
            cardsOnTable.splice(index, 1, playingDeck[random])
            cards.children[index].src = cardsOnTable[index].src
        }
        playingDeck.splice(random, 1)
        cardsInTheDeck.innerHTML = "Cards in the deck: " + playingDeck.length
    }
    else
    {
        cardsOnTable.splice(index, 1)
        cards.removeChild(cards.children[index])
    }   
}

function round()
{
    let timeLeft = 10
    let countdown = setInterval(function()
    {
        if (timeLeft <= 0)
        {
            playerButtons.children[selectedPlayer].innerHTML = players[selectedPlayer].name + ", score: " + (--players[selectedPlayer].score)
            players[selectedPlayer].isActive = false
            playerButtons.children[selectedPlayer].classList.toggle("inactive")
            clearInterval(countdown)
            playerButtons.children[selectedPlayer].classList.toggle("selected")
            selectedPlayer = null
            selectedCards = 0
            for (let i = 0; i < cards.children.length; i++)
            {
                if (cards.children[i].classList.value.includes("selected"))
                {
                    cards.children[i].classList.toggle("selected")
                }
                else if (cards.children[i].classList.value.includes("highlighted"))
                {
                    cards.children[i].classList.toggle("highlighted")
                }
            }
            timer.innerHTML = "Timeout"
            let inactivePlayers = 0
            for (let i = 0; i < playerButtons.children.length; i++)
            {
                if (!players[i].isActive)
                {
                    inactivePlayers++
                    if (inactivePlayers == playerButtons.children.length)
                    {
                        for (let i = 0; i < playerButtons.children.length; i++)
                        {
                            playerButtons.children[i].classList.toggle("inactive")
                            players[i].isActive = true
                        }
                    }
                }
            }
        }
        else if (selectedCards == 3)
        {
            let chosenCards = []
            for (let i = 0; i < cards.children.length; i++)
            {
                if (cards.children[i].classList.value.includes("selected"))
                {
                    chosenCards.push(cardsOnTable[i])
                }
            }
            if (isSet(chosenCards[0], chosenCards[1], chosenCards[2]))
            {
                playerButtons.children[selectedPlayer].innerHTML = players[selectedPlayer].name + ", score: " + (++players[selectedPlayer].score)
                for (let i = 0; i < cards.children.length; i++)
                {
                    if (cards.children[i].classList.value.includes("selected"))
                    {
                        deal(i)
                    }
                }
                for (let i = 0; i < playerButtons.children.length; i++)
                {
                    if (playerButtons.children[i].classList.value.includes("inactive"))
                    {
                        playerButtons.children[i].classList.toggle("inactive")
                        players[i].isActive = true
                    }
                }
                timer.innerHTML = "SET"
            }
            else
            {
                playerButtons.children[selectedPlayer].innerHTML = players[selectedPlayer].name + ", score: " + (--players[selectedPlayer].score)
                players[selectedPlayer].isActive = false
                playerButtons.children[selectedPlayer].classList.toggle("inactive")
                timer.innerHTML = "FAIL"
                let inactivePlayers = 0
                for (let i = 0; i < playerButtons.children.length; i++)
                {
                    if (!players[i].isActive)
                    {
                        inactivePlayers++
                        if (inactivePlayers == playerButtons.children.length)
                        {
                            for (let i = 0; i < playerButtons.children.length; i++)
                            {
                                playerButtons.children[i].classList.toggle("inactive")
                                players[i].isActive = true
                            }
                        }
                    }
                }
            }
            clearInterval(countdown)
            playerButtons.children[selectedPlayer].classList.toggle("selected")
            selectedPlayer = null
            selectedCards = 0
            for (let i = 0; i < cards.children.length; i++)
            {
                if (cards.children[i].classList.value.includes("selected"))
                {
                    cards.children[i].classList.toggle("selected")
                }
                else if (cards.children[i].classList.value.includes("highlighted"))
                {
                    cards.children[i].classList.toggle("highlighted")
                }
            }
        }
        else
        {
            timer.innerHTML = timeLeft + " seconds remaining"
        }
        timeLeft--
        if (!setSearcher())
        {
            if (playingDeck.length == 0)
            {
                game.style.display = "none"
                gameOver.style.display = "block"
                for (let i = 0; i < players.length; i++)
                {
                    if (!scores.includes(players[i].score))
                    {
                        scores.push(players[i].score)
                    }
                }
                scores.sort()
                for (let j = scores.length - 1; j >= 0; j--)
                {
                    let k = 0
                    while (k < players.length)
                    {
                        if (scores[j] == players[k].score)
                        {
                            let li = document.createElement("li")
                            li.innerHTML = players[k].name + ", score: " + players[k].score
                            rankList.appendChild(li)
                        }
                        k++
                    }
                }  
            }
            else if (autoDraw.value == "y")
            {
                for (let i = 0; i < 3; i++)
                {
                    deal()
                }
            }
        }
    }, 1000)
}

function isSet(c1, c2, c3)
{
    let numberRight = (c1.n == c2.n && c1.n == c3.n && c2.n == c3.n) || (c1.n != c2.n && c1.n != c3.n && c2.n != c3.n)
    let colorRight = (c1.c == c2.c && c1.c == c3.c && c2.c == c3.c) || (c1.c != c2.c && c1.c != c3.c && c2.c != c3.c)
    let shapeRight = (c1.s == c2.s && c1.s == c3.s && c2.s == c3.s) || (c1.s != c2.s && c1.s != c3.s && c2.s != c3.s)
    let fillingRight = (c1.f == c2.f && c1.f == c3.f && c2.f == c3.f) || (c1.f != c2.f && c1.f != c3.f && c2.f != c3.f)
    return (numberRight && colorRight && shapeRight && fillingRight)
}

function setSearcher()
{
    for (let i = 0; i < cardsOnTable.length; i++)
    {
        for (let j = 0; j < cardsOnTable.length; j++)
        {
            for (let k = 0; k < cardsOnTable.length; k++)
            {
                if (i != j && i != k && k != j && isSet(cardsOnTable[i], cardsOnTable[j], cardsOnTable[k]))
                {
                    return true
                }
            }
        }
    }
    return false
}

function setHighlighter()
{
    for (let i = 0; i < cardsOnTable.length; i++)
    {
        for (let j = 0; j < cardsOnTable.length; j++)
        {
            for (let k = 0; k < cardsOnTable.length; k++)
            {
                if (i != j && i != k && k != j && isSet(cardsOnTable[i], cardsOnTable[j], cardsOnTable[k]))
                {
                    cards.children[i].classList.toggle("highlighted")
                    cards.children[j].classList.toggle("highlighted")
                    cards.children[k].classList.toggle("highlighted")
                    timer.innerHTML = "SET shown"
                    return true
                }
                else
                {
                    timer.innerHTML = "No SET left"
                }
            }
        }
    }
    return false
}

function deleteAllChild(element)
{
    while (element.lastElementChild)
    {
        element.removeChild(element.lastChild);
    }
}

startButton.addEventListener("click", () =>
{
    if (playerList.childElementCount != 0)
    {
        menu.style.display = "none"
        game.style.display = "block"
        createDeck()
        console.log(playingDeck)
        table()
    }
    else
    {
        console.log("Press the Generate Players button")
    }
})

restartButton.addEventListener("click", () =>
{
    gameOver.style.display = "none"
    menu.style.display = "block"
    deleteAllChild(buttons)
    deleteAllChild(playerButtons)
    deleteAllChild(cards)
    deleteAllChild(rankList)
    players = []
    playingDeck = []
    cardsOnTable = []
    selectedPlayer = null
    selectedCards = 0
    scores = []
})