const productosLista = document.getElementById('productos-lista');
const agregarForm = document.getElementById('agregar-form');

// Función para obtener los productos desde la API
async function obtenerProductos() {
  try {
    const response = await fetch('http://localhost:3000/productos');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error al obtener los productos:', error);
    return [];
  }
}

// Función para mostrar los productos en la lista
function mostrarProductos(productos) {
  productosLista.innerHTML = '';

  productos.forEach((producto) => {
    const li = document.createElement('li');
    li.innerHTML = `<strong>${producto.nombre}</strong> - Precio: $${producto.precio} - <button onclick="editarProducto(${producto.id})">Editar</button>`;
    productosLista.appendChild(li);
  });
}

// Función para enviar el formulario de agregar producto
async function agregarProducto(event) {
  event.preventDefault();

  const nombre = document.getElementById('nombre').value;
  const precio = parseFloat(document.getElementById('precio').value);

  const nuevoProducto = { nombre, precio };

  try {
    const response = await fetch('http://localhost:3000/productos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(nuevoProducto),
    });

    if (response.ok) {
      const data = await response.json();
      mostrarProductos([...productos, data]);
      agregarForm.reset();
    } else {
      console.error('Error al agregar el producto:', response.status);
    }
  } catch (error) {
    console.error('Error al agregar el producto:', error);
  }
}

// Función para obtener un producto por su ID
async function obtenerProductoPorId(id) {
  try {
    const response = await fetch(`http://localhost:3000/productos/${id}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error al obtener el producto:', error);
    return null;
  }
}

// Función para enviar el formulario de editar producto
async function editarProducto(id) {
  const producto = await obtenerProductoPorId(id);

  if (producto) {
    const nombre = prompt('Ingrese el nuevo nombre:', producto.nombre);
    const precio = parseFloat(prompt('Ingrese el nuevo precio:', producto.precio));

    if (nombre && !isNaN(precio)) {
      const productoActualizado = { ...producto, nombre, precio };

      try {
        const response = await fetch(`http://localhost:3000/productos/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(productoActualizado),
        });

        if (response.ok) {
          const data = await response.json();
          const productosActualizados = productos.map((p) => (p.id === id ? data : p));
          mostrarProductos(productosActualizados);
        } else {
          console.error('Error al editar el producto:', response.status);
        }
      } catch (error) {
        console.error('Error al editar el producto:', error);
      }
    }
  }
}

// Cargar productos al cargar la página
window.addEventListener('DOMContentLoaded', async () => {
  const productos = await obtenerProductos();
  mostrarProductos(productos);
});

// Agregar evento al formulario para agregar productos
agregarForm.addEventListener('submit', agregarProducto);
