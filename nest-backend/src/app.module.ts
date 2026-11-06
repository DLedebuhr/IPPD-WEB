import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TasksModule } from './tasks/tasks.module';
import { LivrosModule } from './livros/livros.module';

@Module({
    imports: [TasksModule, LivrosModule],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
