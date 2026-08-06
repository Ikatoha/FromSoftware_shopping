// ============ PRODUCT DATA ============
const products = [
  { id: 1, name: "Dark Souls", tag: "game", price: 20, img: "images/Dark_Souls.jpg",
    desc: "The game that lit the first flame of the Soulslike genre. Journey through Lordran as an Undead seeking to link the fire, or let it fade." },
  { id: 2, name: "Dark Souls II", tag: "game", price: 20, img: "images/Dark_Souls_II.jpg",
    desc: "Travel to Drangleic in search of a cure for the curse of the Undead, through crumbling kingdoms and forgotten thrones." },
  { id: 3, name: "Dark Souls III", tag: "game", price: 25, img: "images/Dark_Souls_III.jpg",
    desc: "The Ashen One rises to link the fire once more, facing Lords of Cinder in the twilight of a dying world." },
  { id: 4, name: "Bloodborne", tag: "game", price: 25, img: "images/Bloodborne.jpg",
    desc: "A Hunter's nightmare set in the gothic city of Yharnam, where a plague of beasts festers beneath the streets." },
  { id: 5, name: "Sekiro: Shadows Die Twice", tag: "game", price: 30, img: "images/Sekiro.png",
    desc: "A one-armed shinobi seeks revenge in Sengoku-era Japan, armed with a prosthetic arm and a blade that resists death." },
  { id: 6, name: "Elden Ring", tag: "game", price: 35, img: "images/Elden_Ring.jpg",
    desc: "Rise, Tarnished, and journey across the Lands Between to claim the Elden Ring and become an Elden Lord." },
  { id: 7, name: "Gehrman Figure", tag: "figure", price: 45, img: "images/Gehrman.jpg",
    desc: "A finely detailed figure of Gehrman, the First Hunter, seated in his wheelchair within the Hunter's Dream." },
  { id: 8, name: "Isshin Figure", tag: "figure", price: 50, img: "images/Isshin.jpg",
    desc: "The Sword Saint himself, captured mid-stance, blade drawn and ready for one final, legendary duel." },
  { id: 9, name: "Malenia Figure", tag: "figure", price: 55, img: "images/Malenia.jpg",
    desc: "Blade of Miquella, rendered in exquisite detail. She who has never known defeat, now guarding your shelf." },
];

// ============ STATE ============
let cart = [];
let currentFilter = "all";
let currentSearch = "";

// ============ RENDER PRODUCTS ============
function renderProducts() {
  const grid = document.getElementById("productGrid");
  const noResults = document.getElementById("noResults");

  const filtered = products.filter(p => {
    const matchesFilter = currentFilter === "all" || p.tag === currentFilter;
    const matchesSearch = p.name.toLowerCase().includes(currentSearch.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  grid.innerHTML = "";

  if (filtered.length === 0) {
    noResults.hidden = false;
  } else {
    noResults.hidden = true;
  }

  filtered.forEach(p => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.innerHTML = `
      <img src="${p.img}" alt="${p.name}">
      <div class="pc-body">
        <div class="pc-tag">${p.tag === "game" ? "Game" : "Figure"}</div>
        <div class="pc-name">${p.name}</div>
        <div class="pc-price">$${p.price}</div>
        <button class="pc-add" data-id="${p.id}">Add to Cart</button>
      </div>
    `;

    // Clicking the card (not the button) opens the detail popup
    card.addEventListener("click", (e) => {
      if (e.target.classList.contains("pc-add")) return;
      openDetail(p.id);
    });

    grid.appendChild(card);
  });

  // Wire up "Add to Cart" buttons after render
  grid.querySelectorAll(".pc-add").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      addToCart(Number(btn.dataset.id));
    });
  });
}

// ============ FEATURED STRIP ============
function renderFeatured() {
  const strip = document.getElementById("featuredStrip");
  const featured = products.slice(0, 5); // first 5 as "featured"

  strip.innerHTML = featured.map(p => `
    <div class="featured-card" data-id="${p.id}">
      <img src="${p.img}" alt="${p.name}">
      <div class="fc-name">${p.name}</div>
    </div>
  `).join("");

  strip.querySelectorAll(".featured-card").forEach(card => {
    card.addEventListener("click", () => openDetail(Number(card.dataset.id)));
  });
}

// ============ DETAIL POPUP ============
function openDetail(id) {
  const p = products.find(item => item.id === id);
  if (!p) return;

  document.getElementById("detailImg").src = p.img;
  document.getElementById("detailImg").alt = p.name;
  document.getElementById("detailTag").textContent = p.tag === "game" ? "Game" : "Figure";
  document.getElementById("detailName").textContent = p.name;
  document.getElementById("detailDesc").textContent = p.desc;
  document.getElementById("detailPrice").textContent = "$" + p.price;
  document.getElementById("detailAddBtn").dataset.id = p.id;

  document.getElementById("detailPopup").classList.add("show");
}

function closeDetail() {
  document.getElementById("detailPopup").classList.remove("show");
}

// ============ CART LOGIC ============
function addToCart(id) {
  const p = products.find(item => item.id === id);
  if (!p) return;

  const existing = cart.find(item => item.id === id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...p, qty: 1 });
  }

  renderCart();
  openCart();
}

function removeFromCart(id) {
  cart = cart.filter(item => item.id !== id);
  renderCart();
}

function renderCart() {
  const cartItems = document.getElementById("cartItems");
  const cartCount = document.getElementById("cartCount");
  const cartTotal = document.getElementById("cartTotal");

  const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.qty * item.price, 0);

  cartCount.textContent = totalQty;
  cartTotal.textContent = "$" + totalPrice;

  if (cart.length === 0) {
    cartItems.innerHTML = `<p class="cart-empty">Your cart is as empty as the Abyss.</p>`;
    return;
  }

  cartItems.innerHTML = cart.map(item => `
    <div class="cart-item">
      <img src="${item.img}" alt="${item.name}">
      <div class="ci-info">
        <div class="ci-name">${item.name} ${item.qty > 1 ? "× " + item.qty : ""}</div>
        <div class="ci-price">$${item.price * item.qty}</div>
        <button class="ci-remove" data-id="${item.id}">Remove</button>
      </div>
    </div>
  `).join("");

  cartItems.querySelectorAll(".ci-remove").forEach(btn => {
    btn.addEventListener("click", () => removeFromCart(Number(btn.dataset.id)));
  });
}

function openCart() {
  document.getElementById("cartDrawer").classList.add("open");
  document.getElementById("overlay").classList.add("show");
}

function closeCart() {
  document.getElementById("cartDrawer").classList.remove("open");
  document.getElementById("overlay").classList.remove("show");
}

// ============ EVENT LISTENERS ============
document.getElementById("cartToggle").addEventListener("click", openCart);
document.getElementById("closeCart").addEventListener("click", closeCart);

document.getElementById("detailClose").addEventListener("click", closeDetail);
document.getElementById("detailPopup").addEventListener("click", (e) => {
  if (e.target.id === "detailPopup") closeDetail();
});

document.getElementById("detailAddBtn").addEventListener("click", () => {
  const id = Number(document.getElementById("detailAddBtn").dataset.id);
  addToCart(id);
  closeDetail();
});

document.getElementById("overlay").addEventListener("click", () => {
  closeCart();
});

document.querySelectorAll(".cat-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".cat-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    currentFilter = btn.dataset.filter;
    renderProducts();
  });
});

// ============ CUSTOM MESSAGE MODAL (replaces browser alert) ============
function showMessage(text) {
  document.getElementById("messageText").textContent = text;
  document.getElementById("messageModal").classList.add("show");
}

function closeMessage() {
  document.getElementById("messageModal").classList.remove("show");
}

document.getElementById("messageOk").addEventListener("click", closeMessage);
document.getElementById("messageModal").addEventListener("click", (e) => {
  if (e.target.id === "messageModal") closeMessage();
});

document.getElementById("searchInput").addEventListener("input", (e) => {
  currentSearch = e.target.value;
  renderProducts();
});

document.getElementById("checkoutBtn").addEventListener("click", () => {
  if (cart.length === 0) {
    showMessage("Your cart is empty. Add something before checking out.");
    return;
  }
  showMessage("Thank you for your purchase, Tarnished. Your wares will arrive... eventually.");
  cart = [];
  renderCart();
  closeCart();
});

// ============ INIT ============
renderFeatured();
renderProducts();
renderCart();