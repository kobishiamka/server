
import {Table, Column, Model, HasMany, PrimaryKey, DataType} from 'sequelize-typescript';
 
@Table
export class Stock extends Model<Stock> {
 
  @PrimaryKey
  @Column (DataType.STRING)
  sName: string;

  @Column (DataType.DOUBLE)
  openPrice: number ;

  @Column (DataType.DOUBLE)
  currentPrice: number;

  @Column (DataType.DOUBLE)
  changePercent: number;
}
export default Stock