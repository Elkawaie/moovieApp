// On récupére notre librairie
const express = require('express');
//On initialise notre application dans la constante
const app = express();
const PORT = 3000;
//Librairie path pour utiliser les chemins absolut
let path = require('path');
const bodyParser = require('body-parser');
const multer = require('multer');
const upload = multer();
// On déclare un tableau d'objet Json dans le but de simuler un retour d'une BDD
let films = [
    {title: 'Le seigneur des anneaux: La comunauté de l\'anneau', year:2001},
    {title: 'Le seigneur des anneaux: Les deux Tours', year:2002},
    {title: 'Le seigneur des anneaux: Le retour du roi', year:2003},
    {title: 'A star is Born', year:2019},
    {title: 'Hook', year:1991}
];


//On déclare le moteurs de view, et le dossier dans lequel les trouver
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use('/public', express.static('public'));
app.use(bodyParser.urlencoded({extended:false}))
/** On utilise la methode get de l'objet app
 * pour intéragir avec les apelle en get sur une
 * url précise ici le "/"*/

app.get('/', (req, res) => {
    //On renvoie dans la réponse un message
        res.render('index')
});

app.get('/moovies', (req,res)=>{
    res.render('list-film', {films: films})
});

app.get('/moovies/search', (req,res)=>{
    res.render('search-moovie')
})

app.get('/moovies/add', (req,res)=>{
    res.render('addMoovie', {films:films})
});

app.post('/moovies/add', upload.fields([]), (req,res)=>{
    if(!req.body){
        return res.sendStatus(500)
    }else{
        const formData = req.body;
        console.log('formData', formData);
        const newMoovie = {
            title: req.body.titrefilm,
            year: req.body.anneefilm
        };
        films.push(newMoovie);
        console.log(films)
        res.sendStatus(201)

    }
})

// app.post('/moovies/add', (req,res)=>{
//     console.log(req)
//     console.log(req.body)
//     console.log(`Le titre du film est: ${req.body.titrefilm}`);
//     console.log(`L'année du film est: ${req.body.anneefilm}`);
//     res.sendStatus(201)
// });

//On a créer la route /moovies suivit d'un paramétre
app.get('/moovies/:id/:title', (req,res) =>{
    //On récupére le paramétre stocker
    const idFilm = req.params.id;
    const title = req.params.title ;
    // On utilise render pour génére une vue, qui
    // contient la valeur de notre constante dans
    //une clef nomée mooviesId
    res.render('moovies-details',
        {
        moovieId: idFilm,
        moovieTitle: title
        }
    )
})





/** On utilise la methode listen pour lancer
 * l'application sur un port précis, on peux
 * également renvoyer un message de bon ou
 * mauvais fonctionement*/
app.listen(PORT, ()=>{
    console.log(`Ecoute sur le port ${PORT}`)
})

