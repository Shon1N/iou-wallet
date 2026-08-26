import BeneficiaryTypeDTO from "./beneficiary-type-dto";
import UserDTO from "./user-dto";

export default interface BeneficiaryDTO {
  id?: string;
  userId: string;
  benUserId: string;
  benUser?: UserDTO;
  benTypeId: string;
  beneficiaryType?: BeneficiaryTypeDTO;
  isActive: boolean;
  updatedAt?: string | null;
  createdAt?: string | null;
}
