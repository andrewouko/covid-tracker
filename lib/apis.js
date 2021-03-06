const httpRequest = require('./http').default

function getCountyData() {
    const options = {
        hostname: `corona.lmao.ninja`,
        path: `/v2/jhucsse/counties`,
        method: 'GET',
    }
    return httpRequest(options)
}

function getStateData() {
    const options = {
        hostname: `corona.lmao.ninja`,
        path: `/v2/states`,
        method: 'GET',
    }
    return httpRequest(options)
}
function getCountryData(country){
    const options = {
        hostname: `corona.lmao.ninja`,
        path: `/v2/countries/${country}`,
        method: 'GET',
    }
    return httpRequest(options)
}

function getGeoCode(location){
    // console.log('api key', process.env.NEXT_PUBLIC_GEO_CODE_KEY)
    const url = require('url')
    const requestUrl = url.parse(url.format({
        protocol: 'http',
        hostname: 'www.mapquestapi.com',
        pathname: '/geocoding/v1/address',
        query: {
            key: process.env.NEXT_PUBLIC_GEO_CODE_KEY || 'j7N6mfDdoJGO8Ar6EWZtFpi9HL8mPRvj',
            location: location
        }
    }));
    const options = {
        hostname: requestUrl.hostname,
        path: requestUrl.path,
        method: 'GET',
    }
    const http = require('http')
    return httpRequest(options, null, http)
}

function getGeoJson(state_iso_code){
    // console.log('api key', process.env.NEXT_PUBLIC_GEO_CODE_KEY)
    const options = {
        hostname: 'raw.githubusercontent.com',
        path: `/unitedstates/districts/gh-pages/states/${state_iso_code}/shape.geojson`,
        method: 'GET',
    }
    return httpRequest(options)
}

module.exports = {
    getCountyData,
    getStateData,
    getCountryData,
    getGeoCode,
    getGeoJson
}
