const fs = require('fs');
const resources = require('./src/resources');

const resourcesString = JSON.stringify(resources.default);
fs.writeFile('resourcesJSON.json', resourcesString);
