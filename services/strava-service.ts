import axios from 'axios';

const stravaApi = axios.create({
    baseURL: 'https://www.strava.com',
    headers: {
      'Content-Type': 'application/json',
    },
  });

const StravaService = {
    async GetAccessToken(){
        try{
            const response:any = await stravaApi.post('/oauth/mobile/authorize?client_id=157862&client_secret=b2f479f3766b5ef263a71681bdab0260a3ce4fe1&code=78e8307ab7845284fe1977f3b8adc8bbb6b01783&grant_type=78e8307ab7845284fe1977f3b8a');
            console.log("Strava response: ", response);
        }catch(err){
            console.log("Strava error: ", err);
       }
        finally{
        }
    }
};


  
export default StravaService;