import { SnowflakeGenerator } from './snowflake';

describe('SnowflakeGenerator', () => {
  let generator: SnowflakeGenerator;

  beforeEach(() => {
    generator = new SnowflakeGenerator(1);
  });

  describe('constructor', () => {
    it('should create generator with valid machine ID', () => {
      expect(() => new SnowflakeGenerator(1)).not.toThrow();
      expect(() => new SnowflakeGenerator(255)).not.toThrow();
    });

    it('should throw error for invalid machine ID', () => {
      expect(() => new SnowflakeGenerator(-1)).toThrow();
      expect(() => new SnowflakeGenerator(256)).toThrow();
    });
  });

  describe('nextId', () => {
    it('should generate unique IDs', () => {
      const id1 = generator.nextId();
      const id2 = generator.nextId();

      expect(id1).not.toBe(id2);
      expect(typeof id1).toBe('string');
      expect(typeof id2).toBe('string');
    });

    it('should generate IDs with correct length', () => {
      const id = generator.nextId();
      expect(id.length).toBeGreaterThanOrEqual(6);
      expect(id.length).toBeLessThanOrEqual(12);
    });

    it('should generate multiple unique IDs quickly', () => {
      const ids = new Set<string>();
      const count = 1000;

      for (let i = 0; i < count; i++) {
        ids.add(generator.nextId());
      }

      expect(ids.size).toBe(count);
    });
  });

  describe('static methods', () => {
    let testId: string;

    beforeEach(() => {
      testId = generator.nextId();
    });

    it('should extract timestamp from ID', () => {
      const timestamp = SnowflakeGenerator.extractTimestamp(testId);
      const now = new Date();

      expect(timestamp).toBeInstanceOf(Date);
      expect(Math.abs(timestamp.getTime() - now.getTime())).toBeLessThan(1000);
    });

    it('should extract machine ID from ID', () => {
      const machineId = SnowflakeGenerator.extractMachineId(testId);
      expect(machineId).toBe(1);
    });

    it('should extract sequence from ID', () => {
      const sequence = SnowflakeGenerator.extractSequence(testId);
      expect(sequence).toBeGreaterThanOrEqual(0);
      expect(sequence).toBeLessThanOrEqual(16383);
    });

    it('should validate ID correctly', () => {
      expect(SnowflakeGenerator.isValidId(testId)).toBe(true);
      expect(SnowflakeGenerator.isValidId('invalid')).toBe(false);
      expect(SnowflakeGenerator.isValidId('123')).toBe(false);
      expect(SnowflakeGenerator.isValidId('')).toBe(false);
      expect(SnowflakeGenerator.isValidId('ABC')).toBe(false);
    });

    it('should generate base36 IDs', () => {
      const id = generator.nextId();
      expect(/^[0-9a-z]+$/.test(id)).toBe(true);
    });

    it('should never generate negative IDs', () => {
      for (let i = 0; i < 100; i++) {
        const id = generator.nextId();
        expect(id.startsWith('-')).toBe(false);
        expect(BigInt(parseInt(id, 36))).toBeGreaterThan(0n);
      }
    });
  });
});
