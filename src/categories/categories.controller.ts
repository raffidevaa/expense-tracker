import {
  Controller,
  HttpCode,
  HttpStatus,
  Get,
  UseGuards,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import * as authGuard from '../auth/auth.guard';

@UseGuards(authGuard.AuthGuard)
@Controller('categories')
export class CategoriesController {
  constructor(private categoriesService: CategoriesService) {}

  @HttpCode(HttpStatus.OK)
  @Get()
  getAllCategories() {
    return this.categoriesService.getAllCategories();
  }
}
