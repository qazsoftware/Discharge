//Get a list of all elements with ids
const elementsWithIds = Array.from(document.querySelectorAll("[id"));

//adds a tag filter function
function filterByTagName(array, tagName) {
    return array.filter((element) => {
        return element.tagName == tagName;
    });
}

//Filter for inputs and buttons
const buttonsWithIds = filterByTagName(elementsWithIds, "BUTTON");
const inputsWithIds = filterByTagName(elementsWithIds, "INPUT");

//adding listeners and displaying current data
buttonsWithIds.forEach(click);
buttonsWithIds.forEach(activate);
inputsWithIds.forEach(inputs);

//Add listeners to the buttons
function click(element){
    element.addEventListener("click", async () => {
        chrome.storage.sync.get([element.id], (result) => {

            //Changing the data
            const data = !result[element.id];
            chrome.storage.sync.set({[element.id]: data});
            
            //Displaying the new data
            if (data){
                element.style.backgroundColor = "#3aa757";
                element.childNodes[1].innerHTML = " [ON]";
            } else {
                element.style.backgroundColor = "#bc544b";
                element.childNodes[1].innerHTML = " [OFF]";
            }
        });
    });
}

//Displaying current data
function activate(element){
    chrome.storage.sync.get([element.id], (result) => {

        //Displaying current data
        const data = result[element.id];
        if (data){
            element.style.backgroundColor = "#3aa757";
            element.innerHTML += "<i> [ON]</i>";
        } else {
            element.style.backgroundColor = "#bc544b";
            element.innerHTML += "<i> [OFF]</i>";
        }
    })
}

//Displaying input data and adding listeners
function inputs(element){
    chrome.storage.sync.get([element.id], (result) => {
        element.value = result[element.id];
    })
    element.addEventListener("change", async () => {
        const data = element.value;
        console.log(data);
        chrome.storage.sync.set({[element.id]: data});
    })
}