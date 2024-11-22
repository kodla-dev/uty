/**
 * Type representing an array or a readonly array.
 * @template K - The type of elements in the array.
 */
export type $array<K = unknown> = K[] | Readonly<K[]>;

/**
 * Type representing either an array or an object literal with keys of type
 * string or number, and values of type K or an array of K.
 * @template K - The type of values in the array or object literal.
 */
export type $collect<K = unknown> = $array<K> | $object<K>;

/**
 * Type representing an object literal with keys of type string or number, and
 * values of type K or an array of K.
 * @template K - The type of values in the object literal.
 */
export type $object<K = unknown> = ObjectLiteral<K>;

/**
 * Represents a type that behaves like an array by having a 'length' property.
 */
export interface ArrayLikeLiteral {
  readonly length: number;
}

/**
 * Alias to create a function.
 * @template K - The type of parameters.
 * @template D - The return type.
 */
export type Arrow<K extends List = any, D extends any = any> = (...args: K) => D;

/**
 * Alias to create a async function.
 * @template K - The type of parameters.
 * @template D - The return type.
 */
export type AsyncArrow<K extends List = any[], D = any> = Arrow<K, Promise<D>>;

/**
 * Type representing a class constructor that takes arguments of type K and
 * creates an instance of type D.
 * @template K - The type of arguments the class constructor takes.
 * @template D - The type of the class instance.
 */
export type ClassLiteral<K = any, D = any> = new (...args: K[]) => D;

/**
 * Type that checks if type `K` extends type `D`, and returns type `K` if true,
 * otherwise returns `never`.
 * @template K - The type to be checked.
 * @template D - The type to check against.
 */
export type Include<K, D> = K extends D ? K : never;

/**
 * Alias representing a readonly array.
 * @template K - The type of elements in the list.
 */
export type List<K = any> = ReadonlyArray<K>;

/**
 * Interface representing an object literal with keys of type string or number,
 * and values of type K or an array of K.
 * @template K - The type of values in the object literal.
 */
export interface ObjectLiteral<K> {
  [key: string | number]: K | K[];
}

/**
 * Extract the return type of a function.
 * @template K - The arrow function type.
 */
export type Return<K extends Arrow> = K extends (...args: List) => infer N ? N : never;

/**
 * Represents JavaScript's primitive types.
 */
export type Primitive = string | number | boolean | null | undefined | symbol | bigint;
