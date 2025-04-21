const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Add this to your db.json under a "users" collection
// "users": []


// Add CORS headers
server.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  next();
});

// Handle preflight requests
server.options('*', (req, res) => {
  res.sendStatus(200);
});



// Set up middleware
server.use(middlewares);
server.use(jsonServer.bodyParser);

// JWT Secret (in production, use environment variable)
const JWT_SECRET = 'your-secret-key-here';

// Helper functions
const findUserByEmail = (email, db) => {
  return db.get('users').find({ email }).value();
};

server.use(middlewares);
server.use(jsonServer.bodyParser);

// Registration endpoint
server.post('/register', (req, res) => {
  const db = router.db; // Get lowdb instance
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }
  
  const existingUser = findUserByEmail(email, db);
  if (existingUser) {
    return res.status(400).json({ error: 'Email already exists' });
  }
  
  const hashedPassword = bcrypt.hashSync(password, 10);
  const newUser = {
    id: Date.now().toString(),
    email,
    password: hashedPassword,
    createdAt: new Date().toISOString()
  };
  
  db.get('users').push(newUser).write();
  
  res.status(201).json({ message: 'User registered successfully' });
});

// Login endpoint
server.post('/login', (req, res) => {
  const db = router.db;
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }
  
  const user = findUserByEmail(email, db);
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  
  const isPasswordValid = bcrypt.compareSync(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  
  const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
  
  res.json({ token, userId: user.id, email: user.email });
});

// Authentication middleware
const authenticate = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    
    req.user = user;
    next();
  });
};

// Protect your routes (example)
server.use('/protected', authenticate, (req, res, next) => {
  // This route is now protected
  next();
});

// Default JSON Server routes
server.use('', router);

// Start server
server.listen(process.env.PORT || 5000, () => {
  console.log('JSON Server with Authentication is running');
});






// <<<<<<< HEAD
// const jsonServer = require('json-server');
// const server = jsonServer.create();
// const router = jsonServer.router('db.json');
// const middlewares = jsonServer.defaults();
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');

// // Add this to your db.json under a "users" collection
// // "users": []

// // Set up middleware
// server.use(middlewares);
// server.use(jsonServer.bodyParser);

// // JWT Secret (in production, use environment variable)
// const JWT_SECRET = 'your-secret-key-here';

// // Helper functions
// const findUserByEmail = (email, db) => {
//   return db.get('users').find({ email }).value();
// };

// // Registration endpoint
// server.post('/register', (req, res) => {
//   const db = router.db; // Get lowdb instance
//   const { email, password } = req.body;
  
//   if (!email || !password) {
//     return res.status(400).json({ error: 'Email and password are required' });
//   }
  
//   const existingUser = findUserByEmail(email, db);
//   if (existingUser) {
//     return res.status(400).json({ error: 'Email already exists' });
//   }
  
//   const hashedPassword = bcrypt.hashSync(password, 10);
//   const newUser = {
//     id: Date.now().toString(),
//     email,
//     password: hashedPassword,
//     createdAt: new Date().toISOString()
//   };
  
//   db.get('users').push(newUser).write();
  
//   res.status(201).json({ message: 'User registered successfully' });
// });

// // Login endpoint
// server.post('/login', (req, res) => {
//   const db = router.db;
//   const { email, password } = req.body;
  
//   if (!email || !password) {
//     return res.status(400).json({ error: 'Email and password are required' });
//   }
  
//   const user = findUserByEmail(email, db);
//   if (!user) {
//     return res.status(401).json({ error: 'Invalid credentials' });
//   }
  
//   const isPasswordValid = bcrypt.compareSync(password, user.password);
//   if (!isPasswordValid) {
//     return res.status(401).json({ error: 'Invalid credentials' });
//   }
  
//   const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
  
//   res.json({ token, userId: user.id, email: user.email });
// });

// // Authentication middleware
// const authenticate = (req, res, next) => {
//   const authHeader = req.headers['authorization'];
//   const token = authHeader && authHeader.split(' ')[1];
  
//   if (!token) {
//     return res.status(401).json({ error: 'No token provided' });
//   }
  
//   jwt.verify(token, JWT_SECRET, (err, user) => {
//     if (err) {
//       return res.status(403).json({ error: 'Invalid or expired token' });
//     }
    
//     req.user = user;
//     next();
//   });
// };

// // Protect your routes (example)
// server.use('/protected', authenticate, (req, res, next) => {
//   // This route is now protected
//   next();
// });

// // Default JSON Server routes
// server.use('', router);

// // Start server
// =======
// //server.js
// const jsonServer = require('json-server')
// const server = jsonServer.create()
// const router = jsonServer.router('db.json')
// const middlewares = jsonServer.defaults()
 
// server.use(middlewares)
// server.use('', router)
// >>>>>>> 52ffe2c5b10b93e026346b35a9aeb9e3f2d661ce
// server.listen(process.env.PORT || 5000, () => {
//   console.log('JSON Server with Authentication is running');
// });




//================================================================
// // server.js
// const jsonServer = require('json-server')
// const server = jsonServer.create()
// const router = jsonServer.router('db.json')
// const middlewares = jsonServer.defaults()
 
// server.use(middlewares)
// server.use('', router)
// server.listen(process.env.PORT || 5000, () => {
//   console.log('JSON Server is running')
// })

//=============================================================

// const fs = require("fs");
// const bodyParser = require("body-parser");
// const jsonServer = require("json-server");
// const cookieParser = require("cookie-parser");
// const jwt = require("jsonwebtoken");
// // const cors = require("cors");

// const server = jsonServer.create();
// const router = jsonServer.router("./db.json");
// const emp_routes = jsonServer.router('./employees.json')
// const userdb = JSON.parse(fs.readFileSync("./users.json", "UTF-8"));


// // server.use(cors({
// //   origin: "*", // Allow client domain
// //   credentials: true, // Allow sending cookies with requests
// // }));


// server.use(cookieParser());
// server.use(bodyParser.urlencoded({ extended: true }));
// server.use(bodyParser.json());
// server.use(jsonServer.defaults());

// const SECRET_KEY = "123456789";

// // Create a token from a payload
// function createToken(payload) {
//   return jwt.sign(payload, SECRET_KEY, { expiresIn: "10m" });
// }

// function createRefreshToken(payload) {
//   return jwt.sign(payload, SECRET_KEY, { expiresIn: "1d" });
// }

// // Verify the token
// function verifyToken(token) {
//   return jwt.verify(token, SECRET_KEY, (err, decode) =>
//     decode !== undefined ? decode : null
//   );
// }

// // Check if the user exists in database
// function isAuthenticated({ email, password }) {
//   return (
//     userdb.users.findIndex(
//       (user) => user.email === email && user.password === password
//     ) !== -1
//   );
// }

// function findUserByEmailAndPassword({ email, password }) {
//   return (
//     userdb.users.find(
//       (user) => user.email === email && user.password === password
//     ) || null
//   );
// }

// // Login to one of the users from ./users.json
// server.post("/auth/login", (req, res) => {
//   console.log("login endpoint called; request body:");
//   console.log(req.body);
//   const { email, password } = req.body;
//   if (isAuthenticated({ email, password }) === false) {
//     const status = 401;
//     const message = "Incorrect email or password";
//     res.status(status).json({ status, message });
//     return;
//   }

//   const user = findUserByEmailAndPassword({ email, password });
//   const access_token = createToken({ user });
//   const refresh_token = createRefreshToken({ user });
//   // console.log("usera", user);
//   // console.log("Access Token:" + access_token);
//   res.cookie("jwt", refresh_token, {
//     httpOnly: true,
//     secure: true,
//     sameSite: "None",
//     maxAge: 24 * 60 * 60 * 1000,
//   });
//   res.status(200).json({ data: user, token: access_token });
// });

// server.get("/auth/refresh", (req, res) => {
//   const cookies = req.cookies;
//   console.log(cookies, "coookkk");
//   try {
//     if (!cookies?.jwt) {
//       return res
//         .status(400)
//         .json({ message: "the cookies token is not found" });
//     }
//     const refresh_token = cookies.jwt;
//     const decoded = verifyToken(refresh_token);
//     if (!decoded) {
//       res.status(401).json({ message: "unauthorized" });
//     }

//     const { user } = decoded;
//     const access_token = createToken({ user });

//     console.log("usera", user);
//     console.log("Access Token:" + access_token);
//     res.status(200).json({ data: user, token: access_token });
//   } catch (error) {
//     console.log(error);
//   }
// });

// server.get("/auth/logout", (req, res) => {
//   const cookies = req.cookies;

//   if (!cookies?.jwt) {
//     return res.status(204).json({ message: "No content" }); // No content to clear
//   }

//   res.clearCookie("jwt", {
//     httpOnly: true,
//     secure: true,
//     sameSite: "None",
//   });

//   return res.status(200).json({ message: "Successfully logged out" });
// });

// server.use(/^(?!\/auth).*$/, (req, res, next) => {
//   if (
//     req.headers.authorization === undefined ||
//     req.headers.authorization.split(" ")[0] !== "Bearer"
//   ) {
//     const status = 401;
//     const message = "Error in authorization format";
//     res.status(status).json({ status, message });
//     return;
//   }
//   try {
//     let verifyTokenResult;
//     verifyTokenResult = verifyToken(req.headers.authorization.split(" ")[1]);

//     if (verifyTokenResult instanceof Error) {
//       const status = 401;
//       const message = "Access token not provided";
//       res.status(status).json({ status, message });
//       return;
//     }
//     next();
//   } catch (err) {
//     const status = 401;
//     const message = "Error access_token is revoked";
//     res.status(status).json({ status, message });
//   }
// })

// server.use(router);
// server.use('/employee', emp_routes)

// server.listen(5000, () => {
//   console.log("Run Auth API Server");
// });
