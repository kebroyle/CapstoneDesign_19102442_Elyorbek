if(process.env.NODE_ENV != 'production'){
    require('dotenv').config()
}

const stripeSecretKey = process.env.STRIPE_SECRET_KEY
const stripePublicKey = process.env.STRIPE_PUBLIC_KEY
console.log(stripeSecretKey, stripePublicKey)
var fs = require('fs');
var path = require('path');
var session = require('express-session');
var bodyParser = require('body-parser');
const {createPool} = require('mysql')
const express = require('express');
const fileUpload = require('express-fileupload')
const { forEach } = require('async');
var bcrypt = require('bcrypt')

const app = express()

app.use(express.json())
app.use(fileUpload())
app.use(express.urlencoded({extended:true}))
app.set('view engine', 'ejs')
app.use(express.static('public'))
const stripe = require('stripe')(stripeSecretKey)








const connection = createPool({
    host: "localhost",
    user: "root",
    password: "root123",
    connectionLimit:10,
    database: 'testdb'
})
//app.use(bodyParser.urlencoded({extended : true}));
connection.query('SELECT * from testdb.tableusers', (err, res)=>{
    if(err){
        console.log("error")
        console.log(err)
    }
    console.log("Database is connected")
})


const users =[]
const loginusers =[]

var handle;



app.get('/homeonline', (req, res)=>{
    const q = `SELECT * FROM testdb.products_table`
                connection.query(q, function(error, data){
                    if(error){
                        console.log(error)
                    }
                    else{
                        
                        let fetched_datas  = data
                        let items=[];
                        let hamburgerArray=[]
                        function myfunction (array){
                            let meals=[];
                            let drinks =[]

                            for(i=0; i<array.length;i++){
                                if(array[i].product_section==='Meals'){
                                    meals.push(array[i])
                                }else{
                                    drinks.push(array[i])
                                }
                            }
                            let items={}
                            items.meals=meals;
                            items.drinks =drinks;
                            return items
                        }
                        items = myfunction(fetched_datas)
                        res.render('homtest.ejs',{
                            stripePublicKey: stripePublicKey,
                            items: items
                        })
                    }
                    
                })
})

app.get('/admin', function(req, res){
    res.render('adminlogin')
   
})

app.post('/adminpage', (req, res)=>{

    
    var username = req.body.username;
    var userpassword = req.body.userpassword;
    if (username && userpassword) {
		connection.query('SELECT * FROM testdb.admin WHERE admin_name = ? AND admin_password = ?', [username, userpassword], function(error, results, fields) {
			if (error) throw error;
			if (results.length > 0) {
				const q = `SELECT * FROM testdb.products_table`
                res.render('admin')
			} else {
				//response.send('Incorrect Username and/or Password!');
				res.send("Login Denied Wrong Paramaters ")
			}			
		});
	} else {
		res.send('Please enter Username and Password!');
		res.end();
	}

})

app.get('/userregister',(req, res)=>{
    res.render('userregister')
})





app.post('/admin/products', (req, res)=>{
    let sampleFile;
    let uploadPath;
    if(!req.files || Object.keys(req.files).length === 0){
        return res.status(400).send("No files are uploadded")
    }

    sampleFile = req.files.sampleFile;
    console.log(sampleFile)
    uploadPath = path.join(__dirname + '/public/' + sampleFile.name);
    console.log(uploadPath)
     sampleFile.mv(uploadPath, function(err){
         if(err) return res.status(500).send(err);
         res.send("The File is Uploaded")
     })
     const image_name = sampleFile.name;
     console.log(image_name)
     const image_price = '10$'

     connection.query('INSERT INTO testdb.products(product_name, product_image) VALUES(?,?)', [image_name, image_price],
     function(error, data){
        if(error){
            console.log(error)
        } else console.log(data)

     })

})

app.get('/get-all-products', (req, res)=>{
    connection.query('SELECT * FROM testdb.products_table', 
    function(error, data){
        if(error){
            res.send(error);
        }
        else{
            res.send(data)
        }
    })
});


app.get('/allproducts', (req, res)=>{
    connection.query('SELECT * FROM testdb.products_table', 
    function(error, data){
        if(error){
            res.send(error);
        }
        else{
            res.render('allproducts.ejs', {
                items: data
            })
        }
    })
})


app.get('/customers', (req, res)=>{
    connection.query('SELECT * FROM testdb.user_table', 
    function(error, data){
        if(error){
            res.send(error);
        }
        else{
            res.render('allcustomers.ejs', {
                customers: data
            })
        }
    })
})


app.post('/post-products', (req, res)=>{
    let sampleFile;
    let uploadPath;
    if(!req.files || Object.keys(req.files).length ===0){
        return res.status(400).send("No files are uploaded")
    }
    sampleFile = req.files.sampleFile;
    console.log(sampleFile)
    uploadPath = path.join(__dirname + '/public/' + sampleFile.name);
    console.log(uploadPath)
     sampleFile.mv(uploadPath, function(err){
         if(err) return res.status(500).send(err);
         console.log("file is uploaded")
     })
     const imageName = sampleFile.name
     const productName = req.body.product_name
     const productPrice = req.body.product_price
     const productSection = req.body.product_section
     const productCategory = req.body.product_category
     const productCompany = req.body.product_company
     const productDescription = req.body.product_description
     connection.query('INSERT INTO testdb.products_table(product_image,product_name, product_price,product_section,product_category,product_company,product_description) VALUES(?,?,?,?,?,?,?)', [imageName, productName, productPrice,productSection,productCategory,productCompany,productDescription],
     function(error, data){
        if(error){
            console.log(error)
        } else console.log(data)
     })
     const q = `SELECT * FROM testdb.products_table`
     connection.query(q, function(error, data){
         if(error){
             console.log(error)
         }
         else{
             res.redirect("allproducts")
         }
     })
     

})

app.get("/create-product", (req, res)=>{
    res.render('createpr')
})

app.get("/delete-product", (req, res)=>{
    res.render('deletepr.ejs')
})

app.post('/delete-product', (req, res)=>{
    const product_id = req.body.product_id;
    connection.query(`DELETE FROM testdb.products_table WHERE product_id = ${product_id};`, (err, results)=>{
        if(err){
            console.log(err)
        }
        else{
            console.log(results);
            res.redirect('/allproducts')
        }
    })
});

app.get('/update-product', (req, res)=>{
    res.render('productupdate.ejs')
})

app.post('/update-products', (req, res)=>{
    let sampleFile;
    let uploadPath;
    if(!req.files || Object.keys(req.files).length ===0){
        return res.status(400).send("No files are uploaded")
    }
    sampleFile = req.files.sampleFile;
    console.log(sampleFile)
    uploadPath = path.join(__dirname + '/public/' + sampleFile.name);
    console.log(uploadPath)
     sampleFile.mv(uploadPath, function(err){
         if(err) return res.status(500).send(err);
         console.log("file is uploaded")
     })
     const productId = req.body.product_id
     const imageName = sampleFile.name
     const productName = req.body.product_name
     const productPrice = req.body.product_price
     const productSection = req.body.product_section
     const productCategory = req.body.product_category
     const productCompany = req.body.product_company
     const productDescription = req.body.product_description

     
    const sql = 'UPDATE testdb.products_table SET product_name=?, product_price=?, product_image=?, product_section=?, product_category=?, product_company=?, product_description=? WHERE product_id=?';
    connection.query(sql, [productName, productPrice, imageName, productSection, productCategory, productCompany, productDescription, productId], (error, results) => {
        if (error) {
            console.error('Error updating product information:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            console.log('Product information updated successfully');
            res.redirect('/allproducts')
        }
    });

})






const purchasedItems = []


app.get('/items', (req, res)=>{
    const q = `SELECT * FROM testdb.products_table`
    connection.query(q, function(error, data){
        if(error){
            res.status(500).end()
        } else{
            let fetched_data = data
            function myfunction (array){
                let meals=[];
                let drinks =[]

                for(i=0; i<array.length;i++){
                    if(array[i].product_section==='Meals'){
                        meals.push(array[i])
                    }else{
                        drinks.push(array[i])
                    }
                }
                let items={}
                items.drinks=meals;
                items.meals =drinks;
                return items
            }
            let items ={}
            items = myfunction(fetched_data)
            console.log(items)
            res.send(items)
        }
    })
})

app.post('/purchase', function(req, res){
    const q = `SELECT * FROM testdb.products_table`
    
    connection.query(q, function(error, data){
        if(error){
            res.status(500).end()
        } else{
            let fetched_data = data
            function myfunction (array){
                let meals=[];
                let drinks=[]

                for(i=0; i<array.length;i++){
                    if(array[i].product_section==='Meals'){
                        meals.push(array[i])
                    }else{
                        drinks.push(array[i])
                    }
                }
                let items={}
                items.meals=meals;
                items.drinks =drinks;
                return items
            }
            let items ={}
            items = myfunction(fetched_data)
            const itemsJson = items
            const itemsArray = itemsJson.meals.concat(itemsJson.drinks)
            let total = 0
            //array of purchsed products in object type
            const purchaseditems = JSON.stringify(req.body.items)
            let orderedProducts=[];

            //get the email of the user purchasing products
            let fetch_email = req.body.stripeTokenEmail;
            let newcustomer={id:10, name:"name1"};
            let customer={};


            req.body.items.forEach(function(item){
                const itemJson = itemsArray.find(function(i){
                    return i.product_id == item.id

                })
                connection.query('SELECT * FROM testdb.user_table WHERE user_email = ?', [fetch_email], function(error, results, fields){
                    function myfunctionCustomer (array, newcustomer){
                        let userId=[];
                        let userEmail=[];
                        let userGender=[];
                        let customer_in ={};
                    
                        for(i=0; i<array.length;i++){
                            userId=array[i].user_id;
                            userEmail = array[i].user_email
                            userGender=array[i].user_gender
                        }
                        customer_in.id=userId
                        customer_in.email=userEmail
                        customer_in.gender=userGender
                        return customer_in
                        }
    
                        customer = myfunctionCustomer(results, newcustomer)
                       
                        console.log(customer)
                        console.log(itemJson)
                        console.log(customer.gender)
                        console.log(item.quantity)
                        console.log(typeof(item.quantity))
                        

                        const orderData = {
                            customer_id: customer.id,
                            customer_email: customer.email,
                            customer_gender: customer.gender,
                            product_id: itemJson.product_id,
                            product_name: itemJson.product_name,
                            product_quantity: item.quantity,
                            product_price: itemJson.product_price,
                            product_category: itemJson.product_category
                        };

                        // SQL query to insert data into the "orders" table
                        const query = 'INSERT INTO testdb.orders SET ?';

                        // Execute the query
                        connection.query(query, orderData, (error, results, fields) => {
                            if (error) {
                            console.error('Error inserting data:', error);
                            return;
                            }
                            console.log('Data inserted successfully');
                            
                        });
                        


                })

                orderedProducts.push(itemJson)

                total = total + parseInt(itemJson.product_price) * item.quantity
            })

            console.log(orderedProducts)
           



            stripe.charges.create({
                amount: total,
                source: req.body.stripeTokenId,
                currency:'usd'
            }).then(function(){
                console.log("Charge Succesfull")
                console.log("this is just purchasesd items:" + purchaseditems)
                purchasedItems.push(purchaseditems)
                console.log("Theese are all purchased items since:" + purchasedItems)
                res.json({ message: 'Successfuly purchased items'})
            }).catch(function(){
                console.log(error)
                console.log('Charge Fail')
                res.status(500).end()
            })
        }
    })

    
})

app.get('/orders', (req, res)=>{
    connection.query('SELECT * FROM testdb.orders', 
    function(error, data){
        if(error){
            res.send(error);
        }
        else{
            res.render('orders_table', {
                orders: data
            })
        }
    })
})

app.get('/myorders', (req, res)=>{
    connection.query('SELECT * FROM testdb.user_table WHERE user_name = ?', [handle], function(error, results, fields){
        if(error){
            console.log(error)
        }else{
            var my_user={};
            // results.filter(result=> result.user_name === handle)
            for(i=0;i<results.length; i++){
                if(results[i].user_name==handle){
                    my_user=results[i].user_email
                }
            }
            connection.query('SELECT * FROM testdb.orders WHERE customer_email = ?', [my_user], function(error, results, fields){
                
                res.render('myorders', {
                    orders: results
                })
            })
            
        }
    })
})


app.get('/login', (req, res)=>{
    res.sendFile(path.join(__dirname + '/public/login.html'))
})

app.get('/onlinestore', (req, res)=>{
    res.sendFile(path.join(__dirname + '/public/login.html'))
});

app.post('/homepage', (req, res)=>{
    handle= req.body.username;
    console.log("inforomation for handle", typeof(handle))
    console.log(handle)
    var username = req.body.username;
    var userpassword = req.body.userpassword;
    let database_password;
    if(username && userpassword){
        connection.query('SELECT * FROM testdb.user_table WHERE user_name = ?', [username], function(error, results, fields){
            if(error) throw error;
            if(results.length >0){
                function myfunction (array){
                    let password;
                
                    for(i=0; i<array.length;i++){
                        password = array[i].user_password
                    }
                    let database={}
                    database.password=password;
                    console.log(typeof(database.password))
                    return database;
                    }
                    datas = myfunction(results)
                console.log(datas.password)
                database_password = datas.password.toString();
                console.log(typeof(database_password))
                console.log(typeof(req.body.userpassword))
                try {
                    if(bcrypt.compare(req.body.userpassword, datas.password)) {
                        const q = `SELECT * FROM testdb.products_table`
                        connection.query(q, function(error, data){
                            if(error){
                                console.log(error)
                            }
                            else{
                                
                                let fetched_datas  = data
                                let items=[];
                                let hamburgerArray=[]
                                function myfunction (array){
                                    let meals=[];
                                    let drinks =[]

                                    for(i=0; i<array.length;i++){
                                        if(array[i].product_section==='Meals'){
                                            meals.push(array[i])
                                        }else{
                                            drinks.push(array[i])
                                        }
                                    }
                                    let items={}
                                    items.meals=meals;
                                    items.drinks =drinks;
                                    return items
                                }
                                items = myfunction(fetched_datas)
                                res.render('homtest.ejs',{
                                    stripePublicKey: stripePublicKey,
                                    items: items
                                })
                            }
                            
                        })
                     } else {
                         res.send('Not Allowed')
                    }
                } catch {
                    res.status(500).send()
                }
                
            }
           
        })
       
    }

    
     



   


})



app.get('/about', (req, res)=>{
    res.sendFile(path.join(__dirname + '/public/about.html'))
})



app.post('/userregister',async(req, res)=>{
    try {
        const hashedPassword = await bcrypt.hash(req.body.userPassword, 10)
         let sampleFile;
        let uploadPath;
        if(!req.files || Object.keys(req.files).length === 0){
            return res.status(400).send("No files are uploadded")
        }

        sampleFile = req.files.sampleFile;
        console.log(sampleFile)
        uploadPath = path.join(__dirname + '/public/' + sampleFile.name);
        console.log(uploadPath)
        sampleFile.mv(uploadPath, function(err){
            if(err) return res.status(500).send(err);
            console.log("The File is Uploaded")
        })
        let userName =req.body.userName;
        let userPassword = hashedPassword;
        let userGender = req.body.userGender;
        let userEmail = req.body.userEmail;
        let userRole = 'user'
        let userPhoto = sampleFile.name
        console.log(userName, userPassword, userGender, userEmail, userRole, userPhoto)
        connection.query('INSERT INTO testdb.user_table(user_name,user_password, user_gender,user_email,user_role,user_photo) VALUES(?,?,?,?,?,?)', [userName, userPassword, userGender, userEmail,userRole,userPhoto],
        function(error, data){
            if(error){
                console.log(error)
            } else{
                console.log(data)
                res.sendFile(path.join(__dirname + '/public/login.html'))
            } 
        })
        
      } catch {
        res.status(500).send()
      }

})

const hashUsers=[];







app.listen(7000, function(){
    console.log("server is running at 7000")
    console.log()
})