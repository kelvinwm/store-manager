/*check if user is logged in*/
function documentonload(){
	let mytoken = localStorage.getItem('mytoken')
	if (mytoken===null){
		let url= "index.html"; 
    	window.location = url;
	}
	let myemail = localStorage.getItem('myemail');
	document.getElementById('myemail').innerHTML = myemail;
	
}
function checkitemsincart(){
	let cart_item ;
	let mytct = localStorage.getItem('mycart');
	if(mytct===null){
		cart_item =[];
	}else{
		cart_item = JSON.parse(mytct);
	}
	let x = cart_item.length;
	if(x>0){
		document.getElementById('itemincart').innerHTML = x;
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
	fetch(`https://store-manager-api-db.herokuapp.com/api/v2/users`,{
		headers:{
	    'Content-Type': 'application/json',
	    'access-token': mytoken
	  }
	})
	  .then((res)=> res.json())
	  .then((data) => {
	  	checkconnection(data);
	  	localStorage.setItem('numberofusers',data["All products"].length);
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
	let url = 'https://store-manager-api-db.herokuapp.com/api/v2/auth/logout';
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
			let del = confirm("Delete cart product!");
		    if (del == false) {
		        return;
		    }
	    	let carttable= document.getElementById("carttable");
	    	var rowLength = document.getElementById("carttable").rows.length;
	    	
	    	for (i = 0; i < rowLength-1; i++){
		      	//gets cells of current row  
		       	let salecell = carttable.rows.item(i).cells;
		       	let product_name = salecell.item(0).innerHTML;
		       	if(product_name==product.item_id){
		       		    itemlist.splice(i-1, 1);
		       		    let cost = 0;
		       		    document.getElementById("carttable").deleteRow(i);
			    		itemlist.forEach(function(product) { 
			    		cost+=product.unit_cost*product.prod_quantity;
			    	});
			    		document.getElementById("carttable").deleteRow(-1);
			    		totalcrtprice(cost);
			    }
		    }
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
/*search functionality*/
function searchitem(tablename) {
  var input, filter, table, tr, td, i;
  input = document.getElementById("searchpd");
  filter = input.value.toUpperCase();
  table = document.getElementById(tablename);
  tr = table.getElementsByTagName("tr");
  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[1];
    if (td) {
      if (td.innerHTML.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    }       
  }
}