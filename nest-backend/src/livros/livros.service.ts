import { Injectable, NotFoundException } from '@nestjs/common';
import { writeFile, readFile } from 'node:fs/promises';
import { CreateLivroDto } from './dto/create-livro.dto';
import { join } from 'node:path';
import { UpdateLivroDto } from './dto/update-livro.dto';

export interface Livro {

    id: number;
    titulo: string;
    autor: string;
    paginas: number;
    lido: boolean;
    nota: number | null;

}

@Injectable()
export class LivrosService {

    private readonly filePath = join(
        process.cwd(),
        'data',
        'livros.json',
    );

    private writeQueue: Promise<void> = Promise.resolve();

    // le o arquivo e devolve a lista de livros
    private async readLivros(): Promise<Livro[]> {

        const ConteudoArquivo = await readFile(this.filePath, 'utf-8');
        const ListaLivros = JSON.parse(ConteudoArquivo) as Livro[];

        return ListaLivros;

    }

    // escreve a lista de livros no arquivo (uma escrita de cada vez)
    private async saveLivros(livros: Livro[]): Promise<void> {

        const TextoParaSalvar = JSON.stringify(livros, null, 2);

        this.writeQueue = this.writeQueue.then(() =>
            writeFile(this.filePath, TextoParaSalvar, 'utf-8'),
        );

        await this.writeQueue;

    }

    // procura a posicao do livro na lista, se nao achar devolve -1
    private encontrarPosicao(ListaLivros: Livro[], id: number): number {

        for (let Posicao = 0; Posicao < ListaLivros.length; Posicao++) {

            if (ListaLivros[Posicao].id === id) {

                return Posicao;

            }

        }

        return -1;

    }

    async findAll(): Promise<Livro[]> {

        const ListaLivros = await this.readLivros();

        return ListaLivros;

    }

    async findOne(id: number): Promise<Livro> {

        const ListaLivros = await this.readLivros();
        const Posicao = this.encontrarPosicao(ListaLivros, id);

        if (Posicao === -1) {

            throw new NotFoundException('Livro não encontrado');

        }

        return ListaLivros[Posicao];

    }

    async create(dto: CreateLivroDto): Promise<Livro> {

        const ListaLivros = await this.readLivros();

        // descobre o maior id que ja existe para criar o proximo
        let MaiorId = 0;

        for (let Posicao = 0; Posicao < ListaLivros.length; Posicao++) {

            if (ListaLivros[Posicao].id > MaiorId) {

                MaiorId = ListaLivros[Posicao].id;

            }

        }

        const NovoLivro: Livro = {

            id: MaiorId + 1,
            titulo: dto.titulo,
            autor: dto.autor,
            paginas: dto.paginas,
            lido: false,
            nota: null,

        };

        ListaLivros.push(NovoLivro);

        await this.saveLivros(ListaLivros);

        return NovoLivro;

    }

    // PUT: troca todos os dados do livro
    async update(
        id: number,
        dto: UpdateLivroDto,
    ): Promise<Livro> {

        const ListaLivros = await this.readLivros();
        const Posicao = this.encontrarPosicao(ListaLivros, id);

        if (Posicao === -1) {

            throw new NotFoundException('Livro não encontrado');

        }

        const LivroAtualizado: Livro = {

            id: id,
            titulo: dto.titulo,
            autor: dto.autor,
            paginas: dto.paginas,
            lido: dto.lido,
            nota: dto.nota,

        };

        ListaLivros[Posicao] = LivroAtualizado;

        await this.saveLivros(ListaLivros);

        return LivroAtualizado;

    }

    // PATCH: troca somente os campos que vieram na requisicao
    async patch(
        id: number,
        dto: Partial<UpdateLivroDto>,
    ): Promise<Livro> {

        const ListaLivros = await this.readLivros();
        const Posicao = this.encontrarPosicao(ListaLivros, id);

        if (Posicao === -1) {

            throw new NotFoundException('Livro não encontrado');

        }

        const LivroEncontrado = ListaLivros[Posicao];

        if (dto.titulo !== undefined) {

            LivroEncontrado.titulo = dto.titulo;

        }

        if (dto.autor !== undefined) {

            LivroEncontrado.autor = dto.autor;

        }

        if (dto.paginas !== undefined) {

            LivroEncontrado.paginas = dto.paginas;

        }

        if (dto.lido !== undefined) {

            LivroEncontrado.lido = dto.lido;

        }

        if (dto.nota !== undefined) {

            LivroEncontrado.nota = dto.nota;

        }

        await this.saveLivros(ListaLivros);

        return LivroEncontrado;

    }

    async remove(id: number): Promise<void> {

        const ListaLivros = await this.readLivros();
        const Posicao = this.encontrarPosicao(ListaLivros, id);

        if (Posicao === -1) {

            throw new NotFoundException('Livro não encontrado');

        } else {

            // remove 1 item a partir da posicao encontrada
            ListaLivros.splice(Posicao, 1);

            await this.saveLivros(ListaLivros);

        }

    }

}
