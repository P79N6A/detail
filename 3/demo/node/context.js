var pet = {
	words: '...',
	speak: function() {
		console.log(this.words)
		console.log(this === pet)
	}
}
pet.speak();

function Pet (words) {
	this.words = words
	this.speak = function () {
		console.log(this.words)
	}
}

var cat = new Pet('miao')