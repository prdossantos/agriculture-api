import { DefaultNamingStrategy, NamingStrategyInterface } from 'typeorm';
import { snakeCase } from 'typeorm/util/StringUtils';

export class SnakeNamingStrategy
  extends DefaultNamingStrategy
  implements NamingStrategyInterface
{
  tableName(className: string, customName: string): string {
    return customName ? customName : snakeCase(className);
  }

  columnName(
    propertyName: string,
    customName: string,
    embeddedPrefixes: string[],
  ): string {
    return snakeCase(
      embeddedPrefixes.join('_') + (customName ? customName : propertyName),
    );
  }

  columnNameCustomized(customName: string): string {
    return snakeCase(customName);
  }

  relationName(propertyName: string): string {
    return snakeCase(propertyName);
  }
}
