const decrementButtons = document.querySelectorAll(".decrement");
const incrementButtons = document.querySelectorAll(".increment");
const counters = document.querySelectorAll(".counter");
const buyButtons = document.querySelectorAll(".buy-button");
const names = document.querySelectorAll(".names");
const prices = document.querySelectorAll(".prices");
const abrirMenuBtn = document.getElementById("abrir-menu");
const cerrarMenuBtn = document.getElementById("cerrar-menu");
const menuLateral = document.getElementById("menu-lateral");
const payButton = document.getElementById("pay-button")

class Order {
    constructor() {
       this.items = [];
    }
    addItem(id, cant, price) {

        const existingItem = this.items.find(item => item.id === id);

        if (existingItem) {
            // Si existe, sumar la cantidad a ese item y actualizar el precio total
            existingItem.cant += cant;
            existingItem.price += price * cant;
        } else {
            // Si no existe, crear un nuevo item y agregarlo a la lista
            const newItem = {
                "id": id,
                "name": names[id].textContent, // Asumiendo que names contiene los nombres
                "cant": cant,
                "price": price * cant
            };
            this.items.push(newItem);
        }
        console.log(this.items)
    }
    removeItem(id) {
        // Buscar el índice del objeto con la ID especificada
        const index = this.items.findIndex(item => item.id === id);

        // Si se encuentra la ID, eliminar el objeto de la lista
        if (index !== -1) {
            this.items.splice(index, 1);
        }
    }
    totalPrice() {
        let totalPrice = 0;

        for (const item of this.items) {
            totalPrice += item.price;
        }

        return totalPrice;
    }
    renderOrder() {
        const orderContainer = document.getElementById('payment-block');
        orderContainer.innerHTML="";
        let html = '<table class="order-table">';
        html += '<thead id="payment-header"><tr><th class="payment-header">Nombre</th><th class="payment-header">Cantidad</th><th class="payment-header">Precio Unitario</th><th class="payment-header">Precio Total</th><th class="payment-header"></th></tr></thead>';
        html += '<tbody>';

        for (const item of this.items) {
            html += '<tr>';
            html += `<td class="order-item">${item.name}</td>`;
            html += `<td class="order-item">${item.cant}</td>`;
            html += `<td class="order-item">${item.price / item.cant}.000Gs</td>`;
            html += `<td class="order-item">${item.price}.000Gs</td>`;
            html += `<td class="order-item"><span class="delete-button" data-id="${item.id}">X</span></td>`;
            html += '</tr>';
        }
        html += `<tfoot><tr> <td class="order-item" colspan ="3">Total</td><td class="order-item">${order.totalPrice()}.000Gs</td></tr></tfoot>`;
        html += '</tbody></table>';
        orderContainer.innerHTML=html;

        const deleteButtons = document.querySelectorAll(".delete-button");
        deleteButtons.forEach((button, index) => {
            button.addEventListener("click", () => {
                this.removeItem(Number(button.getAttribute("data-id")));
                this.renderOrder();
            });
        });

    }
    createTicket(){
        var fullPrice = this.totalPrice();
        fetch('/payment/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({price: fullPrice*1000})
        })
        
        .then(response => response.json())
        .then(data => {
            setTimeout(() => window.open(data.url), 200);
        })
        .catch(error => {
            console.error(error);
        });
    }
    

}

var order = new Order();

// Inicializar contadores
const initialCount = 0;
const counts = Array.from({ length: counters.length }, () => initialCount);

function updateCounter(index) {
    counters[index].textContent = counts[index];
}

function decrementCounter(index) {
    if (counts[index] > 0) {
        counts[index]--;
        updateCounter(index);
    }
}

function incrementCounter(index) {
    counts[index]++;
    updateCounter(index);
}

// Agregar eventos a los botones
decrementButtons.forEach((button, index) => {
    button.addEventListener("click", () => {
        decrementCounter(index);
    });
});

incrementButtons.forEach((button, index) => {
    button.addEventListener("click", () => {
        incrementCounter(index);
    });
});

// Función para cambiar el estado del botón Comprar durante 1 segundo
function changeBuyButtonState(button, text) {
    button.style.backgroundColor = "green";
    button.textContent = text;
    

    setTimeout(() => {
        button.style.backgroundColor = "orange";
        button.textContent = "Comprar";
        button.classList.remove("cliked")
    }, 1000); // 1000 ms (1 segundo)
}


// Agregar evento para el botón Comprar
buyButtons.forEach((button, index) => {
    button.addEventListener("click", (event) => {
        // Cambiar el estado del botón Comprar al hacer clic
        if (counts[index] > 0){
            
            
            order.addItem(index,counts[index],Number(prices[index].textContent));
            event.preventDefault();
            button.classList.add("clicked"); // Agregar una clase al hacer clic
            changeBuyButtonState(button, "Agregado");

            // Puedes realizar acciones adicionales relacionadas con la compra aquí
        }
    });
});

abrirMenuBtn.addEventListener("click", () => {
    menuLateral.classList.remove("cerrado");
    menuLateral.classList.add("abierto");
    order.renderOrder();
});

cerrarMenuBtn.addEventListener("click", () => {
    menuLateral.classList.remove("abierto");
    menuLateral.classList.add("cerrado");
});

payButton.addEventListener("click", () => {
    if (order.totalPrice() > 0)
    {
        order.createTicket();
    }
});


