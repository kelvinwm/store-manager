/*Dashboard*/
function dashboardlayout(){
	adminload();
	documentonload();
	users();
	viewsales();
	products();
	document.getElementById('activeusers').innerHTML = localStorage.getItem('numberofusers');
	document.getElementById('totalsales').innerHTML = localStorage.getItem('numberofsales');
	document.getElementById('totalnumberofproducts').innerHTML = localStorage.getItem('numberofproducts');
}