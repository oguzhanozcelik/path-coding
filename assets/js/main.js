$(document).ready(function () {
    //LAZY LOADING
    setTimeout(function () {
        $('.lazy').each(function () {
            $(this).attr('src', $(this).attr('data-src')).addClass("lazyloaded");
        });
    }, 1000);
    $(window).scroll(function () {
        $('.lazy').each(function () {
            if ($(this).offset().top < ($(window).scrollTop() + $(window).height() + 100)) {
                $(this).attr('src', $(this).attr('data-src')).addClass("lazyloaded");
            }
        });
    });

    let totalItems = JSON.parse(localStorage.getItem("cart"));
    if(totalItems !== null){
        $(".item-total-quantity").empty().append(totalItems.length)
    }else{
        $(".item-total-quantity").append("0");
    }

    let dataOption = {
        title: "batman",
        limit: 10,
        page: 0
    }

    function getStores() {
        $.ajax({
            type: 'GET',
            url: 'https://www.cheapshark.com/api/1.0/stores',
            dataType: 'json',
            success: function (response) {
                if (response) {
                    localStorage.setItem("stores", JSON.stringify(response));
                }
            },
            error: function (err) {
                console.log("-> err", err);
            }
        })
    }

    function getProduct(title, limit, page = 0) {
        let products = "";
        let favorites = JSON.parse(localStorage.getItem("favorites"));
        let insideArray = [];
        if (favorites !== null) {
            favorites.map(function (item) {
                insideArray.push(item.productId);
            })
        } else {
            favorites = [];
        }

        if (page === 0) {
            $.ajax({
                type: 'GET',
                url: 'https://www.cheapshark.com/api/1.0/games?title=' + title + '&exact=0',
                dataType: 'json',
                success: function (response) {
                    if (response) {
                        localStorage.setItem("games", JSON.stringify(response));
                        response.map(function (value, key) {

                            let gId = value.gameID,
                                thumb = value.thumb,
                                cheapest = value.cheapest,
                                cheapestDealID = value.cheapestDealID,
                                title = value.external,
                                internalName = value.internalName;
                            if (title.length > 25) {
                                title = title.slice(0, 22) + "...";
                            }
                            if (key < 10) {
                                products += '<div class="card product">' +
                                    '                <div class="row g-0">' +
                                    '                    <div class="col-md-4 product-image">' +
                                    '                        <img src="assets/images/loading.svg" data-src="' + thumb + '" class="img-fluid rounded-start lazy" alt="' + title + '"/>' +
                                    '                    </div>' +
                                    '                    <div class="col-md-8">' +
                                    '                        <div class="card-body">';
                                if (insideArray.includes(gId)) {
                                    products += '                           <h4 class="card-title">' + title + ' <span class="favorited">Added to favorites<img src="assets/images/heart.svg" alt="Added to favorites"/></span></h4>';
                                } else {
                                    products += '                           <h4 class="card-title">' + title + ' <span class="add-to-favorites" data-product-id="' + gId + '" data-name="' + value.external + '" data-image="' + thumb + '">Add<img src="assets/images/heart.svg" alt="Add to favorites"/></span></h4>';
                                }
                                products +=
                                    '                           <div class="price-section">' +
                                    '                              <span class="cheapest-price">Cheapest Price: <b>$' + cheapest + '</b></span> ' +
                                    '                           </div>' +
                                    '                           <div class="actions mt-3">' +
                                    '                               <button class="btn btn-danger quick-view" data-toggle="modal" data-target="#gameModal" data-title="'+value.external+'" data-product-id="' + gId + '" data-cheapest="' + cheapestDealID + '"><img src="assets/images/quick.svg" alt="Add to favorites"/> Quick View</button>' +
                                    '                           </div>    ' +
                                    '                        </div>' +
                                    '                    </div>' +
                                    '                </div>' +
                                    '            </div>';
                            }

                        })
                        $("#products").append(products);
                    }
                },
                error: function (err) {
                    console.log("-> err", err);
                }
            })
        } else {
            var data = JSON.parse(localStorage.getItem("games"));
            let from = limit * page;
            let to = limit + (limit * page);
            var randomColor = "";
            // You can add background to cards
            // var randomColor = 'background: #'+Math.floor(Math.random() * 16777215).toString(16);
            data.map(function (value, key) {
                let gId = value.gameID,
                    thumb = value.thumb,
                    cheapest = value.cheapest,
                    cheapestDealID = value.cheapestDealID,
                    title = value.external,
                    internalName = value.internalName;
                if (title.length > 25) {
                    title = title.slice(0, 22) + "...";
                }
                if (key > from - 1 && key < to) {
                    products += '<div class="card product" style="' + randomColor + '">' +
                        '                <div class="row g-0">' +
                        '                    <div class="col-md-4 product-image">' +
                        '                        <img src="assets/images/loading.svg" data-src="' + thumb + '" class="img-fluid rounded-start lazy" alt="' + title + '"/>' +
                        '                    </div>' +
                        '                    <div class="col-md-8">' +
                        '                        <div class="card-body">';
                    if (insideArray.includes(gId)) {
                        products += '                           <h4 class="card-title">' + title + ' <span class="favorited">Added to favorites<img src="assets/images/heart.svg" alt="Added to favorites"/></span></h4>';
                    } else {
                        products += '                           <h4 class="card-title">' + title + ' <span class="add-to-favorites" data-product-id="' + gId + '" data-name="' + value.external + '" data-image="' + thumb + '">Add<img src="assets/images/heart.svg" alt="Add to favorites"/></span></h4>';
                    }
                    products +=
                        '                           <div class="price-section">' +
                        '                              <span class="cheapest-price">Cheapest Price: <b>$' + cheapest + '</b></span> ' +
                        '                           </div>' +
                        '                           <div class="actions mt-3">' +
                        '                               <button class="btn btn-danger quick-view" data-toggle="modal" data-target="#gameModal" data-title="'+value.external+'" data-product-id="' + gId + '" data-cheapest="' + cheapestDealID + '"><img src="assets/images/quick.svg" alt="Add to favorites"/> Quick View</button>' +
                        '                           </div>    ' +
                        '                        </div>' +
                        '                    </div>' +
                        '                </div>' +
                        '            </div>';
                }
            })
            $("#products").append(products);
        }

    }

    function getSingle(gID) {
        $.ajax({
            type: 'GET',
            url: 'https://www.cheapshark.com/api/1.0/games?id=' + gID,
            dataType: 'json',
            success: function (response) {
                if (response) {
                    const stores = JSON.parse(localStorage.getItem("stores"));
                    const options = {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'};
                    const dataModal = {
                        title: $(".gameModal .single-title"),
                        image: $(".gameModal .product-image img"),
                        cheapest: $(".gameModal .cheapest-modal span.date"),
                        cheapestPrice: $(".gameModal .cheapest-modal span.price"),
                        listGroup: $(".gameModal .list-group")
                    }
                    let title = response.info.title,
                        thumb = response.info.thumb,
                        cheapestPriceEver = response.cheapestPriceEver.price,
                        cheapestPriceEverDate = response.cheapestPriceEver.date,
                        deals = response.deals;
                    var cheapestDate = new Date(cheapestPriceEverDate * 1000).toLocaleDateString("en-US", options);
                    dataModal.title.empty().append(title);
                    dataModal.cheapest.empty().append(cheapestDate);
                    dataModal.cheapestPrice.empty().append("$" + cheapestPriceEver);
                    dataModal.image.attr("src", thumb);

                    let singleDetails = "";
                    deals.map(function (value, key) {

                        let storeID = value.storeID,
                            dealID = value.dealID,
                            price = value.price,
                            retailPrice = value.retailPrice,
                            savings = value.savings;

                        const index = stores.map(object => object.storeID).indexOf(storeID);
                        let storeName = stores[index].storeName;

                        singleDetails += '<a href="#" class="list-group-item list-group-item-action flex-column align-items-start">' +
                            '                            <div class="d-flex w-100 justify-content-between">' +
                            '                                <h5 class="mb-1">' + storeName + '</h5>' +
                            '                            </div>' +
                            '                           <div class="price-section">';
                        if (price === retailPrice) {
                            singleDetails += '<span class="sale-price">Price:$' + price + '</span> ';
                        } else {
                            singleDetails += '<span class="normal-price">Sale Price:$' + retailPrice + '</span> ' +
                                '<span class="sale-price">Price:$' + price + '</span> ';
                        }
                        if (savings > 0) {
                            singleDetails += '<span class="savings">(You save %' + Number(savings).toFixed(0) + ')</span> ';
                        }
                        singleDetails +=
                            '                           </div>' +
                            '                            <div class="mt-2">' +
                            '                             <button class="btn btn-outline-danger add-soft" data-image-src="' + thumb + '" data-name="' + title + '" data-price="' + price + '" data-id="' + dealID + '">Add to cart</button>  ' +
                            '                           </div>' +
                            '                        </a>'
                    })
                    $(dataModal.listGroup).empty().append(singleDetails);
                }

            },
            error: function (err) {
                console.log("-> err", err);
            }
        })
    }
    function addToCart(id, title, image, price) {
        let products = [];
        if (localStorage.getItem('cart')) {
            products = JSON.parse(localStorage.getItem('cart'));
        }
        products.push({'productId': id, 'title': title, 'image': image, 'price': price});
        localStorage.setItem('cart', JSON.stringify(products));
        toast("Success", "Product added to cart!")

        $(".item-total-quantity").empty().append(products.length)
        addItemGoogle({
            id: id,
            price: price,
            name: title,
        })
    }
    function toast(title, message) {
        $(".toast-title").empty().append(title);
        $(".toast-body").empty().append(message);
        $('.toast').toast('show');
        setTimeout(function () {
            $('.toast').toast('hide');
        }, 3000);
    }
    function removeProduct(productId) {
        if (confirm("Are you sure you want to delete this product from your cart?") === true) {
            let storageProducts = JSON.parse(localStorage.getItem('cart'));
            let products = storageProducts.filter(product => product.productId !== productId);
            localStorage.setItem('cart', JSON.stringify(products));
            listCart();
            toast("Success", "Product removed from cart!")
            $(".item-total-quantity").empty().append(products.length)
        }
    }
    function listCart() {
        const cart = JSON.parse(localStorage.getItem("cart"));
        let itemsInside = "";
        let totalFinal = 0;
        if (cart !== null && cart.length !== 0) {
            let newCart = [];
            cart.map(function (item, key) {
                var itemQuantity = {};
                totalFinal += Number(item.price);
                if (!newCart.includes(item.productId)) {
                    for (var i = 0; i < cart.length; i++) {
                        itemQuantity[cart[i].productId] = 1 + (itemQuantity[cart[i].productId] || 0);
                    }
                    let total = (Number(item.price) * itemQuantity[item.productId]).toFixed(2);

                    itemsInside += '<div class="card-body">' +
                        '              <div class="d-flex justify-content-between">' +
                        '                <div class="d-flex flex-row align-items-center">' +
                        '              <div>' +
                        '                  <img src="' + item.image + '" class="img-fluid rounded-3" alt="Shopping item" style="width: 65px;">' +
                        '               </div>' +
                        '               <div class="ms-3">' +
                        '                  <h5>' + item.title + '</h5>' +
                        '               </div>' +
                        '           </div>' +
                        '           <div class="d-flex flex-row align-items-center">' +
                        '               <div style="width: 50px;">' +
                        '                   <p class="fw-normal mb-0">x' + itemQuantity[item.productId] + '</p>' +
                        '               </div>' +
                        '               <div style="width: 80px;text-align: left;">' +
                        '                  <p class="mb-0">$' + item.price + '</p>' +
                        '                </div>';
                    if (itemQuantity[item.productId] > 1) {
                        itemsInside += '               <div style="width: 80px;text-align: left;">' +
                            '                  <p class="mb-0">$' + total + '</p>' +
                            '                </div>';
                    } else {
                        itemsInside += '<div style="width: 80px;">' +
                            '                  <p class="mb-0">&nbsp;</p>' +
                            '           </div>';
                    }
                    itemsInside += '               <div style="width: 25px;">' +
                        '                  <p class="mb-0"><img src="assets/images/cancel.svg" data-id="' + item.productId + '" class="remove-item"  alt="Remove Item"/> </p>' +
                        '                </div>';
                    itemsInside +=
                        '               </div>' +
                        '           </div>' +
                        '            </div>'
                }
                newCart.push(item.productId);

            })
            $(".total-price").empty().append("$" + totalFinal.toFixed(2)).show();
            $(".total-items").show();
            $(".shopping-list").empty().html(itemsInside)
        } else {
            $(".total-price").empty().hide();
            $(".total-items").hide();
            $(".shopping-list").empty().html("<b>You have no products in your cart</b>")
        }

    }


    function addToFavorites(id, title, image) {
        let favorites = [];
        if (localStorage.getItem('favorites')) {
            favorites = JSON.parse(localStorage.getItem('favorites'));
        }
        if (favorites.length > 0) {
            let insideArray = [];
            favorites.map(function (item) {
                if (item.productId !== id) {
                    insideArray.push(item.productId);
                }
            })
            if (insideArray.includes(id)) {
                console.log("var");
                toast("Error", "You already have this product in your favorites list!")
            } else {
                console.log("ypok");
                favorites.push({'productId': id, 'title': title, 'image': image});
                localStorage.setItem('favorites', JSON.stringify(favorites));
                toast("Success", "Product added to favorites!")
            }
        } else {
            favorites.push({'productId': id, 'title': title, 'image': image});
            localStorage.setItem('favorites', JSON.stringify(favorites));
            toast("Success", "Product added to favorites!")
        }


    }
    function removeFavorite(productId) {
        if (confirm("Are you sure you want to delete this product from your favorite item?") === true) {
            let storageProducts = JSON.parse(localStorage.getItem('favorites'));
            let products = storageProducts.filter(product => product.productId !== productId);
            localStorage.setItem('favorites', JSON.stringify(products));
            listFavorites();
            toast("Success", "Product removed from your favorites list!")
        }
    }
    function listFavorites(){
        var data = JSON.parse(localStorage.getItem("favorites"));
        // You can add background to cards
        // var randomColor = 'background: #'+Math.floor(Math.random() * 16777215).toString(16);
        let products = "";
        if (data !== null && data.length > 0) {
            data.map(function (value, key) {
                let gId = value.productId,
                    image = value.image,
                    title = value.title;
                if (title.length > 25) {
                    title = title.slice(0, 22) + "...";
                }
                products += '<div class="card product">' +
                    '                <div class="row g-0">' +
                    '                    <div class="col-md-4 product-image">' +
                    '                        <img src="' + image + '" class="img-fluid rounded-start lazy" alt="' + title + '"/>' +
                    '                    </div>' +
                    '                    <div class="col-md-8">' +
                    '                        <div class="card-body">' +
                    '                           <h4 class="card-title">' + title + ' <span class="add-to-favorites" data-product-id="' + gId + '" data-name="' + value.external + '" data-image="' + image + '"><img src="assets/images/heart.svg" alt="Add to favorites"></span></h4>' +
                    '                           <span class="w-100 remove-favorite" data-product-id="'+gId+'">Remove</span>' +
                    '                        </div>' +
                    '                    </div>' +
                    '                </div>' +
                    '            </div>';
            })
            $(".favorites-list").empty().append(products);
            $('#favoriteModal').modal('show')
        } else {
            window.location.reload();
            toast("Error!", "Please add a product to your favorites!")
        }
    }


    getStores();
    getProduct(dataOption.title, dataOption.limit, dataOption.page);
    $(document).on("click", ".add-to-favorites", function () {
        const pID = $(this).attr("data-product-id");
        const name = $(this).attr("data-name");
        const image = $(this).attr("data-image");
        $(this).removeClass("add-to-favorites").addClass("favorited").empty().html('Added to favorites<img src="assets/images/heart.svg" alt="Add to favorites"/>');
        addToFavorites(pID, name, image);

        setTimeout(function () {
            // $('#gameModal').modal('show')
        }, 500)
    });
    $(document).on("click", ".quick-view", function () {
        const pID = $(this).attr("data-product-id");
        const pName = $(this).attr("data-title");
        getSingle(pID);
        setTimeout(function () {
            $('#gameModal').modal('show')
        }, 500);
        productClick({
            id: pID,
            name: pName,
        })
    });
    $(document).on("click", ".shopping-cart", function () {
        listCart();
        setTimeout(function () {
            $('#cartModal').modal('show')
        }, 500)

    });
    $(document).on("click", ".remove-item", function () {
        const id = $(this).attr("data-id");
        removeProduct(id);
    });
    $(document).on("click", ".add-soft", function () {
        const id = $(this).attr("data-id");
        const thumb = $(this).attr("data-image-src");
        const title = $(this).attr("data-name");
        const price = $(this).attr("data-price");
        addToCart(id, title, thumb, price);

    });
    $(".btn-continue").click(function () {
        $('#cartModal').modal('hide')
    })
    $(".close-game-modal").click(function () {
        $('#gameModal').modal('hide')
    })
    $(".close-favorite-modal").click(function () {
        $('#gameModal').modal('hide')
    })

    $(document).on("click",".remove-favorite",function () {
        removeFavorite($(this).attr("data-product-id"));
    });
    $(document).on("click",".my-favorites,.favorited",function () {
        listFavorites();
    })

    $(window).scroll(function () {
        if ((window.innerHeight + window.scrollY) >= document.body.scrollHeight) {
            dataOption.page++;
            console.log("Next page" + dataOption.page)
            getProduct("batman", 10, dataOption.page)
        }
    });
    /**
     * Call this function when a user clicks on a product link. This function uses the event
     * callback datalayer variable to handle navigation after the ecommerce data has been sent
     * to Google Analytics.
     * @param {Object} productObj An object representing a product.
     */
    function productClick(productObj) {
        console.log("-> productClick");
        dataLayer.push({ ecommerce: null });  // Clear the previous ecommerce object.
        dataLayer.push({
            'ecommerce': {
                'detail': {
                    'actionField': {'list': 'Apparel Gallery'},    // 'detail' actions have an optional list property.
                    'products': [{
                        'name': productObj.id,
                        'title': productObj.title
                    }]
                }
            }
        });
    }

    function addItemGoogle(productObj){
        dataLayer.push({ ecommerce: null });
        dataLayer.push({
            'event': 'addToCart',
            'ecommerce': {
                'currencyCode': 'USD',
                'add': {                                // 'add' actionFieldObject measures.
                    'products': [{                        //  adding a product to a shopping cart.
                        'name': productObj.title,
                        'id': productObj.id,
                        'price': productObj.price,
                        'quantity': 1
                    }]
                }
            }
        });
    }

});
