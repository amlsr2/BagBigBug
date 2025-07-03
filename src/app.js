document.addEventListener("alpine:init", () => {
  // Alpine.data("products", () => ({
  //   items: [
  //     { id: 1, name: "Bag ", img: "bag3d-1.png", price: 20000 },
  //     { id: 2, name: "Bag ", img: "bag3d-2.png", price: 30000 },
  //     { id: 3, name: "Bag ", img: "bag3d-3.png", price: 40000 },
  //     { id: 4, name: "Bag ", img: "bag3d-4.png", price: 50000 },
  //     { id: 5, name: "Bag ", img: "bag3d-5.png", price: 60000 },
  //     { id: 6, name: "Bag ", img: "bag3d-6.png", price: 70000 },
  //     { id: 7, name: "Bag ", img: "bag3d-7.png", price: 80000 },
  //     { id: 8, name: "Bag ", img: "bag3d-8.png", price: 90000 },
  //     { id: 9, name: "Bag ", img: "bag3d-9.png", price: 100000 },
  //   ],
  // }));

Alpine.data("bags", () => ({
  categories: [
    {
      name: "products",
      items: [
        { id: 1, name: "Bag ", img: "bag3d-1.png", price: 20000 },
        { id: 2, name: "Bag ", img: "bag3d-2.png", price: 30000 },
        { id: 3, name: "Bag ", img: "bag3d-3.png", price: 40000 },
        { id: 4, name: "Bag ", img: "bag3d-4.png", price: 50000 },
        { id: 5, name: "Bag ", img: "bag3d-5.png", price: 60000 },
        { id: 6, name: "Bag ", img: "bag3d-6.png", price: 70000 },
        { id: 7, name: "Bag ", img: "bag3d-7.png", price: 80000 },
        { id: 8, name: "Bag ", img: "bag3d-8.png", price: 90000 },
        { id: 9, name: "Bag ", img: "bag3d-9.png", price: 100000 },
      ],
    },
    {
      name: "menu",
      items: [
        { id: 1, name: "Luna Elegant", img: "baggie-1.png", price: 45000 },
        { id: 2, name: "Violetta Tote", img: "baggie-2.png", price: 520000 },
        { id: 3, name: "Scarlett Satchel", img: "baggie-3.png", price: 450000 },
        { id: 4, name: "Olive Clutch", img: "baggie-4.png", price: 420000 },
        { id: 5, name: "Amber Classic", img: "baggie-5.png", price: 500000 },
        { id: 6, name: "Sienna Everyday", img: "baggie-6.png", price: 460000 },
        { id: 7, name: "Milo Mini", img: "baggie-7.png", price: 350000 },
        { id: 8, name: "Aqua Carryall", img: "baggie-8.png", price: 530000 },
        { id: 9, name: "Hazel Chicc", img: "baggie-9.png", price: 470000 },
      ],
    },
  ],
}));


  Alpine.store("cart", {
    items: [],
    total: 0,
    quantity: 0,
    add(newItem) {
      // cek apakah ada barang yang sama di cart
      const cartItem = this.items.find((item) => item.id === newItem.id);

      // jika belom ada barang / cart masih kosong
      if (!cartItem) {
        this.items.push({ ...newItem, quantity: 1, total: newItem.price });
        this.quantity++;
        this.total += newItem.price;
      } else {
        // jika barang sudah ada, cek apakah barang beda atau sama dengan yang ada di cart
        this.items = this.items.map((item) => {
          // jika barang berbeda
          if (item.id !== newItem.id) {
            return item;
          } else {
            // jika barang sudah ada, tambah quantity dan totalnya
            item.quantity++;
            item.total = item.price * item.quantity;
            this.quantity++;
            this.total += item.price;
            return item;
          }
        });
      }
    },

    remove(id) {
      // ambil item yang mau di remove berdasarkan id nya
      const cartItem = this.items.find((item) => item.id === id);

      // jika item lebih dari 1
      if (cartItem.quantity > 1) {
        // telusuri 1 1
        this.items = this.items.map((item) => {
          if (item.id !== id) {
            return item;
          } else {
            item.quantity--;
            item.total = item.price * item.quantity;
            this.quantity--;
            this.total -= item.price;
            return item;
          }
        });
      } else if (cartItem.quantity === 1) {
        // jika barangnya sisa 1
        this.items = this.items.filter((item) => item.id !== id);
        this.quantity--;
        this.total -= cartItem.price;
      }
    },
  });
});

//  Form Validation
const checkoutButton = document.querySelector(".checkout-button");
checkoutButton.disabled = true;

const form = document.querySelector("#checkoutForm");

form.addEventListener("keyup", function () {
  for (let i = 0; i < form.elements.length; i++) {
    if (form.elements[i].value.length !== 0) {
      checkoutButton.classList.remove("disabled");
      checkoutButton.classList.add("disabled");
    } else {
      return false;
    }
  }
  checkoutButton.disabled = false;
  checkoutButton.classList.remove("disabled");
});

//  kirim data ketika tombol checkout di klik
checkoutButton.addEventListener("click", async function (e) {
  e.preventDefault();
  const formData = new FormData(form);
  const data = new URLSearchParams(formData);
  const objData = Object.fromEntries(data);
  // const message = formatMessage(objData);
  // window.open('http://wa.me/62895372029097?text=' + encodeURIComponent(message));
  console.log(objData);

  // minta transaction token menggunakan ajax / fetch
  try {
    const response = await fetch("/php/placeOrder.php", {
      method: "POST",
      body: data,
    });
    const token = await response.text();
    // console.log(token);
    // Trigger snap popup. @TODO: Replace TRANSACTION_TOKEN_HERE with your transaction token
    window.snap.pay(token);
    // customer will be redirected after completing payment pop-up
  } catch (err) {
    console.log(err.message);
  }
});

// format pesan whatsapp
const formatMessage = (obj) => {
  return `Data Customer
  Nama: ${obj.name}
  Email: ${obj.email}
  No HP: ${obj.phone}
  Data Pesanan
  ${JSON.parse(obj.items).map(
    (item) => `${item.name} (${item.quantity} x ${rupiah(item.total)}) \n
  `
  )}
TOTAL: ${rupiah(obj.total)}
Terima kasih.`;
};

//Konversi ke Rupiah
const rupiah = (number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(number);
};
