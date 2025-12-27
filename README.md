```
upload/
src/
├── app.js
├── server.js
│
├── configs/
│   └── env.js
│
├── database/
│   ├── connection.js
│   └── models/
│       ├── user.model.js
│       ├── product.model.js
│       └── order.model.js
│
├── repositories/
│   ├── user.repository.js
│   ├── product.repository.js
│   └── order.repository.js
│
├── controllers/
│   ├── auth.controller.js
│   ├── product.controller.js
│   └── order.controller.js
│
├── services/
│   ├── auth.service.js
│   ├── product.service.js
│   └── order.service.js
│
├── routes/
│   └── v1/
│       ├── auth.routes.js
│       ├── product.routes.js
│       └── order.routes.js
│
├── middlewares/
│   ├── auth.middleware.js
│   ├── validate.middleware.js
│   ├── protect.middleware.js
│   └── error.middleware.js
│
├── utils/
│   ├── errors.js
│   └── constants.js
│
└── docs/
    └── swagger.json

```

Controller                                  Service

Handles HTTP only                           Handles business logic
Reads req (params, body, query)             Decides what should happen
Calls service                               Calls repository
Sends res                                   Independent from HTTP
No business logic


Rule to remember
If the code needs req or res → controller
If the code should still work without Express → service

npm install
npm run dev

**_ 1.hash password when create use before save to DB _**
**_ 2.login flow-> take email and hashed password -> filter and check from DB -> login success/unsuccess _**

**_ 3.Implement with JWT _**


** protect route **