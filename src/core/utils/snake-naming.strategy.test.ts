import { SnakeNamingStrategy } from './snake-naming.strategy';

describe('SnakeNamingStrategy', () => {
  let strategy: SnakeNamingStrategy;

  beforeEach(() => {
    strategy = new SnakeNamingStrategy();
  });

  describe('tableName', () => {
    it('should return custom name if provided', () => {
      expect(strategy.tableName('TestClass', 'custom_name')).toBe(
        'custom_name',
      );
    });

    it('should return snake case of class name if custom name is not provided', () => {
      expect(strategy.tableName('TestClass', '')).toBe('test_class');
    });
  });

  describe('columnNameCustomized', () => {
    it('should return snake case of custom name', () => {
      expect(strategy.columnNameCustomized('customName')).toBe('custom_name');
    });
  });

  describe('relationName', () => {
    it('should return snake case of property name', () => {
      expect(strategy.relationName('propertyName')).toBe('property_name');
    });
  });
});
