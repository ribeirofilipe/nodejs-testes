import request from 'supertest';
import app from '../../src/app';
import truncate from '../utils/truncate';
import User from '../../src/app/models/User';
import bcrypt from 'bcryptjs';

describe('User', () => {
  beforeEach(async () => {
    await truncate();
  });

  it('should encrypt user password when new user created', async() => {
    const userCreated = await User.create({ 
      name: 'Filipe Ribeiro',
      email: 'ribeiro.filipe94@gmail.com',
      password:  '123456',
    });

    const compareHash = await bcrypt.compare('123456', userCreated.password_hash);

    expect(compareHash).toBe(true);
  })

  it('should be able to register', async () => {
    const response = await request(app)
      .post('/users')
      .send({ 
        name: 'Filipe Ribeiro',
        email: 'ribeiro.filipe94@gmail.com',
        password_hash:  '123456',
      });

    expect(response.body).toHaveProperty('id');
  });     

  it('should not be able to register with duplicated email', async() => {
    

    await request(app)
      .post('/users')
      .send({ 
        name: 'Filipe Ribeiro',
        email: 'ribeiro.filipe94@gmail.com',
        password:  '123456',
      });

    const response = await request(app)
      .post('/users')
      .send({ 
        name: 'Filipe Ribeiro',
        email: 'ribeiro.filipe94@gmail.com',
        password:  '123456',
      });

    expect(response.status).toBe(400);
  })
});