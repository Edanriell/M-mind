import "../sass/main.sass";

import Loader from "./modules/loader";
import Scroll from "./modules/scroll";

window.addEventListener("DOMContentLoaded", () => {
	const loader = new Loader({
		container: ".image-list",
		triggerBtn: ".button--outlined"
	});

	const scroll = new Scroll({
		scrollContainer: "main"
	});

	loader.getCardsOnClick();
	scroll.init();
});
