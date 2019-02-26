var express = require('express');
var router = express.Router();

const MongoClient = require('mongodb').MongoClient;
var objectId = require('mongodb').ObjectID;
const assert = require('assert');

// Connection URL
const url = 'mongodb://localhost:27017';

// Database Name
const dbName = 'vvl';

// Test connect
MongoClient.connect(url, function(err, client) {
	assert.equal(null, err);
	console.log("Connected successfully to server");
	const db = client.db(dbName);
	client.close();
});

var dongho = function () {
	var t = new Date();
	var ngay = t.getDate();
	var thang = t.getMonth()+1;
	var nam = t.getFullYear();
	var gio = t.getHours();
	var phut = t.getMinutes();
	var giay = t.getSeconds();
	var thoigian = gio + ' : ' + phut + ' : ' + giay + ' - ' + ngay +' / ' + thang +' / ' + nam;
	return thoigian
	setTimeout('dongho()', 1000);
}

/* GET home page. */
router.get('/', function(req, res, next) {
	// assert.equal(1,2);
	res.render('index');
});
router.get('/chi-tiet/:id', function(req, res, next) {
	var id = objectId(req.params.id);
	// res.send(id);
	const findDocuments = function(db, callback) {
	  	// Get the documents collection
	  	const collection = db.collection('post');
	  	// Find some documents
	  	collection.find({_id:id}).toArray(function(err, docs) {
		  	assert.equal(err, null);
		  	// console.log(docs);
		  	callback(docs);
	  	});
	}
	MongoClient.connect(url, function(err, client) {
 		assert.equal(null, err);
 		const db = client.db(dbName);
 		findDocuments(db, function(data) {
 			res.render('post',{data:data[0]});
 			// console.log(data[0]);
 			client.close();
 		});
 	});
});

router.get('/upload', function(req, res, next) {
	res.render('upload');
});
router.post('/upload', function(req, res, next) {
	var data = {
		'username' : req.body.txtFullName,
		'link' : req.body.txtLink,
		'nameVideo' : req.body.txtVideo,
		'email' : req.body.txtEmail,
		'intro' : req.body.txtIntro,
		'status' : true,
		'time' : dongho()
	};
	const insertDocuments = function(db, callback) {
  		// Get the documents collection
  		const collection = db.collection('post');
	 	 // Insert some documents
	 	 collection.insert(data, function(err, result) {
	 	 	assert.equal(err, null);
	 	 	console.log("Inserted Finish");
	 	 	callback(result);
	 	 });
	 	}
	 	MongoClient.connect(url, function(err, client) {
	 		assert.equal(null, err);
	 		const db = client.db(dbName);
	 		insertDocuments(db, function() {
	 			client.close();
	 		});
	 	});
	 	res.redirect('/quan-ly');
	 });

router.get('/trang-chu',function(req,res,next){
	var item_onPerPage = 3;
	var page = parseInt(req.query.page) || 1;
	var start = (page-1)*item_onPerPage;
	function youtube_parser(url){
        var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
        var match = url.match(regExp);
        return (match&&match[7].length==11)? match[7] : false;
    }
	const findDocuments = function(db, callback) {
	  	// Get the documents collection
	  	const collection = db.collection('post');
	  	// Find some documents
	  	collection.find({}).skip(start).limit(item_onPerPage).toArray(function(err, docs) {
	  	assert.equal(err, null);
	  	// console.log(docs);
	  	callback(docs);
	  	});
	}
	MongoClient.connect(url, function(err, client) {
		assert.equal(null, err);
		const db = client.db(dbName);
		findDocuments(db, function(data) {
			var xhtml = '';
			data.forEach(function(item){
				xhtml+= '<h2>';
				xhtml+= '<a href="/chi-tiet/'+item._id+'">'+item.video+'</a>';
				xhtml+= '</h2>';
				xhtml+= '<p class="lead">';
				xhtml+= 'Đăng bởi : <a href="mailto:'+item.email+'" target="_blank">'+item.username+'</a>';
				xhtml+= '</p>';
				xhtml+= '<p><span class="glyphicon glyphicon-time"></span> Đăng bài lúc : '+item.time+'</p>';
				xhtml+= '<hr>';
				xhtml+= '<div class="video-container">';
				xhtml+= '<iframe width="100%" height="400" src="https://www.youtube.com/embed/'+youtube_parser(item.link)+'" frameborder="0" allowfullscreen></iframe>';
				xhtml+= '</div>';
				xhtml+= '<hr>';
				xhtml+= '<p></p>';
				xhtml+= '<a class="btn btn-primary" href="/chi-tiet/'+item._id+'">Xem Chi Tiết <span class="glyphicon glyphicon-chevron-right"></span></a>';

				xhtml+= '<hr>';
			});
			res.send(xhtml);
			client.close();
		});
	});
});

module.exports = router;
