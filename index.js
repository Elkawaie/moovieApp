// On récupére notre librairie
const express = require('express');
//On initialise notre application dans la constante
const app = express();
//Librairie path pour utiliser les chemins absolut
let path = require('path');
const bodyParser = require('body-parser');
const multer = require('multer');
const upload = multer();
const config = require('./config')
//On récupére notre librairie mongoose
const mongoose = require('mongoose')
const schemaMovie = require('./Schema/movieSchema')
// url mongodb                  user: motdepasse                                /name of DB
mongoose.connect(`mongodb+srv://${config.db.user}:${config.db.password}@m2icluster-kpkda.gcp.mongodb.net/films?retryWrites=true&w=majority`);
//On déclare une connection dans la constante db
const db = mongoose.connection;

// On gére l'erreur et la reussite de la connexion via .on et .once
db.on('error', console.error.bind(console, 'Erreur de connexion: Aucun accés à la DB'))
db.once('open', () => {
    console.log('Connection réussite')
})

// On attribut le schema a la Constante Movie
const Movie = mongoose.model('Movie', schemaMovie.movieSchema)
// ( Next dans la route /moovie/add )


//On déclare le moteurs de view, et le dossier dans lequel les trouver
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use('/public', express.static('public'));
app.use(bodyParser.urlencoded({extended: false}))
/** On utilise la methode get de l'objet app
 * pour intéragir avec les apelle en get sur une
 * url précise ici le "/"*/

app.get('/', (req, res) => {
    //On renvoie dans la réponse un message
    res.render('index')
});

app.get('/moovies', (req, res) => {

    Movie.find({}, (err, films) => {
        if (!err) {
            resultatFilms = films
            res.render('list-film', {films: resultatFilms})
        } else {
            res.render('list-film', {films: 'no Records found'})
        }
    });


});

app.get('/moovies/search', (req, res) => {
    res.render('search-moovie')
})
app.get('/moovies/add', (req, res) => {
    Movie.find({}, (err, films) => {
        if (!err) {
            res.render('addMoovie', {films: films})
        } else {
            throw err;
        }
    });

});

app.post('/moovies/add', upload.fields([]), (req, res) => {
    if (!req.body) {
         res.sendStatus(500)
    } else {
        const formData = req.body;
        console.log('formData', formData);
        //On instancie notre Schema et on lui attribut les valeurs correspondante
        const myMovie = new Movie({title: req.body.titrefilm, year: req.body.anneefilm});
        // On gére la persistance de l'objet avec la methode error first
        myMovie.save((err, savedMovie) => {
            if (err) {
                console.log(err)
            } else {
                console.log("Votre film " + savedMovie.title + " A bien été ajouté")
            }
        })

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
app.get('/moovies/:id', (req, res) => {
    //On récupére le paramétre stocker
    const idFilm = req.params.id;
    Movie.findById(idFilm, (err, film) => {
        if (!err) {
            res.render('moovies-details', {film: film})
        } else if (err) {
            console.log(err)
            res.render('moovies-details', {msg: 'Le film n\'a pas était trouver'})
        }
    })
    // On utilise render pour génére une vue, qui
    // contient la valeur de notre constante dans
    //une clef nomée mooviesId

})

app.get('/moovies/delete/:id', (req,res)=>{
    const filmId = req.params.id
    Movie.findByIdAndDelete(filmId, {},(err,filmdeleted)=>{
        if(!err){
           Movie.find({}, (err, films)=>{
               if(!err){
                   res.render('list-film', {films: films, suprMsg: filmdeleted})
               }

           })
        }
    })
})

const MongoClient = require('mongodb').MongoClient
let database;
MongoClient.connect(`mongodb+srv://${config.db.user}:${config.db.password}@m2icluster-kpkda.gcp.mongodb.net/films?retryWrites=true&w=majority`, (err, DB)=>{
    if(err){
        throw err;
    }else{

        database = DB.db('films')
    }
})

//La methode collection crée, ou séléction la collection présente dans la DB


app.get('/series/add', (req,res)=>{

    res.render('serie-add')
})

app.post('/series/add', (req, res)=>{
    console.log(database)
    let actif = false;

    if(req.body.actif){
        actif = true
    }
    database.collection('series').insert({
        titre: req.body.title,
        resume: req.body.description,
        nbsSaison: req.body.nbSaison,
        actif: actif,
        defaultValue: 'Serie crée depuis l\'App Moovie App'
    })
    console.log(req.body)
    res.sendStatus(201)
})























/** On utilise la methode listen pour lancer
 * l'application sur un port précis, on peux
 * également renvoyer un message de bon ou
 * mauvais fonctionement*/


app.listen(config.port, () => {
    console.log(`Ecoute sur le port ${config.port}`)
})

