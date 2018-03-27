

import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';

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
import { MessagesService } from 'app/services/messages.service';
import { TestPanelComponent } from './game/test-panel/test-panel.component';
import { BuyItemComponent } from 'app/game/tile-buy-popup/buy-item/buy-item.component';
import { TileBuyPopupComponent } from 'app/game/tile-buy-popup/tile-buy-popup.component';
import { TitleScreenComponent } from './game/toolbar/title-screen/title-screen.component';
import { MessageWindowComponent } from './game/toolbar/message-window/message-window.component';
import { LumberComponent } from './game/item-view/lumber/lumber.component';
import { ItemImgComponent } from './game/item-view/item-img/item-img.component';
import { TileFrameComponent } from './game/board/tile/tile-frame/tile-frame.component';
import { BatteryViewComponent } from './game/toolbar/battery-view/battery-view.component';
import { TileTopComponent } from './game/board/tile/tile-top/tile-top.component';
import { DigitCounterService } from './services/digit-counter.service';

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
    TitleScreenComponent,
    MessageWindowComponent,
    LumberComponent,
    ItemImgComponent,
    TileFrameComponent,
    BatteryViewComponent,
    TileTopComponent,

  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
  ],
  providers: [
    GameEngineService, 
    MessagesService,
    DigitCounterService
   // { provide: LOCALE_ID, useValue: "he" },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
