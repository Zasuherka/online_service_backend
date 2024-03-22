import { Body, Req, Controller, HttpCode, Post, UseGuards, Res, Get, Param, ParseIntPipe } from '@nestjs/common';
import { Response } from 'express';
import { AuthenticationService } from './authentication.service';
import RegisterDto from './dto/register.dto';
import RequestWithUser from './requestWithUser.interface';
import { LocalAuthenticationGuard } from '../guard/localAuthentication.guard';
import JwtAuthenticationGuard from '../guard/jwt-authentication.guard';
import { ApiBody, ApiCookieAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiCookieAuth()
@ApiTags('Authentication')
@Controller('authentication')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}
 
  // Регистрация
  @Post('register')
  @ApiOperation({ summary: 'Регистрация нового пользователя' })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({
    description: 'Данные созданного пользователя',
  })
  async register(@Body() registrationData: RegisterDto) 
  {
    //console.log(registrationData)
    return this.authenticationService.register(registrationData);
  } 

  // Логин
  @HttpCode(200)
  @UseGuards(LocalAuthenticationGuard)
  @Post('login')
  @ApiOperation({ summary: 'Авторизация пользователя' })
  @ApiResponse({
    description: 'Данные пользователя, без пароля'
  })
  async logIn(@Req() request: RequestWithUser, @Res() response: Response) {
    const { user } = request
    const cookie = await this.authenticationService.getCookieWithJwtToken(user.id)
    request.res.set('Set-Cookie', cookie)
    user.password = undefined
    return request.res.send(user) 
  }//Для эмплоера придумать новый логин

  // Выход из профиля
  @UseGuards(JwtAuthenticationGuard)
  @Post('logout')
  @ApiOperation({ summary: 'Выход из профиля пользователя' })
  @ApiResponse({
   status: 200,
    description: 'Пользователь вышел из аккаунта'
    })
  async logOut(@Req() request: RequestWithUser, @Res() response: Response) {
    console.log("Пользователь " + request.user.email + " вышел")
    response.setHeader('Set-Cookie', await this.authenticationService.getCookieForLogOut());
    return response.sendStatus(200);
  }

  // Получение информации о пользователе
  @UseGuards(JwtAuthenticationGuard)
  @Get()
  @ApiOperation({ summary: 'Аутентификация пользователя' })
  @ApiResponse({
   description: 'Данные пользователя, без пароля'
  })
  async authenticate(@Req() request: RequestWithUser) {
    console.log("Куки из ауфа: " + request.cookies.Authentication)
    const user = request.user;
    console.log(user);
    user.password = undefined; 
    return await this.authenticationService.aboutUser(user);
  }
}