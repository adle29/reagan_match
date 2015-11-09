module.exports = function(mongoose) {

	var VINbookSchema = new mongoose.Schema({
	    title: { type: String, default: 'empty todo...' },
	    subject: { type: String, default: 'empty todo...' },
	    description: { type: String  }, 
	    date: {
	    	creation: { type: Date },
	    	lastUpdate: { type: Date }
		}
 	});

 	var VINBook = mongoose.model('VINBook', VINbookSchema);

 	var saveBookCallback = function(err) {
	    if (err) {
	      return console.log(err);
	    };
	    return console.log('VINbook created');
  	};

  	var trial = function (){
  		//console.log('trial');
  	};


 	var saveBook = function(title, subject, description, creation, lastUpdate) {

	    var vinBook = new VINBook({
	      title: title,
	      subject: subject,
	      description: description,
	      date: {
	      	creation: creation,
	      	lastUpdate: lastUpdate
	      }
	    });

	    vinBook.save(saveBookCallback);
	    console.log(title + ' ' + subject);

    };

 	return {
 		saveBook: saveBook,
 		trial: trial, 
 		VINBook: VINBook
 	}

}

