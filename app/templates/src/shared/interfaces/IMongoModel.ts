export interface IMongoModel {
  _id?: string;
  __v?: any;
  _doc?: any;
  createdAt?: string;
  updatedAt?: string;
}
export type MongoOperations<T> = T | _mongoOperations<T>;

/**
 * MongoMerger is all attrs from model + all logicalOperators on toplevel
 * If you use attr as a object, all other expressions from mongo appear as $lt, $gte etc
 */
export type MongoMerger<T> = MongoLogicalOperations<T> & {
  [P in keyof T]?: MongoOperations<T[P]>;
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
  crs?: {
    type: 'name',
    properties: { name: 'urn:x-mongodb:crs:strictwinding:EPSG:4326' }
  }
  geometries?: _mongoGeometries
}
type MongoComparisonOperators<T> = {
  /**
   * Matches any of the values specified in an array.
   */
  $in?: T[];
  /**
   * Matches none of the values specified in an array.
   */
  $nin?: T[];
  /**
   * Matches values that are equal to a specified value.
   */
  $eq?: T;
  /**
   * Matches values that are greater than a specified value.
   */
  $gt?: T;
  /**
   * Matches values that are greater than or equal to a specified value.
   */
  $gte?: T;
  /**
   * Matches values that are less than a specified value.
   */
  $lt?: T;
  /**
   * Matches values that are less than or equal to a specified value.
   */
  $lte?: T;
  /**
   * Matches all values that are not equal to a specified value.
   */
  $ne?: T;
}
type MongoArrayOperators<T> = {
  /**
 * The $all operator selects the documents where the value of a field is an array that contains all the specified elements.
 */
  $all?: T[];
  /**
   * The $elemMatch operator matches documents that contain an array field with at least one element that matches all the specified query criteria.
   * If you specify only a single <query> condition in the $elemMatch expression, you do not need to use $elemMatch.
   */
  $elemMatch?: _mongoOperations<T>;
  /**
   * The $size operator matches any array with the number of elements specified by the argument.
   */
  $size?: number;
}
type MongoElementOperators = {
  /**
   * Matches documents that have the specified field.
   */
  $exists?: boolean;
  /**
   * Selects documents if a field is of the specified type.
   */
  $type?: number[];
}
type MongoEvaluationOperators = {
  /**
   * Performs a modulo operation on the value of a field and selects documents with a specified result.
   */
  $mod?: [number, number];
  /**
   * Selects documents where values match a specified regular expression.
   */
  $regex?: RegExp;
  /**
   * Option object used by $regex operator https://docs.mongodb.com/manual/reference/operator/query/regex/#op._S_options
   */
  $options?: string;
  /**
   * Performs text search.
   */
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
  /**
   * Matches documents that satisfy a JavaScript expression.
   */
  $where?: Function;
}
type MongoGeospatialOperators = {
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
  /**
   * Selects documents with geospatial data that exists entirely within a specified shape.
   * The specified shape can be either a GeoJSON Polygon (either single-ringed or multi-ringed), a GeoJSON MultiPolygon, or a shape defined by legacy coordinate pairs. 
   * The $geoWithin operator uses the $geometry operator to specify the GeoJSON object.
   */
  $geoWithin?: {
    $geometry: {
      type: 'Polygon' | 'MultiPolygon',
      coordinates: [[geoJSONPoint]]
    }
  }
  /**
   * Specifies a point for which a geospatial query returns the documents from nearest to farthest.
   * MongoDB calculates distances for $nearSphere using spherical geometry.
   * $nearSphere requires a geospatial index:
   *    2dsphere index for location data defined as GeoJSON points
   *    2d index for location data defined as legacy coordinate pairs.
   *    To use a 2d index on GeoJSON points, create the index on the coordinates field of the GeoJSON object.
   * The $nearSphere operator can specify either a GeoJSON point or legacy coordinate point.
   */
  $nearSphere?: {
    $geometry: {
      type: 'Point',
      coordinates: geoJSONPoint
    },
    $maxDistance: number;
    $minDistance: number;
  }
}
type MongoLogicalOperations<T> = {
  /**
   * Joins query clauses with a logical AND returns all documents that match the conditions of both clauses.
   */
  $and?: MongoMerger<T>[];
  /**
   * Inverts the effect of a query expression and returns documents that do not match the query expression
   */
  $not?: MongoMerger<T>[];
  /**
   * Joins query clauses with a logical NOR returns all documents that fail to match both clauses.
   */
  $nor?: MongoMerger<T>[];
  /**
   * Joins query clauses with a logical OR returns all documents that match the conditions of either clause.
   */
  $or?: MongoMerger<T>[];
}
interface _mongoOperations<T> extends
  MongoComparisonOperators<T>,
  MongoGeospatialOperators,
  MongoArrayOperators<T>,
  MongoElementOperators,
  MongoEvaluationOperators {
}