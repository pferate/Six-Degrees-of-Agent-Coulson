function displayConnection(){
	var resultElement = document.getElementById("searchResult");
	removeChildren(resultElement);
	var connection = calculateConnections();

	if (connection == null){
		addChild(resultElement,"p","Something went wrong, unable to work out the connection");
	} else if (connection.start == connection.end){
		addChild(resultElement,"h3",connection.start);
		addChild(resultElement,"p","is");
		addChild(resultElement,"h3",connection.start);
	} else {
		var heading = connection.start + " and " + connection.end + " are ";
		if (connection.links.length == 1) {
			heading = heading + "1 connection apart";
		} else {
			heading = heading + connection.links.length + " connections apart";
		}
		addChild(resultElement,"h2",heading)
		addChild(resultElement,"h3",connection.start);
		for(var i = 0; i < connection.links.length; i++){
			var link = connection.links[i];
			addChild(resultElement,"p",link.link + " (" + link.media + ")");
			addChild(resultElement,"h3",link.person);
		}
	}
}

function removeChildren(element){
	while (element.firstChild){
		element.removeChild(element.firstChild);
	}
}

function addChild(parent, tag, content){
	var child = document.createElement(tag);
	child.textContent = content;
	parent.appendChild(child);
}

function calculateConnections(){
	var source = getSelectorValue("goFrom");
	var target = getSelectorValue("goTo");
	
	if (source == target){
		return {
			"start":source,
			"end":target,
			"links":[]};
	} 

	var found = new Set();
	found.add(source);
	var routes = new Set();
	routes.add(
	{
		"start":source,
		"end":source,
		"links":[]
	});
	var leaf = source;
	var length;
	//for each length
	for (length = 0; length < connectionGraph.characters.length; length++){
		//for each 'leaf character'
		var newRoutes = new Set();
		var route;
		for (route of routes){
			//for each unfound character they neighbour
			var connections = getConnections(route.end);
			var connection;
			for (connection of connections){
				var neighbour = connection.person;
				if (!found.has(neighbour)){
					//make a new route
					var newRoute = {
						"start":source,
						"end":neighbour,
						"links":route.links.slice()
						};
						newRoute.links.push(connection)
					if (neighbour == target){
						return newRoute;
					}
					newRoutes.add(newRoute);
					found.add(neighbour);
				}
			};
		}; 
		//put in the new longer routes
		routes = newRoutes;
		//early exit if nothing to expand
		if (newRoutes.size == 0){
			return null;
		}
	}
	return null;
};

function getConnections(character) {
	var media = connectionGraph.properties;
	var connections = new Set();

	for (var i = 0; i < media.length; i++) {
		var interactions = media[i].interactions;
		for (var j = 0; j < interactions.length; j++){
			var connection = interactions[j]
			if (connection.p1 == character){
				connections.add({
					"person":connection.p2,
					"link":connection.desc,
					"media":media[i].name});
			} else if (connection.p2 == character){
				connections.add({
					"person":connection.p1,
					"link":connection.desc,
					"media":media[i].name});
			}
		}
	}
	return connections;
};

function getSelectorValue(selectorId){
	var selector = document.getElementById(selectorId);
	var index = selector.selectedIndex;
	return selector.options[index].value;
};


