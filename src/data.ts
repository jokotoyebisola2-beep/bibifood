/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Category, Meal, Review } from './types';

export const CATEGORIES: Category[] = [
  { id: 'cat-1', name: 'Rice Meals', icon: 'Soup', slug: 'rice-meals', image: 'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?auto=format&fit=crop&q=80&w=300', count: '14+ Options' },
  { id: 'cat-2', name: 'Soups', icon: 'FlameKindling', slug: 'soups', image: 'https://res.cloudinary.com/dtws4emsj/image/upload/v1783260086/1Nigerian-Pepper-Soup_gamwnr.png', count: '8+ Options' },
  { id: 'cat-3', name: 'Swallow', icon: 'ChefHat', slug: 'swallow', image: 'https://res.cloudinary.com/dtws4emsj/image/upload/v1783261860/swallow_vikipd.jpg', count: '10+ Options' },
  { id: 'cat-4', name: 'Fast Food', icon: 'Utensils', slug: 'fast-food', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=300', count: '18+ Options' },
  { id: 'cat-5', name: 'Pizza', icon: 'Pizza', slug: 'pizza', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=300', count: '6+ Options' },
  { id: 'cat-6', name: 'Chicken', icon: 'Beef', slug: 'chicken', image: 'https://res.cloudinary.com/dtws4emsj/image/upload/v1783335102/chicken_vgmpam.jpg', count: '12+ Options' },
  { id: 'cat-7', name: 'Shawarma', icon: 'Egg', slug: 'shawarma', image: 'https://res.cloudinary.com/dtws4emsj/image/upload/v1783334951/shawama_rtcqns.jpg', count: '8+ Options' },
  { id: 'cat-8', name: 'Small Chops', icon: 'Cookie', slug: 'small-chops', image: 'https://res.cloudinary.com/dtws4emsj/image/upload/v1783334466/small_chops_unlmdx.webp', count: '15+ Options' },
  { id: 'cat-9', name: 'Breakfast', icon: 'Egg', slug: 'breakfast', image: 'https://res.cloudinary.com/dtws4emsj/image/upload/v1783335244/breakfast_xfuc48.webp', count: '10+ Options' },
  { id: 'cat-10', name: 'Lunch', icon: 'Utensils', slug: 'lunch', image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=300', count: '24+ Options' },
  { id: 'cat-11', name: 'Dinner', icon: 'FlameKindling', slug: 'dinner', image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=300', count: '20+ Options' },
  { id: 'cat-12', name: 'Drinks', icon: 'Wine', slug: 'drinks', image: 'https://res.cloudinary.com/dtws4emsj/image/upload/v1783335336/drinks_o1blg1.webp', count: '16+ Options' },
  { id: 'cat-13', name: 'Smoothies', icon: 'CupSoda', slug: 'smoothies', image: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&q=80&w=300', count: '7+ Options' },
  { id: 'cat-14', name: 'Desserts', icon: 'Cake', slug: 'desserts', image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&q=80&w=300', count: '9+ Options' },
  { id: 'cat-15', name: 'Healthy Meals', icon: 'Salad', slug: 'healthy-meals', image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=300', count: '11+ Options' },
];

export const MEALS: Meal[] = [
  {
    id: 'meal-1',
    name: 'Royal Saffron Jollof Rice with Grilled Chicken',
    description: 'Long-grain basmati rice cooked in our signature smoked pepper-tomato broth, seasoned with authentic local spices, served with tender wood-fire grilled quarter chicken, plantains, and premium vegetable slaw.',
    price: 4500,
    rating: 4.9,
    prepTime: '20-25 mins',
    deliveryEstimate: '25-35 mins',
    restaurant: 'Bibi Central Kitchen - Victoria Island',
    image: 'https://res.cloudinary.com/dtws4emsj/image/upload/v1783182567/jollof_ie3ewc.webp',
    category: 'rice-meals',
    inStock: true,
    stockCount: 45,
    isPopular: true,
    isFeatured: true,
    calories: '680 kcal',
    ingredients: ['Long-grain Basmati Rice', 'Smoked Bell Pepper & Tomato Reduction', 'Wood-fire Quarter Chicken', 'Sweet Fried Plantains', 'House Slaw'],
    addons: [
      { id: 'addon-1', name: 'Extra Chicken Quarter', price: 1500 },
      { id: 'addon-2', name: 'Extra Fried Plantains (Dodo)', price: 700 },
      { id: 'addon-[#', name: 'Extra Beef Suya Skewer', price: 1800 },
      { id: 'addon-4', name: 'Chilled Hibiscus Zobo Drink', price: 1000 },
    ]
  },
  {
    id: 'meal-2',
    name: 'Slow-Braised Angus Beef Pepper Soup',
    description: 'Ultra-tender braised Angus beef cubes in a highly aromatic, fiery herbal broth infused with utazi, uziza, and local pepper soup spices. Extremely comforting and served with warm artisanal bread.',
    price: 6500,
    rating: 4.8,
    prepTime: '15-20 mins',
    deliveryEstimate: '20-30 mins',
    restaurant: 'Bibi Heritage Kitchen - Ikeja',
    image: 'https://res.cloudinary.com/dtws4emsj/image/upload/v1783183436/beef_i1kxvj.webp',
    category: 'soups',
    inStock: true,
    stockCount: 15,
    isPopular: true,
    isFeatured: true,
    calories: '520 kcal',
    ingredients: ['Angus Beef Chunks', 'Uziza Leaves', 'Utazi Spice Blend', 'Scotch Bonnet Pepper', 'Artisanal Roll'],
    addons: [
      { id: 'addon-1', name: 'Extra Beef Chunks', price: 2000 },
      { id: 'addon-2', name: 'Extra Warm Garlic Roll', price: 600 },
      { id: 'addon-3', name: 'Extra Spicy Pepper Extract', price: 400 },
    ]
  },
  {
    id: 'meal-3',
    name: 'Poundo Gold with Premium Seafood Okra',
    description: 'Silky smooth pounded yam served alongside an opulent, rich seafood okra soup loaded with fresh prawns, crab claws, calamari, and diced fish, slow-cooked in clean red palm oil.',
    price: 8200,
    rating: 4.9,
    prepTime: '25-30 mins',
    deliveryEstimate: '30-40 mins',
    restaurant: 'Bibi Coastal Bistro - Lekki',
    image: 'https://res.cloudinary.com/dtws4emsj/image/upload/v1783261860/swallow_vikipd.jpg',
    category: 'swallow',
    inStock: true,
    stockCount: 12,
    isPopular: false,
    isFeatured: true,
    calories: '750 kcal',
    ingredients: ['Jumbo Prawns', 'Crab Claws', 'Fresh Okra', 'Pure Palm Oil', 'Pounded Yam Swallow'],
    addons: [
      { id: 'addon-1', name: 'Extra Jumbo Prawns (2 pcs)', price: 2500 },
      { id: 'addon-2', name: 'Extra Pounded Yam Wrap', price: 1000 },
      { id: 'addon-3', name: 'Extra Crab Claw', price: 1500 },
    ]
  },
  {
    id: 'meal-4',
    name: 'The Bibi Signature Double Smash Burger',
    description: 'Two premium dry-aged beef smash patties, double cheddar cheese, caramelized onions, house-pickled cucumbers, and secret Bibi baseline burger sauce inside a toasted cloud-soft brioche bun.',
    price: 5200,
    rating: 4.7,
    prepTime: '15 mins',
    deliveryEstimate: '20-30 mins',
    restaurant: 'Bibi Urban Diner - Ikoyi',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=600',
    category: 'fast-food',
    inStock: true,
    stockCount: 30,
    isPopular: true,
    isFeatured: true,
    calories: '820 kcal',
    ingredients: ['Dry-Aged Angus Beef Patties', 'Aged Cheddar Cheese', 'Caramelized Red Onions', 'House Secret Sauce', 'Brioche Bun'],
    addons: [
      { id: 'addon-1', name: 'Extra Beef Patty & Cheese', price: 1800 },
      { id: 'addon-2', name: 'Crispy Seasoned French Fries', price: 1200 },
      { id: 'addon-3', name: 'Extra Melted Cheddar Cheese', price: 800 },
      { id: 'addon-4', name: 'Chilled Soft Drink Can', price: 800 },
    ]
  },
  {
    id: 'meal-5',
    name: 'Smoked Honey Glazed Chicken Shawarma',
    description: 'Slow-roasted chicken breast strips tossed in smoky honey-mustard-bbq glaze, wrapped in toasted flatbread with double cabbage crunch, sweet onions, and house mayonnaise garlic sauce.',
    price: 3200,
    rating: 4.9,
    prepTime: '10-15 mins',
    deliveryEstimate: '15-25 mins',
    restaurant: 'Bibi Street Express - Abuja Wuse II',
    image: 'https://res.cloudinary.com/dtws4emsj/image/upload/v1783334951/shawama_rtcqns.jpg',
    category: 'shawarma',
    inStock: true,
    stockCount: 50,
    isPopular: true,
    isFeatured: true,
    calories: '580 kcal',
    ingredients: ['Slow-Roasted Chicken', 'Honey BBQ Mustard Glaze', 'Garlic Mayo', 'Fresh Shredded Cabbage', 'Toasted Pita Wrap'],
    addons: [
      { id: 'addon-1', name: 'Extra Beef Sausage Link', price: 1000 },
      { id: 'addon-2', name: 'Extra Cheese Melt', price: 800 },
      { id: 'addon-3', name: 'Double Chicken Loading', price: 1200 },
    ]
  },
  {
    id: 'meal-6',
    name: 'Smoky Jerk Chicken Pizza',
    description: 'Stone-baked thin crust pizza layered with spicy jerk chicken breast shreds, sweet bell peppers, red onions, wild mushrooms, and 100% real premium mozzarella cheese, drizzled with a jerk BBQ reduction.',
    price: 7500,
    rating: 4.6,
    prepTime: '20-25 mins',
    deliveryEstimate: '25-35 mins',
    restaurant: 'Bibi Woodfire Pizza - Victoria Island',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=600',
    category: 'pizza',
    inStock: true,
    stockCount: 8,
    isPopular: false,
    isFeatured: true,
    calories: '910 kcal',
    ingredients: ['Artisanal Dough', 'Spicy Jerk Chicken', 'Mozzarella Cheese', 'Bell Peppers', 'Jerk Reduction Drizzle'],
    addons: [
      { id: 'addon-1', name: 'Extra Mozzarella Cheese Layer', price: 1200 },
      { id: 'addon-2', name: 'Garlic Dipping Sauce', price: 500 },
      { id: 'addon-3', name: 'Extra Jerk Chicken Topping', price: 1500 },
    ]
  },
  {
    id: 'meal-7',
    name: 'Gourmet Red Velvet Waffle Tower',
    description: 'Freshly baked premium red velvet waffles stacked with organic vanilla bean cream cheese glaze, fresh wild berries, real maple syrup drizzle, and topped with a dusting of powdered sugar.',
    price: 4500,
    rating: 4.8,
    prepTime: '15-20 mins',
    deliveryEstimate: '20-30 mins',
    restaurant: 'Bibi Sweet Bakery & Desserts',
    image: 'https://res.cloudinary.com/dtws4emsj/image/upload/v1783262401/cake_ejmagt.webp',
    category: 'desserts',
    inStock: true,
    stockCount: 10,
    isPopular: false,
    isFeatured: true,
    calories: '610 kcal',
    ingredients: ['Red Velvet Waffle Batter', 'Vanilla Bean Cream Cheese', 'Wild Berries', 'Pure Maple Syrup', 'Confectioner Sugar'],
    addons: [
      { id: 'addon-1', name: 'Scoop of Vanilla Ice Cream', price: 1000 },
      { id: 'addon-2', name: 'Extra Berry Compote', price: 700 },
      { id: 'addon-3', name: 'Extra Cream Cheese Drizzle', price: 600 },
    ]
  },
  {
    id: 'meal-8',
    name: 'Avocado Green Vitality Bowl',
    description: 'Organic baby kale and romaine salad dressed in a smooth lime-cilantro vinaigrette, with sliced avocado, grilled tofu, fresh cucumber, roasted edamame, and toasted sunflower seeds.',
    price: 3800,
    rating: 4.7,
    prepTime: '10 mins',
    deliveryEstimate: '15-25 mins',
    restaurant: 'Bibi Green Kitchen - Oniru',
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=600',
    category: 'healthy-meals',
    inStock: true,
    stockCount: 25,
    isPopular: false,
    isFeatured: true,
    calories: '420 kcal',
    ingredients: ['Organic Baby Kale', 'Ripe Hass Avocado', 'Grilled Tofu Cubes', 'Roasted Edamame', 'Lime-Cilantro Dressing'],
    addons: [
      { id: 'addon-1', name: 'Extra Grilled Salmon Fillet', price: 2500 },
      { id: 'addon-2', name: 'Extra Avocado Slices', price: 1000 },
      { id: 'addon-3', name: 'Boiled Organic Egg', price: 500 },
    ]
  }
];

export const REVIEWS: Review[] = [
  {
    id: 'rev-1',
    userName: 'Sarah Jenkins',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
    rating: 5,
    comment: 'Bibi Food has completely transformed my lunch hour. The Saffron Jollof is consistent, arriving blazing hot and incredibly fresh. Best single-brand meal experience in the city!',
    date: '2026-06-28',
    mealName: 'Royal Saffron Jollof Rice'
  },
  {
    id: 'rev-2',
    userName: 'Tobi Adebayo',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
    rating: 5,
    comment: 'I order the Double Smash Burger every single weekend during study marathons. Delivery is unbelievably fast and the packaging feels premium. High quality beef patties!',
    date: '2026-06-25',
    mealName: 'The Bibi Signature Double Smash Burger'
  },
  {
    id: 'rev-3',
    userName: 'Nkem Obi',
    userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
    rating: 5,
    comment: 'Ordering dinner for the kids and myself is usually a chore, but Bibi Food makes it so simple. The seafood okra is pristine and full of giant fresh prawns. Excellent service!',
    date: '2026-06-20',
    mealName: 'Poundo Gold with Premium Seafood Okra'
  }
];

export const TRUST_STATS = [
  { value: '35m', label: 'Average Delivery Time' },
  { value: '4.9★', label: 'Customer Satisfaction Score' },
  { value: '25+', label: 'Executive Chefs' },
  { value: '100k+', label: 'Delighted Orders' },
];
