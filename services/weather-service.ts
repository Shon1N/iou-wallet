import EnvelopeDTO from '../dtos/envelope-dto';
import WeatherData from '../dtos/weather-data-dto';
import LocationData from '../dtos/location-data';
import api from './api-service';


const WeatherService = {
    async GetByLocationAsync(locationData:LocationData):Promise<EnvelopeDTO>{
        const envelope: EnvelopeDTO = {Data:[], Result:"", Status: 0};

        try{
            const response:any = await api.post('/weather/GetByLocationAsync', locationData);
            envelope.Data = response.data.Data as WeatherData;
            envelope.Result = response.data.Result;
            envelope.Status = response.data.Status;
        }catch(err){
            envelope.Result = "Network error.";
            envelope.Status = 500;
        }
        finally{
            return envelope;
        }
    }
};

export default WeatherService;