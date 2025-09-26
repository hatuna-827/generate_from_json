"use strict"
import storage from "https://hatuna-827.github.io/storage.js"
import dialog from "https://hatuna-827.github.io/dialog.js"
let wordbook_data = []
if (localStorage.hasOwnProperty("wordbook")) {
	wordbook_data = storage.ger("wordbook")
	console.log(wordbook_data)
} else {
	wordbook_data = [
		{
			name: "使い方", words: [
				{ completed: false, word: "1.新規作成", description: "aa" }
			]
		}
	]
}
const generate_box = document.getElementById("generate_box")
let dots_menu_remove_queue = []
let dots_menu_remove_index = 0
let dots_hover = false
let title_move_hover = false
let hover_index = -1
display_title()

function display_title() {
	generate_box.innerHTML = ""
	wordbook_data.forEach((wordbook, i) => {
		let title = document.createElement("div")
		title.id = `title${i}`
		title.dataset.index = i
		title.className = "title_block"
		title.textContent = wordbook.name
		title.addEventListener('click', title_click)
		title.addEventListener('mouseover', () => { hover_index = i })
		title.addEventListener('mouseleave', () => { hover_index = -1 })
		let dots = document.createElement("div")
		dots.className = "dots"
		dots.addEventListener('mouseover', () => { dots_hover = true })
		dots.addEventListener('mouseleave', () => { dots_hover = false })
		let title_move = document.createElement("div")
		title_move.className = "title_move"
		title_move.addEventListener('mouseover', () => { title_move_hover = true })
		title_move.addEventListener('mouseleave', () => { title_move_hover = false })
		title.appendChild(title_move)
		title.appendChild(dots)
		generate_box.appendChild(title)
		generate_box.appendChild(document.createElement('br'))
	})
	// add add_button
	const add_button = document.createElement("div")
	add_button.className = "title_block"
	add_button.id = "add_button"
	add_button.addEventListener('click', add_new_title)
	generate_box.appendChild(add_button)
	// add dots_meun
	const dots_menu = document.createElement('div')
	const title_remove = document.createElement('div')
	const title_edit = document.createElement('div')
	dots_menu.id = "dots_menu"
	title_remove.id = "title_remove"
	title_edit.id = "title_edit"
	dots_menu.appendChild(title_edit)
	dots_menu.appendChild(document.createElement('hr'))
	dots_menu.appendChild(title_remove)
	generate_box.appendChild(dots_menu)
}

function title_click() {
	// remove dots_menu
	// console.log(`${hover_index}番目 ${wordbook_data[hover_index].name} ${dots_hover ? "dots" : "open"}`)
	if (dots_hover) {
		// dots_click
		if (document.querySelector(`#title${hover_index} #dots_menu`)) {
			if (document.querySelector(`#title${hover_index} #dots_menu:not(.ignore)`)) { hide_dots_menu() }
		} else {
			const dots_menu = document.getElementById('dots_menu')
			const new_dots_menu = dots_menu.cloneNode(true)
			new_dots_menu.querySelector('#title_remove').addEventListener('click', () => {
				delete wordbook_data[this.dataset.index]
				display_title()
			})
			document.getElementById(`title${hover_index}`).appendChild(new_dots_menu)
			remove_dots_menu(dots_menu)
		}
	} else if (title_move_hover) {
		// title_move
	} else {
		// open_wordbook
		hide_dots_menu()
	}
}

function add_new_title() {
	let new_title_name = ""
	new_title_name = window.prompt("単語帳の名前を入力してください。", "")
	while (!/\S+/.test(new_title_name) || new_title_name == "") {
		new_title_name = window.prompt("入力が無効です。", "")
	}
	if (new_title_name == null) { return }
	wordbook_data.push({ name: new_title_name, words: [] })
	display_title()
}

function hide_dots_menu() {
	const dots_menu = document.getElementById('dots_menu')
	generate_box.appendChild(dots_menu.cloneNode(true))
	remove_dots_menu(dots_menu)
}

function remove_dots_menu(dots_menu) {
	const new_dots_menu = dots_menu.cloneNode(true)
	new_dots_menu.style.animationDirection = "reverse"
	new_dots_menu.className = "ignore"
	dots_menu.insertAdjacentElement('afterend', new_dots_menu)
	dots_menu.remove()
	new_dots_menu.dataset.remove_index = dots_menu_remove_index
	dots_menu_remove_queue.push(dots_menu_remove_index)
	dots_menu_remove_index++
	window.setTimeout(() => {
		document.querySelectorAll('.ignore').forEach((ignore) => {
			if (ignore.dataset.remove_index == dots_menu_remove_queue[0]) {
				ignore.remove()
			}
		})
		dots_menu_remove_queue.shift()
	}, 500)
}