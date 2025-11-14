const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");


app.use(cookieParser("secretcode"));


app.get("/", (req, res) => {
    res.send("Hi, I am root");
    console.dir(req.cookies);
});


app.get("/getcookies", (req, res) => {
    res.cookie("greet", "namaste");
    res.cookie("Amit", "Bhaiya");
    res.send("send you some cookies");
});

app.get("/getsignescookies", (req, res) => {
    res.cookie("made-in", "India", {signed: true});
    res.cookie("name", "Amit Bhaiya",  {signed: true});
    res.send("send signed cookies");
});
app.get("/", (req, res) => {
    console.log("Unsigned cookies",req.cookies);
    console.log("signed cookies",req.signedCookies);
    res.send("verified");
    
});










app.listen(3000, () => {
    console.log("server is listening to port 3000");
    
});
