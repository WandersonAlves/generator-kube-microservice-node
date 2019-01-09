export interface IMongoModel {
  _id?: string;
  __v?: any;
  _doc?: any;
  createdAt?: string;
  updatedAt?: string;
  $expr?: any;
}
/**
 * T is the type of a attr from a interface
 * P is the raw interface
 */
export type IMongoOperations<T, P> = T | _mongoOperations<T, P>;

export type MongoMerger<T> = {
  [P in keyof T]?: IMongoOperations<T[P], T>;
}

export enum MongoBSONTypes {
  DOUBLE = 1,
  STRING,
  OBJECT,
  ARRAY,
  BINARY_DATA,
  UNDEFINED,
  OBJECTID,
  BOOLEAN,
  DATE,
  NULL,
  REGULAR_EXPRESSION,
  DBPOINTER,
  JAVASCRIPT,
  SYMBOL,
  JAVASCRIPT_SCOPE,
  INTEGER32BITS,
  TIMESTAMP,
  INTEGER64BITS,
  DECIMAL128,
  MINKEY = -1,
  MAXKEY = 127
}

type geoJSONPoint = [number, number];

type _mongoGeometries = {
  type: 'Polygon' | 'Overview' | 'Point' | 'LineString' | 'MultiPoint' | 'MultiLineString' | 'MultiPolygon' | 'GeometryCollection',
  coordinates?: geoJSONPoint | [geoJSONPoint] | [[geoJSONPoint]] | [[[geoJSONPoint]]]
  geometries?: _mongoGeometries
}

type _mongoOperations<T, P> = {
  /** COMPARISON OPERATORS */
  // Matches any of the values specified in an array.
  $in?: T[];
  // Matches none of the values specified in an array.
  $nin?: T[];
  // Matches values that are equal to a specified value.
  $eq?: T;
  // Matches values that are greater than a specified value.
  $gt?: T;
  // Matches values that are greater than or equal to a specified value.
  $gte?: T;
  // Matches values that are less than a specified value.
  $lt?: T;
  // Matches values that are less than or equal to a specified value.
  $lte?: T;
  // Matches all values that are not equal to a specified value.
  $ne?: T;

  /** LOGICAL OPERATORS */
  // Joins query clauses with a logical AND returns all documents that match the conditions of both clauses.
  $and?: _mongoOperations<T, P>[];
  // Inverts the effect of a query expression and returns documents that do not match the query expression
  $not?: _mongoOperations<T, P>[];
  // Joins query clauses with a logical NOR returns all documents that fail to match both clauses.
  $nor?: Partial<P>[];
  // Joins query clauses with a logical OR returns all documents that match the conditions of either clause.
  $or?: Partial<P>[];

  /** ELEMENT OPERATORS */
  // Matches documents that have the specified field.
  $exists?: boolean;
  // Selects documents if a field is of the specified type.
  $type?: number[];
  // Performs a modulo operation on the value of a field and selects documents with a specified result.

  /** EVALUATION OPERATORS */
  $mod?: [number, number];
  // Selects documents where values match a specified regular expression.
  $regex?: RegExp;
  // Option object used by $regex operator https://docs.mongodb.com/manual/reference/operator/query/regex/#op._S_options
  $options?: string;
  // Performs text search.
  $text?: {
    /**
     * A string of terms that MongoDB parses and uses to query the text index.
     * MongoDB performs a logical OR search of the terms unless specified as a phrase.
     * See Behavior for more information on the field.
     */
    $search: string,
    /**
     * Optional.
     * The language that determines the list of stop words for the search and the rules for the stemmer and tokenizer.
     * If not specified, the search uses the default language of the index.
     * For supported languages, see Text Search Languages.
     * If you specify a language value of "none", then the text search uses simple tokenization with no list of stop words and no stemming.
     */
    $language?: string,
    /**
     * Optional.
     * A boolean flag to enable or disable case sensitive search.
     * Defaults to false; i.e. the search defers to the case insensitivity of the text index.
     */
    $caseSensitive?: boolean,
    /**
     * Optional.
     * A boolean flag to enable or disable diacritic sensitive search against version 3 text indexes.
     * Defaults to false; i.e. the search defers to the diacritic insensitivity of the text index.
     * Text searches against earlier versions of the text index are inherently diacritic sensitive and cannot be diacritic insensitive.
     * As such, the $diacriticSensitive option has no effect with earlier versions of the text index.
     */
    $diacriticSensitive?: boolean
  };
  // Matches documents that satisfy a JavaScript expression.
  $where?: Function;
  /** GEOSPATIAL OPERATORS */
  $geoIntersects?: {
    $geometry: _mongoGeometries
  }
  /**
   * Specifies a point for which a geospatial query returns the documents from nearest to farthest.
   * The $near operator can specify either a GeoJSON point or legacy coordinate point.
   * $near requires a geospatial index:
   *    2dsphere index if specifying a GeoJSON point,
   *    2d index if specifying a point using legacy coordinates.
   */
  $near?: {
    $geometry: {
      type: 'Point',
      coordinates: geoJSONPoint
    },
    $maxDistance: number;
    $minDistance: number;
  }
}