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
    for (i = 1; i < rowLength-1; i++){
      	//gets cells of current row  
       	let salecell = saletable.rows.item(i).cells;
       	let product_name = salecell.item(1).innerHTML;
       	let quantity = salecell.item(2).innerHTML;
       	list = {product_name:product_name,quantity:quantity};
       	product_list.push(list);
    }
       let url = 'https://store-manager-api-db.herokuapp.com/api/v2/sales';
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
			checkconnection(response);
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
	fetch(`https://store-manager-api-db.herokuapp.com/api/v2/sales`,{
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
	  	localStorage.setItem('numberofsales',data["All sales"].length);
	  	data["All sales"].reverse().forEach(function(sale){
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
 /*DELETE A SALE*/
 function deletesale(id_no){
 	documentonload();
 	adminload();
	let url = 'https://store-manager-api-db.herokuapp.com/api/v2/sales/'.concat(id_no) ;
	let del = confirm("Delete Sale record!");
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
		if (response["message"]!="Sales deleted successfully"){
			return alert(response["message"]);
		}else{
			alert(response["message"]);
			let url= "sales.html"; 
    		window.location = url;
		}
	})
	.catch(error => console.error('Error:', error));
}