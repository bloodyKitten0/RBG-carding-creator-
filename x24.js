let nameInput = document.getElementById("userInput")
let levelInput = document.getElementById("levelInput")
let classInput = document.getElementById("classSelection")
let addButton = document.getElementById("addButton")
let observer = document.getElementById("observer")
let searchBar = document.getElementById("searchBar")
let filterSelect = document.getElementById("filter")
let sortSelect = document.getElementById("sort")
let describtionInput = document.getElementById("describe")
let applyButton = document.getElementById("apply")
let cancelBtn = document.getElementById("cancel-btn")
let doomBtn = document.getElementById("doomBtn")

let players = []
let vowels = ["a" , "e" , "i" , "o" ,"u"]
let editID = null
let save = localStorage.getItem("key")

if(save){
    players = JSON.parse(save)
    render()
}

function doom(){
players =[]
edit(false)
localStorage.removeItem("key")
clearInput()
render()
editID = null
}

function saveCreation(){
    localStorage.setItem("key" , JSON.stringify(players))
}
function rules(level){
    if(nameInput.value.trim() === "" ||
     level === "" ||
      classInput.value === ""){

        alert("please fulfill all the boxes")
        return false

    }
    else if( level > 1000 ||
         level < 1){

        alert("level must be from 1 - 1000")
        return false

    }else{

    return true

}}
function tiers(level){

    let numbericLevel 
    = Number(level)

    if(numbericLevel === 1000){return "god"}
    else if(numbericLevel >= 800){return "legendary"}
    else if(numbericLevel >= 600){return "epic"}
    else if(numbericLevel >= 400){return "rare"}
    else if(numbericLevel >= 200){return "common"}
    else{ return "unranked"}

}
function create(level){

    return{
    name: nameInput.value,
    level: Number(level),
    class: classInput.value,
    tier: tiers(level),
    describtion: describtionInput.value
}
}
function edit(is){
    if(is){

    addButton.textContent = "Save"
    cancelBtn.style.display = "inline-block"

}else{

    addButton.textContent = "Add"
    cancelBtn.style.display = "none"

}
}
function check(id){

    return players.find((p) => p.id === id)

}
function clearInput(){

    nameInput.value = ""
    levelInput.value =""
    classInput.value = ""
    describtionInput.value = ""

}
function getFiltered(){
    let searchText = searchBar.value.toLowerCase().trim()
    let selectedClass = filterSelect.value

    let result = players

    if(searchText !== ""){
        result = result.filter((p) => 
            p.name.toLowerCase().includes(searchText)
        )
    }

    if(selectedClass !== ""){
        result = result.filter((p) => 
            p.class === selectedClass
        )
    }

      if(sortSelect.value ==="highestLevel"){
    result.sort((a , b) => {
      if (b.level === a.level) {return a.name.localeCompare(b.name);}
      return b.level - a.level; 
});}
    else if (sortSelect.value === "lowestLevel"){
    result.sort((a , b) => {
      if (a.level === b.level) {return a.name.localeCompare(b.name);}
      return a.level - b.level;
    });
  } else if (sortSelect.value ==="AZ"){
     result.sort((a , b) => a.name.localeCompare(b.name)); 
}

    return result
}
function render(){

    observer.innerHTML = ""

    for(let {name , level, class: role , tier , describtion, id}
         of getFiltered()){

        let aOrAn =
         vowels.includes(role[0].toLowerCase().trim())? "an" : "a"
        let holder =
         document.createElement("div")
        holder.className = 
        tiers(level)

        let deleteButton =
         document.createElement("button")
        deleteButton.textContent =
         "Delete"
        deleteButton.className = 
        "delete-btn"

        deleteButton.addEventListener("click" , ()=>{

       players = players.filter((p) => p.id !== id)
       render()
       saveCreation()
    
    })

        let editButton =
         document.createElement("button")
        editButton.textContent = 
        "Edit"
        editButton.className = 
         "edit-btn"

    editButton.addEventListener("click" , () =>{

        edit(true)
        nameInput.value = name
        levelInput.value = level
        classInput.value = role
        editID = id
        describtionInput.value = describtion
    
    })
    
        holder.innerHTML=` <div><h3>player :${name}</h3> <br> <h3>level: ${level} </h3> <br> <h3> class: ${aOrAn} ${role} </h3> <br> <h3> description: <br> ${describtion}</h3></div>`
     holder.appendChild(deleteButton)
     holder.appendChild(editButton)
     observer.appendChild(holder)
    }}

cancelBtn.addEventListener("click" ,() =>{
    edit(false)
    editID = null
    clearInput()
})
doomBtn.addEventListener("click",()=>{
    doom()
})
sortSelect.addEventListener("change", ()=>{
    render()
})
searchBar.addEventListener("input", () => {
    render()
})
filterSelect.addEventListener("change", () => {
    render()
})
addButton.addEventListener("click" , () =>{

    let level =
     levelInput.value

    if(!rules(level)){

        return

    }

    if (editID !== null){

    if(!check(editID)){

        edit(false)
        editID = null
        return

    }else{

        players = players.map((p)=>{
            if(p.id === editID){
                return {...p,...create(level)}
            }else{
               return p

    }})}}else{

    let player ={

        id : crypto.randomUUID(),
        ...create(level)

    }

    players.push(player)

}

    editID = null
    edit(false)
    render()
    clearInput()
    saveCreation()

})