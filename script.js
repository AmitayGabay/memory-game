$(document).ready(function () {
    const cards = document.querySelectorAll(".memory-card");
    const images = document.querySelectorAll(".front-face");
    const harryPotterBtn = document.querySelector(".btn-info");
    const dogsBtn = document.querySelector(".btn-warning");
    const catsBtn = document.querySelector(".btn-success");

    let cardFliped;
    let firstCard;
    let secondCard;

    // I made the random game bonus by default
    defaultGame();

    function defaultGame() {
        resetGame();
        const rnd = Math.random();
        if (rnd < 0.333) {
            createHarryPotterPictures();
        } else if (rnd >= 0.333 && rnd <= 0.666) {
            createDogsPictures();
        } else {
            createCatsPictures();
        }
    }

    harryPotterBtn.addEventListener("click", () => {
        resetGame();
        createHarryPotterPictures();
    })
    dogsBtn.addEventListener("click", () => {
        resetGame();
        createDogsPictures();
    })
    catsBtn.addEventListener("click", () => {
        resetGame();
        createCatsPictures();
    })

    function resetGame() {
        images.forEach((img) => {
            img.src = "";
            img.parentElement.dataset.framework = "";
            if (!img.parentElement.classList.contains("flip")) {
                img.parentElement.classList.add("flip");
            }
            setTimeout(() => {
                img.parentElement.classList.remove("flip");
            }, 200)
            img.parentElement.addEventListener("click", flipCard);
        })
        cardFliped = false;
    }

    function createHarryPotterPictures() {
        shuffle();
        $.ajax({
            url: "https://hp-api.herokuapp.com/api/characters"
        }).done(function (data) {
            const randomNum = Math.floor(Math.random() * 18);
            for (let i = 0; i < images.length / 2; i++) {
                let location = randomNum + i;
                images[i].src = data[location].image;
                images[i].alt = data[location].name;
                images[i].parentElement.dataset.framework = data[location].name;
                images[images.length - 1 - i].src = data[location].image;
                images[images.length - 1 - i].alt = data[location].name;
                images[images.length - 1 - i].parentElement.dataset.framework = data[location].name;
            }
        });
    }

    function createDogsPictures() {
        shuffle();
        for (let i = 0; i < images.length / 2; i++) {
            $.ajax({
                url: "https://dog.ceo/api/breeds/image/random"
            }).done(function (data) {
                images[i].src = data.message;
                images[i].alt = data.message.substring(30);
                images[i].parentElement.dataset.framework = data.message.substring(30);
                images[images.length - 1 - i].src = data.message;
                images[images.length - 1 - i].alt = data.message.substring(30);
                images[images.length - 1 - i].parentElement.dataset.framework = data.message.substring(30);
            });
        }
    }

    function createCatsPictures() {
        shuffle();
        $.ajax({
            url: "https://api.thecatapi.com/v1/images/search?limit=10"
        }).done(function (data) {
            for (let i = 0; i < images.length / 2; i++) {
                images[i].src = data[i].url;
                images[i].alt = data[i].url?.substring(35);
                images[i].parentElement.dataset.framework = data[i].url?.substring(35);
                images[images.length - 1 - i].src = data[i].url;
                images[images.length - 1 - i].alt = data[i].url?.substring(35);
                images[images.length - 1 - i].parentElement.dataset.framework = data[i].url?.substring(35);
            }
        });
    }

    function shuffle() {
        cards.forEach((card) => {
            let randomNumber = Math.floor(Math.random() * 12);
            card.style.order = randomNumber;
        });
    }

    function flipCard() {
        if (!cardFliped) {
            this.classList.add("flip");
            firstCard = this;
            cardFliped = true;
        } else if (cardFliped) {
            if (this != firstCard) {
                this.classList.add("flip");
                secondCard = this;
                checkMatch();
                cardFliped = false;
            }
        }
    }

    function checkMatch() {
        if (firstCard.dataset.framework === secondCard.dataset.framework) {
            success();
        } else {
            flipBack();
        }
    }

    function flipBack() {
        cards.forEach((card) => {
            card.removeEventListener("click", flipCard);
        });
        setTimeout(() => {
            firstCard.classList.remove("flip");
            secondCard.classList.remove("flip");
            cards.forEach((card) => {
                card.addEventListener("click", flipCard);
            });
        }, 1500);
    }

    function success() {
        firstCard.removeEventListener("click", flipCard);
        secondCard.removeEventListener("click", flipCard);
    }
});






