import GenericException from "../exceptions/GenericException";

export default function withException(target, name, descriptor) {
  const original = descriptor.value;
  descriptor.value = async function(...args) {
    try {
      await original.apply(this, args);
    }
    catch (err) {
      args[2](new GenericException({
        name: err.name,
        message: err.message,
        statusCode: err.statusCode,
        extras: err.extras,
      }));
    }
  };
  return descriptor;
}
