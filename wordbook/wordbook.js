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
				{ completed: false, word: "新規作成", description: "aa" }
			]
		}
	]
}
const generate_box = document.getElementById("generate_box")
const main_title = document.getElementById("main_title")
let dots_hover = false
let title_move_hover = false
let dots_menu_hover = false
let hover_index = -1
display_title()

function open_wordbook(index) {
	console.log("open_wordbook", wordbook_data[index])
	main_title.textContent = wordbook_data[index].name
	generate_box.innerHTML = ""
	wordbook_data[index].words.forEach((word, i) => {
		console.log(`No.${i} ${word.word} -> ${word.description}`)
	})
}

function display_title() {
	main_title.textContent = "デジタル単語帳"
	generate_box.innerHTML = ""
	wordbook_data.forEach((wordbook, i) => {
		const title = document.createElement("div")
		title.id = `title${i}`
		title.dataset.index = i
		title.className = "title_block"
		title.textContent = wordbook.name
		title.addEventListener('click', title_click)
		title.addEventListener('mouseover', () => { hover_index = i })
		title.addEventListener('mouseleave', () => { hover_index = -1 })
		const dots = document.createElement("div")
		dots.className = "dots"
		dots.addEventListener('mouseover', () => { dots_hover = true })
		dots.addEventListener('mouseleave', () => { dots_hover = false })
		const title_move = document.createElement("div")
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
}

function display_words(index) {
	main_title.textContent = wordbook_data[index].name
	generate_box.innerHTML = ""
	const words_list_table = document.createElement('table')
	words_list_table.id = "words_list_table"
	const line = document.createElement('tr')
	const th_no = document.createElement('th')
	const th_word = document.createElement('th')
	const th_description = document.createElement('th')
	th_no.className = "no"
	th_word.className = "word"
	th_description.className = "description"
	th_no.textContent = "No."
	th_word.textContent = "単語"
	th_description.textContent = "説明"
	th_no.scope="col"
	th_word.scope="col"
	th_description.scope="col"
	line.appendChild(th_no)
	line.appendChild(th_word)
	line.appendChild(th_description)
	words_list_table.appendChild(line)
	wordbook_data[index].words.forEach((word, i) => {
		const line = document.createElement('tr')
		const td_no = document.createElement('td')
		const td_word = document.createElement('td')
		const td_description = document.createElement('td')
		td_no.className = "no"
		td_word.className = "word"
		td_description.className = "description"
		td_no.scope = "row"
		td_no.textContent = i + 1
		td_word.textContent = word.word
		td_description.textContent = word.description
		line.appendChild(td_no)
		line.appendChild(td_word)
		line.appendChild(td_description)
		words_list_table.appendChild(line)
	})
	generate_box.appendChild(words_list_table)
}

function title_click() {
	const dots_menu_display = Boolean(document.querySelector(`#title${hover_index} #dots_menu`))
	if (document.getElementById('dots_menu')) {
		document.getElementById('dots_menu').remove()
	}
	// hover_index dots_hover title_move_hover
	if (dots_hover) {
		// dots_click
		if (!dots_menu_display) {
			const dots_menu = document.createElement('div')
			const title_remove = document.createElement('div')
			const title_edit = document.createElement('div')
			const words_list = document.createElement('div')
			dots_menu.id = "dots_menu"
			title_remove.id = "title_remove"
			title_edit.id = "title_edit"
			words_list.id = "words_list"
			dots_menu.addEventListener('mouseover', () => { dots_menu_hover = true })
			dots_menu.addEventListener('mouseleave', () => { dots_menu_hover = false })
			title_remove.addEventListener('click', () => {
				delete wordbook_data[this.dataset.index]
				display_title()
			})
			words_list.addEventListener('click', () => {
				display_words(this.dataset.index)
			})
			dots_menu.appendChild(words_list)
			dots_menu.appendChild(title_edit)
			dots_menu.appendChild(document.createElement('hr'))
			dots_menu.appendChild(title_remove)
			document.getElementById(`title${hover_index}`).appendChild(dots_menu)
		}
	} else if (title_move_hover) {
		// title_move
	} else if (!dots_menu_hover) {
		// open_wordbook
		console.log("-----------open_wordbook", hover_index)
		open_wordbook(hover_index)
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
