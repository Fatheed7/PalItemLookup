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
            const jsonData = await fetchJsonData('DT_ItemDataTable.json');
            const nameTextData = await fetchJsonData('DT_ItemNameText.json');
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