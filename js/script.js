// category & product hierarchy
const categoryHierarchy = {
    "Herr": {
        "Tröjor": ["Graphic Tees", "Hoodies & Sweatshirts"],
        "Byxor": ["Jeans", "Andra byxor"],
        "Skor": ["Skate skor", "Slides"],
        "Jackor": []
    },
    "Dam": {
        "Tröjor": ["Graphic Tees", "Hoodies & Sweatshirts"],
        "Byxor": ["Jeans", "Andra byxor"],
        "Skor": ["Skate skor", "Slides"],
        "Jackor": []
    },
    "Unisex": {
        "Accessories": 
        ["Väskor", "Headwear", "Socks", "Stickers, Keychains, etc"]
    },
    "Skate tillbehör": {
        "Decks": [],
        "Trucks": [],
        "Wheels & Bearings": [],
        "Färdiga brädor": []
    }
};

// product structure
class Product {
    constructor(title, price, description, mainCategory, subCategory, type, image) {
        this.id = Date.now(); // unique ID based on time
        this.title = title;
        this.price = price;
        this.description = description;
        this.category = {
            main: mainCategory,
            sub: subCategory,
            type: type
        };
        this.image = image || "assets/placeholder.png"; // URL to the image
    }
}

// load product list from LocalStorage if available
let products = JSON.parse(localStorage.getItem("allProducts")) || [];

// saves the current product array to the browser's LocalStorage
function saveToLocalStorage() {
    localStorage.setItem("allProducts", JSON.stringify(products));
}

// adds a new product to the system
function addProduct(title, price, description, mainCat, subCat, type, image) {
    const newProduct = new Product(title, price, description, mainCat, subCat, type, image);
    products.push(newProduct);
    saveToLocalStorage(); // save immediately
    renderProducts();     // update the UI
    console.log(`Added ${title} to inventory.`);
}

// removes a product by its ID
function removeProduct(id) {
    products = products.filter(product => product.id !== id);
    saveToLocalStorage();
    renderProducts();
}

// filters products based on their category type and value
function filterProducts(categoryType, categoryValue) {
    const filteredList = products.filter(product => 
        product.category[categoryType] === categoryValue
    );
    renderProducts(filteredList);
}

// renders products to the DOM
function renderProducts(listToRender = products) {
    const container = document.getElementById("product-list-container"); // must have this ID in HTML
    
    // if the container doesn't exist, stop
    if (!container) return; 

    container.innerHTML = ""; // clear current content

    if (listToRender.length === 0) {
        container.innerHTML = "<p>Inga produkter hittades.</p>";
        return;
    }

    listToRender.forEach(product => {
        // create an HTML card for each product
        const cardHTML = `
            <div class="product-card" data-id="${product.id}">
                <div class="image-container">
                    <img src="${product.image}" alt="${product.title}">
                </div>
                <div class="info-container">
                    <h3>${product.title}</h3>
                    <p class="category">${product.category.main} / ${product.category.sub}</p>
                    <p class="price">${product.price} kr</p>
                    <button onclick="removeProduct(${product.id})">Ta bort</button>
                </div>
            </div>
        `;
        container.innerHTML += cardHTML;
    });
}

// fills the "Main Category" dropdown in the Add Product form
function populateMainCategories(selectElementId) {
    const select = document.getElementById(selectElementId);
    if (!select) return;

    select.innerHTML = '<option value="">Välj Kategori</option>';
    Object.keys(categoryHierarchy).forEach(key => {
        select.innerHTML += `<option value="${key}">${key}</option>`;
    });
}

// updates the sub-category dropdown based on the main category selection
function updateSubCategories(mainCategory, subSelectId) {
    const subSelect = document.getElementById(subSelectId);
    if (!subSelect || !categoryHierarchy[mainCategory]) return;

    subSelect.innerHTML = '<option value="">Välj Underkategori</option>';
    const subCats = Object.keys(categoryHierarchy[mainCategory]);
    
    subCats.forEach(sub => {
        subSelect.innerHTML += `<option value="${sub}">${sub}</option>`;
    });
}

// runs when the HTML is loaded
document.addEventListener("DOMContentLoaded", () => {
    
    renderProducts();

    populateMainCategories("main-category-select");

    // handling of the main category change in the form
    const mainSelect = document.getElementById("main-category-select");
    if (mainSelect) {
        mainSelect.addEventListener("change", (e) => {
            updateSubCategories(e.target.value, "sub-category-select");
        });
    }
});