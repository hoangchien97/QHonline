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
router.get('/', function(req, res, next) {
	const findDocuments = function(db, callback) {
	  // Get the documents collection
	  const collection = db.collection('post');
	  // Find some documents
	  collection.find({}).toArray(function(err, docs) {
	  	assert.equal(err, null);
	  	console.log(docs)
	  	callback(docs);
	  });
	}
	MongoClient.connect(url, function(err, client) {
		assert.equal(null, err);
		const db = client.db(dbName);
		findDocuments(db, function(data) {
			res.render('manage',{data:data});
			client.close();
		});
	});
});
router.get('/delete/:id',function(req,res,next){
	const removeDocument = function(db, callback) {
		var id = objectId(req.params.id);
	  	const collection = db.collection('post');
	  	// Delete document where a is 3
	  	collection.deleteOne({ _id : id }, function(err, result) {
	  	assert.equal(err, null);
	  	console.log("Removed Finish");
	  	});
	};
	MongoClient.connect(url, function(err, client) {
		assert.equal(null, err);
		const db = client.db(dbName);
		removeDocument(db, function() {
			client.close();
		});
	});
	res.redirect('/quan-ly');
});
router.get('/edit/:id', function(req, res, next) {
	var id = objectId(req.params.id);
	const findDocuments = function(db, callback) {
	  const collection = db.collection('post');
	  collection.find({_id:id}).toArray(function(err, docs) {
	  	assert.equal(err, null);
	  	callback(docs);
	  });
	}
	MongoClient.connect(url, function(err, client) {
		assert.equal(null, err);
		const db = client.db(dbName);
		findDocuments(db, function(data) {
			console.log(data);
			res.render('edit',{data:data[0]}); // data[0] so data return is an array
			client.close();
		});
	});
});
router.post('/edit/:id', function(req, res, next) {
	var id = objectId(req.params.id);
	// var status = (req.body.chkStatus == "checked") ? true : false;
	// req.body.chkStatus = Boolean(req.body.field);
	// console.log(req.body.chkStatus);
	var data = {
		'username' : req.body.txtFullName,
		'link' : req.body.txtLink,
		'video' : req.body.txtVideo,
		'email' : req.body.txtEmail,
		'intro' : req.body.txtIntro,
		// 'status' : true,
	};
	// console.log(data);
	const updateDocument = function(db, callback) {
		const collection = db.collection('post');
		collection.updateOne({_id : id},{$set:data}, function(err, result) {
		    assert.equal(err, null);
		    console.log("Updated Finish");
		    callback(result);
		});
	}
 	MongoClient.connect(url, function(err, client) {
 		assert.equal(null, err);
 		const db = client.db(dbName);
 		updateDocument(db, function() {
 			client.close();
 		});
 	});
 	res.redirect('/quan-ly');
});

module.exports = router;
