import { connect } from 'mongoose'

const uri = process.env.DB!

connect(uri)
  .then(() => {
    console.log('Connected to MongoDB')
  })
  .catch((err) => {
    console.log("Connection error: " + err.message)
  })