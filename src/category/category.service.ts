import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CategoryService {
  constructor(private readonly prismaService: PrismaService) {}

  create(createCategoryDto: CreateCategoryDto) {
    return 'This action adds a new category';
  }

  async findAll() {
    return await this.prismaService.category.findMany()
  }

  async getProducts(categoryId: number) {
    const products = await this.prismaService.category.findFirst({
      where: {
        id: categoryId,
      },
      select: {
        products: {
          select: {
            id: true,
            title: true,
            cost: true,
            description: true,
            author: {
              select: {
                name: true,
                avatar: true,
            }
            },
          }
        },
      }
    })
    return products.products;
  }

  findOne(id: number) {
    return `This action returns a #${id} category`;
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return `This action updates a #${id} category`;
  }

  remove(id: number) {
    return `This action removes a #${id} category`;
  }
}
