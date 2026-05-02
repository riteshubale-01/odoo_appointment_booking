import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { MailService } from '../mail/mail.service';
import * as bcrypt from 'bcrypt';
import { ForgotPasswordDto, LoginDto, ResetPasswordDto, SignupDto, VerifyOtpDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private usersService: UsersService,
    private jwtService: JwtService,
    private mailService: MailService,
  ) {}

  async signup(dto: SignupDto) {
    const existingUser = await this.usersService.findByEmail(dto.email);
    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = await this.usersService.createUser({
      name: dto.name,
      email: dto.email,
      password: hashedPassword,
      role: dto.role || 'customer',
    });

    // Optionally generate OTP for verification here, but for now just return success
    return {
      user_id: user.user_id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
  }

  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate JWT according to strict contract
    const payload = {
      user_id: user.user_id,
      role: user.role,
      email: user.email,
    };

    const token = this.jwtService.sign(payload);

    return {
      token,
      user: {
        user_id: user.user_id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }

  async generateOtp(email: string): Promise<string> {
    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

    // Upsert or clear previous OTPs? For simplicity, just create
    await this.prisma.oTP.deleteMany({ where: { email } });
    await this.prisma.oTP.create({
      data: {
        email,
        otp,
        expires_at: expiresAt,
      },
    });

    return otp;
  }

  async verifyOtp(dto: VerifyOtpDto) {
    const otpRecord = await this.prisma.oTP.findFirst({
      where: {
        email: dto.email,
        otp: dto.otp,
        expires_at: {
          gt: new Date(), // ensure not expired
        },
      },
    });

    if (!otpRecord) {
      throw new BadRequestException('Invalid or expired OTP');
    }

    // OTP is valid, mark user as verified
    const user = await this.usersService.findByEmail(dto.email);
    if (user && !user.is_verified) {
      await this.usersService.markAsVerified(user.user_id);
    }

    // Delete used OTP
    await this.prisma.oTP.delete({ where: { id: otpRecord.id } });

    return { message: 'OTP verified successfully' };
  }

  async forgotPassword(dto: ForgotPasswordDto) {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) {
      // Return success even if user not found to prevent user enumeration
      return { message: 'If that email is registered, an OTP has been sent.' };
    }

    const otp = await this.generateOtp(dto.email);
    await this.mailService.sendOtpEmail(dto.email, otp);

    return { message: 'If that email is registered, an OTP has been sent.' };
  }

  async resetPassword(dto: ResetPasswordDto) {
    const otpRecord = await this.prisma.oTP.findFirst({
      where: {
        email: dto.email,
        otp: dto.otp,
        expires_at: {
          gt: new Date(),
        },
      },
    });

    if (!otpRecord) {
      throw new BadRequestException('Invalid or expired OTP');
    }

    const user = await this.usersService.findByEmail(dto.email);
    if (!user) {
      throw new BadRequestException('User not found');
    }

    const hashedPassword = await bcrypt.hash(dto.newPassword, 10);
    await this.usersService.updatePassword(user.user_id, hashedPassword);

    // Delete used OTP
    await this.prisma.oTP.delete({ where: { id: otpRecord.id } });

    return { message: 'Password reset successful' };
  }
}
