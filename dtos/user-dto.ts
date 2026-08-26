export default interface UserDTO {
  id: string;
  username: string;
  publicName: string;
  email: string;
  phone: string;
  updatedAt?: string | null;
  isActive: boolean;
  createdAt?: string | null;
}
