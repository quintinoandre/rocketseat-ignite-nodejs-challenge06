import { getRepository, Repository } from "typeorm";
import { User } from "../../../users/entities/User";
import { Game } from "../../entities/Game";
import { IGamesRepository } from "../IGamesRepository";

export class GamesRepository implements IGamesRepository {
  private repository: Repository<Game>;

  constructor() {
    this.repository = getRepository(Game);
  }

  async findByTitleContaining(param: string): Promise<Game[]> {
    return this.repository
      .createQueryBuilder("game")
      .where("game.title ILIKE :param", { param: `%${param}%` })
      .getMany();
  }

  async countAllGames(): Promise<[{ count: string }]> {
    return this.repository.query(`SELECT COUNT(*) FROM games`);
  }

  async findUsersByGameId(id: string): Promise<User[]> {
    return this.repository
      .createQueryBuilder("game")
      .where("game.id = :id", { id })
      .innerJoinAndSelect("game.users", "user")
      .getMany()
      .then((games) => games[0].users);
  }
}
