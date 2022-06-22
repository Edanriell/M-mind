/* eslint-disable max-len */
import getResource from "../services/requests";
import image0 from "../../img/photos/1.png";
import image1 from "../../img/photos/2.png";
import image2 from "../../img/photos/3.png";
import image3 from "../../img/photos/4.png";
import image4 from "../../img/photos/5.png";
import image5 from "../../img/photos/6.png";
import image6 from "../../img/photos/7.png";
import image7 from "../../img/photos/8.png";
import image8 from "../../img/photos/9.png";
import image9 from "../../img/photos/10.png";
import image10 from "../../img/photos/11.png";
import image11 from "../../img/photos/12.png";
import image12 from "../../img/photos/13.png";
import image13 from "../../img/photos/14.png";
import image14 from "../../img/photos/15.png";

export default class Cards {
	static images = [
		{ itemId: 0, imageSrc: image0 },
		{ itemId: 1, imageSrc: image1 },
		{ itemId: 2, imageSrc: image2 },
		{ itemId: 3, imageSrc: image3 },
		{ itemId: 4, imageSrc: image4 },
		{ itemId: 5, imageSrc: image5 },
		{ itemId: 6, imageSrc: image6 },
		{ itemId: 7, imageSrc: image7 },
		{ itemId: 8, imageSrc: image8 },
		{ itemId: 9, imageSrc: image9 },
		{ itemId: 10, imageSrc: image10 },
		{ itemId: 11, imageSrc: image11 },
		{ itemId: 12, imageSrc: image12 },
		{ itemId: 13, imageSrc: image13 },
		{ itemId: 14, imageSrc: image14 }
	];

	constructor({ container, triggerBtn }) {
		this.container = document.querySelector(container);
		this.trigger = document.querySelector(triggerBtn);
		this.cardsFetched = 0;
		this.cardsPerCycle = 1;
		this.totalCardsInDb = this.calculateCards();
		this.calculateCards = this.calculateCards.bind(this);
	}

	init() {
		getResource("http://localhost:3000/images")
			.then(cards => this.renderCards(cards))
			.catch(error => {
				if (error.name === "NetworkError") {
					this.displayErrorMessage("Пожалуйста, проверьте подключение к интернету");
				} else if (error instanceof TypeError) {
					this.displayErrorMessage(
						"Извините, похоже что-то не так с нашим сервером! Повторите попытку позже. "
					);
				} else {
					this.displayErrorMessage(error);
				}
			});
	}

	calculateCards() {
		getResource("http://localhost:3000/images")
			.then(cards => {
				this.totalCardsInDb = cards.length;
			})
			.catch(error => {
				console.log(error);
				this.totalCardsInDb = null;
			});
	}

	renderCards(cards) {
		for (let i = 0; i < this.cardsPerCycle; i++) {
			const {
				imageId,
				imageSize,
				imageCardClass,
				imageLikes,
				imageAltText,
				imageWidth,
				imageHeight
			} = cards[this.cardsFetched];
			const card = document.createElement("li");
			if (imageSize === "large") {
				card.classList.add("image-list__item", imageCardClass, "fade-in-fwd");
				card.innerHTML = `
        <article>
            <a href="#">
              <img class="item-image__image" src="${this.findItemImage(
					imageId,
					Cards.images
				)}" width="${imageWidth}" height="${imageHeight}" alt="${imageAltText}">
              <p class="item-image__likes">${imageLikes}</p>
            </a>
          </article>
        `;
			} else if (imageSize === "medium") {
				card.classList.add("image-list__item", imageCardClass, "fade-in-fwd");
				card.innerHTML = `
        <article>
            <a href="#">
              <img src="${this.findItemImage(
					imageId,
					Cards.images
				)}" width="${imageWidth}" height="${imageHeight}" alt="${imageAltText}">
              <p class="item-image__likes">${imageLikes}</p>
            </a>
          </article>
        `;
			} else {
				card.classList.add("image-list__item", imageCardClass, "fade-in-fwd");
				card.innerHTML = `
        <article>
        <a href="#">
          <img src="${this.findItemImage(
				imageId,
				Cards.images
			)}" width="${imageWidth}" height="${imageHeight}" alt="${imageAltText}">
          <p class="item-image__likes">${imageLikes}</p>
        </a>
      </article>
        `;
			}
			this.container.appendChild(card);
			this.cardsFetched++;
		}
	}

	displayErrorMessage(errorText) {
		if (!document.querySelector(".message")) {
			const error = document.createElement("div");
			error.classList.add("message", "error", "fade-in-fwd");
			error.innerHTML = `
        <p class="error__text">Ошибка</p>- ${errorText}
      `;
			this.container.appendChild(error);
			setTimeout(() => {
				error.classList.remove("fade-in-fwd");
				error.classList.add("fade-out-bck");
				setTimeout(() => {
					error.remove();
				}, 700);
			}, 8000);
		}
	}

	waitAndFetchElements(interval, max = Infinity) {
		function until(time) {
			// eslint-disable-next-line no-promise-executor-return
			return new Promise(resolve => setTimeout(resolve, time - Date.now()));
		}
		return {
			startTime: Date.now(),
			count: 1,
			async next() {
				if (this.count > max) {
					return { done: true };
				}
				const targetTime = this.startTime + this.count * interval;
				await until(targetTime);
				return { value: this.count++ };
			},
			[Symbol.asyncIterator]() {
				return this;
			}
		};
	}

	getCardsOnClick() {
		this.trigger.addEventListener("click", () => {
			(async () => {
				for await (const tick of this.waitAndFetchElements(200, 4)) {
					if (this.cardsFetched === this.totalCardsInDb) {
						this.disableTrigger();
						return;
					}
					this.init();
					console.log(tick);
					console.log(this.totalCardsInDb);
				}
			})();
		});
	}

	disableTrigger() {
		this.trigger.setAttribute("disabled", true);
		this.trigger.style.transition = "all 0.25s linear";
		this.trigger.style.backgroundColor = "rgba(46, 49, 49, 1)";
		this.trigger.style.color = "white";
		this.trigger.style.cursor = "not-allowed";
	}

	findItemImage(id, images) {
		const image = images
			.filter(cardImage => {
				return cardImage.itemId === id;
			})
			.map(url => {
				return url.imageSrc;
			})
			.join();
		return image;
	}
}
