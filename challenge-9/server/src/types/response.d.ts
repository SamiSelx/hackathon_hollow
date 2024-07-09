export default interface ResponseI {
    status: string;
    message: string;
    data?: unknown;
    error?: unknown;
  }