
//behöver dessa för att denna funktionen ska funka
const jwt = require("jsonwebtoken");
const secret = require("./secret");

//next gör att man skickas vidare //Börja med att kolla cookie om den ens existerar
module.exports = function(req,res,next){
    if(req.cookies.token){

        //jwt finns i en cookie vi själva har gjort om cookien finns)
        jwt.verify(req.cookies.token,secret,function(err,token){
            //om icke-fel
            if(!err){
                //next skickar vidare till slut functionen
                next();
            }
            //annars
            else {
                res.send(err.message);
            }

        });

    }
    else{
        res.send("Ingen Token tillgänlig");
    }
}