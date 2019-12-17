const mongoId = require('mongodb').ObjectID;
const render = require("./renderHtml.js");
const login = require("./Login/login")
const auth = require("./Login/auth")
module.exports = async function(app){

    app.get("/matratter",auth, async function(req,res){

        try
        {
            //Hämtar all data
            const data = await app.matratter.find().toArray();
            //Skickar in all data
            let html = data.reverse().map(function(matratter){

                return `
                <style>
                    h2,h3
                    {
                        width:200px;
                        height:50px;
                        margin:auto;
                        color:black;
                        background:white;
                        padding 20px;
                        border: 1px solid white;
                        margin-top:10px;
                    }
                    a
                    {
                        width: 100px;
                        height 50px;
                        margin:auto;
                        padding:10px;
                        color: white;
                        border:1px solid white;
                    }
                </style>
                <h2>${matratter.Mat}</h2>
                <h3>${matratter.Bild}</h3>
                <br>
                <h3>${matratter.Instruktioner}</h3>
                <br>
                <a href="/matratter/radera/${matratter._id}">Ta bort</a>
                <a href="/matratter/andra/${matratter._id}">Ändra</a>
                <hr>
                `;
            });

            //skriver ut all data
            res.send(render("Alla maträtter", html.join("")));
        }
        catch(error)
        {
            res.send("Ingen data");
        }
    });
    
    //skapar maträtt
    app.get("/matratter/skapa",auth, function(req,res)
    {
        res.sendFile(__dirname + "/Matsedel.html")
    });

    app.post("/matratter/skapa", async function(req,res)
    {
        try
        {
            await app.matratter.insertOne(req.body);
            res.redirect("/matratter");
        }
        catch(error)
        {
            res.send("Maträtten är inte skapad");
        }
    });



    app.get("/matratter/radera/:id",auth, async function(req,res){

        try{

        let id = req.params.id;
        await app.matratter.deleteOne({"_id":mongoId(id)});
        res.redirect("/matratter");
        }
        catch(error){
            res.send("Raderings Fel!");
        }
    });


    app.get("/matratter/andra/:id",auth, async function(req,res){

        let id = req.params.id;

        const matratter = await app.matratter.findOne({_id:mongoId(id)});
        let html = `
<style>
    body{
        width: 1200px;
        margin: auto;
        background: #1a1a1a;
    }

    form{
        width: 350px;
        height: 300px;
        margin: auto;
        margin-top: 200px;
        border: 1px solid white;
        box-shadow: 1px 1px 15px whitesmoke;
    }
    input
    {
        width: 250px;
        height: 30px;
        padding: 2px;
        margin: 12px;
        margin-left: 45px;
        box-shadow: 0.5px 0.5px 2px black;
    }
    .yolo
    {
        margin-left: 49px;
    }
    input[type=submit]{
        margin-top: 25px;
        height: 50px;
        background: lightblue;
        box-shadow: 1px 1px 15px lightblue;
    }
    
</style>
<body>
        <form action="/matratter/andra/${id}" method="post">
            <input type="text" name="Mat" value="${matratter.Mat}">
            <br>
            <input type="text" name="Bild" value="${matratter.Bild}">
            <br>
            <input type="text" name="Instruktioner" value="${matratter.Instruktioner}">
            <br>
            <input type="submit" value="Uppdatera">

        </form>
</body>
        `;
        res.send(render("Edit", html));
    });

    app.post("/matratter/andra/:id",auth, async function(req,res)
    {
        try {
            let id = req.params.id;
            await app.matratter.update({_id:mongoId(id)}, req.body);
            res.redirect("/matratter"); 
        } catch (error) {
            res.send(error.message);
        }     
    });

    //Implementerad LOgin

    app.get("/",function(req,res){
        res.redirect("/login");
        console.log(cookies);
    });


    app.post("/login",login,function(req,res)
    {
        //all logik i middelware | om du blir inloggad hamnar man i /secret
        res.sendFile(__dirname + "/Login/loginform.html")
    });


    app.get("/login",function(req,res){
        res.sendFile(__dirname +"/Login/loginform.html");
    });


    //auth verifierar om man är inloggad eller inte | auth är ett middleware (har tillgång till request, respond och next)
    app.get("./Login/secret",auth,function(req,res){
        res.send(req.cookies);
    });


    app.get("./Login/logout", function(req,res){
        res.cookie("token", "snart är det jul");
        res.redirect("./Login/secret");
    });

}