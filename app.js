//Storage Controller
const StorageController = (function () {

    return {
        storeProduct: function (product) {
            let products;
            if(localStorage.getItem('products')===null){
                products=[];
                products.push(product);   
            }else{
                products=JSON.parse(localStorage.getItem('products'));
                products.push(product);
            }
            localStorage.setItem('products',JSON.stringify(products));
            
        },
        getProducts:function(){
         
            let products;
            if(localStorage.getItem('products')===null){
                products=[];  
            }else{
                products=JSON.parse(localStorage.getItem('products'));
            }
            return products;
        },
        updateProduct:function(product){
            let products=JSON.parse(localStorage.getItem('products'));

            products.forEach((item,index)=>{
                if(product.id==item.id){
                    products.splice(index,1,product); //kayıdın bulunduğu indexi siler ve yerine fonksiyona gelen product ı ekler.
                }
            });
            localStorage.setItem('products',JSON.stringify(products));
        },
        deleteProduct:function(product){
            let products=JSON.parse(localStorage.getItem('products'));

            products.forEach((item,index)=>{
                if(product.id==item.id){
                    products.splice(index,1); //kayıdın bulunduğu indexi siler ve yerine fonksiyona gelen product ı ekler.
                }
            });
            localStorage.setItem('products',JSON.stringify(products));
        }
        

    }

})();

//Product Controller
const ProductController = (function () {
    //private
    const Product = function (id, name, price) {
        this.id = id;
        this.name = name;
        this.price = price;
    }
    const data = {
        products: StorageController.getProducts(),
        selectedProduct: null,
        totalPrice:0
    }
    //public
    return {
        getProducts: function () {
            return data.products;
        },
        getData: function () {
            return data;
        },
        addProduct: function (name, price) {
            let id;
            if (data.products.length > 0) {
                id = data.products[data.products.length - 1].id + 1;

            } else {
                id = 0;
            }
            const newProduct = new Product(id, name, price);
            data.products.push(newProduct);
            return newProduct;
        },
        updatedProduct: function (name, price) {
            let product = null;
            data.products.forEach(p => {
                if (p.id == data.selectedProduct.id) {
                    p.name = name;
                    p.price = parseFloat(price);
                    product = p;
                }
            });
            return product;
        },
        deleteProduct: function (product) {
            data.products.forEach(function (prd, index) {
                if (prd.id == product.id) {
                    data.products.splice(index, 1);
                }
            });
        },
        getTotal: function () {
            let total = 0;
            data.products.forEach(p => {
                total += p.price;
            });
            data.totalPrice = total;
            return data.totalPrice;
        },
        getProductById: function (id) {
            let product = null;
            data.products.forEach(p => {
                if (p.id == id) {
                    product = p;
                }

            });
            return product;
        },
        setCurrentProduct: function (product) {
            data.selectedProduct = product;
        },
        getCurrentProduct: function () {
            return data.selectedProduct;
        }
    }
})();


//UI Controller
const UIController = (function () {
    const Selectors = {
        productList: "#item-list",
        productListItems: "#item-list tr",
        addBtn: ".addBtn",
        saveBtn: '.saveBtn',
        deleteBtn: '.deleteBtn',
        cancelBtn: '.cancelBtn',
        productName: "#productName",
        productPrice: "#productPrice",
        productCard: "#productCard",
        totalTl: '#total-tl',
        totalDolar: '#total-dolar',
        updateBtn: '.btnUpdate',

    }
    return {
        createProductList: function (products) {
            let html = '';

            products.forEach(p => {
                html += `
                <tr>
                    <td>${p.id}</td>
                    <td>${p.name}</td>
                    <td>${p.price} $</td>
                    <td class="text-right">
                        <i class="far fa-edit  btnUpdate">
                        </button>
                    </td>
                </tr>`;
            });

            document.querySelector(Selectors.productList).innerHTML = html;
        },
        getSelectors: function () {
            return Selectors;
        },
        addProduct: function (p) {
            document.querySelector(Selectors.productCard).style.display = 'block';
            var item = `
                <tr>
                    <td>${p.id}</td>
                    <td>${p.name}</td>
                    <td>${p.price} $</td>
                    <td class="text-right">
                        <i class="far fa-edit btnUpdate">
                        </button>
                    </td>
                </tr>
            `;
            document.querySelector(Selectors.productList).innerHTML += item;
        },
        updateProduct: function (p) {
            let updatedItem = null;
            let items = document.querySelectorAll(Selectors.productListItems);
            items.forEach(item => {
                if (item.classList.contains('bg-warning')) {
                    item.children[1].textContent = p.name;
                    item.children[2].textContent = p.price + '$';
                    updatedItem = item;
                }
            });
            return updatedItem;
        },
        deletedProduct: function () {
            let items = document.querySelectorAll(Selectors.productListItems);
            items.forEach(item => {
                if (item.classList.contains('bg-warning')) {
                    item.remove();
                }
            });
        },
        clearInputs: function () {
            document.querySelector(Selectors.productName).value = "";
            document.querySelector(Selectors.productPrice).value = "";
        },
        hideCard: function () {
            document.querySelector(Selectors.productCard).style.display = 'none';
        },
        showTotal: function (total) {
            let dolar = 7.96;
            document.querySelector(Selectors.totalDolar).textContent = total;
            document.querySelector(Selectors.totalTl).textContent = total * dolar;
        },
        addProductToForm: function () {
            document.querySelector(Selectors.productName).value = ProductController.getCurrentProduct().name;
            document.querySelector(Selectors.productPrice).value = ProductController.getCurrentProduct().price;
        },
        addingState: function (item) {
            UIController.clearWarningBackground();
            UIController.clearInputs();
            document.querySelector(Selectors.addBtn).style.display = 'inline';
            document.querySelector(Selectors.deleteBtn).style.display = 'none';
            document.querySelector(Selectors.saveBtn).style.display = 'none';
            document.querySelector(Selectors.cancelBtn).style.display = 'none';
        },
        updateState: function (tr) {
            this.clearWarningBackground();
            tr.classList.add('bg-warning');
            document.querySelector(Selectors.addBtn).style.display = 'none';
            document.querySelector(Selectors.deleteBtn).style.display = 'inline';
            document.querySelector(Selectors.saveBtn).style.display = 'inline';
            document.querySelector(Selectors.cancelBtn).style.display = 'inline';

        },
        clearWarningBackground: function () {
            const items = document.querySelectorAll(Selectors.productListItems);
            items.forEach(i => {
                if (i.classList.contains('bg-warning')) {
                    i.classList.remove('bg-warning');
                }
            });
        }
    }
})();

//App Controller
const App = (function (ProductCtrl, UICtrl, StorageCtrl) {

    const UISelectors = UICtrl.getSelectors();

    //Load Event Listeners
    const loadEventListeners = function () {
        //add product event
        document.querySelector(UISelectors.addBtn).addEventListener('click', productAddSubmit);

        //edit product
        document.querySelector(UISelectors.productList).addEventListener('click', productUpdate);

        //save changes
        document.querySelector(UISelectors.saveBtn).addEventListener('click', saveBtn);

        //cancel changes
        document.querySelector(UISelectors.cancelBtn).addEventListener('click', cancelBtn);

        //delete changes
        document.querySelector(UISelectors.deleteBtn).addEventListener('click', deleteBtn);

        UICtrl.showTotal(ProductCtrl.getTotal());
  
    }
    const productUpdate = function (e) {

        const id = e.target.parentNode.previousElementSibling.previousElementSibling.previousElementSibling.textContent;

        //get selected product
        const product = ProductCtrl.getProductById(id);

        //set current product
        ProductCtrl.setCurrentProduct(product);

        //add product to ui
        UICtrl.addProductToForm();


        UICtrl.updateState(e.target.parentNode.parentNode);


        e.preventDefault();

    }
    const productAddSubmit = function (e) {

        const productName = document.querySelector(UISelectors.productName).value;
        const productPrice = document.querySelector(UISelectors.productPrice).value;

        if (productName !== '' && productPrice !== '') {
            //add product
            const newProduct = ProductCtrl.addProduct(productName, parseFloat(productPrice));

            UICtrl.addProduct(newProduct);

            //add product to LS
            StorageCtrl.storeProduct(newProduct);
            //get total
            const total = ProductCtrl.getTotal();

            //show total in ui
            UICtrl.showTotal(total);

            //clear input
            UICtrl.clearInputs();

           
        }


        e.preventDefault();
    }
    const saveBtn = function (e) {
        const productName = document.querySelector(UISelectors.productName).value;
        const productPrice = document.querySelector(UISelectors.productPrice).value;

        if (productName !== '' && productPrice !== '') {

            const updatedProduct = ProductCtrl.updatedProduct(productName, productPrice);

            //uptate ui
            let item = UICtrl.updateProduct(updatedProduct);

            //get total
            const total = ProductCtrl.getTotal();

            //show total
            UICtrl.showTotal(total);

            //update storage
            StorageController.updateProduct(updatedProduct);


            UICtrl.addingState(item);
        }

        e.preventDefault();
    }
    const cancelBtn = function (e) {
        UICtrl.addingState();
        UICtrl.clearWarningBackground();

        e.preventDefault();
    }
    const deleteBtn = function (e) {
        const selectedPoduct = ProductCtrl.getCurrentProduct();
        ;
        ProductCtrl.deleteProduct(selectedPoduct);
        e.preventDefault();

        //delete ui
        UICtrl.deletedProduct();
        const total = ProductCtrl.getTotal();
        UICtrl.showTotal(total);
        StorageController.deleteProduct(selectedPoduct);
        if (total == 0) {
            UICtrl.hideCard();
        }

    }


    return {
        init: function () {
            console.log('starting app..');
            UICtrl.addingState();
            const products = ProductCtrl.getProducts();

            if (products.length == 0) {
                UICtrl.hideCard();
            } else {
                UICtrl.createProductList(products);
            }

            //load event listener
            loadEventListeners();
        }
    }
})(ProductController, UIController, StorageController);

App.init();