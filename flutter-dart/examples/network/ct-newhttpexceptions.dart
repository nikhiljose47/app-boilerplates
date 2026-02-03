//Constructing new exceptions for http for typed error system in the extended framework

abstract class NetworkException implements Exception {
  final String message;
  NetworkException(this.message);
}

class NoInternetException extends NetworkException {
  NoInternetException() : super('No internet connection 📵');
}

class ServerException extends NetworkException {
  ServerException(String message) : super('Server error: $message 🚨');
}

class TimeoutException extends NetworkException {
  TimeoutException() : super('Request timeout ⏰');
}

class UnauthorizedException extends NetworkException {
  UnauthorizedException() : super('Unauthorized access 🔐');
}
