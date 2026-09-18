let cart = [];
const SHIPPING_FEE = 8; // Frais de livraison standard (8 DT)

let activePromo = {
  code: "",
  type: null, // "SHIPPING" wela "PERCENTAGE"
  value: 0    // Ex: 10 pour 10%
};

let selectedSizes = {
  p1: 'L',
  p2: 'M'
};

// ⚠️ Beddel el-numéro mta3ek hna (m3ah code 216)
const MY_PHONE_NUMBER = "21620849009"; 

// SELECTION TAILLE STREET
function selectSize(productId, size, btnElement) {
  selectedSizes[productId] = size;
  
  const parent = document.getElementById(`size-options-${productId}`);
  const buttons = parent.querySelectorAll('.size-btn');
  buttons.forEach(btn => btn.classList.remove('active'));
  
  btnElement.classList.add('active');
}

// AJOUTER AU PANIER
function addToCart(title, price, productId) {
  const size = selectedSizes[productId] || 'M';
  cart.push({ title, price, size });
  updateCartUI();
  alert(`${title} (Taille: ${size}) t'zaad lil-panier! 🎉`);
}

// UPDATE CART UI & CALCULATIONS
function updateCartUI() {
  document.getElementById('cart-count').innerText = cart.length;
  
  const cartItemsDiv = document.getElementById('cart-items');
  cartItemsDiv.innerHTML = '';
  
  let subtotal = 0;
  cart.forEach((item) => {
    subtotal += item.price;
    cartItemsDiv.innerHTML += `
      <div style="display:flex; justify-content:space-between; margin-bottom:10px; border-bottom: 1px solid #222; padding-bottom:5px;">
        <span>${item.title} (${item.size})</span>
        <span style="color:#e63946; font-weight:bold;">${item.price} DT</span>
      </div>
    `;
  });

  // Calculations
  let discountAmount = 0;
  let currentShipping = cart.length > 0 ? SHIPPING_FEE : 0;

  if (activePromo.type === "SHIPPING") {
    currentShipping = 0;
  } else if (activePromo.type === "PERCENTAGE") {
    discountAmount = (subtotal * activePromo.value) / 100;
  }

  let grandTotal = (subtotal - discountAmount) + currentShipping;
  if (grandTotal < 0) grandTotal = 0;

  // Display Subtotal
  document.getElementById('subtotal-price').innerText = subtotal;
  
  // Display Discount Row (if applicable)
  const discountRow = document.getElementById('discount-row');
  if (discountRow) {
    if (discountAmount > 0) {
      discountRow.style.display = "flex";
      document.getElementById('discount-price').innerText = `-${discountAmount.toFixed(1)}`;
    } else {
      discountRow.style.display = "none";
    }
  }

  // Display Shipping & Total
  document.getElementById('shipping-price').innerText = currentShipping === 0 && cart.length > 0 ? "GRATUIT 🎉" : `${currentShipping} DT`;
  document.getElementById('total-price').innerText = grandTotal.toFixed(1);
}

// APPLICATION CODE PROMO
function applyPromoCode() {
  const codeInput = document.getElementById('promoInput').value.trim().toUpperCase();
  const msgElement = document.getElementById('promoMessage');

  if (cart.length === 0) {
    msgElement.style.color = "#ff2a2a";
    msgElement.innerText = "Panier mta3ek faragh!";
    return;
  }

  // CODES PROMO:
  if (codeInput === "LIVHAR") {
    activePromo = { code: codeInput, type: "SHIPPING", value: SHIPPING_FEE };
    msgElement.style.color = "#25D366";
    msgElement.innerText = "Code Promo Valide! Livraison Gratuit 🎉";
  } 
  else if (codeInput === "HARRZA3") {
    activePromo = { code: codeInput, type: "PERCENTAGE", value: 10 }; // Remise 10%
    msgElement.style.color = "#25D366";
    msgElement.innerText = "Code Promo Valide! Remise de 10% 🎉";
  } 
  else {
    activePromo = { code: "", type: null, value: 0 };
    msgElement.style.color = "#ff2a2a";
    msgElement.innerText = "Code Promo Invalide!";
  }

  updateCartUI();
}

// MODAL CONTROLS
function openCart() {
  document.getElementById('cartModal').style.display = 'flex';
}

function closeCart() {
  document.getElementById('cartModal').style.display = 'none';
}

// CONFIRMATION COMMANDE & WHATSAPP REDIRECT
document.getElementById('checkoutForm').addEventListener('submit', function(e) {
  e.preventDefault();

  if (cart.length === 0) {
    alert("Panier mta3ek faragh!");
    return;
  }

  const name = document.getElementById('fullname').value;
  const phone = document.getElementById('phone').value;
  const address = document.getElementById('address').value;

  let itemsSummary = "";
  let subtotal = 0;

  cart.forEach((item, index) => {
    itemsSummary += `${index + 1}. ${item.title} (Taille: ${item.size}) - ${item.price} DT\n`;
    subtotal += item.price;
  });

  let discountAmount = 0;
  let currentShipping = SHIPPING_FEE;

  if (activePromo.type === "SHIPPING") {
    currentShipping = 0;
  } else if (activePromo.type === "PERCENTAGE") {
    discountAmount = (subtotal * activePromo.value) / 100;
  }

  let grandTotal = (subtotal - discountAmount) + currentShipping;

  let promoDetails = "";
  if (activePromo.code) {
    promoDetails = `🎟️ Code Promo: ${activePromo.code} (${activePromo.type === "SHIPPING" ? "Livraison Gratuite" : "-" + activePromo.value + "%"})\n`;
  }

  const rawMessage = `Ahla! Commande jdida min site حار 🌶️:\n\n` +
                     `📌 Les Produits:\n${itemsSummary}\n` +
                     `💵 Sous-total: ${subtotal} DT\n` +
                     (discountAmount > 0 ? `🏷️ Remise: -${discountAmount.toFixed(1)} DT\n` : '') +
                     `🚚 Livraison: ${currentShipping === 0 ? "GRATUITE" : currentShipping + " DT"}\n` +
                     promoDetails +
                     `💰 Total à payer: ${grandTotal.toFixed(1)} DT\n\n` +
                     `👤 Client: ${name}\n` +
                     `📞 Téléphone: ${phone}\n` +
                     `📍 Adresse: ${address}`;

  const encodedMessage = encodeURIComponent(rawMessage);
  const whatsappUrl = `https://wa.me/${MY_PHONE_NUMBER}?text=${encodedMessage}`;
  
  window.open(whatsappUrl, '_blank');
});
