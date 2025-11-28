// let obj = { list: [] }
// for (let i = 1; i < 30; i++) {
//	 obj.list.push({ index: i })
// }
// console.log(JSON.stringify(obj))

"use strict"
import data from "./data.json" with {type: "json"}
let list = data.list
let now_index = 8
let index_box = document.getElementById("index-box")
for (let i = 0; i < now_index; i++) {
	add_line(i, "end")
}

window.addEventListener("scroll", function () {
	let scrollY = window.scrollY
	let scrollindex = Math.floor(scrollY / 240)
	if (scrollindex + 4 > now_index) {
		now_index += 1
		add_line(now_index, "end")
	}
	if (scrollindex < now_index - 8) {
		now_index -= 1
		remove_line("end")
	}
})

function add_line(i, where) {
	add(i * 3, where)
	add(i * 3 + 1, where)
	add(i * 3 + 2, where)
}

function add(i, where) {
	i %= list.length
	let box = document.createElement("div")
	box.className = "box"
	let text = document.createElement("p")
	text.className = "text"
	text.textContent = list[i].index
	if (where == "begin") { index_box.insertAdjacentElement("afterbegin", box) }
	if (where == "end") { index_box.insertAdjacentElement("beforeend", box) }
	box.appendChild(text)
}

function remove_line(where) {
	let i = 0
	if (where == "begin") { i = 0 }
	for (let x = 0; x < 3; x++) {
		if (where == "end") { i = index_box.childElementCount - 1 }
		index_box.children[i].remove()
	}
}