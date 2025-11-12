import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreatePaymentDto {
  @IsString()
  @IsNotEmpty()
  orderId: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;
}
