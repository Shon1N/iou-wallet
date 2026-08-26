import EnvelopeDTO from "../dtos/envelope-dto";
import LoanDTO from "../dtos/loan-dto";
import api from "./api-service";

const LoanService = {
  async CreateAsync(loanDTO: LoanDTO): Promise<EnvelopeDTO> {
    const envelope: EnvelopeDTO = {
      data: null,
      result: "",
      message: "",
      statusCode: 0,
    };

    try {
      const response: any = await api.post("/loan/CreateAsync", loanDTO);
      envelope.data = response.data.data;
      envelope.result = response.data.result;
      envelope.message = response.data.message;
      envelope.statusCode = response.data.statusCode;
    } catch (err) {
      envelope.result = "Network error.";
      envelope.statusCode = 500;
      console.error("CreateAsync error:", err);
    }
    return envelope;
  },

  async UpdateAsync(id: string, loanDTO: LoanDTO): Promise<EnvelopeDTO> {
    const envelope: EnvelopeDTO = {
      data: null,
      result: "",
      message: "",
      statusCode: 0,
    };

    try {
      const response: any = await api.put(`/loan/${id}/UpdateAsync`, loanDTO);
      envelope.data = response.data.data;
      envelope.result = response.data.result;
      envelope.message = response.data.message;
      envelope.statusCode = response.data.statusCode;
    } catch (err) {
      envelope.result = "Network error.";
      envelope.statusCode = 500;
      console.error("UpdateAsync error:", err);
    }
    return envelope;
  },

  async GetByIdAsync(id: string): Promise<EnvelopeDTO> {
    const envelope: EnvelopeDTO = {
      data: null,
      result: "",
      message: "",
      statusCode: 0,
    };

    try {
      const response: any = await api.get(`/loan/${id}/GetByIdAsync`);
      envelope.data = response.data.data;
      envelope.result = response.data.result;
      envelope.message = response.data.message;
      envelope.statusCode = response.data.statusCode;
    } catch (err) {
      envelope.result = "Network error.";
      envelope.statusCode = 500;
      console.error("GetByIdAsync error:", err);
    }
    return envelope;
  },

  async GetAllByUserIdAsync(userId: string): Promise<EnvelopeDTO> {
    const envelope: EnvelopeDTO = {
      data: null,
      result: "",
      message: "",
      statusCode: 0,
    };

    try {
      const response: any = await api.get(`/loan/${userId}/GetAllByUserIdAsync`);
      envelope.data = response.data.data;
      envelope.result = response.data.result;
      envelope.message = response.data.message;
      envelope.statusCode = response.data.statusCode;
    } catch (err) {
      envelope.result = "Network error.";
      envelope.statusCode = 500;
      console.error("GetAllByUserIdAsync error:", err);
    }
    return envelope;
  },

  async GetAllByBenUserIdAsync(benUserId: string): Promise<EnvelopeDTO> {
    const envelope: EnvelopeDTO = {
      data: null,
      result: "",
      message: "",
      statusCode: 0,
    };

    try {
      const response: any = await api.get(`/loan/${benUserId}/GetAllByBenUserIdAsync`);
      envelope.data = response.data.data;
      envelope.result = response.data.result;
      envelope.message = response.data.message;
      envelope.statusCode = response.data.statusCode;
    } catch (err) {
      envelope.result = "Network error.";
      envelope.statusCode = 500;
      console.error("GetAllByBenUserIdAsync error:", err);
    }
    return envelope;
  },
};

export default LoanService;
