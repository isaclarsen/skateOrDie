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
    const container = document.getElementById("product-list-container"); 
    
    if (!container) return; 

    container.innerHTML = ""; 

    if (listToRender.length === 0) {
        // Styling för tomt resultat
        container.innerHTML = `
            <div class="col-span-full text-center py-20 text-gray-500">
                <p class="text-xl font-bold uppercase">Inga produkter hittades.</p>
            </div>`;
        return;
    }

    listToRender.forEach(product => {
        // Vi lägger till Tailwind-klasser direkt i HTML-strängen här
        const cardHTML = `
            <div class="group relative border border-gray-800 bg-black hover:border-neon-yellow transition-colors duration-300" data-id="${product.id}">
                
                <div class="relative w-full aspect-[4/5] overflow-hidden bg-gray-900">
                    <img src="${product.image}" alt="${product.title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
                    
                    <span class="absolute top-2 left-2 bg-neon-yellow text-black text-xs font-black px-2 py-1 uppercase tracking-wide">
                        ${product.category.type}
                    </span>
                </div>

                <div class="p-4 flex flex-col gap-2">
                    <h3 class="text-lg font-bold text-white uppercase tracking-tight leading-none group-hover:text-neon-yellow transition-colors">
                        ${product.title}
                    </h3>
                    <p class="text-gray-400 text-xs uppercase font-bold tracking-wide">
                        ${product.category.main} / ${product.category.sub}
                    </p>
                    <div class="mt-2 flex justify-between items-center">
                        <span class="text-xl font-black text-white">${product.price} kr</span>
                        
                        <button onclick="removeProduct(${product.id})" class="text-gray-600 hover:text-red-500 transition-colors text-xs uppercase font-bold" title="Ta bort">
                            [x]
                        </button>
                    </div>
                    
                    <button class="w-full mt-2 border border-white text-white font-bold uppercase py-2 text-xs hover:bg-neon-yellow hover:text-black hover:border-neon-yellow transition-colors">
                        Add to Cart
                    </button>
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
    
    // OBS: Vi tar bort renderProducts() härifrån!
    // Varför? För att vi vill att varje HTML-sida (men.html, products.html)
    // själva ska få bestämma vad de vill visa.
    
    // Fyller dropdowns om vi är på admin-sidan
    populateMainCategories("main-category-select");

    // Hanterar ändring av huvudkategori
    const mainSelect = document.getElementById("main-category-select");
    if (mainSelect) {
        mainSelect.addEventListener("change", (e) => {
            updateSubCategories(e.target.value, "sub-category-select");
        });
    }
});

// --- INITIERING AV DATABAS ---

function initDatabase() {
    // Om listan 'products' är tom (dvs inget fanns i LocalStorage)
    if (products.length === 0) {
        
        const startProducts = [
            { title: "Logo Graphic Tee", price: 349, desc: "Klassisk skate t-shirt.", main: "Herr", sub: "Tröjor", type: "Graphic Tees", image: "https://www.skatetilldeath.com/cdn/shop/products/thrasher-screaming-logo-santa-cruz-mens-t-shirt-santa-cruz-skatetilldeathcom-123052.webp?v=1697115623&width=1800" },
            { title: "Baggy Denim Jeans", price: 899, desc: "Lös passform.", main: "Herr", sub: "Byxor", type: "Jeans", image: "https://www.flatspot.com/cdn/shop/files/levi_s_-skate-baggy-5-pocket-jeans-deep-groove-black-3_1300x1500_crop_center.progressive.jpg?v=1699287014" },
            { title: "Oversized Hoodie", price: 699, desc: "Mjuk hoodie.", main: "Dam", sub: "Tröjor", type: "Hoodies & Sweatshirts", image: "https://i.ebayimg.com/images/g/P~UAAOSw4uRk3neQ/s-l1200.jpg" },
            { title: "Cargo Skate Pants", price: 749, desc: "Slitstarka byxor.", main: "Dam", sub: "Byxor", type: "Andra byxor", image: "https://scene7.zumiez.com/is/image/zumiez/product_main_medium/Empyre-Ultra-Loose-Natural-Birch-Cargo-Skate-Pants-_383554.jpg" },
            { title: "Pro Skate Deck 8.25", price: 649, desc: "7-lagers lönn.", main: "Skate tillbehör", sub: "Decks", type: "Decks", image: "https://www.hepcat.se/pub_images/original/Creature---Lockwood-Bloodbath-3D-Pro-Skateboard-Deck---825-2.jpg?timestamp=1743439449" },
            { title: "Spitfire Wheels 54mm", price: 499, desc: "Hårda hjul.", main: "Skate tillbehör", sub: "Wheels & Bearings", type: "Wheels & Bearings", image: "https://cdn.abicart.com/shop/ws22/65422/art22/h3445/181673445-origpic-00589d.jpg" },
            { title: "Beanie Black", price: 199, desc: "Värmande mössa.", main: "Unisex", sub: "Accessories", type: "Headwear", image: "https://www.workingclassheroes.co.uk/images/products/archive/m/me/merinowoolbeanieblack.jpg?width=1998&height=1998&quality=85&mode=pad&format=webp&bgcolor=ffffff" },
            { title: "Canvas Backpack", price: 549, desc: "Ryggsäck.", main: "Unisex", sub: "Accessories", type: "Väskor", image: "https://cdn.skatedeluxe.com/thumb/0ObyRUdcslZapGiVVT16L6tiXJk=/fit-in/600x700/filters:fill(white):brightness(-4)/product/166292-0-Dickies-DuckCanvas.jpg" }
        ];

        console.log("Databas tom. Laddar in standardprodukter...");

        startProducts.forEach(p => {
            // OBS: Jag ändrade 'img' till 'image' i objektet ovan för att matcha din addProduct
            addProduct(p.title, p.price, p.desc, p.main, p.sub, p.type, p.image);
        });
    }
}

// Kör funktionen direkt när scriptet laddas
initDatabase();