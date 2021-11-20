import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core';
import { AuthModule } from './auth/auth.module';
import { join } from 'path';
import { ClassroomModule } from './classroom/classroom.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    ConfigModule.forRoot(),
    GraphQLModule.forRoot({
      installSubscriptionHandlers: true, // subscriptions: {'graphql-ws': true},
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      playground: false,
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
    }),
    AuthModule,
    ClassroomModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
