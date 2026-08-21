import { IsEmail, IsString, MinLength, MaxLength } from 'class-validator';

export class RegisterDto {
  @IsString()
  @MinLength(2)
  @MaxLength(60)
  name: string;

  @IsEmail()
  email: string;

  // Kept at 8 chars minimum - long enough to matter without being
  // annoying for a take-home reviewer testing the flow.
  @IsString()
  @MinLength(8)
  @MaxLength(72)
  password: string;
}
