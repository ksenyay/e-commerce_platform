import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  @Matches(/^\S+$/, { message: 'Email cannot contain spaces' })
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  @MaxLength(20, { message: 'Password must be at most 20 characters long' })
  @Matches(/\d/, { message: 'Password must contain at least one number' })
  @Matches(/^\S+$/, { message: 'Password cannot contain spaces' })
  password: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(3, { message: 'Username must be at least 3 characters long' })
  @MaxLength(15, { message: 'Username must be at most 15 characters long' })
  @Matches(/^[a-zA-Z0-9_]+$/, {
    message: 'Username can only contain letters, numbers, and underscores',
  })
  @Matches(/[a-zA-Z]/, {
    message: 'Username must contain at least one letter',
  })
  username: string;
}
