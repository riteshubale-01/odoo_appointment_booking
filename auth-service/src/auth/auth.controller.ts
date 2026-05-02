import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ForgotPasswordDto, LoginDto, ResetPasswordDto, SignupDto, VerifyOtpDto } from './dto/auth.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import type { Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(@Body() dto: SignupDto) {
    const data = await this.authService.signup(dto);
    return {
      success: true,
      message: 'Signup successful',
      data,
      error: null,
    };
  }

  @Post('login')
  async login(@Body() dto: LoginDto) {
    const data = await this.authService.login(dto);
    return {
      success: true,
      message: 'Login successful',
      data,
      error: null,
    };
  }

  @Post('verify-otp')
  async verifyOtp(@Body() dto: VerifyOtpDto) {
    const data = await this.authService.verifyOtp(dto);
    return {
      success: true,
      message: data.message,
      data: null,
      error: null,
    };
  }

  @Post('forgot-password')
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    const data = await this.authService.forgotPassword(dto);
    return {
      success: true,
      message: data.message,
      data: null,
      error: null,
    };
  }

  @Post('reset-password')
  async resetPassword(@Body() dto: ResetPasswordDto) {
    const data = await this.authService.resetPassword(dto);
    return {
      success: true,
      message: data.message,
      data: null,
      error: null,
    };
  }
}

// Controller for /me route outside of /auth prefix
@Controller()
export class UserController {
  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMe(@Req() req: Request) {
    return {
      success: true,
      message: 'Current user retrieved successfully',
      data: req.user,
      error: null,
    };
  }
}
