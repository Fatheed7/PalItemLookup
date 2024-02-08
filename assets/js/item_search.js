        async function fetchJsonData(filename) {
            try {
                const response = await fetch(filename);
                const jsonData = await response.json();
                return jsonData[0].Rows;
            } catch (error) {
                console.error(`Error fetching JSON data from ${filename}:`, error);
            }
        }

        async function searchItems() {
            const jsonData = await fetchJsonData('../assets/json/DT_ItemDataTable.json');
            const nameTextData = await fetchJsonData('../assets/json/DT_ItemNameText.json');
            const searchInput = document.getElementById('searchInput').value.toLowerCase();
            const resultContainer = document.getElementById('resultContainer');
            resultContainer.innerHTML = ''; 

            const items = [];

            for (const itemName in jsonData) {
                if (jsonData.hasOwnProperty(itemName)) {
                    const item = jsonData[itemName];
                    const itemNameLowerCase = itemName.toLowerCase();

                    const itemNameKey = "ITEM_NAME_" + itemName

                    const localizedString = nameTextData[itemNameKey] ? nameTextData[itemNameKey].TextData.LocalizedString : itemName;

                    const finalItemName = localizedString.toLowerCase() === 'en text' ? itemName.replace("_"," ") : localizedString.replace("_"," ");

                    if (finalItemName.toLowerCase().includes(searchInput)) {
                        const salePrice = item.Price / 10;
                        items.push({ itemName: finalItemName, price: item.Price, salePrice });
                    }
                }
            }

            items.sort((a, b) => a.itemName.localeCompare(b.itemName));

            items.forEach(item => {
                const itemDiv = document.createElement('div');
                itemDiv.className = 'item col-8 offset-2';
                itemDiv.innerHTML = `<strong>${item.itemName}</strong> - Price: ${item.price} - Sale Price: ${item.salePrice}`;
                resultContainer.appendChild(itemDiv);
            });
        }

        searchItems();

        const btnSwitch = document.getElementById('btnSwitch');

        btnSwitch.addEventListener('click', () => {
            const isDark = document.documentElement.getAttribute('data-bs-theme') === 'dark';
            document.documentElement.setAttribute('data-bs-theme', isDark ? 'light' : 'dark');
            btnSwitch.innerHTML = isDark ? '<i class="fa-solid fa-moon"></i>' : '<i class="fa-solid fa-sun"></i>';
            
            btnSwitch.classList.remove(isDark ? "text-dark" : "text-light", isDark ? "btn-light" : "btn-dark");
            btnSwitch.classList.add(isDark ? "text-light" : "text-dark", isDark ? "btn-dark" : "btn-light");
        });