const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const { body, validationResult } = require('express-validator');

const app = express();
const port = 3000;
const SECRET_KEY = 'your_secret_key';

// Middleware to parse JSON
app.use(bodyParser.json());

// In-memory user and product data (for simplicity)
let users = [
  { id: 1, username: 'user', password: bcrypt.hashSync('pass', 8) }
];

let products = [];

// Middleware to verify JWT
function verifyToken(req, res, next) {
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(401).send({ auth: false, message: 'No token provided.' });
  }

  jwt.verify(token.split(" ")[1], SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
    }
    req.userId = decoded.id;
    next();
  });
}

// Swagger setup
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'JWT Auth API',
    version: '1.0.0',
    description: 'API documentation for JWT Auth API',
  },
  servers: [
    {
      url: `http://localhost:${port}`,
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ['./index.js'],
};

const swaggerSpec = swaggerJsdoc(options);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: User already exists or validation failed
 */
app.post('/register', [
  body('username')
    .isLength({ min: 4 }).withMessage('Username must be at least 4 characters long'),
  body('password')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
    .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
    .matches(/[!@#$%^&*(),.?":{}|<>]/).withMessage('Password must contain at least one special character')
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, password } = req.body;
  const user = users.find(u => u.username === username);
  if (user) {
    return res.status(400).send({ message: 'User already exists.' });
  }

  const hashedPassword = bcrypt.hashSync(password, 8);
  const newUser = { id: users.length + 1, username, password: hashedPassword };
  users.push(newUser);
  res.status(201).send({ message: 'User created successfully' });
});

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Login to the application
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successful login
 *       401:
 *         description: Invalid credentials
 */
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username);
  if (!user) {
    return res.status(404).send({ auth: false, token: null, message: 'User not found.' });
  }

  const passwordIsValid = bcrypt.compareSync(password, user.password);
  if (!passwordIsValid) {
    return res.status(401).send({ auth: false, token: null, message: 'Invalid password.' });
  }

  const token = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: 86400 }); // 24 hours
  res.status(200).send({ auth: true, token });
});

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of products
 */
app.get('/products', verifyToken, (req, res) => {
  res.status(200).send(products);
});

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Get product by ID
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Product data
 *       404:
 *         description: Product not found
 */
app.get('/products/:id', verifyToken, (req, res) => {
  const id = parseInt(req.params.id);
  const product = products.find(p => p.id === id);
  if (product) {
    res.status(200).send(product);
  } else {
    res.status(404).send({ message: 'Product not found' });
  }
});

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               dateAdded:
 *                 type: string
 *                 format: date
 *               category:
 *                 type: string
 *                 enum: [Electronics, Clothing, Food]
 *     responses:
 *       201:
 *         description: The created product
 */
app.post('/products', [
  verifyToken,
  body('name').isString().withMessage('Name is required and must be a string'),
  body('price').isNumeric().withMessage('Price is required and must be a number'),
  body('dateAdded').isISO8601().withMessage('Date added is required and must be a valid date'),
  body('category').isIn(['Electronics', 'Clothing', 'Food']).withMessage('Category must be one of Electronics, Clothing, Food')
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const product = req.body;
  product.id = products.length + 1;
  products.push(product);
  res.status(201).send(product);
});

/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: Update a product by ID
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               dateAdded:
 *                 type: string
 *                 format: date
 *               category:
 *                 type: string
 *                 enum: [Electronics, Clothing, Food]
 *     responses:
 *       200:
 *         description: The updated product
 *       404:
 *         description: Product not found
 */
app.put(`/products/:id`, [
  verifyToken,
  body(`name`).optional().isString().withMessage(`Name must be a string`),
  body(`price`).optional().isNumeric().withMessage(`Price must be a number`),
  body(`dateAdded`).optional().isISO8601().withMessage(`Date added must be a valid date`),
  body(`category`).optional().isIn([`Electronics`, `Clothing`, `Food`]).withMessage(`Category must be one of Electronics, Clothing, Food`)
  ], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
  return res.status(400).json({ errors: errors.array() });
  }
  const id = parseInt(req.params.id);
  const productIndex = products.findIndex(p => p.id === id);
  if (productIndex !== -1) {
    products[productIndex] = { ...products[productIndex], ...req.body };
    res.send(products[productIndex]);
  } else {
    res.status(404).send({ message: 'Product not found' });
  }
});

/**
* @swagger
* /products/{id}:
*   delete:
*     summary: Delete a product by ID
*     tags: [Products]
*     security:
*       - bearerAuth: []
*     parameters:
*       - in: path
*         name: id
*         required: true
*         schema:
*           type: integer
*     responses:
*       200:
*         description: The deleted product
*       404:
*         description: Product not found
*/
app.delete(`/products/:id`, verifyToken, (req, res) => {
const id = parseInt(req.params.id);
const productIndex = products.findIndex(p => p.id === id);
if (productIndex !== -1) {
const deletedProduct = products.splice(productIndex, 1);
res.send(deletedProduct);
} else {
res.status(404).send({ message: `Product not found` });
}
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});