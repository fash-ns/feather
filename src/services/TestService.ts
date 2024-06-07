class TestService {
  private name: string;
  constructor(name: string) {
    console.log('Service is initialized');
    this.name = name;
  }

  public greet() {
    console.warn('HELLO ' + this.name);
  }
}

export default TestService;
