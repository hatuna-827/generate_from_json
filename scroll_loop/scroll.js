// let obj = { list: [] }
// for (let i = 1; i < 30; i++) {
//     obj.list.push({ index: i })
// }
// console.log(JSON.stringify(obj))

"use strict"
import data from "./data.json" with {type: "json"}
let list = data.list
let now_index = 8
let index_box = document.getElementById("index_box")
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
    let new_a = document.createElement("a")
    let new_div = document.createElement("div")
    let new_p = document.createElement("p")
    new_p.textContent = list[i].index
    if (where == "begin") { index_box.insertAdjacentElement("afterbegin", new_a) }
    if (where == "end") { index_box.insertAdjacentElement("beforeend", new_a) }
    new_a.appendChild(new_div)
    new_div.appendChild(new_p)
}

function remove_line(where) {
    let i = 0
    if (where == "begin") { i = 0 }
    for (let x = 0; x < 3; x++) {
        if (where == "end") { i = index_box.childElementCount - 1 }
        index_box.children[i].remove()
    }
}