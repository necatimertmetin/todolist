document.addEventListener('DOMContentLoaded', function () {
    let itemList = [];
    let input = '';
    let booleanValue = false;

    const addItem = (inputtedTitle) => {
        if (inputtedTitle.trim() === '') return; // Prevent adding empty items
        const newItem = {
            id: itemList.length + 1,
            title: inputtedTitle,
            completed: false
        };
        itemList.push(newItem);
        input = ''; // Clear input after adding item
        saveToLocalStorage();
        render();
    };

    const deleteItem = (id) => {
        const index = itemList.findIndex(item => item.id === id);
        itemList.splice(index, 1);
        saveToLocalStorage();
        render();
    };

    const toggleComplete = (id) => {
        const index = itemList.findIndex(item => item.id === id);
        itemList[index].completed = !itemList[index].completed;
        saveToLocalStorage();
        render();
    };

    const asc = (item) => {
        const index = itemList.findIndex(el => el === item);
        if (index > 0) {
            const temp = itemList[index];
            itemList[index] = itemList[index - 1];
            itemList[index - 1] = temp;
            render();
        }
    };

    const desc = (item) => {
        const index = itemList.findIndex(el => el === item);
        if (index < itemList.length - 1) {
            const temp = itemList[index];
            itemList[index] = itemList[index + 1];
            itemList[index + 1] = temp;
            render();
        }
    };

    const render = () => {
        const appDiv = document.getElementById('app');
        appDiv.innerHTML = '';

        const inputField = document.createElement('input');
        inputField.id = 'input';
        inputField.classList.add('input');
        inputField.type = 'text';
        inputField.value = input;
        inputField.placeholder = 'note';
        inputField.addEventListener('input', function (event) {
            input = event.target.value;
        });
        inputField.addEventListener('keydown', function (event) {
            if (event.key === 'Enter') {
                addItem(input);
                inputField.focus(); // Keep the input field focused
            }
        });

        const addButton = document.createElement('button');
        addButton.id = 'add-button';
        addButton.classList.add('add-button');
        addButton.textContent = 'Save';
        addButton.addEventListener('click', function () {
            addItem(input);
            inputField.focus(); // Keep the input field focused
        });

        const inputContainerDiv = document.createElement('div');
        inputContainerDiv.classList.add('input-container');
        inputContainerDiv.appendChild(inputField);
        inputContainerDiv.appendChild(addButton);
        appDiv.appendChild(inputContainerDiv);

        itemList.forEach(item => {
            const listItemDiv = document.createElement('div');
            listItemDiv.classList.add('listItem');

            const sortButtonsContainerDiv = document.createElement('div');
            sortButtonsContainerDiv.classList.add('sort-buttons-container');

            const ascButton = document.createElement('div');
            ascButton.classList.add('sort', 'asc');
            const ascImg = document.createElement('img');
            ascImg.src = './arrow.png';
            ascButton.appendChild(ascImg);
            ascButton.addEventListener('click', function () {
                asc(item);
                saveToLocalStorage();
            });

            const descButton = document.createElement('div');
            descButton.classList.add('sort', 'desc');
            const descImg = document.createElement('img');
            descImg.src = './arrow.png';
            descButton.appendChild(descImg);
            descButton.addEventListener('click', function () {
                desc(item);
                saveToLocalStorage();
            });

            sortButtonsContainerDiv.appendChild(ascButton);
            sortButtonsContainerDiv.appendChild(descButton);

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.classList.add('check');
            checkbox.checked = item.completed;
            checkbox.addEventListener('change', function () {
                toggleComplete(item.id);
                saveToLocalStorage();
            });

            const listItemTitleDiv = document.createElement('div');
            listItemTitleDiv.classList.add('listItemTitle');
            listItemTitleDiv.textContent = item.title;
            if (item.completed) {
                listItemTitleDiv.classList.add('completed');
            }

            const deleteButton = document.createElement('div');
            deleteButton.classList.add('delete');
            deleteButton.textContent = 'Delete';
            deleteButton.addEventListener('click', function () {
                deleteItem(item.id);
                saveToLocalStorage();
            });

            listItemDiv.appendChild(sortButtonsContainerDiv);
            listItemDiv.appendChild(checkbox);
            listItemDiv.appendChild(listItemTitleDiv);
            listItemDiv.appendChild(deleteButton);

            appDiv.appendChild(listItemDiv);
        });

        // Ensure the input field is focused after rendering
        const inputElement = document.getElementById('input');
        if (inputElement) {
            inputElement.focus();
        }
    };

    const saveToLocalStorage = () => {
        localStorage.setItem('itemList', JSON.stringify(itemList));
    };

    // Retrieve data from localStorage when the page loads
    const storedItemList = JSON.parse(localStorage.getItem('itemList'));
    if (storedItemList) {
        itemList.push(...storedItemList);
        render();
    }

    // Set booleanValue to true when the page loads
    booleanValue = true;

    render();
});
