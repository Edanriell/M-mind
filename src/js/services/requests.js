async function getResource(url) {
	const response = await fetch(url);
	if (!response.ok) {
		throw new Error(`Could not fetch ${url}, status: ${response.status}`);
	}
	const type = response.headers.get("content-type");
	if (type !== "application/json; charset=utf-8") {
		throw new TypeError(`Expected JSON, got ${type}`);
	}
	const cards = await response.json();
	return cards;
}

export default getResource;
