// import 'dotenv/config';
const bcrypt = require('bcrypt');

const Users = require('../models/users');
const Recipes = require('../models/recipes');

const password = bcrypt.hashSync('okay', 10);
const users = [
  {
    username: 'admin',
    password,
  },
  {
    username: 'Chinyelu',
    password,
  },
];

const recipes = [
  {
    Name: 'Chicken Nuggets',
    PrepTime: new Date(),
    Difficulty: 1,
    Vegetarian: true,
  },
  {
    Name: 'Chicken Nuggets',
    PrepTime: new Date(),
    Difficulty: 1,
    Vegetarian: false,
  },
  {
    Name: 'Jollof Rice',
    PrepTime: new Date(),
    Difficulty: 2,
    Vegetarian: false,
  },
  {
    Name: 'Meat pie',
    PrepTime: new Date(),
    Difficulty: 3,
    Vegetarian: false,
  },
  {
    Name: 'Vegetable soup',
    PrepTime: new Date(),
    Difficulty: 1,
    Vegetarian: true,
  },
];

const seed = async () => {
  try {
    console.log('Seeding started...');
    const user1 = await Users.create(users[0]);
    const user2 = await Users.create(users[1]);
    const recipe1 = await Recipes.create(recipes[0]);
    const recipe2 = await Recipes.create(recipes[1]);
    const recipe3 = await Recipes.create(recipes[2]);
    const recipe4 = await Recipes.create(recipes[3]);
    const recipe5 = await Recipes.create(recipes[4]);
    if (user1 || user2 || recipe1 || recipe2 || recipe3 || recipe4 || recipe5) {
      return 'Seeded successfully';
    }
    return 'Seeded Unsuccessfully';
  } catch (error) {
    return console.log(error);
  }
};

const rollback = async () => {
  console.log('Starting seed rollback...');
  const username = users.map((a) => a.username);
  await Users.deleteMany({ username: { $in: username } });
  return 'Seeding rolled back successfully';
};

const isRollback = process.argv[2] === '--rollback';
if (isRollback) rollback().then(console.log).catch(console.log).finally(() => process.exit(0));
else seed().then(console.log).catch(console.log).finally(() => process.exit(0));
