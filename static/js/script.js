const words = [
	"Weddings.",
	"Jaimala.",
	"Festivals.",
	"Cultural Programmes.",
	"Temple Inaugration.",
];
let i = 0;
let timer;

document.getElementById("word").innerHTML = "Book For ";
setTimeout(() => {
	typingEffect();
}, 1500);

function typingEffect() {
	let word = words[i].split("");
	var loopTyping = function () {
		if (word.length > 0) {
			document.getElementById("word").innerHTML =
				document.getElementById("word").innerHTML + word.shift();
		} else {
			deletingEffect();
			return false;
		}
		timer = setTimeout(loopTyping, 100);
	};
	loopTyping();
}

function deletingEffect() {
	let word = words[i].split("");
	var loopDeleting = function () {
		if (word.length > 0) {
			word.pop();
			document.getElementById("word").innerHTML =
				"Book For " + word.join("");
		} else {
			if (words.length > i + 1) {
				i++;
			} else {
				i = 0;
			}
			typingEffect();
			return false;
		}
		timer = setTimeout(loopDeleting, 100);
	};
	loopDeleting();
}
