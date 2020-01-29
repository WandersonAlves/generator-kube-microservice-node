import GenericException from '../exceptions/GenericException';

export default function withException<T>(target: object, name: string | symbol, descriptor: PropertyDescriptor): TypedPropertyDescriptor<T> {
  const original = descriptor.value;
  descriptor.value = async function(...args) {
    try {
      await original.apply(this, args);
    } catch (err) {
      throw new GenericException({
        name: err.name,
        message: err.message,
        statusCode: err.statusCode,
        extras: err.extras,
      });
    }
  };
  return descriptor;
}
