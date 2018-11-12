/*check if user is logged in*/
function documentonload(){
	let mytoken = localStorage.getItem('mytoken')
	if (mytoken===null){
		let url= "index.html"; 
    	window.location = url;
	}
}
/*check failure to reach server and expired token*/
function checkconnection(response){
	if(response["message"]=="Internal Server Error"){
		alert("Error loading data, check internet connection");
	}else 
	if(response["message"]=="Your time has expired, please login"){
		localStorage.removeItem('mytoken');
		let url= "index.html"; 
    	window.location = url;
    	alert(response["message"]);
	}
}
/*access dashboard from home page*/
function accessdashboard(){
	let myrole = localStorage.getItem('myrole')
	if (myrole=="true"){
		let url= "manage.html"; 
    	return window.location = url;
	}
	alert("You cannot access dashboard. Contact admin");
}
/*check for admin role*/
function adminload(){
	let myrole = localStorage.getItem('myrole')
	if (myrole!="true"){
		let url= "home.html"; 
    	return window.location = url;
	}
}
/*User login function*/
function login(){
	let nemail=document.getElementById("req_email").value;
	let password=document.getElementById("req_password").value;
	let url = 'http://127.0.0.1:5000/api/v2/auth/login';
	let data = {
				email: nemail,
				password: password};
	fetch(url, {
	  method: 'POST',
	  body: JSON.stringify(data),
	  headers:{
	    'Content-Type': 'application/json'
	  }
	}).then(res => res.json())
	.then(response => {
		if (response["Token"]){
			localStorage.setItem('mytoken', response["Token"]);
			localStorage.setItem('myemail', nemail);
			localStorage.setItem('myrole', response["role"]);
			if(response["role"]=='true'){
				let url= "manage.html"; 
    			window.location = url;
			}else{
				let url= "home.html"; 
    			window.location = url;
			}
		}else{
			alert(response["message"]);
		}
	})
	.catch(error => console.error('Error:', error));
}
let mytoken = localStorage.getItem('mytoken');
/* view all user*/
function users(){
	documentonload();
	adminload();
	fetch(`http://127.0.0.1:5000/api/v2/users`,{
		headers:{
	    'Content-Type': 'application/json',
	    'access-token': mytoken
	  }
	})
	  .then((res)=> res.json())
	  .then((data) => {
	  	checkconnection(data);
	  	console.log(data);
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
		    cell2.innerHTML = user.first_name;
		    cell3.innerHTML = user.last_name;
		    cell4.innerHTML = user.email;
		    cell5.innerHTML = user.role;
		    cell6.innerHTML = user.date_created;
		    cell7.innerHTML = `<img style="cursor: pointer;" src="img/edit.png" alt="edit cart">`;
		    cell7.onclick = function (event){
		    	adminload();
		    	loadpopup();
		    	document.getElementById("id_no").value = user.Id;
		    	document.getElementById("first_name").value = user.first_name;
		    	document.getElementById("last-name").value = user.last_name;
		    	document.getElementById("new-email").value = user.email;
		    	document.getElementById("new-category").value = user.role;
		    }
	  	});
	  })
	  .catch((err)=> console.log(err))
 }
 /* form popup to edit user and product info*/
function loadpopup(){
	let updateform = document.getElementById("form-popup");
	updateform.style.display = "block";
	}
/*update user data*/
function edituser(){
	documentonload();
	adminload();
	let id_no=document.getElementById("id_no").value;
	let fname=document.getElementById("first_name").value;
	let lname=document.getElementById("last-name").value;
	let nemail=document.getElementById("new-email").value;
	let nrole=document.getElementById("new-category").value;
	let url = 'http://127.0.0.1:5000/api/v2/users/'.concat(id_no) ;
	let data = {first_name: fname,
				last_name: lname,
				email: nemail,
				role: nrole};
	fetch(url, {
	  method: 'PUT',
	  body: JSON.stringify(data),
	  headers:{
	    'Content-Type': 'application/json',
	    'access-token': mytoken
	  }
	}).then(res => res.json())
	.then(response => {
		console.log(response);
		checkconnection(response);
		if (response["message"]!="Updated successfully"){
			return alert(response["message"] || response["Alert"]);
		}else{
			alert(response["message"]);
			let url= "users.html";
			window.location = url;
			return closeform();
		}
	})
	.catch(error => console.error('Error:', error));
}
function closeform(){
	let updateform = document.getElementById("form-popup");
	updateform.style.display = "none";
}
/* singup new user*/
function addnewuser(){
	documentonload();
	adminload();
	let fname=document.getElementById("first-name").value;
	let lname=document.getElementById("last_name").value;
	let nemail=document.getElementById("user_email").value;
	let password=document.getElementById("user_password").value;
	let c_password=document.getElementById("confirm_password").value;
	if (password!=c_password){
		return  alert("Password mismatch!");
	}
	else{
	let url = 'http://127.0.0.1:5000/api/v2/auth/signup';
	let data = {first_name: fname,
				last_name: lname,
				email: nemail,
				password: password};
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
		if (response["message"]!="User successfully registered"){
			return alert(response["message"]|| response["Error"]);
		}else{
			document.getElementById("first-name").value ="";
	    	document.getElementById("last_name").value = "";
	    	document.getElementById("user_email").value = "";
	    	document.getElementById("user_password").value ="";
	    	document.getElementById("confirm_password").value = "";
			return alert(response["message"]);
		}
	})
	.catch(error => console.error('Error:', error));
  }
}
/*user can log out*/
function logout(){
	documentonload();
	let url = 'http://127.0.0.1:5000/api/v2/auth/logout';
	fetch(url, {
	  method: 'GET',
	  headers:{
	    'Content-Type': 'application/json',
	    'access-token': mytoken
	  }
	}).then(res => res.json())
	.then(response => {
		checkconnection(response);
		console.log(response);
		localStorage.clear();
		let url= "index.html"; 
		window.location = url;
	})
	.catch(error => console.error('Error:', error));
}
/*get all categories*/
function categories(){
	documentonload();
	adminload();
	fetch(`http://127.0.0.1:5000/api/v2/category`,{
		headers:{
	    'Content-Type': 'application/json',
	    'access-token': mytoken
	  }
	})
	  .then((res)=> res.json())
	  .then((data) => {
	  	checkconnection(data);
	  	console.log(data);
	  	data["All categories"].forEach(function(category){
	  		let table = document.getElementById("categories_table");
		    let row = table.insertRow();
		    let cell1 = row.insertCell(0);
		    let cell2 = row.insertCell(1);
		    let cell3 = row.insertCell(2);
		    let cell4 = row.insertCell(3);
		    cell1.innerHTML = category.Id;
		    cell2.innerHTML = category.Category;
		    cell3.innerHTML = category.date;
		    cell4.innerHTML = `<img style="cursor: pointer; width:15%;" src="img/edit.png" alt="edit cart">`;
		    cell4.onclick = function (event){
		    	adminload();
		    	loadpopup();
		    	document.getElementById("id_no").value = category.Id;
		    	document.getElementById("category_name").value = category.Category;
		    }
	  	});
	  })
	  .catch((err)=> console.log(err))
 }
 /*Add category*/
 function addnewcategory(){
	documentonload();
	adminload();
	let newcategory=document.getElementById("newcategory_name").value;
	let url = 'http://127.0.0.1:5000/api/v2/category';
	let data = {category: newcategory};
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
		if (response["message"]!="category added successfully"){
			return alert(response["message"]|| response["Error"]);
		}else{
	    	document.getElementById("newcategory_name").value = "";
	    	closecart();
	    	let url= "categories.html";
			window.location = url;
			return alert(response["message"]);
		}
	})
	.catch(error => console.error('Error:', error));
  }
/*update category*/
function editcategory(){
	documentonload();
	adminload();
	let id_no=document.getElementById("id_no").value;
	let category=document.getElementById("category_name").value;
	let url = 'http://127.0.0.1:5000/api/v2/category/'.concat(id_no) ;
	let data = {category: category};
	fetch(url, {
	  method: 'PUT',
	  body: JSON.stringify(data),
	  headers:{
	    'Content-Type': 'application/json',
	    'access-token': mytoken
	  }
	}).then(res => res.json())
	.then(response => {
		console.log(response);
		checkconnection(response);
		if (response["message"]!="Updated successfully"){
			return alert(response["message"] || response["Alert"]);
		}else{
			alert(response["message"]);
			let url= "categories.html";
			window.location = url;
			return closeform();
		}
	})
	.catch(error => console.error('Error:', error));
}
/*DELETE A CATEGORY*/

/*Add new product*/
function addproduct(){
	documentonload();
	adminload();
	let product_name=document.getElementById("product_name").value;
	let quantity=document.getElementById("quantity").value;
	let price=document.getElementById("price").value;
	let product_category=document.getElementById("product_category").value;
	let url = 'http://127.0.0.1:5000/api/v2/products';
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
	fetch(`http://127.0.0.1:5000/api/v2/products`,
		{headers:{
	    'Content-Type': 'application/json',
	    'access-token': mytoken
	  }})
	  .then((res)=> res.json())
	  .then((data) => {
	  	checkconnection(data);
	  	console.log(data);
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
	let url = 'http://127.0.0.1:5000/api/v2/products/'.concat(id_no) ;
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
	let del = confirm("Delete Product!");
    if (del == false) {
        return;
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
		console.log(response);
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
/*Add to cart*/
function popformcart(){
	let updateform = document.getElementById("form-cart");
	updateform.style.display = "block";
	}
/*close popformcart*/
function closecart(){
	let updateform = document.getElementById("form-cart");
	updateform.style.display = "none";
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
	alert(x);
	closecart();
}
/* view items in the cart*/
function mycartitems(){
	documentonload();
	let mytct = localStorage.getItem('mycart');
	let itemlist = JSON.parse(mytct);
	let total_cost = 0;
	if(itemlist === null){
		let url= "home.html"; 
    	return window.location = url;
	}
	let table = document.getElementById("carttable");
	itemlist.forEach(function(product) { 
	    let row = table.insertRow();
	    let cell1 = row.insertCell(0);
	    let cell2 = row.insertCell(1);
	    let cell3 = row.insertCell(2);
	    let cell4 = row.insertCell(3);
	    let cell5 = row.insertCell(4);
	    let cell6 = row.insertCell(5);
	    cell1.innerHTML = product.item_id;
	    cell2.innerHTML = product.prod_name;
	    cell3.innerHTML = product.prod_quantity;
	    cell4.innerHTML = product.unit_cost;
	    cell5.innerHTML = product.unit_cost*product.prod_quantity;
	    cell6.innerHTML = `<img style="cursor: pointer;" src="img/delete.png" alt="delete cart">`;
	    cell6.onclick = function (event){
	    	itemlist.splice(product.item_id-1, 1);
	    	document.getElementById("carttable").deleteRow(product.item_id);
	    	total_cost = 0;
	    	itemlist.forEach(function(product) { 
	    	total_cost+=product.unit_cost*product.prod_quantity;
	    	});
	    	document.getElementById("carttable").deleteRow(-1);
	    	totalcrtprice(total_cost);
	    }
	    total_cost+=product.unit_cost*product.prod_quantity;
	});
	totalcrtprice(total_cost);	
}
/* this function gives total cost of items in cart*/
function totalcrtprice(total_cost){
	let table = document.getElementById("carttable");
	let row = table.insertRow();
    let cell1 = row.insertCell(0);
    let cell2 = row.insertCell(1);
    let cell3 = row.insertCell(2);
    let cell4 = row.insertCell(3);
    let cell5 = row.insertCell(4);
    let cell6 = row.insertCell(5);
	cell1.innerHTML = "TOTAL COST";
    cell5.innerHTML =total_cost;
}
/*cancel item from cart*/
function cancelcart(){
	localStorage.removeItem('mycart');
	let url= "home.html"; 
    return window.location = url;
}
/*Create a sale*/
function createasales(){
   //gets table
   	documentonload();
	let product_list = [];
    let saletable = document.getElementById('carttable');
    let rowLength = saletable.rows.length;
    if(rowLength<2){
    	alert("No items in the cart");
    	let url= "home.html"; 
    	return window.location = url;
    }  
    for (i = 1; i < rowLength; i++){
      	//gets cells of current row  
       	let salecell = saletable.rows.item(i).cells;
       	let product_name = salecell.item(1).innerHTML;
       	let quantity = salecell.item(2).innerHTML;
       	list = {product_name:product_name,quantity:quantity};
       	product_list.push(list);
    }
       let url = 'http://127.0.0.1:5000/api/v2/sales';
	   let data =  {"products":product_list};
	   fetch(url, {
		  method: 'POST',
		  body: JSON.stringify(data),
		  headers:{
		    'Content-Type': 'application/json',
		    'access-token': mytoken
		  }
	    })
		.then(res => res.json())
		.then(response => {
			console.log(response);
			if (response["message"]!="Sales created successfully"){
				return alert(response["message"]);
			}else{
				localStorage.removeItem('mycart');
				let url= "home.html"; 
				alert("Sales created successfully");
				return window.location = url;
			}
		})
		.catch(error => console.error('Error:', error));
}
/*view all sales*/
function viewsales(){
	documentonload();
	fetch(`http://127.0.0.1:5000/api/v2/sales`,{
		headers:{
	    'Content-Type': 'application/json',
	    'access-token': mytoken
	  }
	})
	  .then((res)=> res.json())
	  .then((data) => {
	  	checkconnection(data);
	  	if (data["message"]=="Nothing has been stored yet"){
	  		return alert("Nothing has been stored yet");
	  	}
	  	console.log(data);
	  	data["All sales"].forEach(function(sale){
	  		let table = document.getElementById("salestable");
		    let row = table.insertRow();
		    let cell1 = row.insertCell(0);
		    let cell2 = row.insertCell(1);
		    let cell3 = row.insertCell(2);
		    let cell4 = row.insertCell(3);
		    let cell5 = row.insertCell(4);
		    let cell6 = row.insertCell(5);
		    let cell7 = row.insertCell(6);
		    cell1.innerHTML = sale.Id;
		    cell2.innerHTML = sale.username;
		    cell3.innerHTML = sale.product_id;
		    cell4.innerHTML = sale.quantity;
		    cell5.innerHTML = sale.price;
		    cell6.innerHTML = sale.date;
		    cell7.innerHTML = `<img style="cursor: pointer; width:20%;" src="img/delete.png" alt="delete cart">`;
		    cell7.onclick = function (event){
		    	let myrole = localStorage.getItem('myrole')
		    	if (myrole!="true"){
					alert("You cannot delete sale record. Contact admin");
			    	return ;
				}
		    	deletesale(sale.Id);
		    }
	  	});
	  })
	  .catch((err)=> console.log(err))
 }
