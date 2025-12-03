const PRODUCTS = {
    "choco-brownie": {
        name: "Choco Brownie Cookies",
        desc: "A rich fudge brownie-style cookie with a gooey center.",
        images: ["./images/cookie2-1.png"],
        packs: [
            { size: "5 Pack", price: 391 },
            { size: "10 Pack", price: 738 }
        ]
    },

    "new-york-style": {
        name: "New York Style Cookies",
        desc: "Classic NY-style chunky cookies with a crisp outside and soft inside.",
        images: ["./images/cookie2-2.png"],
        packs: [
            { size: "5 Pack", price: 444 },
            { size: "10 Pack", price: 820 }
        ]
    },

    "nutella-lava": {
        name: "Nutella Lava Cookies",
        desc: "Thick stuffed cookies filled with molten Nutella.",
        images: ["./images/cookie2-3.png"],
        packs: [
            { size: "5 Pack", price: 497 },
            { size: "10 Pack", price: 920 }
        ]
    },

    "toasted-hazelnut": {
        name: "Toasted Hazelnut Cookies",
        desc: "Premium toasted hazelnuts mixed into a chocolate cookie base.",
        images: ["./images/cookie2-4.png"],
        packs: [
            { size: "5 Pack", price: 435 },
            { size: "10 Pack", price: 799 }
        ]
    },

    "yin-yang": {
        name: "Yin & Yang Chocolate Cookie",
        desc: "A perfect balance of dark and white chocolate in each bite.",
        images: ["./images/cookie2-5.png"],
        packs: [
            { size: "5 Pack", price: 489 },
            { size: "10 Pack", price: 899 }
        ]
    },

    "oatmeal-raisin": {
        name: "Oatmeal Raisin Cookies",
        desc: "Classic oatmeal cookies loaded with juicy raisins.",
        images: ["./images/cookie2-6.png"],
        packs: [
            { size: "5 Pack", price: 334 },
            { size: "10 Pack", price: 620 }
        ]
    },

    "choco-chunk": {
        name: "Choco Chunk Cookies",
        desc: "Chunky chocolate-loaded cookies with a soft gooey bite.",
        images: ["./images/cookie2-7.png"],
        packs: [
            { size: "5 Pack", price: 364 },
            { size: "10 Pack", price: 680 }
        ]
    },

    "red-velvet": {
        name: "Red Velvet Cookies",
        desc: "Red velvet cookie with white chocolate chunks.",
        images: ["./images/cookie2-8.png"],
        packs: [
            { size: "5 Pack", price: 444 },
            { size: "10 Pack", price: 820 }
        ]
    },

    "macadamia-nuts": {
        name: "Macadamia Nuts Cookies",
        desc: "Soft cookies packed with buttery macadamia nuts.",
        images: ["./images/cookie2-9.png"],
        packs: [
            { size: "5 Pack", price: 444 },
            { size: "10 Pack", price: 820 }
        ]
    },
    "ultimate-diwali-box": {
        name: "The Ultimate Diwali Gift Box",
        desc: "A festive premium gift box curated specially for Diwali, filled with Dohful’s bestselling cookies and treats.",
        images: ["./images/gifts-1.png"],
        packs: [
            { size: "Standard Box", price: 1100 }
        ]
    },

    "special-gift-pack": {
        name: "Dohful's Special Gift Pack",
        desc: "A beautifully curated gift pack filled with your favourite Dohful cookies — perfect for gifting to loved ones.",
        images: ["./images/gifts-2.png"],
        packs: [
            { size: "Standard Box", price: 444 }
        ]
    },

    "dohful-gift-card": {
        name: "Dohful Gift Card",
        desc: "Let them choose their favourite cookies! The perfect gifting option when you're not sure what they would love.",
        images: ["./images/gifts-3.png"],
        packs: [
            { size: "Gift Card", price: 497 }
        ]
    },


    "assorted-1": {
        name: "Assorted Cookies",
        desc: "Surprize your BAE with this box of delicious handcrafted cookies, baked just for them! You can also add a customized message or a photo along with this box!",
        images: ["./images/assorted-img.png"],
        packs: [
            { size: "5 Pack", price: 426 },
            { size: "10 Pack", price: 852 }
        ]
    },

    "sampler-1": {
        name: "Dohful's Special Gift Pack",
        desc: "A delightful gift box filled with Dohful's bestselling cookies.",
        images: ["./images/sampler-pack.png"],
        packs: [
            { size: "Special Pack", price: 444 }
        ]
    },
};



let params = new URLSearchParams(window.location.search);
let productId = params.get("id");

let product = PRODUCTS[productId];

let selectedPack = product.packs[0];  // default to first pack
let quantity = 1;

// LOAD PRODUCT INTO PAGE
window.onload = () => {
    document.getElementById("productName").textContent = product.name;
    document.getElementById("productDesc").textContent = product.desc;

    // Load main image
    document.getElementById("mainImage").src = product.images[0];

    // Load thumbnails
    let thumbContainer = document.getElementById("thumbs");
    product.images.forEach((img, i) => {
        let t = document.createElement("img");
        t.src = img;
        t.className = "thumb";
        t.onclick = () => {
            document.getElementById("mainImage").src = img;
        };
        thumbContainer.appendChild(t);
    });

    // Load packs
    let packContainer = document.getElementById("packOptions");
    product.packs.forEach((pack, index) => {
        let div = document.createElement("div");
        div.className = "pack-option " + (index === 0 ? "active" : "");
        div.innerHTML = `
            <span style="color:#162B9A">${pack.size}</span>
            <span style="color:#162B9A">Rs.${pack.price}</span>
        `;
        div.onclick = () => selectPack(index);

        packContainer.appendChild(div);
    });

    updatePrice();
};

// SELECT PACK
function selectPack(index) {
    selectedPack = product.packs[index];

    document.querySelectorAll(".pack-option").forEach(el => el.classList.remove("active"));
    document.querySelectorAll(".pack-option")[index].classList.add("active");

    updatePrice();
}


// QUANTITY CHANGE
function changeQty(n) {
    quantity = Math.max(1, quantity + n);
    document.getElementById("qty").textContent = quantity;
    updatePrice();
}

// ADD TO CART FROM PRODUCT PAGE
function addProductToCart() {
    let item = {
        id: productId,
        name: product.name,
        img: product.images[0],
        pack: selectedPack.size,
        price: selectedPack.price,
        quantity
    };

    addItemToCart(item);
    openCart();
}
