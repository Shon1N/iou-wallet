import EnvelopeDTO from "../dtos/envelope-dto";
import LoginDTO from "../dtos/login-dto";
import api from "./api-service";
import AuthDTO from "../dtos/auth-dto";

const WeatherService = {
  async LoginAsync(loginDTO: LoginDTO): Promise<EnvelopeDTO> {
    const envelope: EnvelopeDTO = { Data: null, Result: "", Status: 0 };

    try {
      const response: any = await api.post("/auth/LoginAsync", loginDTO);
      envelope.Data = response.data.Data as AuthDTO;
      envelope.Result = response.data.Result;
      envelope.Status = response.data.Status;
    } catch (err) {
      envelope.Result = "Network error.";
      envelope.Status = 500;
    } finally {
      return envelope;
    }
  },
};

export default WeatherService;
