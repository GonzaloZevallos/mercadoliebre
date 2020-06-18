window.onload = () => {

   let categories = document.querySelectorAll('.categories');

   for (const category of categories) {
      category.addEventListener('click', () => {
         let restURL = category.id != 'allProducts' ? `?category=${category.id}` : '';
         let URL = 'http://localhost:3000/api/products' + restURL;

         console.log(URL)
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

               // Relleno el contenedor de productos con los datos de la respuesta
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

               productContainer.innerHTML = fullContent;
            })
      })   
   }

}