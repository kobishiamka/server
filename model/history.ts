
import {Table, Column, Model, HasMany, PrimaryKey, DataType, CreatedAt} from 'sequelize-typescript';
 
@Table
export class history extends Model<history> {
 
  @PrimaryKey
  @CreatedAt 
  @Column (DataType.DATE)
  date: Date;

  @Column (DataType.STRING)
  action: string ;

  @Column (DataType.STRING)
  sName: string;

  @Column (DataType.DOUBLE)
  totalBuyPrice: number;

  @Column (DataType.DOUBLE)
  quantity: number;

  @Column (DataType.STRING)
  log: string;

  @Column (DataType.DOUBLE)
  ppi: number;
}
export default history