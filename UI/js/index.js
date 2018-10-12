
function homepage() {

	if (document.getElementById("category").value=='Attendant'){
		window.location="home.html";
	}
	else if(document.getElementById("category").value=='Admin'){
		window.location="manage.html";
	}
	else if(document.getElementById("category").value=='choose'){
		alert("Please choose a role");

	}
}