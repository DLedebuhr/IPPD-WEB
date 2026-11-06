import { Injectable, NotFoundException } from '@nestjs/common';
import { writeFile, readFile } from 'node:fs/promises';
import { CreateTaskDto } from './dto/create-task.dto';
import { join } from 'node:path';
import { UpdateTaskDto } from './dto/update-task.dto';

export interface Task {

    id: number;
    descricao: string;
    inicio: number;
    fim: number;
    status: string;
    resultado: number[] | null;

}

@Injectable()
export class TasksService {

    private readonly filePath = join(
        process.cwd(),
        'data',
        'tasks.json',
    );

    private writeQueue: Promise<void> = Promise.resolve();

    // le o arquivo e devolve a lista de tarefas
    private async readTasks(): Promise<Task[]> {

        const ConteudoArquivo = await readFile(this.filePath, 'utf-8');
        const ListaTarefas = JSON.parse(ConteudoArquivo) as Task[];

        return ListaTarefas;

    }

    // escreve a lista de tarefas no arquivo (uma escrita de cada vez)
    private async saveTasks(tasks: Task[]): Promise<void> {

        const TextoParaSalvar = JSON.stringify(tasks, null, 2);

        this.writeQueue = this.writeQueue.then(() =>
            writeFile(this.filePath, TextoParaSalvar, 'utf-8'),
        );

        await this.writeQueue;

    }

    // procura a posicao da tarefa na lista, se nao achar devolve -1
    private encontrarPosicao(ListaTarefas: Task[], id: number): number {

        for (let Posicao = 0; Posicao < ListaTarefas.length; Posicao++) {

            if (ListaTarefas[Posicao].id === id) {

                return Posicao;

            }

        }

        return -1;

    }

    async findAll(): Promise<Task[]> {

        const ListaTarefas = await this.readTasks();

        return ListaTarefas;

    }

    async findOne(id: number): Promise<Task> {

        const ListaTarefas = await this.readTasks();
        const Posicao = this.encontrarPosicao(ListaTarefas, id);

        if (Posicao === -1) {

            throw new NotFoundException('Tarefa não encontrada');

        }

        return ListaTarefas[Posicao];

    }

    async create(dto: CreateTaskDto): Promise<Task> {

        const ListaTarefas = await this.readTasks();

        // descobre o maior id que ja existe para criar o proximo
        let MaiorId = 0;

        for (let Posicao = 0; Posicao < ListaTarefas.length; Posicao++) {

            if (ListaTarefas[Posicao].id > MaiorId) {

                MaiorId = ListaTarefas[Posicao].id;

            }

        }

        const NovaTarefa: Task = {

            id: MaiorId + 1,
            descricao: dto.descricao,
            inicio: dto.inicio,
            fim: dto.fim,
            status: 'PENDENTE',
            resultado: null,

        };

        ListaTarefas.push(NovaTarefa);

        await this.saveTasks(ListaTarefas);

        return NovaTarefa;

    }

    // PUT: troca todos os dados da tarefa
    async update(
        id: number,
        dto: UpdateTaskDto,
    ): Promise<Task> {

        const ListaTarefas = await this.readTasks();
        const Posicao = this.encontrarPosicao(ListaTarefas, id);

        if (Posicao === -1) {

            throw new NotFoundException('Tarefa não encontrada');

        }

        const TarefaAtualizada: Task = {

            id: id,
            descricao: dto.descricao,
            inicio: dto.inicio,
            fim: dto.fim,
            status: dto.status,
            resultado: dto.resultado,

        };

        ListaTarefas[Posicao] = TarefaAtualizada;

        await this.saveTasks(ListaTarefas);

        return TarefaAtualizada;

    }

    // PATCH: troca somente os campos que vieram na requisicao
    async patch(
        id: number,
        dto: Partial<UpdateTaskDto>,
    ): Promise<Task> {

        const ListaTarefas = await this.readTasks();
        const Posicao = this.encontrarPosicao(ListaTarefas, id);

        if (Posicao === -1) {

            throw new NotFoundException('Tarefa não encontrada');

        }

        const TarefaEncontrada = ListaTarefas[Posicao];

        if (dto.descricao !== undefined) {

            TarefaEncontrada.descricao = dto.descricao;

        }

        if (dto.inicio !== undefined) {

            TarefaEncontrada.inicio = dto.inicio;

        }

        if (dto.fim !== undefined) {

            TarefaEncontrada.fim = dto.fim;

        }

        if (dto.status !== undefined) {

            TarefaEncontrada.status = dto.status;

        }

        if (dto.resultado !== undefined) {

            TarefaEncontrada.resultado = dto.resultado;

        }

        await this.saveTasks(ListaTarefas);

        return TarefaEncontrada;

    }

    async remove(id: number): Promise<void> {

        const ListaTarefas = await this.readTasks();
        const Posicao = this.encontrarPosicao(ListaTarefas, id);

        if (Posicao === -1) {

            throw new NotFoundException('Tarefa não encontrada');

        } else {

            // remove 1 item a partir da posicao encontrada
            ListaTarefas.splice(Posicao, 1);

            await this.saveTasks(ListaTarefas);

        }

    }

}
