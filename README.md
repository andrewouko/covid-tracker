# Project Description
This is a FRONTEND web application that helps users visualize the Covid-19 presence in the United States. 
The information is presented according to states and also aggregated Nation-wide.

## User Inerface Brief Description
When the page loads a Google Maps interface will be created with markers set on each of the USA states with Covid Cases.
The sidebar can be opened (or closed) by clicking on the Chevron icon to show more detailed information of the statistics.
Clicking on a marker on the map, will update the sidebar with Covid statistics for the state selected.
Using the autocomplete on the sidebar will also filter data for a specific state.
When the filter is cleared the sidebar shows information.
# Brief Description of Tools used in this application
### 1. NextJS
This is frontend ReactJS framework. The motivation behind using this was to fasten the development process as well as maintain application performance and scalability. It serves the application through a NodeJS server.
 For installation go to `https://nextjs.org/`

### 2. React Material UI
This is an open source React Component library that enables us to build a scalable and resposive application quickly. It has ready made UI components for most use cases. The components are also easily customizable. This project uses Version 5 of the library. For installtion go to `https://mui.com/getting-started/installation/`

### 3. React Google Maps
This is an npm package that wraps around the V3 of the Google Maps library. It abstracts most of the complexity of installing Google Maps on the frontend. You will still need to setup and API key and Billing information in the Google Console. `https://www.npmjs.com/package/react-google-maps`

### 4. Recompose
Recompose is a React utility belt for functional components and higher-order components. `https://www.npmjs.com/package/recompose`

### 5. NovelCovid API
This API is used to get the latest Covid-19 statistics. Specifically, the application uses the /v2/states and /v2/countries/:query endpoints. The former returns the Covid-19 statisics for each USA state. The latter returns the aggregated Covid-19 for the entire USA. The documentation can be found at `https://documenter.getpostman.com/view/11144369/Szf6Z9B3?version=latest#deb6cab2-fe80-4532-be14-f7d86635078f`

### 6. MapQuest GeoCodingAPI
This API is used to get latitude and longitude information for a each state. This is important for rendering markers in the map correctly. `https://developer.mapquest.com/documentation/geocoding-api/address/get/`

# How to start the application

### 1. Get the required API Keys
#### a. Google MAPS
Follow the guide on `https://developers.google.com/maps/documentation/maps-static/get-api-key` to get your Google MAPS API Key

#### a. MapQuest GeoCodingAPI
Setup a free account on `https://developer.mapquest.com/plan_purchase/steps/business_edition/business_edition_free/register`. After that, get the API key on `https://developer.mapquest.com/user/me/profile` after signing in.

### 2. Install dependencies using npm

`npm install`

### 3. Create .env.local file in `the project root folder` with following variables :

-   `NEXT_PUBLIC_GEO_CODE_KEY` : This is the API keys for using MapQuest GeoCoding API. The key is located at `https://developer.mapquest.com/user/me/profile` after signing up. It needs to be prefixed with NEXT_PUBLIC_ to be available of the frontend.
-   `NEXT_PUBLIC_GOOGLE_MAPS_KEY` : This is the API key for using the Maps for Javascript API & Services. It is located in the Credential section of the Google Developer Console. It needs to be prefixed with NEXT_PUBLIC_ to be available of the frontend.

### 4. Build the Application using the scripts provided in package.json
`npm run build`

## 5. Run the NodeJs production server using the scripts provided in package.json :

`npm run start`

*Application will now be accessible from port 3000*

## 5.1 Optionally Run the NodeJs production server on a different port:

`npm run start -- -p 3005`

*Application will now be accessible from port 3005. You can chnage this to any port you like.*


# Technical Tradeoffs
### 1. Covid Data API
Due to the `https://www.trackcorona.live/api` API being discontinued, I was forced to use the NovelCovidAPI whose data although exhaustive seems inaccurate. The NovelCovidAPI also does not have geometry information about the USA states: hence I was forced to amalgamate it with the MAPQuest GeoCoding API to get the Longitude and Latitude information.

### 2. Unstable MapQuest GeoCodingAPI
The MapQuest GeoCoding API has been noted to be unstable. It responds with `net::ERR_NETWORK_CHANGED` in some cases when fetching the longitude and latitude data for a given state or address. This could be due rate limiting on the API. The tradeoff for this unstable API is to filter out all the states that the service was not able to get the longitude and latitude data necessary for creating markers on the map. This means on different reloads of the page we will have different number of markers on the map.

### 3. Deprecated ReactJS features in react-google-maps package
The react-google-maps package uses some outdated features in it's code. This will lead to some warnings when building the applciation and starting the server. Nevertheless the application will continue to function as the features used are not breaking changes.
