import { CreateLivroDto } from './create-livro.dto';

export class UpdateLivroDto extends CreateLivroDto {
  lido: boolean;
  nota: number | null;
}
