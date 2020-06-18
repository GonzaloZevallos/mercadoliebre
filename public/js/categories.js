window.onload = () => {

   // Selecciono todos los elementos con los que quiero trabajar
   let categories = document.querySelectorAll('.categories');

   // Recorro los elementos para poder aplicarles eventos
   for (const category of categories) {
      // Aplico evento al elemento
      category.addEventListener('click', () => {

         // Construyo la URL
         let restURL = category.id != 'allProducts' ? `?category=${category.id}` : '';
         let URL = 'http://localhost:3000/api/products' + restURL;
         
         // Realizo el pedido a la API de mi backend
         fetch(URL)
            .then(response => response.json())
            .then(response => {
               
               let products = response.data.products
               let productContainer = document.querySelector('.products-container');
               let fullContent = '';

               // Cambio el titulo
               if(category.id == 'allProducts'){
                  document.querySelector('h1.products-title').innerHTML = 'Todos los productos'
               } else {
                  document.querySelector('h1.products-title').innerHTML = category.id
               }

               // Creo el contenido que a priori estará dentro de mi contenedor de productos
               for (const product of products) {
                  let content = `
                  <div class="col-12 col-sm-6 col-lg-4">
                  <section class="product-box">
                  <a href="/products/detail/${product.id}">
                  <figure class="product-box_image">
                              <img src="/images/products/${product.image}" alt="${product.name}">
                              </figure>
                              <article class="product-box_data">
                              <h2>$${product.price - product.price * product.discount / 100}</h2>`
                              
                  if(product.discount > 0) {
                     content += `
                              <span>${product.discount} % OFF</span>`
                  }
                  
                  content += `
                  <p>${product.name}</p>
                  <i class="fas fa-truck"></i>
                  </article>
                  </a>
                  </section>
                  </div>`
                  fullContent += content
               }
               
               // Asigno lo construido al contenedor
               productContainer.innerHTML = fullContent;
            })
      })   
   }

}