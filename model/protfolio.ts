
import {Table, Column, Model, HasMany, PrimaryKey, DataType} from 'sequelize-typescript';
 
@Table
export class protfolio extends Model<protfolio> {
 
  @PrimaryKey
  @Column (DataType.STRING)
  sName: string ;

  @Column (DataType.DOUBLE)
  buyPrice: number;

  @Column (DataType.DOUBLE)
  currentPrice: number;

  @Column (DataType.DOUBLE)
  quantity: number;

  @Column (DataType.DOUBLE)
  totalBuyPrice: number;

  @Column (DataType.DOUBLE)
  holdingValue: number;

  @Column (DataType.DOUBLE)
  profit: number;
}
export default protfolio 