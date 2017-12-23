import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { GameComponent } from './game/game.component';
import { GameEngineService } from './services/game-engine.service';
import { BoardComponent } from './game/board/board.component';
import { TileComponent } from 'app/game/board/tile/tile.component';
//import { ParticlesModule } from 'angular-particle';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ArenaComponent } from './game/arena/arena.component';
import { AnimationsComponent } from './game/animations/animations.component';
import { EnemyComponent } from './game/arena/enemy/enemy.component';
import { TileCardComponent } from './game/board/tile/tile-card/tile-card.component';
import { TileBuyPopupComponent } from './game/board/tile/tile-buy-popup/tile-buy-popup.component';
import { BuyItemComponent } from './game/board/tile/tile-buy-popup/buy-item/buy-item.component';
import { ToolbarComponent } from './game/toolbar/toolbar.component';
import { ResourceTableComponent } from './game/toolbar/resource-table/resource-table.component';
import { ResourceItemComponent } from './game/toolbar/resource-table/resource-item/resource-item.component';
import { PopupComponent } from './common/popup/popup.component';

import { FormsModule } from "@angular/forms";
import { ItemsStorePopupComponent } from './game/toolbar/items-store-popup/items-store-popup.component';
import { ItemsStorePopupItemComponent } from './game/toolbar/items-store-popup/items-store-popup-item/items-store-popup-item.component';
//import { Ng2PopupModule } from 'ng2-popup';
@NgModule({
  declarations: [
    AppComponent,
    GameComponent,
    BoardComponent,
    TileComponent,
    ArenaComponent,
    AnimationsComponent,
    BuyItemComponent,
    EnemyComponent,
    ResourceTableComponent,
    ResourceItemComponent,
    ArenaComponent,
    TileCardComponent,
    TileBuyPopupComponent,
    ToolbarComponent,
    PopupComponent,
    ItemsStorePopupComponent,
    ItemsStorePopupItemComponent,
    
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    // ParticlesModule,
    FormsModule,
    //Ng2PopupModule
  ],
  providers: [GameEngineService],
  bootstrap: [AppComponent]
})
export class AppModule { }
