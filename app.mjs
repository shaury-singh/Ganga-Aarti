import express from 'express';
import path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const app = express();
const port = 8000;

app.use('/static',express.static('static'));
app.set('view engine', 'pug');
const __dirname = dirname(fileURLToPath(import.meta.url));
app.set('views', path.join(__dirname,'views'));
app.use(express.urlencoded({ extended: true }));

app.get('/',(req,res)=>{
    res.status(200).render('index.pug');
})

app.get('/book-your-aarti',(req,res)=>{
    res.status(200).render('book.pug');
})

app.post('/book-your-aarti',(req,res)=>{
    const body = req.body;
    console.log(body);
    res.send("Done");
})

app.get('/about-us',(req,res)=>{
    res.status(200).render("aboutUs.pug");
})

app.get('/gallery',(req,res)=>{
    res.status(200).render("gallery.pug")
})

app.get('/services',(req,res)=>{
    res.status(200).render('services.pug');
})

app.listen(port, ()=>{
    console.log(`Application Started in Development Phase on you Localhost at Port:${port}`);
});