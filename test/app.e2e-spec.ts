import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('Your (e2e) here', () => {
  //You should normally implement your tests here
  it('should pass', () => {
    expect(true).toBe(true);
  });
});
