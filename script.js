let cart = [];

// ⚠️ Beddel el-numéro mta3ek hna (m3ah 216)
const MY_PHONE_NUMBER = "21620849009"; 

function addToCart(title, price, sizeSelectId) {
  const size = document.getElementById(sizeSelectId).value;
  cart.push({ title, price, size });
  updateCartUI();
  alert(`${title} (${size}) t'zaad lil-panier!`);
}

function updateCartUI() {
  document.getElementById('cart-count').innerText = cart.length;
  
  const cartItemsDiv = document.getElementById('cart-items');
  cartItemsDiv.innerHTML = '';
  
  let total = 0;
  cart.forEach((item) => {
    total += item.price;
    cartItemsDiv.innerHTML += `
      <div style="display:flex; justify-content:space-between; margin-bottom:10px; border-bottom: 1px solid #333; padding-bottom:5px;">
        <span>${item.title} (${item.size})</span>
        <span style="color:#e63946; font-weight:bold;">${item.price} DT</span>
      </div>
    `;
  });

  document.getElementById('total-price').innerText = total;
}

function openCart() {
  document.getElementById('cartModal').style.display = 'flex';
}

function closeCart() {
  document.getElementById('cartModal').style.display = 'none';
}

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
  let total = 0;

  cart.forEach((item, index) => {
    itemsSummary += `${index + 1}. ${item.title} (Taille: ${item.size}) - ${item.price} DT\n`;
    total += item.price;
  });

  const rawMessage = `Ahla! Commande jdida min site حار 🌶️:\n\n` +
                     `📌 Les Produits:\n${itemsSummary}\n` +
                     `💰 Total: ${total} DT\n\n` +
                     `👤 Client: ${name}\n` +
                     `📞 Téléphone: ${phone}\n` +
                     `📍 Adresse: ${address}`;

  const encodedMessage = encodeURIComponent(rawMessage);
  const whatsappUrl = `https://wa.me/${MY_PHONE_NUMBER}?text=${encodedMessage}`;
  
  window.open(whatsappUrl, '_blank');
});