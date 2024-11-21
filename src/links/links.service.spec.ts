import { LinksService } from './links.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Link } from './entities/link.entity';
import { TestingModule, Test } from '@nestjs/testing';
import { Repository } from 'typeorm';

describe('LinksService', () => {
  let service: LinksService;
  // let repository: Repository<Link>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LinksService,
        {
          provide: getRepositoryToken(Link),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<LinksService>(LinksService);
    // repository = module.get<Repository<Link>>(getRepositoryToken(Link));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
