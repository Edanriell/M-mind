export default class Scroll {
	constructor({ scrollContainer }) {
		this.container = document.querySelector(scrollContainer);
	}

	init() {
		this.createBtn();
		const trigger = document.querySelector(".pageup");
		this.toggleClass(trigger);
		trigger.addEventListener("click", event => {
			this.scroll(event);
		});
	}

	createBtn() {
		const btn = document.createElement("a");
		btn.setAttribute("href", "#up");
		btn.classList.add("pageup");
		this.container.appendChild(btn);
	}

	scroll(event) {
		event.preventDefault();
		const widthTop = document.documentElement.scrollTop;
		const { hash } = document.querySelector("header"); // fix header id
		const toBlock = document.querySelector("header", "#up").getBoundingClientRect().top;
		let start = null;
		const speed = 0.01;
		requestAnimationFrame(step);
		function step(time) {
			if (start === null) {
				start = time;
			}
			const progress = time - start;
			const r =
				toBlock < 0
					? Math.max(widthTop - progress / speed, widthTop + toBlock)
					: Math.min(widthTop + progress / speed, widthTop + toBlock);
			document.documentElement.scrollTo(0, r);
			if (r !== widthTop + toBlock) {
				requestAnimationFrame(step);
			} else {
				// eslint-disable-next-line no-restricted-globals
				location.hash = hash;
			}
		}
	}

	toggleClass(trigger) {
		window.addEventListener("scroll", () => {
			if (
				document.documentElement.scrollTop > 600 &&
				!trigger.classList.contains("slide-in-blurred-bottom")
			) {
				trigger.classList.add("slide-in-blurred-bottom");
				trigger.classList.remove("slide-out-blurred-right");
			} else if (
				document.documentElement.scrollTop < 600 &&
				trigger.classList.contains("slide-in-blurred-bottom")
			) {
				trigger.classList.remove("slide-in-blurred-bottom");
				trigger.classList.add("slide-out-blurred-right");
			}
		});
	}
}
