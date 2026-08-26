import EnvelopeDTO from "../dtos/envelope-dto";
import RepaymentDTO from "../dtos/repayment-dto";
import api from "./api-service";

const RepaymentService = {
  async CreateAsync(repaymentDTO: RepaymentDTO): Promise<EnvelopeDTO> {
    const envelope: EnvelopeDTO = {
      data: null,
      result: "",
      message: "",
      statusCode: 0,
    };

    try {
      const response: any = await api.post("/repayment/CreateAsync", repaymentDTO);
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
      const response: any = await api.get(`/repayment/${id}/GetByIdAsync`);
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
      const response: any = await api.get(`/repayment/${userId}/GetAllByUserIdAsync`);
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

  async GetAllByLoanIdAsync(loanId: string): Promise<EnvelopeDTO> {
    const envelope: EnvelopeDTO = {
      data: null,
      result: "",
      message: "",
      statusCode: 0,
    };

    try {
      const response: any = await api.get(`/repayment/${loanId}/GetAllByLoanIdAsync`);
      envelope.data = response.data.data;
      envelope.result = response.data.result;
      envelope.message = response.data.message;
      envelope.statusCode = response.data.statusCode;
    } catch (err) {
      envelope.result = "Network error.";
      envelope.statusCode = 500;
      console.error("GetAllByLoanIdAsync error:", err);
    }
    return envelope;
  },
};

export default RepaymentService;
