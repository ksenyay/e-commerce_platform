import {
  Body,
  ConflictException,
  Injectable,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request } from 'express';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../db/schemas/user.schema';
import { CreateUserDto, LoginUserDto } from './dto';
import { Password } from '../utils/password';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(@InjectModel(User.name) private user: Model<User>) {}

  getCurrentUser(req: Request): { currentUser: object | null } {
    return { currentUser: req.currentUser || null };
  }

  async signup(data: CreateUserDto, req: Request): Promise<UserDocument> {
    const { username, email, password } = data;

    const hashed = await Password.hash(password);

    const newUser = new this.user({ username, email, password: hashed });
    try {
      const token = jwt.sign(
        { id: newUser._id, username: newUser.username, email: newUser.email },
        process.env.JWT_SECRET!,
      );

      req.session = { jwt: token };

      return await newUser.save();
    } catch (err) {
      if (err.keyPattern?.email) {
        throw new ConflictException('User with this email already exists');
      }
      if (err.keyPattern?.username) {
        throw new ConflictException('Username already taken');
      }

      throw new ConflictException('User already exists');
    }
  }

  async signin(
    @Body() data: LoginUserDto,
    @Req() req: Request,
  ): Promise<string> {
    const { email, password } = data;

    const user = await this.user.findOne({ email }).exec();

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isValid = await Password.compare(password, user.password);

    if (!isValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = jwt.sign(
      { id: user._id, username: user.username, email: user.email },
      process.env.JWT_SECRET!,
    );

    req.session = { jwt: token };

    return `User ${user.username} signed in! Email: ${email}, Password: ${password}`;
  }

  signout(req: Request): string {
    req.session = undefined;
    return 'User signed out';
  }
}
