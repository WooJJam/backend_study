const option = {
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'jaemin5548',
  database: 'backstudy'
}

app.use(session({
  secret: "secretkey",
  store: new MySQLStore(option),
  resave: false,
  saveUninitialized: false,
}));