import { Test, TestingModule } from '@nestjs/testing';
import { MailsenderService } from './mailsender.service.js';

describe('MailsenderService', () => {
  let service: MailsenderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MailsenderService],
    }).compile();

    service = module.get<MailsenderService>(MailsenderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
