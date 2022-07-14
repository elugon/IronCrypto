# App name

## Description

This is a project developed by Alberto Quintero and Elu Gonzalez as the project for the second module at Ironhack. The application was built to deliver live information about crypto currencies the its users.

---

## Wireframes
![](/img/IronCryptoLayout.png)

---

## Instructions

When cloning the project, change the <code>sample.env</code> for an <code>.env</code> with the values you consider:
```js
PORT=3000
MONGO_URL='mongodb://localhost/dbName'
SESSION_SECRET='SecretOfYourOwnChoosing'
NODE_ENV='development'
```
Then, run:
```bash
npm install
```
To start the project run:
```bash
npm run start
```

---

## User stories (MVP)

What can the user do with the app?
- User can sign up and create and account
- User can login
- User can log out
- User can create a favorite coins list
- Comment on each coin
- Edit his profile or favorite coins

## User stories (Backlog)

- User can upload a profile picture
- User can require live data
- 

---

## Models



User:

```js
const userSchema = new Schema(
  {
    username: {
      type: String,
      trim: true,
      required: [true, 'Username is required.'],
      unique: true
    },
    email: {
      type: String,
      required: [true, 'Email is required.'],
      unique: true,
      lowercase: true,
      trim: true
    },
    hashedPassword: {
      type: String,
      required: [true, 'Password is required.']
    },
    favorites:{
      type: [String]
    },
    imageUrl:{
      type: String,
      default: '/img/default-user.png'
    },

  },
  {
    timestamps: true
  }
);

Comments:

const commentSchema = new Schema(
  {
    comment: {
      type: String,
      trim: true,
      required: [true, 'Comment is required.'],      
    },
    coinComment: {
        type: String,              
      },
    commentingUser:{
        type:String
    },
    userImage:{
         type:String,
    },
  },
  {
    timestamps: true
  }
);


```

---

## Routes

| Name  | Method | Endpoint    | Protected | Req.body            | Redirects |
|-------|--------|-------------|------|---------------------|-----------|
| Home  | GET   | /           | No   |                     |           |
| Login | GET    | /auth/login | No |                      |           |
| Login | POST | /auth/login   | No | { email, password }  | /         |
| Signup | GET    | /auth/signup | No |                      |           |
| Signup | POST | /auth/signup   | No | { username, email, password }  | /auth/login  |
| Profile  | GET    | /profile | Yes |
| all-coins  | GET    | /all-coins | Yes |                      |           |
| coin-detail | GET | /coin-detail/"coin"   | Yes |   |   |
| select-favorites | GET | /select-favorites   | Yes |  |   |
| select-favorites | POST | /select-favorites   | Yes | {["favorite coins"]  }  | /favorites  |
| favorites | GET | /favorites   | Yes |  |   |
| comments | GET | /comments/"coin name"  | Yes | | /comments/"coin name"  |
| comments | POST | /comments/"coin name"  | Yes | { comment, coinComment, commentingUser, userImage }  | /comments/"coin name"  |

---

## Useful links

- [Github Repo] (https://github.com/elugon/IronCrypto.git)
- [Deployed version]()
- [Presentation slides](https://slides.com/albertoquintero-1/desk)



