var typingTimer;
var doneTypingInterval = 250; // milliseconds

function searchCharacters() {
    clearTimeout(typingTimer);
    typingTimer = setTimeout(performSearch, doneTypingInterval);
}

function performSearch() {
    var itemName = document.getElementById('itemInput').value.toLowerCase();
    var resultDiv = document.getElementById('result');
    resultDiv.innerHTML = '';

    fetch('./assets/json/drop_data.json')
    .then(response => response.json())
    .then(data => {
        var characters = [];
        data.forEach(entry => {
            for (var key in entry) {
                if (key.startsWith('ItemId') && entry[key].toLowerCase().includes(itemName)) {
                    characters.push(entry['CharacterID']);
                    break;
                }
            }
        });

        characters.sort(); // Sorting alphabetically

        if (characters.length > 0) {
            resultDiv.innerHTML = "<p>Number of Pals found that drop " + itemName + ": " + characters.length + "</p>";
            characters.forEach(character => {
                const itemDiv = document.createElement('div');
                itemDiv.className = 'item col-8 offset-2';
                itemDiv.innerHTML = `<strong>${character}</strong>`;
                resultDiv.appendChild(itemDiv);
            });
        } else {
            resultDiv.innerText = "No characters found that drop " + itemName + " (partial match).";
        }
    })
    .catch(error => {
        resultDiv.innerText = "An error occurred while fetching data: " + error;
    });
}

// Trigger search when user stops typing
document.getElementById('itemInput').addEventListener('keyup', searchCharacters);
