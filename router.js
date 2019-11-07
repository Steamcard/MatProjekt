const mongoId = require('mongodb').ObjectID;
const render = require("./renderHtml.js");

module.exports = async function(app){

    app.get("/matratter", async function(req,res){

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
    app.get("/matratter/skapa", function(req,res)
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



    app.get("/matratter/radera/:id", async function(req,res){

        try{

        let id = req.params.id;
        await app.matratter.deleteOne({"_id":mongoId(id)});
        res.redirect("/matratter");
        }
        catch(error){
            res.send("Raderings Fel!");
        }
    });


    app.get("/matratter/andra/:id", async function(req,res){

        try{

            let id = req.params.id;
            res.redirect("/matratter/skapa/:id")
        }

    })

}