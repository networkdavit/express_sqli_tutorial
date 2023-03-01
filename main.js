const express = require('express')
const sqlite3 = require('sqlite3').verbose();
// const bodyparser = require('body-parser')
// const jsonparser = bodyparser.json()
const app = express()
// const crypto = require('crypto');
const port = 3000
app.use(express.json())

let db = new sqlite3.Database('main.db')
db.run("CREATE TABLE IF NOT EXISTS users(id INTEGER PRIMARY KEY, username TEXT, password TEXT)")


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.post('/register', (req,res) =>{
	const username = req.body.username
	const password = req.body.password
	// const hashed_password = crypto.createHash('sha256').update(password).digest('hex');
	let sql = "INSERT INTO users (username, password) VALUES (?, ?)"
	  db.run(sql, username,password, function(err){
	        if(err){
	            res.status(403).send(JSON.stringify({status: "Error Reigstering"}))
	        }
	        res.send(JSON.stringify({status: "User Created"}))
	    })  

})

app.post('/login', (req,res) =>{
	const username = req.body.username
	const password = req.body.password
	// const hashed_password = crypto.createHash('sha256').update(password).digest('hex');

	let sql = "SELECT * FROM users WHERE username = '"+ username +"' AND password = '"+ password +"'"
	console.log(sql)
	  db.get(sql, function(err, row){
	        if(err || row == undefined){
	            res.status(401).send(JSON.stringify({status: "Wrong credentials"}))
	        }else{
		        res.send(JSON.stringify({status: `Logged in as ${row.username}`}))
	        }
	    })  
})

app.post('/update', (req,res) =>{
	const username = req.body.username
	const password = req.body.password
	// const hashed_password = crypto.createHash('sha256').update(password).digest('hex');

	let sql = "UPDATE users SET password = '"+ password +"' where username = '"+ username +"'"
	console.log(sql)
	  db.run(sql, function(err, row){
	  	console.log(sql)
	        if(err){
	            res.send(JSON.stringify({status: "Wrong credentials"}))
	        }else{
		        res.send(JSON.stringify({status: "Updated"}))
	        }
	    })  
})





//solutions


// wildcard
// app.post('/login', (req,res) =>{
// 	const username = req.body.username
// 	const password = req.body.password
// 	// const hashed_password = crypto.createHash('sha256').update(password).digest('hex');
// 	let sql = "SELECT * FROM users WHERE username = ? AND password = ?"
// 	console.log(sql)
// 	  db.get(sql,[username,password], function(err, row){
// 	        if(err || row == undefined){
// 	            res.status(401).send(JSON.stringify({status: "Wrong credentials"}))
// 	        }else{
// 		        res.send(JSON.stringify({status: "Logged in"}))
// 	        }
// 	    })  

// })

// blacklist
// const black_list = ["'", '"', "OR", "or", "AND", "and", "-", "--", "---"]
// app.post('/login', (req,res) =>{
// 	const username = req.body.username
// 	const password = req.body.password
// 	// const hashed_password = crypto.createHash('sha256').update(password).digest('hex');
// 	let isVulnerable = false;
// 	black_list.forEach(function(item, index){
// 		if(username.includes(item)){
// 			isVulnerable = true
// 		}
//  	})
//  	if(isVulnerable){
// 		res.send(JSON.stringify({status: "Wrong credentials"}))
//  	}else{
// 		let sql = "SELECT * FROM users WHERE username = '"+ username +"' AND password = '"+ password +"'"
// 		console.log(sql)
// 		db.get(sql, function(err, row){
// 		if(err || row == undefined){
// 			res.status(401).send(JSON.stringify({status: "Wrong credentials"}))
// 		}else{
// 			res.send(JSON.stringify({status: "Logged in"}))
// 		}
// 		})
//  	}

// })



//allowlist
// app.post('/login', (req,res) =>{
// 	const username = req.body.username
// 	const password = req.body.password
// 	if(username.match(/^([a-z]|[A-Z]|[0-9\_@]){4,24}$/)){
// 		let sql = "SELECT * FROM users WHERE username = '"+ username +"' AND password = '"+ password +"'"
// 		console.log(sql)
// 		db.get(sql, function(err, row){
// 		if(err || row == undefined){
// 		    res.send(JSON.stringify({status: "Wrong credentials"}))
// 		}
// 		else{
// 		    res.send(JSON.stringify({status: "Logged in"}))
// 		}
// 		}
// 	)
// 	}
// 	else{
// 		res.send(JSON.stringify({status: "Wrong credentials"}))
// 	}
// })








//sqli payloads
// Login without password via comment in SQL
// {
//     "username": "admin'; --", 
//     "password": "123"
// }

// Login without password via OR in SQL
// {
//     "username": "admin';OR '1' = '1'", 
//     "password": "asdf"
// }

// Login without username and password via OR and COMMENT
// {
// 	"username": "a' OR '1' = '1';--",
// 	"password": "123"
// }

// Update all user passwords
// {
// 	"username": "a",
// 	"password": "123';--"
// }

//js explanation
// let username = "admin"
// let password = "password123"
// console.log(username == "admin" || '1' == '1'/* && password == "passworda123" */)





app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})