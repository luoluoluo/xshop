import { InputType, Field, registerEnumType } from '@nestjs/graphql';

// 排序方向枚举
export enum SorterDirection {
  ASC = 'asc',
  DESC = 'desc',
}
registerEnumType(SorterDirection, { name: 'SorterDirection' });

// 单个排序条件输入类型
@InputType()
export class SorterInput {
  @Field(() => String)
  field: string;

  @Field(() => SorterDirection)
  direction: SorterDirection;
}
