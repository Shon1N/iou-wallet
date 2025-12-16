import AuthDTO  from '../dtos/auth-dto';

class StateService {
  private _auth: AuthDTO | null = null;
  private listeners: ((isAuthenticated: boolean) => void)[] = [];

  get auth(): AuthDTO | null {
    return this._auth;
  }

  private set auth(value: AuthDTO | null) {
    this._auth = value;
  }

  isAuthenticated(): boolean {
    return this._auth !== null && this._auth.Token?.length > 0;
  }

  setAuth(authData: AuthDTO) {
    this._auth = authData;
    this.notifyListeners(this.isAuthenticated());
  }

  clearAuth() {
    this._auth = null;
    this.notifyListeners(this.isAuthenticated());
  }

  subscribeAuth(listener: (isAuthenticated: boolean) => void) {
    this.listeners.push(listener);
    listener(this.isAuthenticated()); // Notify the initial state
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notifyListeners(isAuthenticated: boolean) {
    this.listeners.forEach(listener => listener(isAuthenticated));
  }

}

const stateService = new StateService();

export default stateService;