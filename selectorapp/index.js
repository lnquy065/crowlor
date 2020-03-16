const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const axios = require('axios');
var mongoClient = require("mongodb").MongoClient;
class SelectorApp {
    constructor(queryconnect, querydb, querycolection) {
        this.queryconnect = queryconnect;
        this.querydb = querydb;
        this.querycolection = querycolection;
    }

    async Run() {
        const client = await mongoClient.connect(this.queryconnect);
        const db = client.db(this.querydb);
        try {
            setInterval(() => {
                db.collection(this.querycolection).find({}).toArray((err, datajson) => {
                    this.ReadJSON(datajson);
                });
            }, 3600000);
            console.log('App running...')
        } catch (error) {
            console.log("ERROR: " + error);
            db.close();
        }
    }

    ReadJSON(datajson) {
        datajson.forEach(async(elmjson) => {
            if (elmjson.scheduled == "1h") {
                var dataURL = await new Promise(r => axios({
                    method: 'GET',
                    url: elmjson.url,
                }).then(function(res) { r(res) }));

                const dom = new JSDOM(dataURL.data);
                var data = "";
                elmjson.selectors.forEach((elmselectors, index) => {
                    let result = "";
                    if (elmselectors.get === 'innerHTML') {
                        if (dom.window.document.querySelector(elmselectors.query)) {
                            result = dom.window.document.querySelector(elmselectors.query).innerHTML;
                        }
                    } else if (elmselectors.get === 'value') {
                        if (dom.window.document.querySelector(elmselectors.query)) {
                            result = dom.window.document.querySelector(elmselectors.query).value;
                        }
                    } else if (elmselectors.get === 'NodeList') {
                        if (dom.window.document.querySelectorAll(elmselectors.query)) {
                            let results = dom.window.document.querySelectorAll(elmselectors.query);
                            let arrResult = []
                            results.forEach(element => {
                                arrResult.push(element.outerHTML);
                            });
                            result = arrResult;
                        }
                    }
                    if (index == 0) {
                        data += '{"' + elmselectors.alias + '":' + JSON.stringify(result) + ','
                    } else if (index == elmjson.selectors.length - 1) {
                        data += '"' + elmselectors.alias + '":' + JSON.stringify(result) + '}'
                    } else {
                        data += '"' + elmselectors.alias + '' + JSON.stringify(result) + ''
                    }
                });
                this.CallEndpoint(elmjson.webhook, JSON.parse(data));
            }
        });
    }

    CallEndpoint(webhook, data) {
        axios({
            method: webhook.method,
            url: webhook.endpoint,
            headers: webhook.headers,
            data: data
        }).then(function(res) {
            console.log("Call Endpoint success");
        }).catch(error => {
            console.log(error)
        });
    }

}

module.exports = SelectorApp;