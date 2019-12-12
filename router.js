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
        <form action="/matratter/andra/${id}" method="post">
            <input type="text" name="Mat" value="${matratter.Mat}">
            <br>
            <input type="text" name="Bild" value="${matratter.Bild}">
            <br>
            <input type="text" name="Instruktioner" value="${matratter.Instruktioner}">
            <br>
            <input type="submit" value="Uppdatera">

        </form>
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
        res.send(req.cookies);
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