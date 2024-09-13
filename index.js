// // Create a new script element for Bugsnag
// var bugsnagScript = document.createElement('script');
// import BugsnagPerformance from '//d2wy8f7a9ursnm.cloudfront.net/v1/bugsnag-performance.min.js';

// bugsnagScript.src = '//d2wy8f7a9ursnm.cloudfront.net/v7/bugsnag.min.js';

// // Set onload function to initialize Bugsnag after script is loaded
// bugsnagScript.onload = function () {
// 	// Start Bugsnag and Bugsnag Performance
// 	Bugsnag.start({ apiKey: '8aa9f71fe4d9e6471648442df6e71240' });
// 	BugsnagPerformance.start({ apiKey: '8aa9f71fe4d9e6471648442df6e71240' });
// };

// // Append the Bugsnag script to the document
// document.head.appendChild(bugsnagScript);

import './src/styles/styles.css'; // Adjust the path as necessary

// Add links to the head tag
const link1 = document.createElement('link');
link1.rel = 'preconnect';
link1.href = 'https://fonts.googleapis.com';
document.head.appendChild(link1);

const link2 = document.createElement('link');
link2.rel = 'preconnect';
link2.href = 'https://fonts.gstatic.com';
link2.crossOrigin = true;
document.head.appendChild(link2);

const link3 = document.createElement('link');
link3.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap';
link3.rel = 'stylesheet';
document.head.appendChild(link3);

async function fetchWidget({ ...props }) {
	const response = await fetch(`${props.port}/storefront/getWidget?_id=${props.chat_widget_id}`, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
		}
	});
	return await response.json();
}

function openChatWidget({ iframeSrc, hasLabel = false }) {
	const chat_modal = document.querySelector(".chat-modal")
	const chat_widget_btn = document.querySelector(".chat-widget-btn")
	const poweredBy = document.querySelector(".powered-by")

	if (hasLabel) {
		const chatDialog = document.querySelector(".chat-dialog")
		chatDialog.style.display = "none"
	}
	chat_modal.src = iframeSrc
	chat_modal.allow = "autoplay"
	chat_modal.classList.add("show")
	chat_modal.classList.remove("close")
	chat_widget_btn.classList.toggle("hide")
	poweredBy?.classList?.toggle("show")

	// Specify '*' as the target origin to allow communication with any origin
	// send postMessage to the iframe object with type of widget_opened
	// check if the iframs is loaded
	// chat_modal.onload = function () {
	// 	chat_modal.contentWindow.postMessage({
	// 		type: "widget_click"
	// 	}, '*');
	// }
}

function closeChatWidget() {
	const chat_modal = document.querySelector(".chat-modal")
	const chat_widget_btn = document.querySelector(".chat-widget-btn")
	const poweredBy = document.querySelector(".powered-by")

	poweredBy?.classList.toggle("show")

	chat_modal.classList.remove("show")
	chat_modal.classList.add("close")
	if (chat_widget_btn.classList.contains("hide"))
		setTimeout(() => {
			chat_widget_btn.classList.toggle("hide")
		}, 500)
	else chat_widget_btn.classList.toggle("hide")
}

// function toggleChatWidget({ iframeSrc, hasLabel = false }) {
// 	const chat_modal = document.querySelector(".chat-modal")
// 	const chat_widget_btn = document.querySelector(".chat-widget-btn")

// 	if (hasLabel) {
// 		const chatDialog = document.querySelector(".chat-dialog")
// 		chatDialog.style.display = "none"
// 	}

// 	chat_modal.classList.toggle("show")
// 	// check if the chat widget is open or not
// 	if (chat_widget_btn.classList.contains("hide"))
// 		setTimeout(() => {
// 			chat_widget_btn.classList.toggle("hide")
// 		}, 500)
// 	else chat_widget_btn.classList.toggle("hide")

// }

function closeChatDialog() {
	const chatDialog = document.querySelector(".chat-dialog")
	chatDialog.style.display = "none"
}

function addWidgetStyle(widget) {
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

function createWidget({ _id, chat_widget_id, widget, env, platform, selectedPlan }) {

	const link = document.createElement('link');
	link.rel = 'stylesheet';
	link.type = 'text/css';
	link.href = "https://worker.widgify.chat/src/styles/styles.css"
	document.head.appendChild(link);

	const url = env === "local" ? "http://localhost:9932" : "https://storefront.widgify.chat";
	const iframeSrc = `${url}?_id=${_id}&chat_widget_id=${chat_widget_id}&env=${env}&platform=${platform}&source=${window.location.href}`
	// SECTION
	const section = document.createElement('div');
	const { desktop, tablet, mobile } = widget.style.displayOn
	section.className = `chat-widget___ ${!desktop ? "hide_on_desktop" : ""} ${!tablet ? "hide_on_tablet" : ""} ${!mobile ? "hide_on_mobile" : ""}`
	section.style.zIndex = "999999999"
	document.body.appendChild(section)

	const container = document.createElement('div');
	container.className = "container"
	section.appendChild(container)
	if (widget.style.position == "flex-end") container.style.right = "0px";
	else container.style.left = "0px";
	// MODAL
	const chat_modal = document.createElement('iframe');
	chat_modal.className = "chat-modal"
	container.appendChild(chat_modal)
	// POWERED BY
	if (selectedPlan === "price_1PAe02GuSc0lsvia7pMoQ5JA" || selectedPlan === "price_1PAe02ia7pMoQ5JAGuSc0lsv") {
		const poweredBy = document.createElement('a');
		poweredBy.className = 'powered-by';
		poweredBy.href = `https://www.widgify.chat/?ref=powered_by&utm_source=powered_by&utm_medium=${window.location.href}&utm_widget_id=${widget._id}&utm_content=${widget.name}`
		poweredBy.target = '_blank';
		poweredBy.innerHTML = 'Powered by: <img src="https://storefront.widgify.chat/d76772b21555c89371c891f3d91edd00.svg">';
		container.appendChild(poweredBy)
	} else {
		chat_modal.classList.add("pb-unvisible")
	}
	// BTN
	const btn = document.createElement('div');
	btn.className = 'chat-widget-btn';
	container.appendChild(btn)
	const btnLauncher = document.createElement('div');
	btnLauncher.className = 'chat-widget-launcher';
	btn.appendChild(btnLauncher)
	const launcherIcon = document.createElement('img');
	launcherIcon.src = "https://assets.lightfunnels.com/account-206/images_library/e41cd459-4c85-4fb7-a4fd-93ce657e26b9.chat.svg"
	btnLauncher.appendChild(launcherIcon)
	btnLauncher.addEventListener("click", () => openChatWidget({ iframeSrc, hasLabel: widget.style.label.hasLabel }));
	if (widget.style.label.hasLabel) {

		const dialog = document.createElement('div');

		if (widget.style.position == "flex-end") {
			btn.style.flexFlow = "row"
			btn.style.flexWrap = "wrap"
		}
		else {
			btn.style.flexFlow = "row-reverse"
			btn.style.flexWrap = "wrap"
			dialog.style.transformOrigin = "bottom left"
		}

		dialog.className = "chat-dialog"
		dialog.innerHTML = `
		<div class="label ellipsis">${widget.style.label.text}</div>
		<div class="caption ellipsis">
			<span class="indicator"></span>
			<span class="content">${widget.style.label.respondTime}</span>
		</div>
		<div class="close-dialog-btn">
			<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
				<g opacity="0.5">
				<path fill-rule="evenodd" clip-rule="evenodd" d="M4.23123 4.23123C4.53954 3.92292 5.03941 3.92292 5.34772 4.23123L9 7.88352L12.6523 4.23123C12.9606 3.92292 13.4605 3.92292 13.7688 4.23123C14.0771 4.53954 14.0771 5.03941 13.7688 5.34772L10.1165 9L13.7688 12.6523C14.0771 12.9606 14.0771 13.4605 13.7688 13.7688C13.4605 14.0771 12.9606 14.0771 12.6523 13.7688L9 10.1165L5.34772 13.7688C5.03941 14.0771 4.53954 14.0771 4.23123 13.7688C3.92292 13.4605 3.92292 12.9606 4.23123 12.6523L7.88352 9L4.23123 5.34772C3.92292 5.03941 3.92292 4.53954 4.23123 4.23123Z" fill="black"/>
				</g>
			</svg>
		</div>
		`

		btn.insertBefore(dialog, btn.firstChild)


		setTimeout(() => { dialog.style.display = "flex" }, 1000)
		// setTimeout(() => { dialog.style.display = "none" }, 10000)

		document.querySelector(".close-dialog-btn").addEventListener("click", closeChatDialog)
	}
}

window.addEventListener('message', function (event) {
	if (event.origin === 'http://localhost:9932' || "https://storefront.widgify.chat") {
		if (event.data === 'closeChatWidget') closeChatWidget();
	}
});


document.addEventListener('DOMContentLoaded', async () => {
	try {

		const script = document.querySelector('script[src="https://worker.widgify.chat/index.js"]');

		const env = script.dataset.env

		const _id = script.dataset._id;
		const chat_widget_id = script.dataset.chat_widget_id;
		const port = env === "dev" ? "https://api.widgify.chat" : env === "local" ? "http://localhost:9090" : "https://api.widgify.chat"
		const platform = script.dataset.platform

		const user = await fetch(`${port}/storefront/getUser?_id=${_id}`, {
			method: "GET",
			headers: { "Content-Type": "application/json" }
		}).then(res => res.json()).catch(err => { throw new Error(err) })

		if (user.hasAccess) {
			fetchWidget({ chat_widget_id, port }).then(data => {
				createWidget({ _id, chat_widget_id, widget: data, env, platform, selectedPlan: user.selectedPlan })
				addWidgetStyle(data)
			}).catch(error => {
				console.error('Error fetching data:', error);
			})
		} else {
			console.log("User is not licensed")
		}
	}
	catch (err) {
		console.log(err)
		// Bugsnag.notify(new Error(err))
	}
})