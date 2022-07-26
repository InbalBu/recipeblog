require('../models/database');
const Category = require('../models/Category');
const Recipe = require('../models/Recipe');


/**
 * GET /
 * HomePage
 */

exports.homepage = async(req, res) => {

    try {

        const limitNumber = 5;
        const limit = 6;
        const categories = await Category.find({}).limit(limitNumber);
        const latest = await Recipe.find({}).sort({_id: -1}).limit(limit);
        const thai = await Recipe.find({ 'category': 'Thai'}).limit(limitNumber);
        const american = await Recipe.find({ 'category': 'American'}).limit(limitNumber);
        const italian = await Recipe.find({ 'category': 'Italian'}).limit(limitNumber);
        const israeli = await Recipe.find({ 'category': 'Israeli'}).limit(limitNumber);
        const mexican = await Recipe.find({ 'category': 'Mexican'}).limit(limitNumber);
        const indian = await Recipe.find({ 'category': 'Indian'}).limit(limitNumber);
        const greek = await Recipe.find({ 'category': 'Greek'}).limit(limitNumber);
        const french = await Recipe.find({ 'category': 'French'}).limit(limitNumber);
        const turkish = await Recipe.find({ 'category': 'Turkish'}).limit(limitNumber);
        const spanish = await Recipe.find({ 'category': 'Spanish'}).limit(limitNumber);

        const food = {latest, thai, american, italian, israeli, mexican, indian, greek, french, turkish, spanish};


        res.render('index', { title: 'Cooking Blog', categories, food});
    } catch (error) {
        res.status(500).send({message: error.message || "Error Occured "});
    }

}



/**
 * GET /categories
 * exploreCategories
 */

 exports.exploreCategories = async(req, res) => {

    try {

        const limitNumber = 10;
        const categories = await Category.find({}).limit(limitNumber);

        res.render('categories', { title: 'Cooking Blog - Categories', categories});
    } catch (error) {
        res.status(500).send({message: error.message || "Error Occured "});
    }

}



/**
 * GET /categories/:id
 * exploreCategories by ID
 */

 exports.exploreCategoriesById = async(req, res) => {
    try {
        let categoryId = req.params.id;

        const limitNumber = 10;
        const categoryById = await Recipe.find({'category': categoryId}).limit(limitNumber);

        res.render('categories', { title: 'Cooking Blog - Categories', categoryById});
    } catch (error) {
        res.status(500).send({message: error.message || "Error Occured "});
    }

}



/**
 * GET /categories/id
 * RecipePage
 */

 exports.exploreRecipe = async(req, res) => {
    try {

        let recipeId = req.params.id;
        const recipe = await Recipe.findById(recipeId);

        res.render('recipe', { title: 'Cooking Blog - Recipe', recipe});
    } catch (error) {
        res.status(500).send({message: error.message || "Error Occured "});
    }

}


/**
 * POST /search
 * Search
 */
 exports.searchRecipe = async(req, res) => {

    try {
        let searchTerm = req.body.searchTerm;

        let recipe = await Recipe.find({ $text: {$search: searchTerm, $diacriticSensitive: true } });

        res.render('search', { title: 'Cooking Blog - Search', recipe});

        
    } catch (error) {
        res.status(500).send({message: error.message || "Error Occured "});
    }


 }


 /**
 * GET /explore-latest
 * Explore Latest
 */
  exports.exploreLatest = async(req, res) => {

    try {
        
        const limitNumber = 20;
        const recipe = await Recipe.find({}).sort({_id: -1}).limit(limitNumber);
        res.render('explore-latest', { title: 'Cooking Blog - Explore Latest', recipe});

        
    } catch (error) {
        res.status(500).send({message: error.message || "Error Occured "});
    }
 }


 /**
 * GET /explore-random
 * Explore Random
 */
  exports.exploreRandom = async(req, res) => {

    try {
        
        let count = await Recipe.find().countDocuments();
        let random = Math.floor(Math.random() * count);
        let recipe = await Recipe.findOne().skip(random).exec();

        res.render('explore-random', { title: 'Cooking Blog - Explore Random', recipe});

        
    } catch (error) {
        res.status(500).send({message: error.message || "Error Occured "});
    }
 }


 
 /**
 * GET /submit-recipe
 * Submit Recipe
 */
  exports.submitRecipe = async(req, res) => {
    const infoErrorsObj = req.flash('infoErrors');
    const infoSubmitObj = req.flash('infoSubmit');

     res.render('submit-recipe', { title: 'Cooking Blog - Submit Recipe', infoErrorsObj, infoSubmitObj });
        
   
 }


  /**
 * POST /submit-recipe
 * Submit Recipe
 */
   exports.submitRecipeOnPost = async(req, res) => {

    try {

        let imageUploadFile;
        let uploadPath;
        let newImageName;
    
        if(!req.files || Object.keys(req.files).length === 0){
          console.log('No Files were uploaded.');
        } else {
    
          imageUploadFile = req.files.image;
          newImageName = Date.now() + imageUploadFile.name;
    
          uploadPath = require('path').resolve('./') + '/public/uploads/' + newImageName;
    
          imageUploadFile.mv(uploadPath, function(err){
            if(err) return res.satus(500).send(err);
          })
    
        }


        const newRecipe = new Recipe({
            name: req.body.name,
            description: req.body.description,
            email: req.body.email,
            ingredients: req.body.ingredients,
            category: req.body.category,
            image: newImageName
        });

        await newRecipe.save();

        req.flash('infoSubmit', 'Recipe has been added.')
        res.redirect('/submit-recipe');
        
    } catch (error) {
        
        req.flash('infoErrors', error);
        res.redirect('/submit-recipe');
    }
  
 }





