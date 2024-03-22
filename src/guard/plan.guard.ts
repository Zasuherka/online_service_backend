import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Role } from '@prisma/client';
import { PlanService } from 'src/plan/plan.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProductService } from "src/product/product.service"
import { UsersService } from "src/users/users.service"

// проверяем, может ли пользователь работать с услугой
@Injectable()
export default class PlanGuard implements CanActivate {
    constructor (private readonly usersService: UsersService, readonly planService: PlanService, private readonly productService: ProductService, private readonly prismaService: PrismaService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const {user, params} = context.switchToHttp().getRequest();
        // Максим попросил, я сделал
        try {
            const plan = await this.planService.getById(Number(params.id))
            await this.productService.getById(Number(plan.idProduct));
        } catch (error) {
            return false;
        }

        if (!user || !params) {
            return false;
        }

        const planId = Number(params.id);
        const checkedPlan = await this.planService.getById(planId)
        console.log("checkedPlan: " + checkedPlan.idProduct)
        const userId = user.id;
        const checkedUser = await this.usersService.getById(userId)
        console.log("checkedUser: " + checkedUser.id)
        const checkedProduct = await this.productService.getById(checkedPlan.idProduct)
        console.log("checkedProduct: " + checkedProduct.id)

        const currentDate = new Date();
        if (checkedPlan.datetime < currentDate) {
            const deletePlan = await this.prismaService.plan.delete({where: {id: planId}})
            console.log("Удалена запись на время" + deletePlan)
        }

        // либо ты админ
        if (user?.role.includes(Role.Admin)) {
            return true;
        }

        // либо ты автор
        return (checkedUser.id === checkedProduct.authorId);    
    }
}