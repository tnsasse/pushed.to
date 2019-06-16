module.exports = {

    host: '',

    github: {
        api_url: 'https://api.github.com',
        user: 'cokeSchlumpf',
        client_id: process.env.GH_CLIENT_ID || 'xxx',
        client_secret: process.env.GH_CLIENT_SECRET || 'xxx'
    }
    
}