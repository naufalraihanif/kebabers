document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling untuk tombol CTA
    const ctaButton = document.querySelector('.cta-button');
    if (ctaButton) {
        ctaButton.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = ctaButton.getAttribute('href') || '#menu';
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                window.scrollTo({
                    top: targetSection.offsetTop - document.querySelector('header').offsetHeight,
                    behavior: 'smooth'
                });
            }
        });
    }

    // Smooth scrolling untuk navigasi
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            // Cek jika linknya bukan tombol keranjang
            if (link.id !== 'cart-icon') {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                if (targetSection) {
                    window.scrollTo({
                        top: targetSection.offsetTop - document.querySelector('header').offsetHeight,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // --- LOGIKA KERANJANG BARU ---
    let cart = []; // Array untuk menyimpan produk di keranjang

    const cartIcon = document.getElementById('cart-icon');
    const cartModal = document.getElementById('cart-modal');
    const closeBtn = document.querySelector('.close-btn');
    const cartCount = document.getElementById('cart-count');
    const cartItemsContainer = document.getElementById('cart-items');
    const totalPriceElement = document.getElementById('total-price');
    const checkoutBtn = document.querySelector('.checkout-btn');
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');

    // Fungsi untuk memperbarui tampilan keranjang dan total harga
    function renderCart() {
        cartItemsContainer.innerHTML = '';
        let total = 0;

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p>Keranjang Anda kosong.</p>';
        } else {
            cart.forEach(item => {
                const itemElement = document.createElement('div');
                itemElement.classList.add('cart-item');
                itemElement.innerHTML = `
                    <div class="item-info">
                        <strong>${item.name}</strong>
                        <br>
                        <span>Rp. ${item.price.toLocaleString('id-ID')}</span>
                    </div>
                    <div class="item-quantity">
                        <button class="quantity-btn decrease-btn" data-name="${item.name}">-</button>
                        <span>${item.quantity}</span>
                        <button class="quantity-btn increase-btn" data-name="${item.name}">+</button>
                    </div>
                `;
                cartItemsContainer.appendChild(itemElement);
                total += item.price * item.quantity;
            });
        }

        totalPriceElement.textContent = `Rp. ${total.toLocaleString('id-ID')}`;
        cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
    }

    // Fungsi untuk menambah produk ke keranjang
    function addToCart(product) {
        const existingItem = cart.find(item => item.name === product.name);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({...product,
                quantity: 1
            });
        }
        renderCart();
        alert(`${product.name} berhasil ditambahkan ke keranjang!`);
    }

    // Event listener untuk tombol "Tambah ke Keranjang"
    addToCartButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const productElement = e.target.closest('.menu-item');
            const productName = productElement.dataset.name;
            const productPrice = parseInt(productElement.dataset.price);

            const product = {
                name: productName,
                price: productPrice
            };
            addToCart(product);
        });
    });

    // Event listener untuk tombol Keranjang (menampilkan modal)
    cartIcon.addEventListener('click', (e) => {
        e.preventDefault();
        cartModal.style.display = 'block';
    });

    // Event listener untuk tombol Tutup modal
    closeBtn.addEventListener('click', () => {
        cartModal.style.display = 'none';
    });

    // Tutup modal ketika klik di luar area modal
    window.addEventListener('click', (e) => {
        if (e.target === cartModal) {
            cartModal.style.display = 'none';
        }
    });

    // Event listener untuk tombol tambah/kurang kuantitas di dalam keranjang
    cartItemsContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('increase-btn')) {
            const productName = e.target.dataset.name;
            const item = cart.find(item => item.name === productName);
            if (item) {
                item.quantity++;
                renderCart();
            }
        } else if (e.target.classList.contains('decrease-btn')) {
            const productName = e.target.dataset.name;
            const itemIndex = cart.findIndex(item => item.name === productName);
            if (itemIndex > -1) {
                if (cart[itemIndex].quantity > 1) {
                    cart[itemIndex].quantity--;
                } else {
                    cart.splice(itemIndex, 1);
                }
                renderCart();
            }
        }
    });

    // Event listener untuk tombol "Pesan Sekarang"
    checkoutBtn.addEventListener('click', () => {
        if (cart.length > 0) {
            alert('Terima kasih! Pesanan Anda sedang diproses. Total pembayaran: ' + totalPriceElement.textContent);
            cart = []; // Kosongkan keranjang setelah "pesanan"
            renderCart();
            cartModal.style.display = 'none';
        } else {
            alert('Keranjang Anda masih kosong. Silakan pilih produk terlebih dahulu.');
        }
    });
});