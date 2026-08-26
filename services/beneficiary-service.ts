import BeneficiaryDTO from "../dtos/beneficiary-dto";
import EnvelopeDTO from "../dtos/envelope-dto";
import api from "./api-service";

const BeneficiaryService = {
  async CreateAsync(beneficiaryDTO: BeneficiaryDTO): Promise<EnvelopeDTO> {
    const envelope: EnvelopeDTO = {
      data: null,
      result: "",
      message: "",
      statusCode: 0,
    };

    try {
      const response: any = await api.post("/beneficiary/CreateAsync", beneficiaryDTO);
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

  async GetByIdAsync(id: string): Promise<EnvelopeDTO> {
    const envelope: EnvelopeDTO = {
      data: null,
      result: "",
      message: "",
      statusCode: 0,
    };

    try {
      const response: any = await api.get(`/beneficiary/${id}/GetByIdAsync`);
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
      const response: any = await api.get(`/beneficiary/${userId}/GetAllByUserIdAsync`);
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

  async UpdateAsync(id: string, beneficiaryDTO: BeneficiaryDTO): Promise<EnvelopeDTO> {
    const envelope: EnvelopeDTO = {
      data: null,
      result: "",
      message: "",
      statusCode: 0,
    };

    try {
      const response: any = await api.put(`/beneficiary/${id}/UpdateAsync`, beneficiaryDTO);
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

  async DeleteAsync(id: string, beneficiaryDTO: BeneficiaryDTO): Promise<EnvelopeDTO> {
    const envelope: EnvelopeDTO = {
      data: null,
      result: "",
      message: "",
      statusCode: 0,
    };

    try {
      const response: any = await api.delete(`/beneficiary/${id}/DeleteAsync`, { data: beneficiaryDTO });
      envelope.data = response.data.data;
      envelope.result = response.data.result;
      envelope.message = response.data.message;
      envelope.statusCode = response.data.statusCode;
    } catch (err) {
      envelope.result = "Network error.";
      envelope.statusCode = 500;
      console.error("DeleteAsync error:", err);
    }
    return envelope;
  },
};

export default BeneficiaryService;
