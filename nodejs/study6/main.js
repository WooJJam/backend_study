const express = require('express') // express module
const app = express() // new express app
const port = 4000 // port
const bodyParser = require('body-parser');
const fs = require('fs');
const xmlToJson = require('xml-js');
const csvToJson = require('csvtojson');
const { json } = require('body-parser');
const yamlToJson = require('js-yaml');
const ExifReader = require('exifreader');

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

app.post('/v1/files/json', (req, res) => {
    var jsonpath = __dirname+req.body.path;
    const jsonfile = fs.readFileSync(jsonpath, 'utf8')
    res.status(200).json({
        status: "ok",
        body: jsonfile
    })
})

app.post('/v1/files/xml', (req, res) => {
    var xmlpath = __dirname+req.body.path;
    const xmlfile = fs.readFileSync(xmlpath, 'utf8');
    var result = xmlToJson.xml2json(xmlfile, {compact: true, spaces: 4});
    res.status(200).json({
        status: "ok",
        body: JSON.parse(result)
    })
})

app.post('/v1/files/csv', (req, res) => {
    var csvpath = __dirname+req.body.path;
    csvToJson()
    .fromFile(csvpath)
    .then(csvfile => {
       res.status(200).json({
        status:"ok",
        body: csvfile
       })
    })
    .catch(err =>{
        console.log(err);
    }) 
})

app.post('/v1/files/yaml', (req, res) => {
    var yamlpath = __dirname+req.body.path;
    const yamlfile = yamlToJson.load(fs.readFileSync(yamlpath, 'utf8'));
    res.status(200).json({
        status:200,
        body: yamlfile
    });
})

app.post('/v1/files/exif', (req, res) => {
    var exifpath = __dirname+req.body.path;
    var exiffile = fs.readFileSync(exifpath);
    const tags = ExifReader.load(exiffile, {expanded: true});
    res.status(200).json({
        status:200,
        body: {
            "make" : tags.exif.Make.description,
            "latitude" : tags.gps.Latitude,
            "longitude" : tags.gps.Longitude,
        }
    });
})

app.listen(port, () => console.log(`Example app listening on port ${port}`))