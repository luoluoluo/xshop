/**
 * 自定义 Snowflake ID 生成器 (优化版)
 *
 * Snowflake ID 结构 (64位):
 * 1位符号位(0) + 41位时间戳 + 8位机器ID + 14位序列号
 */
export class SnowflakeGenerator {
  private static readonly EPOCH = 1704067200000; // 2024-01-01 00:00:00 UTC
  private static readonly MACHINE_ID_BITS = 8; // 机器ID位数 (支持256个节点)
  private static readonly SEQUENCE_BITS = 14; // 序列号位数 (每毫秒16384个ID)

  private static readonly MAX_MACHINE_ID =
    (1 << SnowflakeGenerator.MACHINE_ID_BITS) - 1; // 255
  private static readonly MAX_SEQUENCE =
    (1 << SnowflakeGenerator.SEQUENCE_BITS) - 1; // 16383

  private static readonly MACHINE_ID_SHIFT = SnowflakeGenerator.SEQUENCE_BITS; // 14
  private static readonly TIMESTAMP_SHIFT =
    SnowflakeGenerator.SEQUENCE_BITS + SnowflakeGenerator.MACHINE_ID_BITS; // 22

  private machineId: number;
  private sequence: number = 0;
  private lastTimestamp: number = -1;

  constructor(machineId: number = 1) {
    if (machineId < 0 || machineId > SnowflakeGenerator.MAX_MACHINE_ID) {
      throw new Error(
        `Machine ID must be between 0 and ${SnowflakeGenerator.MAX_MACHINE_ID}`,
      );
    }
    this.machineId = machineId;
  }

  /**
   * 生成下一个 ID
   */
  nextId(): string {
    let timestamp = this.getCurrentTimestamp();

    // 时钟回拨检测
    if (timestamp < this.lastTimestamp) {
      throw new Error(
        `Clock moved backwards. Refusing to generate id for ${this.lastTimestamp - timestamp} milliseconds`,
      );
    }

    // 同一毫秒内，序列号自增
    if (timestamp === this.lastTimestamp) {
      this.sequence = (this.sequence + 1) & SnowflakeGenerator.MAX_SEQUENCE;

      // 序列号溢出，等待下一毫秒
      if (this.sequence === 0) {
        timestamp = this.waitNextMillis(this.lastTimestamp);
      }
    } else {
      // 新的毫秒，序列号重置
      this.sequence = 0;
    }

    this.lastTimestamp = timestamp;

    // 使用 BigInt 进行位运算，避免 JavaScript 32位整数限制
    const timestampBig = BigInt(timestamp - SnowflakeGenerator.EPOCH);
    const machineIdBig = BigInt(this.machineId);
    const sequenceBig = BigInt(this.sequence);

    // 生成ID: 时间戳 + 机器ID + 序列号
    const id =
      (timestampBig << BigInt(SnowflakeGenerator.TIMESTAMP_SHIFT)) |
      (machineIdBig << BigInt(SnowflakeGenerator.MACHINE_ID_SHIFT)) |
      sequenceBig;

    return id.toString(36); // 返回36进制字符串 (0-9, a-z)
  }

  /**
   * 等待下一毫秒
   */
  private waitNextMillis(lastTimestamp: number): number {
    let timestamp = this.getCurrentTimestamp();
    while (timestamp <= lastTimestamp) {
      timestamp = this.getCurrentTimestamp();
    }
    return timestamp;
  }

  /**
   * 获取当前时间戳
   */
  private getCurrentTimestamp(): number {
    return Date.now();
  }

  /**
   * 从 Snowflake ID 中提取时间戳
   */
  static extractTimestamp(id: string): Date {
    const snowflakeId = BigInt(parseInt(id, 36)); // 从36进制字符串解析
    const timestamp =
      Number(snowflakeId >> BigInt(SnowflakeGenerator.TIMESTAMP_SHIFT)) +
      SnowflakeGenerator.EPOCH;
    return new Date(timestamp);
  }

  /**
   * 从 Snowflake ID 中提取机器ID
   */
  static extractMachineId(id: string): number {
    const snowflakeId = BigInt(parseInt(id, 36)); // 从36进制字符串解析
    return Number(
      (snowflakeId >> BigInt(SnowflakeGenerator.MACHINE_ID_SHIFT)) &
        BigInt(SnowflakeGenerator.MAX_MACHINE_ID),
    );
  }

  /**
   * 从 Snowflake ID 中提取序列号
   */
  static extractSequence(id: string): number {
    const snowflakeId = BigInt(parseInt(id, 36)); // 从36进制字符串解析
    return Number(snowflakeId & BigInt(SnowflakeGenerator.MAX_SEQUENCE));
  }

  /**
   * 验证是否为有效的 Snowflake ID
   */
  static isValidId(id: string): boolean {
    try {
      // 检查是否为有效的36进制字符串
      if (!/^[0-9a-z]+$/.test(id)) {
        return false;
      }
      const num = BigInt(parseInt(id, 36));
      return num > 0n && id.length >= 6 && id.length <= 12; // 36进制长度调整
    } catch {
      return false;
    }
  }
}

// 全局单例实例
const machineId = parseInt(process.env.MACHINE_ID || '1', 10);
export const snowflakeGenerator = new SnowflakeGenerator(machineId);
