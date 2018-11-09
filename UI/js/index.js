function documentonload(){
	let mytoken = localStorage.getItem('mytoken')
	if (mytoken===null){
		let url= "index.html"; 
    	window.location = url;
	}
}
function adminload(){
	let myrole = localStorage.getItem('myrole')
	if (myrole!="true"){
		let url= "index.html"; 
    	window.location = url;
	}
}
function login(){
	let nemail=document.getElementById("req_email").value;
	let password=document.getElementById("req_password").value;
	let url = 'https://store-manager-api-db.herokuapp.com/api/v2/auth/login';
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
			localStorage.setItem('mytoken', response["Token"])
			localStorage.setItem('myrole', response["role"])
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
function users(){
	adminload();
	fetch(`https://store-manager-api-db.herokuapp.com/api/v2/users`)
	  .then((res)=> res.json())
	  .then((data) => {
	  	if (data["message"]=="Internal Server Error"){
	  		alert("Error loading data, check internet connection");
	  	}
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
function loadpopup(){
	let updateform = document.getElementById("form-popup");
	updateform.style.display = "block";
	}
function edituser(){
	let id_no=document.getElementById("id_no").value;
	let fname=document.getElementById("first_name").value;
	let lname=document.getElementById("last-name").value;
	let nemail=document.getElementById("new-email").value;
	let nrole=document.getElementById("new-category").value;
	let url = 'https://store-manager-api-db.herokuapp.com/api/v2/users/'.concat(id_no) ;
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
		if (response["message"]!="Updated successfully"){
			return alert(response["message"]);
		}else{
			alert(response["message"]);
			return closeform();
		}
	})
	.catch(error => console.error('Error:', error));
}
function closeform(){
	let updateform = document.getElementById("form-popup");
	updateform.style.display = "none";
}

function addnewuser(){
	let fname=document.getElementById("first-name").value;
	let lname=document.getElementById("last_name").value;
	let nemail=document.getElementById("user_email").value;
	let password=document.getElementById("user_password").value;
	let c_password=document.getElementById("confirm_password").value;
	if (password!=c_password){
		return  alert("Password mismatch!");
	}
	else{
	let url = 'https://store-manager-api-db.herokuapp.com/api/v2/auth/signup';
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
		console.log(response);
		if (response["message"]!="User successfully registered"){
			return alert(response["message"]);
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

function logout(){
	let url = 'https://store-manager-api-db.herokuapp.com/api/v2/auth/logout';
	fetch(url, {
	  method: 'GET',
	  headers:{
	    'Content-Type': 'application/json',
	    'access-token': mytoken
	  }
	}).then(res => res.json())
	.then(response => {
		console.log(response);
			let url= "index.html"; 
    		window.location = url;
    		localStorage.clear();
	})
	.catch(error => console.error('Error:', error));
}
/*Add new product*/
function addproduct(){
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
		if (response["message"]!="Product added successfully"){
			return alert(response["message"]);
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
function products(){
	fetch(`https://store-manager-api-db.herokuapp.com/api/v2/products`)
	  .then((res)=> res.json())
	  .then((data) => {
	  	if (data["message"]=="Internal Server Error"){
	  		alert("Error loading data, check internet connection");
	  	}
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
		    cell3.innerHTML = user.quantity;
		    cell4.innerHTML = user.price;
		    cell5.innerHTML = user.category;
		    cell6.innerHTML =  `<img style="cursor: pointer;" src="img/troller.png" alt="add to cart">`;
		    cell7.innerHTML = `<img style="cursor: pointer;" src="img/edit.png" alt="edit cart">`;
		    cell6.onclick = function (event){
		    	loadpopup();
		    	document.getElementById("id_no").value = user.Id;
		    	document.getElementById("product_name").value = user.product_name;
		    	document.getElementById("quantity").value = user.quantity;
		    	document.getElementById("price").value = user.price;
		    	document.getElementById("product_category").value = user.category;
		    }
	  	});
	  })
	  .catch((err)=> console.log(err))
 }