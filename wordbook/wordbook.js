"use strict"

/* - import ------------------------------------------------------------------------------------ */

import storage from "https://hatuna-827.github.io/module/storage.js"
import dialog from "https://hatuna-827.github.io/module/dialog.js"

/* - const ------------------------------------------------------------------------------------- */

let wordbook_data = [
	{
		name: "使い方", words: [
			{ word: "新規作成", description: "aa" },
			{ word: "編集", description: "bb" },
			{ word: "削除", description: "cc" }
		]
	}
]

const main_title = document.getElementById("main_title")
const back = document.getElementById("back")
const generate_box = document.getElementById("generate_box")

let dots_hover = false
let dots_menu_hover = false
let hover_index = -1

let dragEl = null

let card_data = { book: { index: 0, name: "", lenght: 0 }, card_index: 0, word: true }

/* - init -------------------------------------------------------------------------------------- */

if (storage.get("wordbook")) {
	wordbook_data = [
		...wordbook_data,
		...storage.get("wordbook")
	]
}

display_title()

/* - add eventListener ------------------------------------------------------------------------- */

generate_box.addEventListener("dragstart", (e) => {
	if (e.target.classList && e.target.classList.contains("title_move")) {
		dragEl = e.target.closest(".title_block")
		dragEl.classList.add("dragging")
		e.dataTransfer.effectAllowed = "move"
		e.dataTransfer.setDragImage(new Image(), 0, 0)
	} else {
		e.preventDefault()
	}
})

generate_box.addEventListener("dragend", (e) => {
	if (!dragEl) return
	const afterIndex = getDragAfterElement(generate_box, e.clientY).index
	const [data] = wordbook_data.splice(dragEl.dataset.index, 1)
	wordbook_data.splice(afterIndex, 0, data)
	display_title()
	dragEl.classList.remove("dragging")
	dragEl = null
})

generate_box.addEventListener("dragover", (e) => {
	e.preventDefault()
	if (!dragEl) return
	const afterElement = getDragAfterElement(generate_box, e.clientY).element
	generate_box.insertBefore(dragEl, afterElement)
	generate_box.appendChild(document.getElementById('add_button'))
})

/* - function ---------------------------------------------------------------------------------- */

function getDragAfterElement(container, y) {
	const elements = [...container.querySelectorAll(".title_block:not(.dragging)")]
	return elements.reduce(
		(closest, child, i) => {
			const size = child.getBoundingClientRect()
			const offset = y - size.top - size.height / 2
			if (offset < 0 && offset > closest.offset) {
				return { offset: offset, element: child, index: i }
			} else {
				return closest
			}
		},
		{ offset: Number.NEGATIVE_INFINITY, index: wordbook_data.length }
	)
}

function update_card() {
	if (card_data.book.lenght <= card_data.card_index) {
		display_title()
		return
	}
	const card = document.getElementById("card")
	let text = wordbook_data[card_data.book.index].words[card_data.card_index]
	if (card_data.word) {
		text = text.word
	} else {
		text = text.description
	}
	card.textContent = text
}

function next_card() {
	if (card_data.word) {
		card_data.word = false
	} else {
		card_data.word = true
		++card_data.card_index
	}
	update_card()
}

function open_wordbook(index) {
	const book = wordbook_data[index]
	main_title.textContent = book.name
	back.style.display = "block"
	back.onclick = display_title
	generate_box.innerHTML = ""
	card_data = { book: { index: index, name: book.name, lenght: book.words.length }, card_index: 0, word: true }
	const card = document.createElement('div')
	card.id = "card"
	card.addEventListener('click', next_card)
	generate_box.appendChild(card)
	update_card()
}

function display_title() {
	main_title.textContent = "デジタル単語帳"
	back.style.display = "none"
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
		title_move.draggable = true
		title.appendChild(title_move)
		title.appendChild(dots)
		generate_box.appendChild(title)
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
	back.style.display = "block"
	back.onclick = display_title
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
	th_no.scope = "col"
	th_word.scope = "col"
	th_description.scope = "col"
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
				dialog({ title: "注意", content: "削除します。よろしいですか?", button: ["キャンセル", "削除"] }).then((resolve) => {
					console.log(resolve)
					if (resolve == 1) {
						delete wordbook_data[this.dataset.index]
						display_title()
					}
				})
			})
			title_edit.addEventListener('click', () => {
				let new_title_name = ""
				new_title_name = window.prompt("単語帳の名前を入力してください。", "")
				while (!/\S+/.test(new_title_name) || new_title_name == "") {
					new_title_name = window.prompt("入力が無効です。", "")
				}
				if (new_title_name != null) { wordbook_data[this.dataset.index].name = new_title_name }
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
	} else if (!dots_menu_hover) {
		// open_wordbook
		open_wordbook(hover_index)
	}
}

function add_new_title() {
	let new_title_name = ""
	new_title_name = window.prompt("単語帳の名前を入力してください。", "")
	while (!/\S+/.test(new_title_name) || new_title_name == "") {
		new_title_name = window.prompt("入力が無効です。", "")
	}
	if (new_title_name != null) { wordbook_data.push({ name: new_title_name, words: [] }) }
	display_title()
}

/* --------------------------------------------------------------------------------------------- */