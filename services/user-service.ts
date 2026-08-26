import EnvelopeDTO from "../dtos/envelope-dto";
import UserDTO from "../dtos/user-dto";
import api from "./api-service";

const UserService = {
  async CreateAsync(userDTO: UserDTO): Promise<EnvelopeDTO> {
    const envelope: EnvelopeDTO = {
      data: null,
      result: "",
      message: "",
      statusCode: 0,
    };

    try {
      const response: any = await api.post("/user/CreateAsync", userDTO);
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
      const response: any = await api.get(`/user/${id}/GetByIdAsync`);
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

  async GetByUsernameAsync(username: string): Promise<EnvelopeDTO> {
    const envelope: EnvelopeDTO = {
      data: null,
      result: "",
      message: "",
      statusCode: 0,
    };

    try {
      const response: any = await api.get(`/user/${username}/GetByUsernameAsync`);
      envelope.data = response.data.data;
      envelope.result = response.data.result;
      envelope.message = response.data.message;
      envelope.statusCode = response.data.statusCode;
    } catch (err) {
      envelope.result = "Network error.";
      envelope.statusCode = 500;
      console.error("GetByUsernameAsync error:", err);
    }
    return envelope;
  },

  async GetAllByFilteredAsync(skip: number, take: number, filter: string): Promise<EnvelopeDTO> {
    const envelope: EnvelopeDTO = {
      data: null,
      result: "",
      message: "",
      statusCode: 0,
    };

    try {
      const queryFilter = filter && filter.trim().length > 0 ? encodeURIComponent(filter.trim()) : "all";
      const response: any = await api.get(`/user/${skip}/${take}/${queryFilter}/GetAllByFilteredAsync`);
      envelope.data = response.data.data;
      envelope.result = response.data.result;
      envelope.message = response.data.message;
      envelope.statusCode = response.data.statusCode;
    } catch (err) {
      envelope.result = "Network error.";
      envelope.statusCode = 500;
      console.error("GetAllByFilteredAsync error:", err);
    }
    return envelope;
  },

  async UpdateAsync(id: string, userDTO: UserDTO): Promise<EnvelopeDTO> {
    const envelope: EnvelopeDTO = {
      data: null,
      result: "",
      message: "",
      statusCode: 0,
    };

    try {
      const response: any = await api.put(`/user/${id}/UpdateAsync`, userDTO);
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

  async DeleteAsync(id: string, userDTO: UserDTO): Promise<EnvelopeDTO> {
    const envelope: EnvelopeDTO = {
      data: null,
      result: "",
      message: "",
      statusCode: 0,
    };

    try {
      const response: any = await api.delete(`/user/${id}/DeleteAsync`, { data: userDTO });
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

export default UserService;
