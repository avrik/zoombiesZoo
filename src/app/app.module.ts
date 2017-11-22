import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { GameComponent } from './game/game.component';
import { GameEngineService } from './services/game-engine.service';
import { BoardComponent } from './game/board/board.component';
import { TileComponent } from 'app/game/board/tile/tile.component';
import { ParticlesModule } from 'angular-particle';
import { BoardBgComponent } from './game/board/board-bg/board-bg.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ArenaComponent } from './game/arena/arena.component';
import { AnimationsComponent } from './game/animations/animations.component';
import { ItemsStoreComponent } from './game/items-store/items-store.component';
import { BuyItemComponent } from './game/items-store/buy-item/buy-item.component';
import { EnemyComponent } from './game/arena/enemy/enemy.component';
import { TowerComponent } from './game/arena/tower/tower.component';
import { ResourceTableComponent } from './game/resource-table/resource-table.component';
import { ResourceItemComponent } from './game/resource-table/resource-item/resource-item.component';

@NgModule({
  declarations: [
    AppComponent,
    GameComponent,
    BoardComponent,
    TileComponent,
    BoardBgComponent,
    ArenaComponent,
    AnimationsComponent,
    ItemsStoreComponent,
    BuyItemComponent,
    EnemyComponent,
    TowerComponent,
    ResourceTableComponent,
    ResourceItemComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ParticlesModule,
  ],
  providers: [GameEngineService],
  bootstrap: [AppComponent]
})
export class AppModule { }
