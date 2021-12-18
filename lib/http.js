const https = require('https')

export default function httpRequest(options, payload = null, protocol =  null){
    const handleResponse = (callback, status, message) => {
        return callback({
            status: status,
            data: message
        })
    }
    return new Promise((resolve, reject) => {
        if(!protocol) protocol = https
        const req = protocol.request(options, res => {
            let body = [];
            res.on('data', chunk => {
                body.push(chunk);
            });
            res.on('end', async() => {
                body = Buffer.concat(body).toString()
                try{
                    body = JSON.parse(body);
                } catch(error){
                    console.log('http request error', error)
                    return handleResponse(reject, res.statusCode, body)
                }
                console.log('http statusCode', res.statusCode)
                if (res.statusCode < 200 || res.statusCode >= 300) {
                    console.log('failure body: ', body)
                    return handleResponse(reject, res.statusCode, body)
                }
                return handleResponse(resolve, res.statusCode, body)
            })
        })
        req.on('error', error => {
            handleResponse(reject, 500, error.message)
        })
        if(payload)
            req.write(payload)
        /* if(form_data)
            form_data.pipe(req); */
        req.end()  
    })
}