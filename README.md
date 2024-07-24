# AdvancedNodeStarter

Starting project for a course on Advanced Node @ Udemy

### Installation

- Run `npm install` in the root of the project to install the server's dependencies
- Change into the client directory and run `npm install --legacy-peer-deps`
- Change back into the root of the project and run `npm run dev` to start application

**Important** - the Mongo Atlas database credentials provided in `dev.js` are read only. If you attempt to login without using your own connection string (covered in the course) you will get the following error `[0] MongoError: user is not allowed to do action [insert] on [advnode.users]`
