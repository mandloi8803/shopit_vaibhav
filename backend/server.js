const app=require('./app')
const connectDatabase=require('./config/database')
const dotenv=require('dotenv');
//config file setting
dotenv.config({ path:'backend/config/config.env'})

connectDatabase();
const server=app.listen(process.env.PORT, () =>{
    console.log(`Server started on PORT:${process.env.PORT} in ${process.env.NODE_ENV} mode`)
})
//handle unhandle promise like db url wrong
process.on('unhandledRejection',err=>{
    console.log(`ERROR: ${err.message}`)
    console.log('shutting down server due to db issue');
    server.close(()=>{
        process.exit(1)
    })
})