

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { GameComponent } from './game/game.component';
import { GameEngineService } from './services/game-engine.service';
import { BoardComponent } from './game/board/board.component';
import { TileComponent } from 'app/game/board/tile/tile.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { TileCardComponent } from './game/board/tile/tile-card/tile-card.component';

import { ToolbarComponent } from './game/toolbar/toolbar.component';
import { ResourceTableComponent } from './game/toolbar/resource-table/resource-table.component';
import { ResourceItemComponent } from './game/toolbar/resource-table/resource-item/resource-item.component';
import { PopupComponent } from './common/popup/popup.component';

import { FormsModule } from "@angular/forms";
/* import { ItemsStorePopupComponent } from './game/toolbar/items-store-popup/items-store-popup.component';
import { ItemsStorePopupItemComponent } from './game/toolbar/items-store-popup/items-store-popup-item/items-store-popup-item.component'; */
import { MessagesService } from 'app/services/messages.service';
import { TestPanelComponent } from './game/test-panel/test-panel.component';
import { BuyItemComponent } from 'app/game/tile-buy-popup/buy-item/buy-item.component';
import { TileBuyPopupComponent } from 'app/game/tile-buy-popup/tile-buy-popup.component';

@NgModule({
  declarations: [
    AppComponent,
    GameComponent,
    BoardComponent,
    TileComponent,
    BuyItemComponent,
    ResourceTableComponent,
    ResourceItemComponent,
    TileCardComponent,
    TileBuyPopupComponent,
    ToolbarComponent,
    PopupComponent,
    /* ItemsStorePopupComponent,
    ItemsStorePopupItemComponent, */
    TestPanelComponent,
    
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
  ],
  providers: [GameEngineService,MessagesService],
  bootstrap: [AppComponent]
})
export class AppModule { }
