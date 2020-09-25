import axios from 'axios';

require('dotenv/config');

async function getUserUsername() {
    
    const username = await (await axios.post(process.env.REACT_APP_SERVER_ADDRESS + '/evaluator_username',
            { sessionId: localStorage.getItem('e') }
        )).data;
    
    return username
}

export default getUserUsername;