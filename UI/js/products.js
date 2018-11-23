/*PRODUCTS*/
/*Add new product*/
function addproduct(){
	documentonload();
	adminload();
	let product_name=document.getElementById("product_name").value;
	let quantity=document.getElementById("quantity").value;
	let price=document.getElementById("price").value;
	let product_category=document.getElementById("product_category").value;
	let url = 'https://store-manager-api-db.herokuapp.com/api/v2/products';
	let data = {product_name: product_name,
				quantity: quantity,
				price: price,
				category: product_category};
	fetch(url, {
	  method: 'POST',
	  body: JSON.stringify(data),
	  headers:{
	    'Content-Type': 'application/json',
	    'access-token': mytoken
	  }
	}).then(res => res.json())
	.then(response => {
		checkconnection(response);
		console.log(response);
		if (response["message"]!="Product added successfully"){
			return alert(JSON.stringify(response["message"]));
		}else{
			document.getElementById("product_name").value ="";
	    	document.getElementById("quantity").value = "";
	    	document.getElementById("price").value = "";
	    	document.getElementById("product_category").value ="Choose category..";
			return alert(response["message"]);
		}
	})
	.catch(error => console.error('Error:', error));
}
/* get all products*/
function products(){
	documentonload();
	checkitemsincart();
	fetch(`https://store-manager-api-db.herokuapp.com/api/v2/products`,
		{headers:{
	    'Content-Type': 'application/json',
	    'access-token': mytoken
	  }})
	  .then((res)=> res.json())
	  .then((data) => {
	  	checkconnection(data);
	  	localStorage.setItem('numberofproducts',data["All products"].length);
	  	data["All products"].forEach(function(user){
	  		let table = document.getElementById("userstable");
		    let row = table.insertRow();
		    let cell1 = row.insertCell(0);
		    let cell2 = row.insertCell(1);
		    let cell3 = row.insertCell(2);
		    let cell4 = row.insertCell(3);
		    let cell5 = row.insertCell(4);
		    let cell6 = row.insertCell(5);
		    let cell7 = row.insertCell(6);
		    cell1.innerHTML = user.Id;
		    cell2.innerHTML = user.product_name;
		    cell3.innerHTML = user.price;
		    cell4.innerHTML = user.quantity;
		    cell5.innerHTML = user.category;
		    cell6.innerHTML =  `<img style="cursor: pointer;" src="img/troller.png" alt="add to cart">`;
		    cell7.innerHTML = `<img style="cursor: pointer;" src="img/edit.png" alt="edit cart">`;
		    /*edit a products--- load a pop up form with products details*/
		    cell7.onclick = function (event){
		    	let myrole = localStorage.getItem('myrole')
				if (myrole!="true"){
					alert("You cannot modify product. Contact admin");
			    	return ;
				}
		    	loadpopup();
		    	document.getElementById("id_no").value = user.Id;
		    	document.getElementById("product_name").value = user.product_name;
		    	document.getElementById("quantity").value = user.quantity;
		    	document.getElementById("price").value = user.price;
		    	document.getElementById("product_category").value = user.category;
		    }
		     cell6.onclick = function (event){
		     	/*add items to cart---  this loads a pop up cart from with product name and input for quatity*/
		    	popformcart();
		    	document.getElementById("prod_name").value = user.product_name;
		    	localStorage.setItem('unit_cost',user.price);
		    }
	  	});
	  })
	  .catch((err)=> console.log(err))
 }
 /* update product data*/
 function editproduct(){
 	documentonload();
 	adminload();
	let id_no=document.getElementById("id_no").value;
    let quantity = document.getElementById("quantity").value;
	let price = document.getElementById("price").value;
	let category = document.getElementById("product_category").value;
	let url = 'https://store-manager-api-db.herokuapp.com/api/v2/products/'.concat(id_no) ;
	let data = {quantity: quantity,
				price: price,
				category: category};
	fetch(url, {
	  method: 'PUT',
	  body: JSON.stringify(data),
	  headers:{
	    'Content-Type': 'application/json',
	    'access-token': mytoken
	  }
	}).then(res => res.json())
	.then(response => {
		checkconnection(response);
		console.log(response);
		// check on negavite entries and validations
		if (response["message"]!="Updated successfully"){
			return alert(response["message"] || response["Alert"]);
		}else{
			alert(response["message"]);
			let url= "home.html";
			window.location = url;
			return closeform();
		}
	})
	.catch(error => console.error('Error:', error));
}
/*delete a product/category*/
function deleteproduct(theurl, pageurl){
	documentonload();
	adminload();
	let id_no=document.getElementById("id_no").value;
	let url =theurl.concat(id_no) ;
	let del = confirm("Delete!");
    if (del == false) {
        return closeform();
    }
	fetch(url, {
	  method: 'DELETE',
	  body: JSON.stringify(""),
	  headers:{
	    'Content-Type': 'application/json',
	    'access-token': mytoken
	  }
	}).then(res => res.json())
	.then(response => {
		checkconnection(response);
		if (response["message"]=="Product deleted successfully" || response["message"]=="category deleted successfully"){
			alert(response["message"]);
			closeform();
			let url= pageurl; 
    		return window.location = url;
		}else{
			return alert(response["message"]);
		}
	})
	.catch(error => console.error('Error:', error));
}
/*add products to cart*/
function addtocart(){
	documentonload();
	prod_name = document.getElementById("prod_name").value;
	prod_quantity = document.getElementById("prod_quantity").value;
	let unit_cost = localStorage.getItem('unit_cost');
	if(prod_quantity===""){
		return alert("quantity cannot be empty");
	}
	if(prod_quantity<1){
		return alert("quantity cannot be negavite number");
	}
	/*initialize array list for cart products*/
	let cart_item ;
	let mytct = localStorage.getItem('mycart');
	if(mytct===null){
		cart_item =[];
	}else{
		cart_item = JSON.parse(mytct);
	}
	let item_id = cart_item.length+1;
	item = {item_id:item_id,prod_name:prod_name,prod_quantity:prod_quantity, unit_cost:unit_cost};
	cart_item.push(item);
	localStorage.setItem('mycart', JSON.stringify(cart_item));
	let x = cart_item.length;
	document.getElementById('itemincart').innerHTML = x;
	closecart();
}