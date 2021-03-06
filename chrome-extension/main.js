
chrome.tabs.query({}, tabs => {
	const elem_search_text = document.getElementById("search_text");
	const elem_replacement_text = document.getElementById("replacement_text");
	const elem_result = document.getElementById("result");

	const findReplaceTargetTab = (tabs, search_text, replacement_text) => {
		return tabs.filter(tab => {
			return tab.url.includes(search_text);
		}).map(tab => {
			const newUrl = tab.url.split(search_text).join(replacement_text);
			return {tab, newUrl};
		});
	};

	const updateResult = () => {
		const search_text = elem_search_text.value;
		elem_result.innerText = "";
		const replacement_text = elem_replacement_text.value;
		findReplaceTargetTab(tabs, search_text, replacement_text).forEach(({tab, newUrl}) => {
			const resultItem = createResultItem(tab.title, tab.url, newUrl);
			elem_result.appendChild(resultItem);
		});
	};

	const createResultItem = (title, currentUrl, newUrl) => {
		const li = document.createElement("li");
		li.append(title);
		li.append(document.createElement("br"));
		li.append(currentUrl);
		li.append(document.createElement("br"));
		li.append("↓");
		li.append(document.createElement("br"));
		li.append(newUrl);
		return li;
	};

	elem_search_text.addEventListener("change", updateResult);
	elem_search_text.addEventListener("keyup", updateResult);
	elem_search_text.addEventListener("cut", updateResult);
	elem_search_text.addEventListener("paste", updateResult);
	elem_replacement_text.addEventListener("change", updateResult);
	elem_replacement_text.addEventListener("keyup", updateResult);
	elem_replacement_text.addEventListener("cut", updateResult);
	elem_replacement_text.addEventListener("paste", updateResult);

	const replace = () => {
		const search_text = elem_search_text.value;
		if (search_text === "") return;
		const replacement_text = elem_replacement_text.value;
		findReplaceTargetTab(tabs, search_text, replacement_text).forEach(({tab, newUrl}) => {
			chrome.tabs.update(tab.id, {
				url: newUrl
			});
		});
	};
	document.getElementById("replace").addEventListener("click", replace);

	updateResult();
	elem_search_text.focus();
});
