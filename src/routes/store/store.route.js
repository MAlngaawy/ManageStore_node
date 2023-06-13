const express = require('express');
const router = express.Router();
const Item = require('../../models/item.model');
const Recipe = require('../../models/recipe.model');

//! ITEMS Endpoints_____________________________

// Create a new item
router.post('/items', async (req, res) => {
  try {
    const { name, quantity } = req.body;
    const newItem = new Item({ name, quantity });
    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all items
router.get('/items', async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a specific item
router.get('/items/:itemId', async (req, res) => {
  try {
    const item = await Item.findById(req.params.itemId);
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update an item
router.put('/items/:itemId', async (req, res) => {
  try {
    const { itemId } = req.params;
    const updates = req.body;
    const updatedItem = await Item.findByIdAndUpdate(itemId, updates, { new: true });

    if (!updatedItem) {
      return res.status(404).json({ error: 'Item not found' });
    }

    res.json(updatedItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Increase the quantity of an item
router.patch('/items/increase/:itemId', async (req, res) => {
  try {
    const { itemId } = req.params;
    const { increaseBy } = req.body;

    const item = await Item.findById(itemId);

    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    item.quantity += increaseBy;
    await item.save();

    res.json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Decrease the quantity of an item
router.patch('/items/decrease/:itemId', async (req, res) => {
  try {
    const { itemId } = req.params;
    const { decreaseBy } = req.body;

    const item = await Item.findById(itemId);

    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    if (item.quantity <= decreaseBy) {
      return res.status(400).json({ error: 'Cannot decrease quantity below zero' });
    }

    item.quantity -= decreaseBy;
    await item.save();

    res.json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//! RECIPES Endpoints_____________________________

// Create a new recipe
router.post('/recipes', async (req, res) => {
  try {
    const { name, items } = req.body;
    const newRecipe = new Recipe({ name, items });
    const savedRecipe = await newRecipe.save();
    res.status(201).json(savedRecipe);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all recipes
router.get('/recipes', async (req, res) => {
  try {
    const recipes = await Recipe.find().populate('items.item');
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a specific recipe
router.get('/recipes/:recipeId', async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.recipeId).populate('items.item');
    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }
    res.json(recipe);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a recipe
router.put('/recipes/:recipeId', async (req, res) => {
  try {
    const { name, items } = req.body;
    const updatedRecipe = await Recipe.findByIdAndUpdate(req.params.recipeId, { name, items }, { new: true }).populate(
      'items.item'
    );
    if (!updatedRecipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }
    res.json(updatedRecipe);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a recipe
router.delete('/recipes/:recipeId', async (req, res) => {
  try {
    const { recipeId } = req.params;
    const deletedRecipe = await Recipe.findByIdAndDelete(req.params.recipeId).populate('items.item');
    if (!deletedRecipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }
    res.json({ message: 'Successfully Deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/recipes/decrease-items/:recipeId/', async (req, res) => {
  try {
    const { recipeId } = req.params;
    const recipe = await Recipe.findById(recipeId).populate('items.item');

    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }

    // Decrease the quantity of items based on the recipe's items array
    for (const item of recipe.items) {
      const { id, amount } = item;
      const updatedItem = await Item.findByIdAndUpdate(id, { $inc: { quantity: -amount } }, { new: true });

      if (!updatedItem) {
        return res.status(404).json({ error: `Item with ID ${itemId} not found` });
      }
    }

    res.json({ message: 'Items quantity decreased successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
