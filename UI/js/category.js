/*get all categories*/
function categories(){
	documentOnLoad();
	adminLoad();
	fetch(`https://store-manager-api-db.herokuapp.com/api/v2/category`,{
		headers:{
	    'Content-Type': 'application/json',
	    'access-token': mytoken
	  }
	})
	  .then((res)=> res.json())
	  .then((data) => {
	  	checkConnection(data);
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
		    	adminLoad();
		    	loadPopUp();
		    	document.getElementById("id_no").value = category.Id;
		    	document.getElementById("category_name").value = category.Category;
		    }
	  	});
	  })
	  .catch((err)=> console.log(err))
 }
 /*Add category*/
 function addNewCategory(){
	documentOnLoad();
	adminLoad();
	let newcategory=document.getElementById("newcategory_name").value;
	let url = 'https://store-manager-api-db.herokuapp.com/api/v2/category';
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
		checkConnection(response);
		console.log(response);
		if (response["message"]!="category added successfully"){
			return alert(response["message"]|| response["Error"]);
		}else{
	    	document.getElementById("newcategory_name").value = "";
	    	closeCart();
	    	let url= "categories.html";
			window.location = url;
			return alert(response["message"]);
		}
	})
	.catch(error => console.error('Error:', error));
  }
/*update category*/
function editCategory(){
	documentOnLoad();
	adminLoad();
	let id_no=document.getElementById("id_no").value;
	let category=document.getElementById("category_name").value;
	let url = 'https://store-manager-api-db.herokuapp.com/api/v2/category/'.concat(id_no) ;
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
		checkConnection(response);
		if (response["message"]!="Updated successfully"){
			return alert(response["message"] || response["Alert"]);
		}else{
			alert(response["message"]);
			let url= "categories.html";
			window.location = url;
			return closeForm();
		}
	})
	.catch(error => console.error('Error:', error));
}
