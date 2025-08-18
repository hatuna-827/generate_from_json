"use strict"
import bookmark_data from "./Bookmarks.json" with {type: "json"}
let bookmarks = bookmark_data.roots.bookmark_bar.children
let generate_box = document.getElementById("generate_box")
add_folder(bookmarks, generate_box)

function add_folder(children, at) {
    for (let i = 0; i < children.length; i++) {
        let child = children[i]
        if (child.type == "url") {
            add_url(child, at)
        }
        else if (child.type == "folder") {
            let new_folder = document.createElement("details")
            let new_folder_name = document.createElement("summary")
            if (child.name === "") { new_folder_name.textContent = "null" } else { new_folder_name.textContent = child.name }
            new_folder_name.textContent = new_folder_name.textContent + " " + child.children.length
            at.insertAdjacentElement("beforeend", new_folder)
            new_folder.insertAdjacentElement("beforeend", new_folder_name)
            add_folder(child.children, new_folder)
        }
        else {
            alert(`不明なtype"${child.type}"です。`)
        }
    }
    return
}
function add_url(data, at) {
    let new_url = document.createElement("a")
    if (data.name === "") { new_url.textContent = "null" } else { new_url.textContent = data.name }
    new_url.setAttribute("href", data.url)
    at.insertAdjacentElement("beforeend", new_url)
    at.insertAdjacentElement("beforeend", document.createElement("br"))
}
