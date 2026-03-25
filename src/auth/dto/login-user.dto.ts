import { IsEmail, IsString, Matches, MaxLength, Min, MinLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class LoginUserDto {

  @ApiProperty({ example: 'user@example.com', description: 'User email address' })
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'Abc123!',
    description: 'User password',
    minLength: 6,
    maxLength: 50
  })
  @IsString()
  @MinLength(6)
  @MaxLength(50)
  @Matches(
    /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'The password must have a Uppercase, lowercase letter and a number'
  })
  password: string;

}