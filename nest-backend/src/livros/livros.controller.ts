import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Post,
    Put,
    Patch,
} from '@nestjs/common';

import { CreateLivroDto } from './dto/create-livro.dto';
import { UpdateLivroDto } from './dto/update-livro.dto';
import { LivrosService, Livro } from './livros.service';

@Controller('livros')
export class LivrosController {

    constructor(private readonly livrosService: LivrosService) {}

    @Get()
    findAll(): Promise<Livro[]> {

        return this.livrosService.findAll();

    }

    @Get(':id')
    findOne(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<Livro> {

        return this.livrosService.findOne(id);

    }

    @Post()
    create(@Body() dto: CreateLivroDto): Promise<Livro> {

        return this.livrosService.create(dto);

    }

    @Put(':id')
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateLivroDto,
    ): Promise<Livro> {

        return this.livrosService.update(id, dto);

    }

    @Patch(':id')
    patch(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: Partial<UpdateLivroDto>,
    ): Promise<Livro> {

        return this.livrosService.patch(id, dto);

    }

    @Delete(':id')
    remove(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<void> {

        return this.livrosService.remove(id);

    }

}
