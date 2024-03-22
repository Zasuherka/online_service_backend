import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards , ParseIntPipe} from '@nestjs/common';
import { CompanyService } from './company.service';
import CreateEmployeeDto from './dto/create-employee.dto';
import JwtAuthenticationGuard from 'src/guard/jwt-authentication.guard';
import { User } from '@prisma/client';
import CompanyLeaderGuard from 'src/guard/company-leader.guard';
import { UpdateEmployeeDto } from './dto/update-employee.dto';


@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @UseGuards(JwtAuthenticationGuard, CompanyLeaderGuard)
  @Post('create_employee/:id')
  async createEmployee(@Body() employeeData: CreateEmployeeDto, user: User, @Param('id', ParseIntPipe) id: number) {
    console.log(employeeData)
    return await this.companyService.createEmployee(employeeData, id);
  }

  @Patch('registerEmployee')
  async registerEmployee(@Body() employeeData: UpdateEmployeeDto) {
    return await this.companyService.registerEmployee(employeeData)
  }

  @Post('infoEmployee')
  async getInfoEmployee(@Body() data) {
    return await this.companyService.DataForRegisterEmployee(data.hash);
  }

  @UseGuards(JwtAuthenticationGuard, CompanyLeaderGuard)
  @Patch('fire_employee/:id')
  async fire(@Param('id', ParseIntPipe) id: number, @Body() req) {
    return await this.companyService.fire(req.employeeId);
  }

  @Get('allEmployee/:id')
  async getAllEmployes(@Param('id', ParseIntPipe) id: number) {
    return await this.companyService.getAllEmployes(id);
  }
  
  // @Get('registerEmployee')
  // async getHashData(@Body() dataHash) {
  //   return 
  // }
}