const fs = require('fs')
const express = require('express')
const app = express()
app.use(express.json())

const tours = JSON.parse(fs.readFileSync('./dev-data/data/tours-simple.json', 'utf-8'))

app.use((req, res, next) => {
    console.log('Hello from the middleware 👋')
    next()
})
app.use((req, res, next) => {
    req.requestTime = new Date().toISOString()
    next()
})

const getAllTours = (req, res,next) => {
    try{
    console.log(req.requestTime)
    res.status(200).json({
        status: 'success',
        requestedAt: req.requestTime,
        results: tours.length,
        data: {
            tours:tours
        }
    })
} catch(err){
    next(err)
}}

const gettourById =  (req, res,next) => {
    try{

    const id = req.params.id * 1
    const tour = tours.find(el => el.id === id)
    if(!tour){
        return res.status(404).json({
            status: 'fail',
            message: 'Invalid ID'
        })
    }
    res.status(200).json({
        status: 'success',
        data: {
            tour: tour
        }
    })
} catch(err){
    next(err)
}
}

const craeteNewtour = (req, res,next) => {
    try{
    const newId = tours[tours.length - 1].id + 1
    const newtour = Object.assign({id: newId}, req.body)
    tours.push(newtour)
    fs.writeFile('./dev-data/data/tours-simple.json', JSON.stringify(tours), err => {
        res.status(201).json({
            status: 'success',
            data: {
                tour: newtour
            }
        })
    })
} catch(err){
    next(err)
}
}

const updatetour =  (req, res,next) => {
    try{
    const id =req.params.id *1
    const tour = tours.find(i=>i.id===id)
    if(!tour){
        return res.status(404).json({
            status: 'fail',
            message: 'Invalid ID'
        })
    }
    const newTours = tours.filter(i=>i.id!==id)
    fs.writeFile('./dev-data/data/tours-simple.json', JSON.stringify(newTours), err=>{
        res.status(204).json({
            status: 'success',
            data: null
        })
    
    })
} catch(err){
    next(err)
}
}

const deleteTour = (req, res,next) => {
    try{
    const id =req.params.id *1
    const tour = tours.find(i=>i.id===id)
    if(!tour){
        return res.status(404).json({
            status: 'fail',
            message: 'Invalid ID'
        })
    }
    const newTours = tours.filter(i=>i.id!==id)
    fs.writeFile('./dev-data/data/tours-simple.json', JSON.stringify(newTours), err=>{
        res.status(204).json({
            status: 'success',
            data: null
        })
    
    })
} catch(err){
    next(err)
}
}

/* app.get('/api/v1/tours',getAllTours)
app.get('/api/v1/tours/:id/:x?/:y?',)
app.post('/api/v1/tours', craeteNewtour)
app.patch('/api/v1/tours/:id', updatetour)
app.delete('/api/v1/tours/:id', deleteTour) */

app.route('/api/v1/tours').get(getAllTours).post(craeteNewtour)
app.route('/api/v1/hello').get(getAllTours).post(craeteNewtour)
app.route('/api/v1/tours/:id').get(gettourById).patch(updatetour).delete(deleteTour)

app.use((err,req, res, next) => {
    console.log(err.stack, 'line')
    res.status(500).json({
        status: 'error',
        message: err.message
    })
})

const port = 3000
app.listen(port, () => console.log(`Example app listening on port ${port}!`))