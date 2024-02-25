async function fetchWidget({ ...props }) {
	// console.log(props)
	console.log("fetching…")
	const response = await fetch(`${props.port}/storefront/getWidget?_id=${props.chat_widget_id}`, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
		}
	});
	return await response.json();
}

function toggleChatWidget() {
	const chat_modal = document.querySelector(".chat-modal")
	const chat_widget_btn = document.querySelector(".chat-widget-btn")

	chat_modal.classList.toggle("show")
	// check if the chat widget is open or not
	if (chat_widget_btn.classList.contains("hide"))
		setTimeout(() => {
			chat_widget_btn.classList.toggle("hide")
		}, 500)
	else chat_widget_btn.classList.toggle("hide")

}

function addWidgetStyle(widget) {
	console.log("adding styles...")
	const styleTag = document.createElement('style');

	styleTag.textContent = `
	:root{
		--brandColor: ${widget.style.brandColor};
		--textColor: ${widget.style.textColor};
		--position: ${widget.style.position};
	}
	`
	document.head.appendChild(styleTag);
}

function createWidget({ _id, chat_widget_id, widget, env }) {
	const iframeSrc = env === "local" ? "http://localhost:9932" : "https://storefront.widgify.chat";
	console.log("Adding widget…")
	// SECTION
	const section = document.createElement('section');
	section.className = `chat-widget___`
	section.style.zIndex = "999999999"
	const container = document.createElement('div');
	container.className = "container"
	if (widget.style.position == "flex-end") container.style.right = "0px";
	else container.style.left = "0px";

	// BTN
	const btn = document.createElement('div');
	btn.className = 'chat-widget-btn';
	const btnIcon = document.createElement('img');
	btnIcon.src = "https://assets.lightfunnels.com/account-206/images_library/e41cd459-4c85-4fb7-a4fd-93ce657e26b9.chat.svg"
	if (widget.style.label) {
		const btnLabel = document.createElement('p');
		btnLabel.textContent = widget.style.label.text
		widget.style.position == "flex-end" ? btnLabel.style.right = "calc(64px + 12px)" : btnLabel.style.left = "calc(64px + 12px)"
		btn.appendChild(btnLabel)

		setTimeout(() => {
			btnLabel.style.display = "none"
		}, 4000)
	}
	btn.appendChild(btnIcon)

	// MODAL
	const chat_modal = document.createElement('iframe');
	chat_modal.className = "chat-modal"
	chat_modal.src = `${iframeSrc}?_id=${_id}&chat_widget_id=${chat_widget_id}&env=${env}`


	// const closeBtn = document.createElement("img")
	// closeBtn.className = "chat-close-modal"
	// closeBtn.src = "https://assets.lightfunnels.com/account-206/images_library/60e13e8e-8385-4653-85e4-ebd06928c179.24x24.svg"

	container.appendChild(chat_modal)
	container.appendChild(btn)

	section.appendChild(container)

	const pageBody = document.querySelector(".vhPBy")
	pageBody.appendChild(section)

	btn.addEventListener("click", toggleChatWidget);
	// closeBtn.addEventListener("click", toggleChatWidget);
}

window.addEventListener('message', function (event) {
	if (event.origin === 'http://localhost:9932' || "https://storefront.widgify.chat") {
		if (event.data === 'toggleChatWidget') toggleChatWidget();
	}
});

document.addEventListener('DOMContentLoaded', async () => {
	try {

		const script = document.querySelector('script[src="https://worker.widgify.chat/index.js"]');

		const env = script.dataset.env

		const _id = script.dataset._id;
		const chat_widget_id = script.dataset.chat_widget_id;
		const port = env === "dev" ? "https://widgify-api-dev.up.railway.app" : env === "local" ? "http://localhost:9931" : "https://api.widgify.chat"

		const account = await fetch(`${port}/storefront/getAccount?_id=${_id}`, {
			method: "GET",
			headers: { "Content-Type": "application/json" }
		}).then(res => res.json()).catch(err => console.log(err))

		if (account.hasAccess) {
			fetchWidget({ chat_widget_id, port }).then(data => {
				createWidget({ _id, chat_widget_id, widget: data, env })
				addWidgetStyle(data)
				console.log("page is fully loaded");
			}).catch(error => {
				console.error('Error fetching data:', error);
			})
		} else {
			console.log("User is not licensed")
		}
	}
	catch (err) {
		console.log(err)
	}
})