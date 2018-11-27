/*Dashboard*/
function dashboardLayout(){
	adminLoad();
	documentOnLoad();
	users();
	viewSales();
	products();
	document.getElementById('activeusers').innerHTML = localStorage.getItem('numberofusers');
	document.getElementById('totalsales').innerHTML = localStorage.getItem('numberofsales');
	document.getElementById('totalnumberofproducts').innerHTML = localStorage.getItem('numberofproducts');
}