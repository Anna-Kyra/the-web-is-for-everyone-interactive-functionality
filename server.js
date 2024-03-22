import express from 'express'
import fetchJson from './helpers/fetch-json.js'

const app = express()
app.set('view engine', 'ejs')
app.set('views', './views')
app.use(express.static('public'))
app.use(express.urlencoded({extended: true}))

// Stel het basis endpoint in
const apiUrl = 'https://fdnd-agency.directus.app/items'
const sdgData = await fetchJson(apiUrl + '/hf_sdgs')
const scoresData = await fetchJson(apiUrl + '/hf_scores')
const companiesData = await fetchJson(apiUrl + '/hf_companies')

const klantenData = await fetchJson(apiUrl + `/hf_stakeholders/?filter={"company_id":"4","type":"klanten"}`)
console.log(klantenData.data)

// ROUTES 
app.get('/', function(request, response) {
    
    response.render('index', {
        sdgs: sdgData.data,
        scores: scoresData.data,
        companies: companiesData.data
    })
    response.redirect(303, '/')
})

app.get('/bedrijf/:id', function(request, response) {
    fetchJson(apiUrl + '/hf_companies/' + request.params.id).then((companiesData) => {
        fetchJson(apiUrl + `/hf_stakeholders/?filter={"company_id":"${request.params.id}"}`).then((stakeholdersData) => { 
            response.render('bedrijf', {
                sdgs: sdgData.data,
                stakeholders: stakeholdersData.data,
                scores: scoresData.data,
                companies: companiesData.data,
                klanten: klantenData.data
            }) 
        })
    }) 
})    

// Stel het poortnummer in waar express op moet gaan luisteren
app.set('port', process.env.PORT || 8000)

// Start express op, haal daarbij het zojuist ingestelde poortnummer op
app.listen(app.get('port'), function() {
  // Toon een bericht in de console en geef het poortnummer door
    console.log(`Application started on http://localhost:${app.get('port')}`)
})