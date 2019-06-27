function getData(url) {

	return fetch(url)
		.then(response => processFetchResponse(response))
		.catch(error => {
			console.error("error (internal):", error);

			return error;
		});
}


function postData(url, data) {

	let contentType = "";

	if (data instanceof FormData) {

		contentType = "application/x-www-form-urlencoded; charset=utf-8";
	}
	else
		if (data instanceof Object) {

			contentType = "application/json; charset=UTF-8";

			data = JSON.stringify(data);
		}

	return fetch(url,
		{
			method: "POST",
			body: data,
			headers: { "Content-type": contentType }
		})
		.then(response => processFetchResponse(response))
		.catch(error => {
			console.error("error (internal):", error);

			return error;
		});
}

// At least for general use (i.e. not byte arrays, etc) processing the
// response is the same...will probably need an update for byte arrays
function processFetchResponse(response) {

	if (!response.ok) {
		return Promise.reject({
			"status": response.status,
			"statusText": response.statusText
		});
	}

	const contentType = response.headers.get("Content-Type") || "";

	if (contentType.includes("application/json")) {

		return response.json().catch(error => {
			return Promise.reject(`JSON error: ${error.message}`);
		});
	}

	if (contentType.includes("text/html")) {
		return response.text().then(html => {
			return {
				page_type: "generic",
				html: html
			};
		}).catch(error => {
			return Promise.reject(`HTML error: ${error.message}`);
		});
	}

	return Promise.reject(`Invalid content type: ${contentType}`);
}