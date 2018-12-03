const axios = require('axios')
const http = require('http')

var port = 8080
var server = http.createServer()

    server.on('request', function(request, response) {
        response.writeHead(200)
    
        console.log('\nNew request: http://localhost:' + port + '' + request.url)
        response.write('Unspent output results printed on other terminal\n')
        response.end()
    
        doTheStuff(request.url)
    
    })

    server.listen(port);
    console.log('Make the requests on http://localhost:' + port + '/address/<bitcoin-address>');


function doTheStuff(url) {

    /*
     * correct url must be 43 characters long
     * example: /address/14DjTuAUh87cwRsbU1z6W8hZY6FnEkpfLS
     */
    if(url.length != 43) {
        console.log('Invalid url: ' + url)
        return
    }

    let address = url.replace('/address/', '')

    // blockchain.info API
    axios.get('https://blockchain.info/unspent?active=' + address)
        .then(function(response) {

            let result = {
                outputs: []
            }

            for(let i = 0; i < response.data.unspent_outputs.length; i++) {
                let unspentOutput = response.data.unspent_outputs[i]

                let obj = {
                    value: unspentOutput.value,
                    tx_hash: unspentOutput.tx_hash,
                    output_idx: unspentOutput.tx_index,
                }

                result.outputs.push(obj)
            }

            // formats the output
            let unspentTransactionOutputs = JSON.stringify(result, null, 3)
            console.log('Unspent transaction outputs:')
            console.log(unspentTransactionOutputs)

        }).catch(function(error) {
            console.log(error.message)
            console.log('=> No free outputs to spend')
        })
}