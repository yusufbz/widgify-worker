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

	const chatDialog = document.querySelector(".chat-dialog")
	console.log(chatDialog)
	chatDialog.style.display = "none"

	chat_modal.classList.toggle("show")
	// check if the chat widget is open or not
	if (chat_widget_btn.classList.contains("hide"))
		setTimeout(() => {
			chat_widget_btn.classList.toggle("hide")
		}, 500)
	else chat_widget_btn.classList.toggle("hide")

}

function closeChatDialog() {
	const chatDialog = document.querySelector(".chat-dialog")
	chatDialog.style.display = "none"
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
	if (widget.style.label.hasLabel) {
		const dialog = document.createElement('div');
		widget.style.position == "flex-end" ? dialog.style.right = "calc(64px + 12px)" : dialog.style.left = "calc(64px + 12px)"
		dialog.className = "chat-dialog"
		dialog.innerHTML = `
		<div class="label">${widget.style.label.text}</div>
		<div class="caption">
			<span class="indicator"></span>
			<span>We’ll respond immediately</span>
		</div>
		<button class="close-dialog-btn" onClick={()=>closeChatDialog()}>
			<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
				<g opacity="0.5">
				<path fill-rule="evenodd" clip-rule="evenodd" d="M4.23123 4.23123C4.53954 3.92292 5.03941 3.92292 5.34772 4.23123L9 7.88352L12.6523 4.23123C12.9606 3.92292 13.4605 3.92292 13.7688 4.23123C14.0771 4.53954 14.0771 5.03941 13.7688 5.34772L10.1165 9L13.7688 12.6523C14.0771 12.9606 14.0771 13.4605 13.7688 13.7688C13.4605 14.0771 12.9606 14.0771 12.6523 13.7688L9 10.1165L5.34772 13.7688C5.03941 14.0771 4.53954 14.0771 4.23123 13.7688C3.92292 13.4605 3.92292 12.9606 4.23123 12.6523L7.88352 9L4.23123 5.34772C3.92292 5.03941 3.92292 4.53954 4.23123 4.23123Z" fill="black"/>
				</g>
			</svg>
		</button>
		`
		btn.appendChild(dialog)

		setTimeout(() => { dialog.style.display = "flex" }, 2000)
		// setTimeout(() => { dialog.style.display = "none" }, 10000)
	}
	btn.appendChild(btnIcon)

	// MODAL
	const chat_modal = document.createElement('iframe');
	chat_modal.className = "chat-modal"
	chat_modal.src = `${iframeSrc}?_id=${_id}&chat_widget_id=${chat_widget_id}&env=${env}`
	// TODO LABEL: Add Later
	// const dialog = document.createElement('iframe');
	// dialog.className = "chat-dialog"
	// dialog.src = `${iframeSrc}/dialog?_id=${_id}&chat_widget_id=${chat_widget_id}&env=${env}`



	// const closeBtn = document.createElement("img")
	// closeBtn.className = "chat-close-modal"
	// closeBtn.src = "https://assets.lightfunnels.com/account-206/images_library/60e13e8e-8385-4653-85e4-ebd06928c179.24x24.svg"

	container.appendChild(chat_modal)
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
		}).then(res => res.json()).catch(err => { throw new Error(err) })

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