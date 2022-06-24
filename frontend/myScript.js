function submit() {
	console.log("test")
	alert("test")
}

function buildTable(data) {
	var table = document.getElementById('myTable')
	table.innerHTML = ""
	for (var i = 0; i < data.length; i++){
		var row = `<tr>
						<td>${data[i].stockno}</td>
						<td>${data[i].stockname}</td>
						<td>${data[i].price}</td>
						<td>${data[i].date.substring(0, 10)}</td>
				  </tr>`
		table.innerHTML += row
	}
}

document.getElementById("submitButton").addEventListener("click", () => {
	var inputBox = document.getElementById("inputBox");
	console.log(inputBox.value)
	fetch(`http://localhost:3001/query/${inputBox.value}`)
	.then((res) => {
		var obj = res.json()
		return obj
	})
	.then((res) => {
		// console.log(res)
		buildTable(res)
		var tot = (1 + res.length) * res.length / 2;
		var r = 0;
		for(var i = 0; i < res.length; i ++) {
			r += (i + 1) / tot * res[i].price;
		}
		document.getElementById("predicted").innerHTML = r.toString()
	})
	.catch((err) => {
		alert('StockNo does not exist')
		console.log(err)
	})
})