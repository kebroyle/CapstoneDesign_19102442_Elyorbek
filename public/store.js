if(document.readyState=='loading'){
    document.addEventListener('DOMContentLoaded', ready)
}else{
    ready()
}

function ready(){
    

    var removeCarItemButtons = document.getElementsByClassName('btn-danger')
    for(var i =0; i<removeCarItemButtons.length;i++){
        var button = removeCarItemButtons[i]
        button.addEventListener('click', removeCartItem)
    }

    var quantityInputs = document.getElementsByClassName('cart-quantity-input')
    for(var i =0; i<quantityInputs.length;i++){
        var input = quantityInputs[i]
        input.addEventListener('change', quantityChanged)
    }

    var addToCartButtons = document.getElementsByClassName('shop-item-button')
    for(var i =0; i<addToCartButtons.length; i++){
        var button = addToCartButtons[i]
        button.addEventListener('click', addToCartClicked)
    }

    document.getElementsByClassName('btn-purchase')[0].addEventListener('click', purchaseClicked)

}

var stripeHandler = StripeCheckout.configure({
    key: stripePublicKey,
    locale:'en',
    token: function(token){
        var items =[]
        var cartItemContainer = document.getElementsByClassName('cart-items')[0]
        var cartRows = cartItemContainer.getElementsByClassName('cart-row')
        for (var i =0; i<cartRows.length; i++){
            var cartRow = cartRows[i]
            var quantityElement = cartRow.getElementsByClassName('cart-quantity-input')[0]
            var quantity = quantityElement.value
            var id = cartRow.dataset.itemId
            items.push({
                id: id,
                quantity: quantity
            })
        }

        fetch('/purchase',{
            method:'POST',
            headers:{
                'Content-Type': 'application/json',
                'Accept':'application/json'
            },
            body:JSON.stringify({
                stripeTokenId:token.id,
                stripeTokenEmail:token.email,
                items: items
            })
        }).then(function(res){
            return res.json()
        }).then(function(data){
            alert(data.message)
            var cartItems = document.getElementsByClassName('cart-items')[0]
                while(cartItems.hasChildNodes()){
                    cartItems.removeChild(cartItems.firstChild)
                }
                updateCartTotal()
        }).catch(function(error){
            console.log(error)
        })
    }
})

function purchaseClicked(){

    var priceElement = document.getElementsByClassName('cart-total-price')[0]
    var price =parseFloat(priceElement.innerText.replace('$', '')) *100
    stripeHandler.open({
        amount:price
    })

}

function removeCartItem(event){
    var buttonClicked = event.target
    buttonClicked.parentElement.parentElement.remove()
    updateCartTotal()
}

function quantityChanged(event){
    var input = event.target
    if(isNaN(input.value) || input.value<=0){
        input.value = 1
    }
    updateCartTotal()

}



var removeCarItemButtons = document.getElementsByClassName('btn-danger')
for(var i =0; i<removeCarItemButtons.length;i++){
    var button = removeCarItemButtons[i]
    button.addEventListener('click', function(event){
        var buttonClicked= event.target
        buttonClicked.parentElement.parentElement.remove()
        updateCartTotal()
    })
}

function addToCartClicked(event){
    alert("the order has been added to the cart")
    var button = event.target
    var shopItem = button.parentElement.parentElement
    var title = shopItem.getElementsByClassName('shop-item-title')[0].innerText
    var price = shopItem.getElementsByClassName('shop-item-price')[0].innerText
    var imageSrc = shopItem.getElementsByClassName('shop-item-image')[0].src
    var id = shopItem.dataset.itemId
    console.log(title, price, imageSrc)
    addItemToCart(title, price, imageSrc, id)
    updateCartTotal()
}

function addItemToCart(title, price, imageSrc, id){
    var cartRow = document.createElement('div')
    cartRow.classList.add('cart-row')
    cartRow.dataset.itemId = id

    var cartItems = document.getElementsByClassName('cart-items')[0]
    var cartItemNames =cartItems.getElementsByClassName('cart-item-title')
    for(var i = 0; i < cartItemNames.length; i++){
        console.log(cartItemNames[i] + "this is names")
        if(cartItemNames[i].innerText == title){
            console.log(i + "this is i")
            alert('This is already added to the cart')
            return
        }
    }
    var cartRowContents = `
    <div class="cart-item cart-column">
        <img class ="cart-item-image" src =${imageSrc} width ="100" height="100">
        <span class="class-item-title">${title}</span>
        </div>
        <span class="cart-price cart-column">${price}</span>
        <div class="cart-quantity cart-column">
            <input class="cart-quantity-input" type="number" value ="1">
            <button class="btn btn-danger" type="button">REMOVE</button>
        </div> 
    `
    cartRow.innerHTML = cartRowContents

    cartItems.append(cartRow)
    cartRow.getElementsByClassName('btn-danger')[0].addEventListener('click', removeCartItem)
    cartRow.getElementsByClassName('cart-quantity-input')[0].addEventListener('change', quantityChanged)


}

function updateCartTotal(){
    var cartItemContainer = document.getElementsByClassName('cart-items')[0]
    var cartRows = cartItemContainer.getElementsByClassName('cart-row')
    var total =0;
    for(var i = 0; i<cartRows.length; i++){
        var cartRow = cartRows[i]
        var priceElement = cartRow.getElementsByClassName('cart-price')[0]
        var quantityElement= cartRow.getElementsByClassName('cart-quantity-input')[0]
        var price = parseFloat(priceElement.innerText.replace('$', ''))
        var quantity = quantityElement.value
        var multip = parseInt(quantity)
        total = total + (price * multip)
        total = Math.round(total * 100)/100
        console.log("ths is multip" + multip)
        console.log(typeof(multip))
        console.log(typeof(total))
        console.log(typeof(quantity))
        console.log(total)
        console.log(price + "this is typeof of pricr " +typeof(price) )
        
    }
    document.getElementsByClassName('cart-total-price')[0].innerText ='$' + total
}

function searchProducts() {
    function fetched_datas(){
        let fetched_datas = [
            {
                id:900,
                name: "free",
                price: 12,
                category: 'category',
                image: 'image'
            }
        ]
        let products_array=[]
        fetch('/get-all-products')
        .then(response => {
        // Check if the response status is OK (status code 200)
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
        // Parse the response JSON
            return response.json();
        })
        .then(data => {
            data.forEach(function(data){
                fetched_datas.push({id:parseInt(data.product_id), name: data.product_name, price:parseInt(data.product_price), category:data.product_category, image:data.product_image})
            })
            let pr_array = []
            for (i=0; i<fetched_datas.length; i++){
                pr_array.push(fetched_datas[i])
            }
            // console.log(fetched_datas)
            // console.log(typeof(fetched_datas))
            const query = document.getElementById('search-input').value.toLowerCase();
            const resultsContainer = document.getElementById('results-container');

            // Clear previous results
            resultsContainer.innerHTML = '';

            

            // Filter dummy data based on the search query
            const filteredData = fetched_datas.filter(product =>
                product.name.toLowerCase().includes(query));
            
            com_value = filteredData[0].category.toString()
            function check(recoms, com_value){
                const searchInput = com_value;
                

                // if (searchTerm === '') {
                //     return; // If the search input is empty, do nothing
                // }
                filteredRec = recoms.filter(recom=>
                recom.category===searchInput)
                displayRecommendations(filteredRec);
                ready()
            }

            function displayRecommendations(items) {
                const recommendationList = document.getElementById('recommendationList');
                recommendationList.innerHTML = ''; // Clear the list before displaying new recommendations

                if (items && items.length > 0) {
                    items.forEach(item => {
                        const shopIt =`
                            <div class= "shop-item" data-item-id="${item.id}">
                                <span class="shop-item-title">${item.name}</span>
                                <img class="shop-item-image" src = ${item.image} width="200" height="200">
                                <div class="shop-item-details">
                                    <span class="shop-item-price">$${item.price/100}</span>
                                    <button class="btn btn-primary shop-item-button" type="button">ADDTO CART</button>
                                    </div>
                            </div>
                        `
                        const shopItem = document.createElement("div")
                        shopItem.innerHTML= shopIt
                        recommendationList.appendChild(shopItem)
                    });
                } else {
                    recommendationList.innerHTML = 'No recommendations found.';
                } 
            }

           
            if (filteredData.length > 0) {
                filteredData.forEach(product => {
                    
                    const shopIt =`
                    <div class= "shop-item" data-item-id="${product.id}">
                        <span class="shop-item-title">${product.name}</span>
                        <img class="shop-item-image" src = ${product.image} width="200" height="200">
                        <div class="shop-item-details">
                            <span class="shop-item-price">$${product.price/100}</span>
                            <button class="btn btn-primary shop-item-button" type="button">ADDTO CART</button>
                            </div>
                    </div>
                `
                const shopItem = document.createElement("div")
                shopItem.innerHTML= shopIt
                    resultsContainer.appendChild(shopItem);
                });
            } else {
                resultsContainer.innerHTML = '<p>No results found.</p>';
            }
            check(fetched_datas, com_value )
            return fetched_datas
        
            
        
    

        })
        .catch(error => {
        // Handle errors
            console.error('Fetch error:', error);
        });
    
    
    }
    fetched_datas()
    ready()
    
    
    
}