const wrapper = document.querySelector(".wrapper"),
  searchInput = wrapper.querySelector("input"),
  synonyms = wrapper.querySelector(".synonym .list"),
  volume = wrapper.querySelector(".word i"),
  removeIcon = wrapper.querySelector(".search span"),
  infoText = wrapper.querySelector(".info-text");
let audio;

// data function
function data(result, word) {
  // if api returns the message of can't find word
  if (result.title) {
    infoText.innerHTML = `Can't find the meaning of <span>"${word}"</span>. Please, try to search for another`;
  } else {
    wrapper.classList.add("active"); //if the searched word exists then the active class is added in the wrapper

    let definitions = result[0].meanings[0].definitions[0];
    phonetics = `${result[0].meanings[0].partOfSpeech}/${result[0].phonetics[0].text}/`;

    // let's pass the particular response data to a particular html element
    document.querySelector(".word p").innerText = result[0].word;
    document.querySelector(".word span").innerText = phonetics;
    document.querySelector(".meaning span").innerText = definitions.definition;
    document.querySelector(".example span").innerText = definitions.example;
    // creating new audio obj and passing the audio src
    audio = new Audio("https:" + result[0].phonetics[0].audio);

    if (definitions.synonyms[0] == undefined) {
      //if there is no synonym then hide the synonyms div
      synonyms.parentElement.style.display = "none";
    } else {
      synonyms.parentElement.style.display = "block";
      synonyms.innerHTML = "";
      for (let i = 0; i < 5; i++) {
        //getting only 5 synonyms out of the many
        let tag = `<span onclick= search('${definitions.synonyms[i]}')>${definitions.synonyms[i]}</span>`;
        tag =
          i == 4
            ? (tag = `<span onclick="search('${definitions.synonyms[i]}')">${definitions.synonyms[4]}</span>`)
            : tag;
        synonyms.insertAdjacentHTML("beforeend", tag); //passing all 5 synonyms inside synonyms div
      }
    }
  }
}

// search synonyms function
function search(word) {
  searchInput.value = word;
  fetchApi(word);
  wrapper.classList.remove("active");
}
// fetch api function
// The API returns an object of search word
function fetchApi(word) {
  infoText.style.color = "#000";
  wrapper.classList.remove("active");
  infoText.innerHTML = `Searching the meaning of <span>"${word}"</span>`;
  let url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;
  fetch(url)
    .then((res) => res.json())
    .then((result) => data(result, word));
}
// if pressed key is enter and the input field is not empty, the call fetchApi function.
// The Fetch API provides a JavaScript interface for accessing and manipulating parts of the HTTP pipeline, such as requests and responses. It also provides a global fetch() method that provides an easy, logical way to fetch resources asynchronously across the network
searchInput.addEventListener("keyup", (e) => {
  if (e.key === "Enter" && e.target.value) {
    fetchApi(e.target.value);
  }
});

// volume event addEventListener
volume.addEventListener("click", () => {
  volume.style.color = "#4D59FB";
  audio.play();
  setTimeout(() => {
    volume.style.color = "#999";
  }, 800);
});

removeIcon.addEventListener("click", () => {
  searchInput.value = "";
  searchInput.focus();
  wrapper.classList.remove("active");
  infoText.style.color = "#9A9A9A";
  infoText.innerHTML =
    "Type any existing word and press enter to get meaning, example, synonyms, etc.";
});
