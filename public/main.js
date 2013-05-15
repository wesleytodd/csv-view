// Attach listener for when a file is first dragged onto the screen
document.addEventListener('dragenter', function(e) {
	e.stopPropagation();
	e.preventDefault();

	// Show an overlay so it is clear what the user needs to do
	document.body.classList.add('show-overlay');
}, false);

// Attach a listener for while the file is over the browser window
document.addEventListener('dragover', function(e) {
	e.stopPropagation();
	e.preventDefault();
}, false);

// Attach a listener for when the file is actually dropped
document.addEventListener('drop', function(e) {
	e.stopPropagation();
	e.preventDefault();

	// Hides the overlay
	document.body.classList.remove('show-overlay');
	
	// Process the files
	handelFiles(e.dataTransfer.files);
	
}, false);

// This function gets the file data and uploads it to the server
function handelFiles(files) {

	for (var i = 0, l = files.length; i < l; i++) {

		// Check that the files is a CSV
		if (files[i].type == 'text/csv') {

			// Wrap it in a closure so that we maintain correct references to our xhr request
			(function(file) {

				// Setup an xhr and a FormData object
				var xhr = new XMLHttpRequest(),
					fd = new FormData();

				// Listen for the xhr to complete
				xhr.onreadystatechange = function() {
					if (xhr.readyState == 4) {
						// Parse the response and build the table
						buildTable(file, JSON.parse(xhr.responseText));
					}
				};

				// Attach our file to the FormData object
				fd.append('csv', file);
				
				// Open the connection to the server
				xhr.open("POST", "/upload", true);

				// Send our FormData
				xhr.send(fd);

			})(files[i]);

		} else {
			alert('Don\'t give me that dirty file.  It\'s not a CSV!!');
		}

	}

}

// does a lot of ugly javascript to create the dom elements
function buildTable(file, data) {
	var tableContainer = document.createElement('div'),
		header = document.createElement('h2'),
		table = document.createElement('table'),
		head = document.createElement('thead'),
		headrow = document.createElement('tr')
		tbody = document.createElement('tbody')
		dataFirstRow = data.shift();

	for (var h in dataFirstRow) {
		var th = document.createElement('th');
		th.appendChild(document.createTextNode(dataFirstRow[h]));
		head.appendChild(th);
	}

	for (var r in data) {
		var tr = document.createElement('tr');
		var first = true;
		for (var i in data[r]) {
			if (first) {
				var td = document.createElement('th');
				first = false;
			} else {
				var td = document.createElement('td');
			}
			td.appendChild(document.createTextNode(data[r][i]));
			tr.appendChild(td);
		}
		tbody.appendChild(tr);
	}

	head.appendChild(headrow);
	table.appendChild(head);
	table.appendChild(tbody);
	tableContainer.appendChild(table);

	tableContainer.classList.add('table-container');

	header.appendChild(document.createTextNode(file.name));

	var container = document.getElementById('container')
	container.appendChild(header);
	container.appendChild(tableContainer);
}
